import { UsersRepository } from "./repository";
import { toUserItemDTO } from "./mapper";
import { ValidationError, NotFoundError } from "../../lib/errors";
import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";
import { PermissionService } from "./PermissionService";

export class UsersService {
  private readonly repository = new UsersRepository();

  async getUsersList(tenantId: string) {
    const users = await this.repository.findUsers(tenantId);
    const dbUsers = users.map(toUserItemDTO);

    const settings = await prisma.tenantSettings.findFirst({
      where: { tenantId }
    });
    const invitations = ((settings?.metadata as any)?.invitations as any[]) || [];
    const mappedInvites = invitations
      .filter((inv: any) => inv.status !== "ACCEPTED")
      .map((inv: any) => ({
        id: inv.id,
        fullName: inv.fullName,
        email: inv.email,
        role: inv.roleCode || "member",
        roleLabel: `${inv.roleName || "Member"} (Pending - ${inv.status})`,
        status: inv.status === "REVOKED" ? "disabled" : "invited",
        lastLoginAt: null,
        metadata: {
          invitationId: inv.id,
          token: inv.token,
          expiresAt: inv.expiresAt,
          invitedBy: inv.invitedBy,
          invitationStatus: inv.status
        },
        assignedLocations: (inv.assignedLocations || []).map((locId: string) => ({ locationId: locId })),
        permissionOverrides: inv.permissionOverrides || []
      }));

    return [...dbUsers, ...mappedInvites];
  }

  async updateUserRole(id: string, roleId: string, tenantId: string, actorUserId: string, requestMeta?: { requestId?: string | undefined; ipAddress?: string | undefined; userAgent?: string | undefined }) {
    const user = await this.repository.findUserById(id, tenantId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const targetRole = await prisma.role.findFirst({
      where: { id: roleId, tenantId }
    });
    if (!targetRole) {
      throw new NotFoundError("Target role not found.");
    }

    // Protection rule: cannot remove owner role from the last active Owner
    if (user.role.code === "business_owner" && targetRole.code !== "business_owner") {
      const isLast = await this.repository.isLastActiveOwner(id, tenantId);
      if (isLast) {
        throw new ValidationError("Ownership protection: Cannot change role of the last active Owner.");
      }
    }

    const updated = await this.repository.updateUserRole(id, roleId, tenantId);

    // Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "users",
        action: "user_role_changed",
        summary: `Updated user ${user.fullName} role from ${user.role.name} to ${targetRole.name}`,
        entityType: "user",
        severity: "INFO",
        afterData: { userId: id, oldRole: user.role.code, newRole: targetRole.code },
        requestId: requestMeta?.requestId ?? null,
        ipAddress: requestMeta?.ipAddress ?? null,
        userAgent: requestMeta?.userAgent ?? null
      }
    });

    return toUserItemDTO(updated);
  }

  async deactivateUser(id: string, tenantId: string, actorUserId: string, requestMeta?: { requestId?: string | undefined; ipAddress?: string | undefined; userAgent?: string | undefined }) {
    const user = await this.repository.findUserById(id, tenantId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    // Protection rule: cannot deactivate the last active Owner
    if (user.role.code === "business_owner") {
      const isLast = await this.repository.isLastActiveOwner(id, tenantId);
      if (isLast) {
        throw new ValidationError("Ownership protection: Cannot deactivate the last active Owner.");
      }
    }

    const updated = await this.repository.updateUserStatus(id, "DISABLED", tenantId);

    // Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "users",
        action: "user_deactivated",
        summary: `Deactivated user ${user.fullName} (${user.email})`,
        entityType: "user",
        severity: "INFO",
        afterData: { userId: id },
        requestId: requestMeta?.requestId ?? null,
        ipAddress: requestMeta?.ipAddress ?? null,
        userAgent: requestMeta?.userAgent ?? null
      }
    });

    return toUserItemDTO(updated);
  }

  async reactivateUser(id: string, tenantId: string, actorUserId: string, requestMeta?: { requestId?: string | undefined; ipAddress?: string | undefined; userAgent?: string | undefined }) {
    const user = await this.repository.findUserById(id, tenantId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const updated = await this.repository.updateUserStatus(id, "ACTIVE", tenantId);

    // Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "users",
        action: "user_reactivated",
        summary: `Reactivated user ${user.fullName} (${user.email})`,
        entityType: "user",
        severity: "INFO",
        afterData: { userId: id },
        requestId: requestMeta?.requestId ?? null,
        ipAddress: requestMeta?.ipAddress ?? null,
        userAgent: requestMeta?.userAgent ?? null
      }
    });

    return toUserItemDTO(updated);
  }

  async removeUser(id: string, tenantId: string, actorUserId: string, requestMeta?: { requestId?: string | undefined; ipAddress?: string | undefined; userAgent?: string | undefined }) {
    const user = await this.repository.findUserById(id, tenantId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    // Protection rule: cannot delete the last active Owner
    if (user.role.code === "business_owner") {
      const isLast = await this.repository.isLastActiveOwner(id, tenantId);
      if (isLast) {
        throw new ValidationError("Ownership protection: Cannot remove/delete the last active Owner.");
      }
    }

    await this.repository.deleteUser(id, tenantId);

    // Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "users",
        action: "user_removed",
        summary: `Permanently removed user ${user.fullName} (${user.email})`,
        entityType: "user",
        severity: "INFO",
        afterData: { userId: id, email: user.email, fullName: user.fullName },
        requestId: requestMeta?.requestId ?? null,
        ipAddress: requestMeta?.ipAddress ?? null,
        userAgent: requestMeta?.userAgent ?? null
      }
    });

    return { success: true, message: `User ${user.fullName} removed successfully` };
  }

  async updateUserLocations(id: string, locationIds: string[], tenantId: string, actorUserId: string, requestMeta?: { requestId?: string | undefined; ipAddress?: string | undefined; userAgent?: string | undefined }) {
    const user = await this.repository.findUserById(id, tenantId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    await prisma.$transaction([
      prisma.userLocation.deleteMany({
        where: { tenantId, userId: id }
      }),
      ...(locationIds.length > 0 ? [
        prisma.userLocation.createMany({
          data: locationIds.map(locId => ({
            id: createId("uloc"),
            tenantId,
            userId: id,
            locationId: locId
          }))
        })
      ] : []),
      prisma.user.update({
        where: { id },
        data: { tokenVersion: { increment: 1 } }
      })
    ]);

    PermissionService.clearCache(id, tenantId);

    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "users",
        action: "user_locations_updated",
        summary: `Updated locations assignment for user ${user.fullName}`,
        entityType: "user",
        severity: "INFO",
        afterData: { userId: id, assignedLocations: locationIds },
        requestId: requestMeta?.requestId ?? null,
        ipAddress: requestMeta?.ipAddress ?? null,
        userAgent: requestMeta?.userAgent ?? null
      }
    });

    return { success: true, message: "User location assignments updated successfully." };
  }

  async updateUserPermissions(id: string, overrides: { permissionId: string; allowed: boolean }[], tenantId: string, actorUserId: string, requestMeta?: { requestId?: string | undefined; ipAddress?: string | undefined; userAgent?: string | undefined }) {
    const user = await this.repository.findUserById(id, tenantId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    await prisma.$transaction([
      prisma.userPermissionOverride.deleteMany({
        where: { tenantId, userId: id }
      }),
      ...(overrides.length > 0 ? [
        prisma.userPermissionOverride.createMany({
          data: overrides.map(ov => ({
            id: createId("upov"),
            tenantId,
            userId: id,
            permissionId: ov.permissionId,
            allowed: ov.allowed
          }))
        })
      ] : []),
      prisma.user.update({
        where: { id },
        data: { tokenVersion: { increment: 1 } }
      })
    ]);

    PermissionService.clearCache(id, tenantId);

    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "users",
        action: "user_permissions_updated",
        summary: `Updated custom permission overrides for user ${user.fullName}`,
        entityType: "user",
        severity: "INFO",
        afterData: { userId: id, overrides },
        requestId: requestMeta?.requestId ?? null,
        ipAddress: requestMeta?.ipAddress ?? null,
        userAgent: requestMeta?.userAgent ?? null
      }
    });

    return { success: true, message: "User permission overrides updated successfully." };
  }
}

