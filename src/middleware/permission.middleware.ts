import type { Middleware } from "../framework/types";
import { ForbiddenError } from "../lib/errors";
import { permissionMatrix } from "../domain/permissions";
import { PermissionService } from "../modules/users/PermissionService";

export type PermissionKey = keyof typeof permissionMatrix;

export function requirePermission(permissionCode: PermissionKey): Middleware {
  return async (context, next) => {
    if (!context.actorId || !context.tenantId) {
      throw new ForbiddenError("Authentication credentials not loaded");
    }

    const allowed = await PermissionService.can(context.actorId, permissionCode, context.tenantId);
    if (allowed) {
      return next();
    }

    throw new ForbiddenError(`Permission '${permissionCode}' required to execute this operation`);
  };
}
