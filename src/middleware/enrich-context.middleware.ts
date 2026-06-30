import type { Middleware } from "../framework/types";
import { prisma } from "../lib/db";
import { PermissionService } from "../modules/users/PermissionService";

/** Roles that have unrestricted access to all tenant data — no location filtering applied. */
const GLOBAL_ACCESS_ROLES = new Set([
  "business_owner",
  "super_admin",
  "BUSINESS_OWNER",
  "SUPER_ADMIN"
]);

/**
 * Enriches the RequestContext with:
 * - assignedLocationIds: locations the user is responsible for (non-global roles only)
 * - isGlobalAccess: true for business_owner / super_admin
 * - permissions: effective permission codes for the user
 *
 * Must run after requireAuth and resolveTenant.
 */
export const enrichContext: Middleware = async (context, next) => {
  const userId = context.actorId;
  const tenantId = context.tenantId;
  const roleCode = context.role ?? "";

  if (!userId) {
    return next();
  }

  context.isGlobalAccess = GLOBAL_ACCESS_ROLES.has(roleCode);

  if (!context.isGlobalAccess) {
    const locations = await prisma.userLocation.findMany({
      where: { userId, tenantId },
      select: { locationId: true }
    });
    context.assignedLocationIds = locations.map((l) => l.locationId);
  } else {
    context.assignedLocationIds = [];
  }

  context.permissions = await PermissionService.getEffectivePermissions(userId, tenantId);

  return next();
};
