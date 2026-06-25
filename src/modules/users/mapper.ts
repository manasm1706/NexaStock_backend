import type { UserItemDTO } from "./dto";
import type { Role } from "../../domain/types";
import { roleLabels } from "../../domain/permissions";

export function toUserItemDTO(user: any): UserItemDTO {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role.code as Role,
    roleLabel: roleLabels[user.role.code as Role] || user.role.name,
    status: user.status.toLowerCase(),
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    metadata: user.metadata || null,
    assignedLocations: user.assignedLocations ? user.assignedLocations.map((al: any) => ({ locationId: al.locationId })) : [],
    permissionOverrides: user.permissionOverrides ? user.permissionOverrides.map((po: any) => ({
      permissionId: po.permissionId,
      allowed: po.allowed,
      permissionCode: po.permission ? po.permission.code : undefined
    })) : []
  };
}
