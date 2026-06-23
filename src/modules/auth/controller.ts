import type { RequestContext } from "../../framework/types";
import { AuthService } from "./service";
import { TenantService } from "../tenant/service";
import { InvitationService } from "../users/invitation.service";
import { permissionMatrix, roleLabels } from "../../domain/permissions";
import type { Role } from "../../domain/types";
import { prisma } from "../../lib/db";

export class AuthController {
  private readonly service = new AuthService();
  private readonly tenantService = new TenantService();
  private readonly invitationService = new InvitationService();

  login = async (context: RequestContext) => {
    const body = context.body as any;
    const tenantId = body.tenantId || context.tenantId;
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    
    return this.service.login(body, tenantId, userAgent, ipAddress);
  };

  googleLogin = async (context: RequestContext) => {
    const body = (context.body as { credential?: string }) || {};
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    
    return this.service.googleLogin(body.credential || "", userAgent, ipAddress);
  };

  refresh = async (context: RequestContext) => {
    const body = (context.body as { refreshToken?: string }) || {};
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    
    return this.service.refreshSession(body.refreshToken || "", userAgent, ipAddress);
  };

  register = async (context: RequestContext) => {
    return this.tenantService.startOnboarding(context.body as any);
  };

  logout = async (context: RequestContext) => {
    // Revoke current session if actorId is loaded
    if (context.actorId) {
      try {
        await prisma.userSession.updateMany({
          where: { userId: context.actorId, isActive: true },
          data: { isActive: false, revokedAt: new Date() }
        });
      } catch (err) {
        console.error("Failed to revoke session logs on logout:", err);
      }
    }
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

  updateProfile = async (context: RequestContext) => {
    const userId = context.actorId!;
    const body = (context.body as { fullName?: string; email?: string }) || {};
    return this.service.updateProfile(userId, context.tenantId, body.fullName || "", body.email || "");
  };

  updatePassword = async (context: RequestContext) => {
    const userId = context.actorId!;
    return this.service.updatePassword(userId, context.tenantId, context.body);
  };

  getInvitation = async (context: RequestContext) => {
    const token = context.params.token as string;
    return this.invitationService.getInvitationByToken(token);
  };

  acceptInvitation = async (context: RequestContext) => {
    const body = (context.body as { token?: string; password?: string }) || {};
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    
    return this.service.acceptInvitation(body.token || "", body.password || "", userAgent, ipAddress);
  };
}
