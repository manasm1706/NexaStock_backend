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
    status: user.status.toLowerCase()
  };
}
