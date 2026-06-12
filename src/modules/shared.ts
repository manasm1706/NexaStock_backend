import { badRequest, forbidden, unauthorized } from "../framework/errors";
import type { RequestContext } from "../framework/types";
import { findTenant, listTenantUsers } from "../data/store";
import type { Role, User } from "../domain/types";

export function requireTenant(context: RequestContext) {
  const tenant = findTenant(context.tenantId);
  if (!tenant) {
    throw badRequest(`Unknown tenant: ${context.tenantId}`);
  }

  return tenant;
}

export function requireUser(context: RequestContext): User {
  if (!context.actorId) {
    throw unauthorized("Authentication is required");
  }

  const user = listTenantUsers(context.tenantId).find((entry) => entry.id === context.actorId);
  if (!user) {
    throw unauthorized("Session user not found");
  }

  return user;
}

export function requireRole(context: RequestContext, allowedRoles: Role[]): User {
  const user = requireUser(context);
  if (!allowedRoles.includes(user.role)) {
    throw forbidden("Your role is not allowed to perform this action");
  }

  return user;
}

export function requireManager(context: RequestContext): User {
  return requireRole(context, ["super_admin", "business_owner", "operations_manager", "warehouse_manager", "store_manager"]);
}
