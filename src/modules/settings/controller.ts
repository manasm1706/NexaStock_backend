import type { RequestContext } from "../../framework/types";
import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";
import { ValidationError, NotFoundError } from "../../lib/errors";

export class SettingsController {
  
  // ==========================================
  // 1. Roles & Permission Matrix
  // ==========================================

  listRoles = async (context: RequestContext) => {
    const tenantId = context.tenantId;

    const roles = await prisma.role.findMany({
      where: { tenantId }
    });

    const defaultCodes = ["business_owner", "admin", "warehouse_manager", "store_manager", "cashier"];
    const existingCodes = roles.map(r => r.code);
    const missingCodes = defaultCodes.filter(c => !existingCodes.includes(c));

    if (missingCodes.length > 0) {
      const seededRoles = [];
      const roleMappings: Record<string, { name: string; key: any }> = {
        admin: { name: "Admin", key: "OPS_MANAGER" },
        warehouse_manager: { name: "Warehouse Manager", key: "WAREHOUSE_MANAGER" },
        store_manager: { name: "Store Manager", key: "STORE_MANAGER" },
        cashier: { name: "Cashier", key: "CASHIER" }
      };

      for (const code of missingCodes) {
        const map = roleMappings[code];
        if (map) {
          const r = await prisma.role.create({
            data: {
              id: createId("role"),
              tenantId,
              code,
              name: map.name,
              roleKey: map.key,
              isSystem: true
            }
          });
          seededRoles.push(r);
        }
      }
      return [...roles, ...seededRoles];
    }

    return roles;
  };

  createRole = async (context: RequestContext) => {
    const tenantId = context.tenantId;
    const body = (context.body as { name?: string; description?: string }) || {};
    
    if (!body.name) {
      throw new ValidationError("Role name is required.");
    }

    const code = body.name.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (!code) {
      throw new ValidationError("Invalid role name.");
    }

    const existing = await prisma.role.findFirst({
      where: { tenantId, code }
    });
    if (existing) {
      throw new ValidationError(`A role with code '${code}' already exists.`);
    }

    const created = await prisma.role.create({
      data: {
        id: createId("role"),
        tenantId,
        code,
        name: body.name,
        description: body.description || "",
        isSystem: false
      }
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId: context.actorId || null,
        module: "settings",
        action: "role_created",
        summary: `Created custom role: ${body.name}`,
        entityType: "role",
        severity: "INFO",
        afterData: { roleId: created.id }
      }
    });

    return created;
  };

  getPermissions = async (context: RequestContext) => {
    const tenantId = context.tenantId;
    const roleId = context.params.id as string;

    // Self-healing permission seeding
    const existingCount = await prisma.permission.count({
      where: { tenantId }
    });

    if (existingCount === 0) {
      const keys = [
        { code: "PRODUCT_MANAGEMENT", name: "Product Catalog Management", module: "products", action: "manage" },
        { code: "INVENTORY_READ", name: "Read Inventory Levels", module: "inventory", action: "read" },
        { code: "INVENTORY_WRITE", name: "Modify Inventory & Adjustments", module: "inventory", action: "write" },
        { code: "POS_SALES", name: "Process Point of Sale Checkout", module: "pos", action: "sales" },
        { code: "ANALYTICS_READ", name: "Read Store Analytics & Metrics", module: "analytics", action: "read" },
        { code: "AI_READ", name: "Read AI Center Recommendations", module: "ai", action: "read" },
        { code: "SETTINGS_MANAGE", name: "Manage System Settings & Policies", module: "settings", action: "manage" },
        { code: "USER_MANAGEMENT", name: "Manage Team Members & Invites", module: "users", action: "manage" },
        { code: "TENANT_ADMIN", name: "Full Organization Control", module: "organization", action: "admin" },
        { code: "AUDIT_READ", name: "Read Security Compliance Logs", module: "compliance", action: "read" }
      ];

      for (const item of keys) {
        await prisma.permission.create({
          data: {
            id: createId("perm"),
            tenantId,
            code: item.code,
            name: item.name,
            module: item.module,
            action: item.action,
            isSystem: true
          }
        });
      }
    }

    const allPerms = await prisma.permission.findMany({
      where: { tenantId }
    });

    const rolePerms = await prisma.rolePermission.findMany({
      where: { tenantId, roleId }
    });

    return allPerms.map(p => {
      const rp = rolePerms.find(r => r.permissionId === p.id);
      return {
        permissionId: p.id,
        code: p.code,
        name: p.name,
        module: p.module,
        allowed: rp ? rp.allowed : false
      };
    });
  };

  savePermissions = async (context: RequestContext) => {
    const tenantId = context.tenantId;
    const roleId = context.params.id as string;
    const body = (context.body as { permissions?: Array<{ code: string; allowed: boolean }> }) || {};
    const inputPerms = body.permissions || [];

    const role = await prisma.role.findFirst({
      where: { id: roleId, tenantId }
    });
    if (!role) {
      throw new NotFoundError("Role not found.");
    }

    const allPerms = await prisma.permission.findMany({
      where: { tenantId }
    });

    for (const item of inputPerms) {
      const perm = allPerms.find(p => p.code === item.code);
      if (perm) {
        const existing = await prisma.rolePermission.findFirst({
          where: { tenantId, roleId, permissionId: perm.id }
        });

        if (existing) {
          await prisma.rolePermission.update({
            where: { id: existing.id },
            data: { allowed: item.allowed }
          });
        } else {
          await prisma.rolePermission.create({
            data: {
              id: createId("roleperm"),
              tenantId,
              roleId,
              permissionId: perm.id,
              allowed: item.allowed
            }
          });
        }
      }
    }

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId: context.actorId || null,
        module: "settings",
        action: "role_permissions_updated",
        summary: `Updated permissions schema for role ${role.name}`,
        entityType: "role",
        severity: "INFO",
        afterData: { roleId }
      }
    });

    return { success: true, message: "Role permissions saved successfully." };
  };

  // ==========================================
  // 2. Active Sessions & Security Policy
  // ==========================================

  listSessions = async (context: RequestContext) => {
    const userId = context.actorId!;
    const tenantId = context.tenantId;

    return prisma.userSession.findMany({
      where: { userId, tenantId, isActive: true },
      orderBy: { lastSeenAt: "desc" }
    });
  };

  revokeOtherSessions = async (context: RequestContext) => {
    const userId = context.actorId!;
    const tenantId = context.tenantId;

    await prisma.userSession.updateMany({
      where: {
        userId,
        tenantId,
        isActive: true,
        // We'll keep the current request session alive. Since token verification doesn't give a specific session ID,
        // we can optionally receive a body session ID to exclude, or simply revoke all other sessions.
        id: { not: (context.body as { currentSessionId?: string })?.currentSessionId || "none" }
      },
      data: {
        isActive: false,
        revokedAt: new Date()
      }
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId: userId || null,
        module: "security",
        action: "sessions_revoked",
        summary: `Revoked other active user sessions`,
        entityType: "user",
        severity: "INFO"
      }
    });

    return { success: true, message: "Logged out other sessions successfully." };
  };

  getPolicy = async (context: RequestContext) => {
    const tenantId = context.tenantId;

    const settings = await prisma.tenantSettings.findFirst({
      where: { tenantId }
    });

    const meta = (settings?.metadata as any) || {};
    return {
      minLength: meta.pwMinLength ?? 8,
      requireNumbers: meta.pwRequireNumbers ?? true,
      requireSpecialChars: meta.pwRequireSpecial ?? true,
      requireUppercase: meta.pwRequireUpper ?? true
    };
  };

  updatePolicy = async (context: RequestContext) => {
    const tenantId = context.tenantId;
    const body = context.body as {
      minLength?: number;
      requireNumbers?: boolean;
      requireSpecialChars?: boolean;
      requireUppercase?: boolean;
    };

    const settings = await prisma.tenantSettings.findFirst({
      where: { tenantId }
    });

    if (!settings) {
      throw new NotFoundError("Tenant settings record not found.");
    }

    const currentMeta = (settings.metadata as any) || {};
    const updatedMeta = {
      ...currentMeta,
      pwMinLength: body.minLength ?? currentMeta.pwMinLength ?? 8,
      pwRequireNumbers: body.requireNumbers ?? currentMeta.pwRequireNumbers ?? true,
      pwRequireSpecial: body.requireSpecialChars ?? currentMeta.pwRequireSpecial ?? true,
      pwRequireUpper: body.requireUppercase ?? currentMeta.pwRequireUpper ?? true
    };

    await prisma.tenantSettings.update({
      where: { id: settings.id },
      data: { metadata: updatedMeta }
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId: context.actorId || null,
        module: "security",
        action: "policy_updated",
        summary: `Updated password security complexity policies`,
        entityType: "tenant",
        severity: "INFO"
      }
    });

    return { success: true, message: "Security policy updated successfully." };
  };

  // ==========================================
  // 3. Notification Preferences
  // ==========================================

  getNotifications = async (context: RequestContext) => {
    const userId = context.actorId!;
    const tenantId = context.tenantId;

    let pref = await prisma.notificationPreference.findUnique({
      where: { userId }
    });

    if (!pref) {
      pref = await prisma.notificationPreference.create({
        data: {
          id: createId("notifpref"),
          tenantId,
          userId,
          emailEnabled: true,
          inAppEnabled: true,
          metadata: {
            lowStockAlerts: true,
            inventoryAlerts: true,
            teamActivity: true,
            invitationNotifications: true
          }
        }
      });
    }

    return pref;
  };

  updateNotifications = async (context: RequestContext) => {
    const userId = context.actorId!;
    const body = context.body as {
      emailEnabled?: boolean;
      inAppEnabled?: boolean;
      lowStockAlerts?: boolean;
      inventoryAlerts?: boolean;
      teamActivity?: boolean;
      invitationNotifications?: boolean;
    };

    let pref = await prisma.notificationPreference.findUnique({
      where: { userId }
    });

    const metadata = {
      lowStockAlerts: body.lowStockAlerts !== false,
      inventoryAlerts: body.inventoryAlerts !== false,
      teamActivity: body.teamActivity !== false,
      invitationNotifications: body.invitationNotifications !== false
    };

    if (pref) {
      pref = await prisma.notificationPreference.update({
        where: { id: pref.id },
        data: {
          emailEnabled: body.emailEnabled !== false,
          inAppEnabled: body.inAppEnabled !== false,
          metadata
        }
      });
    } else {
      pref = await prisma.notificationPreference.create({
        data: {
          id: createId("notifpref"),
          tenantId: context.tenantId,
          userId,
          emailEnabled: body.emailEnabled !== false,
          inAppEnabled: body.inAppEnabled !== false,
          metadata
        }
      });
    }

    return pref;
  };

  getWorkspaceSettings = async (context: RequestContext) => {
    const userId = context.actorId!;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const meta = (user.metadata as any) || {};
    if (meta.workspaceSettings) {
      return meta.workspaceSettings;
    }

    // Role-based defaults
    const roleCode = user.role.code;
    let sidebarOrder = ["dashboard", "inventory", "ai", "stores", "pos", "analytics", "settings"];
    let sidebarFavorites: string[] = [];
    let sidebarHidden: string[] = [];
    let activeLayoutName = "Default Layout";

    if (roleCode === "business_owner" || roleCode === "super_admin") {
      sidebarFavorites = ["analytics", "ai", "settings"];
      activeLayoutName = "Executive Layout";
    } else if (roleCode === "operations_manager" || roleCode === "store_manager") {
      sidebarFavorites = ["inventory", "analytics", "stores"];
      activeLayoutName = "Manager Layout";
    } else if (roleCode === "cashier") {
      sidebarFavorites = ["pos", "inventory"];
      sidebarHidden = ["ai", "stores", "analytics", "settings"];
      activeLayoutName = "Cashier Layout";
    } else if (roleCode === "warehouse_manager") {
      sidebarFavorites = ["inventory", "stores"];
      sidebarHidden = ["pos", "ai", "analytics"];
      activeLayoutName = "Warehouse Layout";
    }

    const defaultWidgets = [
      { id: "revenue", size: "sm", visible: true },
      { id: "stores", size: "sm", visible: true },
      { id: "inventoryValue", size: "sm", visible: true },
      { id: "lowStock", size: "sm", visible: true },
      { id: "forecastChart", size: "md", visible: true },
      { id: "aiInsights", size: "sm", visible: true },
      { id: "topProducts", size: "md", visible: true },
      { id: "alerts", size: "sm", visible: true }
    ];

    const executiveWidgets = [
      { id: "revenue", size: "sm", visible: true },
      { id: "inventoryValue", size: "sm", visible: true },
      { id: "lowStock", size: "sm", visible: true },
      { id: "aiInsights", size: "sm", visible: true },
      { id: "forecastChart", size: "md", visible: true },
      { id: "topProducts", size: "md", visible: true },
      { id: "alerts", size: "sm", visible: true },
      { id: "stores", size: "sm", visible: false }
    ];

    const managerWidgets = [
      { id: "inventoryValue", size: "sm", visible: true },
      { id: "lowStock", size: "sm", visible: true },
      { id: "stores", size: "sm", visible: true },
      { id: "topProducts", size: "md", visible: true },
      { id: "forecastChart", size: "md", visible: true },
      { id: "alerts", size: "sm", visible: true },
      { id: "revenue", size: "sm", visible: false },
      { id: "aiInsights", size: "sm", visible: false }
    ];

    const cashierWidgets = [
      { id: "lowStock", size: "sm", visible: true },
      { id: "topProducts", size: "md", visible: true },
      { id: "revenue", size: "sm", visible: false },
      { id: "inventoryValue", size: "sm", visible: false },
      { id: "stores", size: "sm", visible: false },
      { id: "forecastChart", size: "md", visible: false },
      { id: "aiInsights", size: "sm", visible: false },
      { id: "alerts", size: "sm", visible: false }
    ];

    const warehouseWidgets = [
      { id: "lowStock", size: "sm", visible: true },
      { id: "inventoryValue", size: "sm", visible: true },
      { id: "stores", size: "sm", visible: true },
      { id: "alerts", size: "sm", visible: true },
      { id: "revenue", size: "sm", visible: false },
      { id: "forecastChart", size: "md", visible: false },
      { id: "aiInsights", size: "sm", visible: false },
      { id: "topProducts", size: "md", visible: false }
    ];

    const defaultLayouts = [
      { name: "Default Layout", widgets: defaultWidgets },
      { name: "Executive Layout", widgets: executiveWidgets },
      { name: "Manager Layout", widgets: managerWidgets },
      { name: "Cashier Layout", widgets: cashierWidgets },
      { name: "Warehouse Layout", widgets: warehouseWidgets },
      { name: "Retail Layout", widgets: defaultWidgets }
    ];

    return {
      sidebarOrder,
      sidebarFavorites,
      sidebarHidden,
      dashboardLayouts: defaultLayouts,
      activeLayoutName
    };
  };

  updateWorkspaceSettings = async (context: RequestContext) => {
    const userId = context.actorId!;
    const body = context.body || {};

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const currentMeta = (user.metadata as any) || {};
    const updatedMeta = {
      ...currentMeta,
      workspaceSettings: body
    };

    await prisma.user.update({
      where: { id: userId },
      data: { metadata: updatedMeta }
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId: context.tenantId,
        actorUserId: userId,
        module: "settings",
        action: "workspace_layout_updated",
        summary: `Updated workspace personalization settings`,
        entityType: "user",
        afterData: body,
        severity: "INFO"
      }
    });

    return { success: true, workspaceSettings: body };
  };
}

