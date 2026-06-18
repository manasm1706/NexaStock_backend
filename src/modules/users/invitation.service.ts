import { prisma } from "../../lib/db";
import { createId, hashPassword } from "../../lib/crypto";
import { ValidationError, NotFoundError } from "../../lib/errors";
import { randomUUID } from "node:crypto";

export class InvitationService {
  /**
   * Invites a new user to the tenant organization.
   * Creates a pending user record with status INVITED and stores token data in metadata.
   */
  async inviteUser(
    tenantId: string,
    email: string,
    fullName: string,
    roleId: string,
    actorUserId: string
  ) {
    // 1. Check if email already exists globally or in the tenant
    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } }
    });

    if (existing) {
      throw new ValidationError("A user with this email address is already registered or invited.");
    }

    // 2. Validate role exists
    const role = await prisma.role.findFirst({
      where: { id: roleId, tenantId }
    });
    if (!role) {
      throw new NotFoundError("Assigned role not found.");
    }

    const invitationToken = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    const metadata = {
      invitationToken,
      invitationExpiresAt: expiresAt.toISOString(),
      invitationStatus: "PENDING",
      invitedBy: actorUserId
    };

    // 3. Create pending user record
    const user = await prisma.user.create({
      data: {
        id: createId("user"),
        tenantId,
        roleId,
        email,
        fullName,
        passwordHash: hashPassword(randomUUID()), // Safe random password before setup
        status: "INVITED",
        userScope: "INTERNAL",
        metadata
      },
      include: { role: true }
    });

    // 4. Log audit event
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "users",
        action: "user_invited",
        summary: `Invited user ${fullName} (${email}) as role ${role.name}`,
        entityType: "user",
        severity: "INFO",
        afterData: { invitedUserId: user.id }
      }
    });

    return {
      user,
      token: invitationToken,
      inviteLink: `/accept-invitation?token=${invitationToken}`
    };
  }

  /**
   * Fetches invitation details by validating the token.
   */
  async getInvitationByToken(token: string) {
    const users = await prisma.user.findMany({
      where: {
        status: "INVITED"
      }
    });

    const user = users.find(u => {
      const meta = (u.metadata as any) || {};
      return meta.invitationToken === token;
    });

    if (!user) {
      throw new NotFoundError("Invitation token is invalid or has expired.");
    }

    const meta = (user.metadata as any) || {};
    if (meta.invitationToken !== token || meta.invitationStatus !== "PENDING") {
      throw new ValidationError("Invitation has been revoked or accepted.");
    }

    const expiresAt = new Date(meta.invitationExpiresAt);
    if (expiresAt.getTime() < Date.now()) {
      throw new ValidationError("Invitation token has expired. Please request a new invite.");
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId }
    });

    const role = await prisma.role.findUnique({
      where: { id: user.roleId }
    });

    return {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      tenantName: tenant?.name || "NexaStock Workspace",
      roleName: role?.name || "Member"
    };
  }

  /**
   * Accepts invitation by setting the user's password, status, and accepting the token.
   */
  async acceptInvitation(token: string, passwordHash: string) {
    const details = await this.getInvitationByToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: details.userId }
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const meta = (user.metadata as any) || {};
    const updatedMetadata = {
      ...meta,
      invitationStatus: "ACCEPTED",
      acceptedAt: new Date().toISOString()
    };

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        status: "ACTIVE",
        passwordHash,
        metadata: updatedMetadata
      },
      include: { role: true }
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId: user.tenantId,
        actorUserId: user.id,
        module: "users",
        action: "user_joined",
        summary: `User ${user.fullName} (${user.email}) accepted invitation and joined organization`,
        entityType: "user",
        severity: "INFO"
      }
    });

    return updatedUser;
  }

  /**
   * Resends the invitation by generating a new token and refreshing expiry.
   */
  async resendInvitation(userId: string, tenantId: string, actorUserId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, tenantId, status: "INVITED" }
    });

    if (!user) {
      throw new NotFoundError("Pending invited user not found.");
    }

    const invitationToken = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const meta = (user.metadata as any) || {};
    const updatedMetadata = {
      ...meta,
      invitationToken,
      invitationExpiresAt: expiresAt.toISOString(),
      invitationStatus: "PENDING",
      inviteResentAt: new Date().toISOString()
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        metadata: updatedMetadata
      },
      include: { role: true }
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "users",
        action: "invite_resent",
        summary: `Resent invitation to ${user.fullName} (${user.email})`,
        entityType: "user",
        severity: "INFO"
      }
    });

    return {
      user: updatedUser,
      token: invitationToken,
      inviteLink: `/accept-invitation?token=${invitationToken}`
    };
  }

  /**
   * Cancels/revokes a pending invitation.
   */
  async cancelInvitation(userId: string, tenantId: string, actorUserId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, tenantId, status: "INVITED" }
    });

    if (!user) {
      throw new NotFoundError("Pending invited user not found.");
    }

    const meta = (user.metadata as any) || {};
    const updatedMetadata = {
      ...meta,
      invitationStatus: "REVOKED",
      revokedAt: new Date().toISOString()
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: "DISABLED",
        metadata: updatedMetadata
      },
      include: { role: true }
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "users",
        action: "invite_cancelled",
        summary: `Cancelled invitation for ${user.fullName} (${user.email})`,
        entityType: "user",
        severity: "INFO"
      }
    });

    return updatedUser;
  }
}
