import { prisma } from "../../lib/db";
import { permissionMatrix } from "../../domain/permissions";
import type { Role } from "../../domain/types";

const permissionKeyMap: Record<string, string> = {
  productManagement: "PRODUCT_MANAGEMENT",
  inventoryAdjustments: "INVENTORY_WRITE",
  posSales: "POS_SALES",
  dispatchOperations: "INVENTORY_WRITE",
  userManagement: "USER_MANAGEMENT",
  settingsManage: "SETTINGS_MANAGE",
  analyticsRead: "ANALYTICS_READ",
  aiRead: "AI_READ",
  auditRead: "AUDIT_READ",
  tenantAdmin: "TENANT_ADMIN"
};

export class PermissionService {
  private static cache = new Map<string, { permissions: string[]; expiresAt: number }>();
  private static CACHE_TTL_MS = 10000; // 10 seconds cache to minimize DB queries per request

  /**
   * Retrieves effective permission codes for a user, combining role permissions and overrides.
   */
  static async getEffectivePermissions(userId: string, tenantId: string): Promise<string[]> {
    const cacheKey = `${userId}:${tenantId}`;
    const now = Date.now();
    const cached = this.cache.get(cacheKey);

    if (cached && cached.expiresAt > now) {
      return cached.permissions;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { roleId: true, role: { select: { code: true } } }
    });

    if (!user || !user.role) {
      return [];
    }

    const permissionCodes = new Set<string>();

    // 1. Fetch role permissions from DB
    const dbRolePermissions = await prisma.rolePermission.findMany({
      where: { tenantId, roleId: user.roleId },
      include: { permission: true }
    });

    if (dbRolePermissions.length > 0) {
      for (const rp of dbRolePermissions) {
        if (rp.allowed && rp.permission) {
          permissionCodes.add(rp.permission.code);
        }
      }
    } else {
      // Fallback to static authorization matrix if no DB role permissions exist
      const roleCode = user.role.code as Role;
      for (const [key, rules] of Object.entries(permissionMatrix)) {
        if (rules && (rules as any)[roleCode] === true) {
          const dbCode = permissionKeyMap[key] || key.toUpperCase();
          permissionCodes.add(dbCode);
        }
      }
    }

    // 2. Fetch and apply user overrides
    const overrides = await prisma.userPermissionOverride.findMany({
      where: { tenantId, userId },
      include: { permission: true }
    });

    for (const ov of overrides) {
      if (ov.permission) {
        if (ov.allowed) {
          permissionCodes.add(ov.permission.code);
        } else {
          permissionCodes.delete(ov.permission.code);
        }
      }
    }

    const result = Array.from(permissionCodes);
    this.cache.set(cacheKey, {
      permissions: result,
      expiresAt: now + this.CACHE_TTL_MS
    });

    return result;
  }

  /**
   * Checks if a user has a specific permission.
   */
  static async can(userId: string, permissionCode: string, tenantId: string): Promise<boolean> {
    const dbPermissionCode = permissionKeyMap[permissionCode] || permissionCode.toUpperCase();
    const effective = await this.getEffectivePermissions(userId, tenantId);
    return effective.includes(dbPermissionCode);
  }

  /**
   * Clears the permission cache for a user or entirely.
   */
  static clearCache(userId?: string, tenantId?: string): void {
    if (userId && tenantId) {
      this.cache.delete(`${userId}:${tenantId}`);
    } else {
      this.cache.clear();
    }
  }
}
