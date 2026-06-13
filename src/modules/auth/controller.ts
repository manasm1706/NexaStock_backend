import type { RequestContext } from "../../framework/types";
import { AuthService } from "./service";
import { TenantService } from "../tenant/service";
import { permissionMatrix, roleLabels } from "../../domain/permissions";
import type { Role } from "../../domain/types";

export class AuthController {
  private readonly service = new AuthService();
  private readonly tenantService = new TenantService();

  login = async (context: RequestContext) => {
    const body = context.body as any;
    const tenantId = body.tenantId || context.tenantId;
    return this.service.login(body, tenantId);
  };

  register = async (context: RequestContext) => {
    return this.tenantService.startOnboarding(context.body as any);
  };

  logout = async (context: RequestContext) => {
    return { success: true, message: "Logged out successfully" };
  };

  profile = async (context: RequestContext) => {
    const userId = context.actorId!;
    const user = await this.service.getProfile(userId, context.tenantId);
    
    return {
      user,
      permissions: permissionMatrix,
      roleLabel: roleLabels[user.role as Role]
    };
  };
}
