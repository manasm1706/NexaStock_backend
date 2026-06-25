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
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };

    const body = (context.body as {
      email?: string;
      fullName?: string;
      roleId?: string;
      assignedLocations?: string[];
      permissionOverrides?: { permissionId: string; allowed: boolean }[];
      department?: string;
      reportsTo?: string;
    }) || {};
    
    const extra: {
      assignedLocations?: string[];
      permissionOverrides?: { permissionId: string; allowed: boolean }[];
      department?: string;
      reportsTo?: string;
    } = {};

    if (body.assignedLocations !== undefined) extra.assignedLocations = body.assignedLocations;
    if (body.permissionOverrides !== undefined) extra.permissionOverrides = body.permissionOverrides;
    if (body.department !== undefined) extra.department = body.department;
    if (body.reportsTo !== undefined) extra.reportsTo = body.reportsTo;

    return this.invitationService.inviteUser(
      context.tenantId,
      body.email || "",
      body.fullName || "",
      body.roleId || "",
      actorUserId,
      Object.keys(extra).length > 0 ? extra : undefined,
      requestMeta
    );
  };

  resendInvite = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.invitationService.resendInvitation(id, context.tenantId, actorUserId, requestMeta);
  };

  cancelInvite = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.invitationService.cancelInvitation(id, context.tenantId, actorUserId, requestMeta);
  };

  updateRole = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const body = (context.body as { roleId?: string }) || {};
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.service.updateUserRole(id, body.roleId || "", context.tenantId, actorUserId, requestMeta);
  };

  deactivate = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.service.deactivateUser(id, context.tenantId, actorUserId, requestMeta);
  };

  reactivate = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.service.reactivateUser(id, context.tenantId, actorUserId, requestMeta);
  };

  remove = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.service.removeUser(id, context.tenantId, actorUserId, requestMeta);
  };

  updateLocations = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const body = (context.body as { locationIds?: string[] }) || {};
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.service.updateUserLocations(id, body.locationIds || [], context.tenantId, actorUserId, requestMeta);
  };

  updatePermissions = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const body = (context.body as { overrides?: { permissionId: string; allowed: boolean }[] }) || {};
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.service.updateUserPermissions(id, body.overrides || [], context.tenantId, actorUserId, requestMeta);
  };
}
