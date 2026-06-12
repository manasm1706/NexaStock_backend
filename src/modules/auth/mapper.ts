import type { UserDTO } from "./dto";
import type { Role } from "../../domain/types";
import { roleLabels } from "../../domain/permissions";

export function toUserDTO(user: any): UserDTO {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role.code as Role,
    roleLabel: roleLabels[user.role.code as Role] || user.role.name,
    tenantId: user.tenantId,
    status: user.status.toLowerCase()
  };
}
