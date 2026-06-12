import type { Role } from "../../domain/types";

export interface UserItemDTO {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  roleLabel: string;
  status: string;
}
