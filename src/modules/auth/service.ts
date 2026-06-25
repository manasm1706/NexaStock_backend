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
import { OAuth2Client } from "google-auth-library";
import { PermissionService } from "../users/PermissionService";

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

  private async getAssignedLocations(userId: string): Promise<string[]> {
    const locations = await prisma.userLocation.findMany({
      where: { userId },
      select: { locationId: true }
    });
    return locations.map(l => l.locationId);
  }

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
      tenantId: user.tenantId,
      tokenVersion: user.tokenVersion
    });

    const refreshToken = createId("ref");
    const sessionId = createId("sess");

    // Write UserSession record
    try {
      await prisma.userSession.create({
        data: {
          id: sessionId,
          tenantId: user.tenantId,
          userId: user.id,
          sessionTokenHash: refreshToken,
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

    const effective = await PermissionService.getEffectivePermissions(user.id, user.tenantId);
    const locations = await this.getAssignedLocations(user.id);
    return {
      token,
      refreshToken,
      user: toUserDTO(user, effective, locations)
    };
  }

  async getProfile(userId: string, tenantId: string) {
    const user = await this.repository.findUserById(userId, tenantId);
    if (!user) {
      throw new NotFoundError("Session user not found");
    }
    const effective = await PermissionService.getEffectivePermissions(user.id, tenantId);
    const locations = await this.getAssignedLocations(user.id);
    return toUserDTO(user, effective, locations);
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

    const effective = await PermissionService.getEffectivePermissions(updated.id, tenantId);
    const locations = await this.getAssignedLocations(updated.id);
    return toUserDTO(updated, effective, locations);
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

  async acceptInvitation(token: string, password: string, userAgent: string, ipAddress: string, requestId?: string) {
    const details = await this.invitationService.getInvitationByToken(token);
    
    // Hash password
    const hashed = hashPassword(password);
    const user = await this.invitationService.acceptInvitation(token, hashed, { requestId, ipAddress, userAgent });

    // Generate JWT access token
    const jwtToken = generateAccessToken({
      sub: user.id,
      role: user.role.code,
      tenantId: user.tenantId,
      tokenVersion: user.tokenVersion
    });

    const refreshToken = createId("ref");
    const sessionId = createId("sess");

    // Track active UserSession
    try {
      await prisma.userSession.create({
        data: {
          id: sessionId,
          tenantId: user.tenantId,
          userId: user.id,
          sessionTokenHash: refreshToken,
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

    const effective = await PermissionService.getEffectivePermissions(user.id, user.tenantId);
    const locations = await this.getAssignedLocations(user.id);
    return {
      token: jwtToken,
      refreshToken,
      user: toUserDTO(user, effective, locations)
    };
  }

  async googleLogin(
    credential: string,
    userAgent: string,
    ipAddress: string
  ): Promise<LoginResponseDTO> {
    if (!credential) {
      throw new ValidationError("Google credential token is required.");
    }

    const client: any = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID || "",
      });
      payload = ticket.getPayload();
    } catch (err: any) {
      throw new ForbiddenError("Failed to verify Google authentication: " + err.message);
    }

    if (!payload || !payload.email) {
      throw new ForbiddenError("Google authentication did not return a valid email.");
    }

    const email = payload.email;
    const fullName = payload.name || "Google User";
    const googleId = payload.sub; // Google User ID

    // Find user globally
    let user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      include: { role: true }
    });

    if (user) {
      if (user.status === "DISABLED") {
        throw new ForbiddenError("Your account has been deactivated. Please contact your organization owner.");
      }

      // Link Google ID if not already linked (preserve existing account and avoid duplicates)
      const metadata = (user.metadata as any) || {};
      if (metadata.googleId !== googleId) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            metadata: {
              ...metadata,
              googleId
            }
          }
        });
      }
    } else {
      // User does not exist, so we avoid creating a temporary user.
      // Return a special payload so frontend can complete onboarding before creation.
      return {
        isNewUser: true,
        email,
        fullName,
        googleId
      } as any;
    }

    // Log the user in and return standard tokens
    const token = generateAccessToken({
      sub: user.id,
      role: user.role.code,
      tenantId: user.tenantId,
      tokenVersion: user.tokenVersion
    });

    const refreshToken = createId("ref");
    const sessionId = createId("sess");

    try {
      await prisma.userSession.create({
        data: {
          id: sessionId,
          tenantId: user.tenantId,
          userId: user.id,
          sessionTokenHash: refreshToken,
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

      // Write Audit Log
      await prisma.auditLog.create({
        data: {
          id: createId("audit"),
          tenantId: user.tenantId,
          actorUserId: user.id,
          module: "auth",
          action: "login_google",
          summary: `User ${user.fullName} logged in successfully via Google`,
          entityType: "user",
          severity: "INFO"
        }
      });
    } catch (sessionErr) {
      console.error("Failed to track session log or last login for Google login:", sessionErr);
    }

    const effective = await PermissionService.getEffectivePermissions(user.id, user.tenantId);
    const locations = await this.getAssignedLocations(user.id);
    return {
      token,
      refreshToken,
      user: toUserDTO(user, effective, locations)
    };
  }

  async refreshSession(
    refreshToken: string,
    userAgent: string,
    ipAddress: string
  ): Promise<{ token: string; refreshToken: string }> {
    if (!refreshToken) {
      throw new ValidationError("Refresh token is required.");
    }

    const session = await prisma.userSession.findFirst({
      where: {
        sessionTokenHash: refreshToken,
        isActive: true,
        expiresAt: { gt: new Date() }
      },
      include: {
        user: {
          include: { role: true }
        }
      }
    });

    if (!session) {
      throw new ForbiddenError("Invalid or expired session. Please sign in again.");
    }

    // Update lastSeenAt
    await prisma.userSession.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() }
    });

    // Generate a fresh access token
    const token = generateAccessToken({
      sub: session.user.id,
      role: session.user.role.code,
      tenantId: session.user.tenantId,
      tokenVersion: session.user.tokenVersion
    });

    return {
      token,
      refreshToken: session.sessionTokenHash
    };
  }
}
