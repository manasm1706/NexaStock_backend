import { badRequest, forbidden, unauthorized } from "../framework/errors";
import type { RequestContext } from "../framework/types";
import type { Role, User } from "../domain/types";
import { prisma } from "../lib/db";

export async function requireTenant(context: RequestContext) {
  const tenant = await prisma.tenant.findFirst({
    where: { id: context.tenantId }
  });
  if (!tenant) {
    throw badRequest(`Unknown tenant: ${context.tenantId}`);
  }

  return tenant;
}

export async function requireUser(context: RequestContext): Promise<User> {
  if (!context.actorId) {
    throw unauthorized("Authentication is required");
  }

  const dbUser = await prisma.user.findFirst({
    where: { id: context.actorId, tenantId: context.tenantId },
    include: { role: true }
  });

  if (!dbUser) {
    throw unauthorized("Session user not found");
  }

  // Map to domain User type
  return {
    id: dbUser.id,
    tenantId: dbUser.tenantId,
    fullName: dbUser.fullName,
    email: dbUser.email,
    passwordHash: dbUser.passwordHash,
    role: dbUser.role.code as Role,
    locationIds: [],
    status: dbUser.status.toLowerCase() as "active" | "invited" | "disabled",
    createdAt: dbUser.createdAt.toISOString()
  };
}

export async function requireRole(context: RequestContext, allowedRoles: Role[]): Promise<User> {
  const user = await requireUser(context);
  if (!allowedRoles.includes(user.role)) {
    throw forbidden("Your role is not allowed to perform this action");
  }

  return user;
}

export async function requireManager(context: RequestContext): Promise<User> {
  return requireRole(context, ["super_admin", "business_owner", "operations_manager", "warehouse_manager", "store_manager"]);
}
