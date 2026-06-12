import { AuthRepository } from "./repository";
import { verifyPassword } from "../../lib/password";
import { generateAccessToken } from "../../lib/jwt";
import { ForbiddenError, NotFoundError } from "../../lib/errors";
import type { LoginInput } from "./schema";
import type { LoginResponseDTO } from "./dto";
import { toUserDTO } from "./mapper";

export class AuthService {
  private readonly repository = new AuthRepository();

  async login(input: LoginInput, tenantId: string): Promise<LoginResponseDTO> {
    const user = await this.repository.findUserByEmail(input.email, tenantId);
    if (!user || !verifyPassword(input.password, user.passwordHash)) {
      throw new ForbiddenError("Invalid credentials");
    }

    const token = generateAccessToken({
      sub: user.id,
      role: user.role.code,
      tenantId
    });

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
}
