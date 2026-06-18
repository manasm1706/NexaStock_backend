import { AuthRepository } from "./repository";
import { verifyPassword, hashPassword } from "../../lib/crypto";
import { generateAccessToken } from "../../lib/jwt";
import { ForbiddenError, NotFoundError, ValidationError } from "../../lib/errors";
import type { LoginInput } from "./schema";
import type { LoginResponseDTO } from "./dto";
import { toUserDTO } from "./mapper";
import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";
import { InvitationService } from "../users/invitation.service";

function parseDeviceName(userAgent: string): string {
  if (userAgent.includes("iPhone")) return "iPhone";
  if (userAgent.includes("iPad")) return "iPad";
  if (userAgent.includes("Android")) return "Android Device";
  if (userAgent.includes("Windows")) return "Windows PC";
  if (userAgent.includes("Macintosh")) return "Mac";
  if (userAgent.includes("Linux")) return "Linux Workstation";
  return "Unknown Device";
}

export class AuthService {
  private readonly repository = new AuthRepository();
  private readonly invitationService = new InvitationService();

  async login(
    input: LoginInput,
    tenantId: string,
    userAgent: string,
    ipAddress: string
  ): Promise<LoginResponseDTO> {
    let user = await this.repository.findUserByEmail(input.email, tenantId);
    if (!user) {
      user = await this.repository.findUserByEmailGlobally(input.email);
    }

    if (!user || !verifyPassword(input.password, user.passwordHash)) {
      throw new ForbiddenError("Invalid credentials");
    }

    if (user.status === "DISABLED") {
      throw new ForbiddenError("Your account has been deactivated. Please contact your organization owner.");
    }

    const token = generateAccessToken({
      sub: user.id,
      role: user.role.code,
      tenantId: user.tenantId
    });

    // Write UserSession record
    try {
      await prisma.userSession.create({
        data: {
          id: createId("sess"),
          tenantId: user.tenantId,
          userId: user.id,
          sessionTokenHash: createId("hash"),
          deviceName: parseDeviceName(userAgent),
          ipAddress,
          userAgent,
          isActive: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          lastSeenAt: new Date()
        }
      });

      // Update user lastLoginAt
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Write Audit Log
      await prisma.auditLog.create({
        data: {
          id: createId("audit"),
          tenantId: user.tenantId,
          actorUserId: user.id,
          module: "auth",
          action: "login",
          summary: `User ${user.fullName} logged in successfully`,
          entityType: "user",
          severity: "INFO"
        }
      });
    } catch (sessionErr) {
      console.error("Failed to track session log or last login:", sessionErr);
    }

    return {
      token,
      user: toUserDTO(user)
    };
  }

  async getProfile(userId: string, tenantId: string) {
    const user = await this.repository.findUserById(userId, tenantId);
    if (!user) {
      throw new NotFoundError("Session user not found");
    }
    return toUserDTO(user);
  }

  async updateProfile(userId: string, tenantId: string, fullName: string, email: string) {
    const user = await this.repository.findUserById(userId, tenantId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Check if email changed and is taken
    if (email.toLowerCase() !== user.email.toLowerCase()) {
      const existing = await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" }, id: { not: userId } }
      });
      if (existing) {
        throw new ValidationError("This email address is already in use by another account.");
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { fullName, email },
      include: { role: true }
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId: userId,
        module: "users",
        action: "profile_updated",
        summary: `User updated profile info: Name: ${fullName}, Email: ${email}`,
        entityType: "user",
        severity: "INFO"
      }
    });

    return toUserDTO(updated);
  }

  async updatePassword(userId: string, tenantId: string, input: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    });

    if (!user || !verifyPassword(input.currentPassword, user.passwordHash)) {
      throw new ForbiddenError("Current password incorrect.");
    }

    // Get Tenant Settings for Password Policy
    const settings = await prisma.tenantSettings.findFirst({
      where: { tenantId }
    });
    
    const meta = (settings?.metadata as any) || {};
    const policy = {
      minLength: meta.pwMinLength ?? 8,
      requireNumbers: meta.pwRequireNumbers ?? true,
      requireSpecialChars: meta.pwRequireSpecial ?? true,
      requireUppercase: meta.pwRequireUpper ?? true
    };

    const password = input.newPassword;
    if (password.length < policy.minLength) {
      throw new ValidationError(`Password must be at least ${policy.minLength} characters long.`);
    }
    if (policy.requireNumbers && !/\d/.test(password)) {
      throw new ValidationError("Password must contain at least one number.");
    }
    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new ValidationError("Password must contain at least one special character.");
    }
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      throw new ValidationError("Password must contain at least one uppercase letter.");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashPassword(password) }
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId: userId,
        module: "users",
        action: "password_changed",
        summary: `User changed password`,
        entityType: "user",
        severity: "INFO"
      }
    });

    return { success: true, message: "Password updated successfully." };
  }

  async acceptInvitation(token: string, password: string, userAgent: string, ipAddress: string) {
    const details = await this.invitationService.getInvitationByToken(token);
    
    // Hash password
    const hashed = hashPassword(password);
    const user = await this.invitationService.acceptInvitation(token, hashed);

    // Generate JWT access token
    const jwtToken = generateAccessToken({
      sub: user.id,
      role: user.role.code,
      tenantId: user.tenantId
    });

    // Track active UserSession
    try {
      await prisma.userSession.create({
        data: {
          id: createId("sess"),
          tenantId: user.tenantId,
          userId: user.id,
          sessionTokenHash: createId("hash"),
          deviceName: parseDeviceName(userAgent),
          ipAddress,
          userAgent,
          isActive: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          lastSeenAt: new Date()
        }
      });
      
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });
    } catch (sessionErr) {
      console.error("Failed to track session during invitation acceptance:", sessionErr);
    }

    return {
      token: jwtToken,
      user: toUserDTO(user)
    };
  }
}
