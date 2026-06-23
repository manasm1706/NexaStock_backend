import type { Role } from "../../domain/types";

export interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  roleLabel: string;
  tenantId: string;
  status: string;
}

export interface LoginResponseDTO {
  token: string;
  refreshToken?: string;
  user: UserDTO;
}

export interface ProfileResponseDTO {
  user: UserDTO;
  permissions: Record<string, Record<string, boolean>>;
  roleLabel: string;
}
