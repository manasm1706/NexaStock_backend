import { UsersRepository } from "./repository";
import { toUserItemDTO } from "./mapper";
import { ValidationError, NotFoundError } from "../../lib/errors";
import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";

export class UsersService {
  private readonly repository = new UsersRepository();

  async getUsersList(tenantId: string) {
    const users = await this.repository.findUsers(tenantId);
    return users.map(toUserItemDTO);
  }

  async updateUserRole(id: string, roleId: string, tenantId: string, actorUserId: string) {
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
        afterData: { userId: id, oldRole: user.role.code, newRole: targetRole.code }
      }
    });

    return toUserItemDTO(updated);
  }

  async deactivateUser(id: string, tenantId: string, actorUserId: string) {
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
        afterData: { userId: id }
      }
    });

    return toUserItemDTO(updated);
  }

  async reactivateUser(id: string, tenantId: string, actorUserId: string) {
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
        afterData: { userId: id }
      }
    });

    return toUserItemDTO(updated);
  }

  async removeUser(id: string, tenantId: string, actorUserId: string) {
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
        afterData: { userId: id, email: user.email, fullName: user.fullName }
      }
    });

    return { success: true, message: `User ${user.fullName} removed successfully` };
  }
}
