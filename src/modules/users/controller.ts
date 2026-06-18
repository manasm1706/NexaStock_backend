import type { RequestContext } from "../../framework/types";
import { UsersService } from "./service";
import { InvitationService } from "./invitation.service";

export class UsersController {
  private readonly service = new UsersService();
  private readonly invitationService = new InvitationService();

  list = async (context: RequestContext) => {
    return this.service.getUsersList(context.tenantId);
  };

  invite = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const body = (context.body as { email?: string; fullName?: string; roleId?: string }) || {};
    
    return this.invitationService.inviteUser(
      context.tenantId,
      body.email || "",
      body.fullName || "",
      body.roleId || "",
      actorUserId
    );
  };

  resendInvite = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    return this.invitationService.resendInvitation(id, context.tenantId, actorUserId);
  };

  cancelInvite = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    return this.invitationService.cancelInvitation(id, context.tenantId, actorUserId);
  };

  updateRole = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const body = (context.body as { roleId?: string }) || {};
    return this.service.updateUserRole(id, body.roleId || "", context.tenantId, actorUserId);
  };

  deactivate = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    return this.service.deactivateUser(id, context.tenantId, actorUserId);
  };

  reactivate = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    return this.service.reactivateUser(id, context.tenantId, actorUserId);
  };

  remove = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    return this.service.removeUser(id, context.tenantId, actorUserId);
  };
}
