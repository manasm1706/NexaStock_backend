import type { Middleware } from "../framework/types";
import { ForbiddenError } from "../lib/errors";
import { permissionMatrix } from "../domain/permissions";
import { prisma } from "../lib/db";
import type { Role } from "../domain/types";

export type PermissionKey = keyof typeof permissionMatrix;

export function requirePermission(permissionCode: PermissionKey): Middleware {
  return async (context, next) => {
    if (!context.actorId || !context.role) {
      throw new ForbiddenError("Authentication credentials not loaded");
    }

    const roleCode = context.role as Role;

    // 1. Dynamic DB role-permission mapping lookup
    const dbPermission = await prisma.rolePermission.findFirst({
      where: {
        tenantId: context.tenantId,
        role: { code: roleCode },
        permission: { code: permissionCode },
        allowed: true
      }
    });

    if (dbPermission) {
      return next();
    }

    // 2. Fallback to static authorization matrix
    const staticRules = permissionMatrix[permissionCode];
    if (staticRules && roleCode in staticRules) {
      const allowed = staticRules[roleCode];
      if (allowed) {
        return next();
      }
    }

    throw new ForbiddenError(`Permission '${permissionCode}' required to execute this operation`);
  };
}
