import { createId, hashPassword } from "../../lib/crypto";
import { toTenantDTO } from "./mapper";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { prisma } from "../../lib/db";
import type { OnboardingInput } from "./schema";
import { generateAccessToken } from "../../lib/jwt";
import { toUserDTO } from "../auth/mapper";
import { PermissionService } from "../users/PermissionService";

// Sanitize payload for logging (strip passwords)
function sanitizeForLog(input: any): any {
  const clone = JSON.parse(JSON.stringify(input));
  if (clone.adminUser?.password) clone.adminUser.password = "***REDACTED***";
  return clone;
}

export class TenantService {
  async startOnboarding(input: OnboardingInput) {
    const tenantId = createId("tenant");
    const requestTimestamp = new Date().toISOString();
    console.log(`[Onboarding] START tenantId=${tenantId} org="${input.organizationName}" at=${requestTimestamp}`);

    // Transaction-safe onboarding setup
    const { tenant, adminUser } = await prisma.$transaction(async (tx) => {
      // 0. Verify email doesn't exist globally
      const existingUser = await tx.user.findFirst({
        where: { email: { equals: input.adminUser.email, mode: "insensitive" } }
      });
      if (existingUser) {
        throw new ValidationError("This email address is already registered.");
      }

      // 1. Create Tenant
      const created = await tx.tenant.create({
        data: {
          id: tenantId,
          name: input.organizationName,
          legalName: input.legalName || input.organizationName,

          slug: input.organizationName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),

          // Ensure industry is never empty — required non-nullable field
          industry: input.businessType || input.industry || "general",
          primaryCurrency: input.currency || "USD",
          timezone: input.timezone || "UTC"
        }
      });

      // 2. Create Tenant Settings
      await tx.tenantSettings.create({
        data: {
          tenantId,
          currencyCode: input.currency || "USD",
          timezone: input.timezone || "UTC",
          // aiPreferences is Json? — must be an object, not a plain string
          aiPreferences: { mode: input.aiPreference || "Co-pilot" },
          operationalPreferences: {
            businessType: input.businessType || input.industry || "general"
          }
        }
      });

      // Find or create SubscriptionPlan
      const tierMapping: Record<string, string> = {
        starter: "STARTER",
        growth: "GROWTH",
        professional: "PROFESSIONAL",
        enterprise: "ENTERPRISE"
      };
      const planCode = (tierMapping[input.plan?.toLowerCase()] || "PROFESSIONAL");

      let subPlan = await tx.subscriptionPlan.findUnique({
        where: { code: planCode }
      });
      if (!subPlan) {
        subPlan = await tx.subscriptionPlan.create({
          data: {
            id: createId("subplan"),
            code: planCode,
            name: `${planCode.charAt(0) + planCode.slice(1).toLowerCase()} Plan`,
            tier: planCode as any,
            billingCycle: "MONTHLY",
            priceMonthly: 99.00,
            priceYearly: 990.00,
            limits: {},
            featureSet: {},
            isActive: true
          }
        });
      }

      // Create Subscription
      await tx.subscription.create({
        data: {
          id: createId("sub"),
          tenantId,
          subscriptionPlanId: subPlan.id,
          status: "ACTIVE",
          billingCycle: "MONTHLY",
          seatsPurchased: 5,
          seatsUsed: 1,
          startedAt: new Date(),
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      });

      // 3. Create Default Owner Role
      const ownerRole = await tx.role.create({
        data: {
          id: createId("role"),
          tenantId,
          roleKey: "BUSINESS_OWNER",
          code: "business_owner",
          name: "Business Owner",
          description: "Workspace owner with full access",
          isSystem: true
        }
      });

      // 3.1 Seed default permissions and permission matrix (Task 12)
      const defaultPermissions = [
        { code: "PRODUCT_MANAGEMENT", name: "Product Catalog Management", module: "products", action: "manage" },
        { code: "INVENTORY_READ", name: "Read Inventory Levels", module: "inventory", action: "read" },
        { code: "INVENTORY_WRITE", name: "Modify Inventory & Adjustments", module: "inventory", action: "write" },
        { code: "POS_SALES", name: "Process Point of Sale Checkout", module: "pos", action: "sales" },
        { code: "ANALYTICS_READ", name: "Read Store Analytics & Metrics", module: "analytics", action: "read" },
        { code: "AI_READ", name: "Read AI Center Recommendations", module: "ai", action: "read" },
        { code: "SETTINGS_MANAGE", name: "Manage System Settings & Policies", module: "settings", action: "manage" },
        { code: "USER_MANAGEMENT", name: "Manage Team Members & Invites", module: "users", action: "manage" },
        { code: "TENANT_ADMIN", name: "Full Organization Control", module: "organization", action: "admin" },
        { code: "AUDIT_READ", name: "Read Security Compliance Logs", module: "compliance", action: "read" },
        { code: "DISPATCH_OPERATIONS", name: "Dispatch & Delivery Operations", module: "transfers", action: "dispatch" },
        { code: "APPROVE_TRANSFER", name: "Approve Stock Transfers", module: "transfers", action: "approve" },
        { code: "APPROVE_GRN", name: "Approve Goods Receipt Notes", module: "procurement", action: "approve_grn" },
        { code: "APPROVE_DC", name: "Approve Delivery Challans", module: "transfers", action: "approve_dc" },
        { code: "PROCESS_REFUND", name: "Process Sales Refunds", module: "pos", action: "refund" },
        { code: "EXPORT_DATA", name: "Export Business Data", module: "analytics", action: "export" },
        { code: "CONFIGURE_AI", name: "Configure AI Settings", module: "ai", action: "configure" }
      ];

      for (const perm of defaultPermissions) {
        const permission = await tx.permission.create({
          data: {
            id: createId("perm"),
            tenantId,
            code: perm.code,
            name: perm.name,
            module: perm.module,
            action: perm.action,
            isSystem: true
          }
        });

        // Grant all permissions to Business Owner role
        await tx.rolePermission.create({
          data: {
            id: createId("rp"),
            tenantId,
            roleId: ownerRole.id,
            permissionId: permission.id,
            allowed: true
          }
        });
      }

      // Build workspaceSettings based on chosen features
      const features = input.selectedFeatures || ["inventory", "pos", "analytics", "ai", "stores", "dealers"];
      
      const sidebarOrder = ["dashboard"];
      if (features.includes("inventory")) sidebarOrder.push("inventory");
      if (features.includes("ai")) sidebarOrder.push("ai");
      if (features.includes("stores")) sidebarOrder.push("stores");
      if (features.includes("dealers")) sidebarOrder.push("dealers");
      if (features.includes("pos")) sidebarOrder.push("pos");
      if (features.includes("analytics")) sidebarOrder.push("analytics");
      sidebarOrder.push("settings");

      const widgets = [];
      if (features.includes("pos") || features.includes("analytics")) {
        widgets.push({ id: "revenue", size: "sm" as const, visible: true });
      }
      if (features.includes("stores")) {
        widgets.push({ id: "stores", size: "sm" as const, visible: true });
      }
      if (features.includes("inventory")) {
        widgets.push({ id: "inventoryValue", size: "sm" as const, visible: true });
        widgets.push({ id: "lowStock", size: "sm" as const, visible: true });
      }
      if (features.includes("analytics") || features.includes("ai")) {
        widgets.push({ id: "forecastChart", size: "md" as const, visible: true });
      }
      if (features.includes("ai")) {
        widgets.push({ id: "aiInsights", size: "sm" as const, visible: true });
      }
      if (features.includes("pos") || features.includes("inventory") || features.includes("analytics")) {
        widgets.push({ id: "topProducts", size: "md" as const, visible: true });
      }
      widgets.push({ id: "alerts", size: "sm" as const, visible: true });

      const workspaceSettings = {
        sidebarOrder,
        sidebarFavorites: [],
        sidebarHidden: [],
        dashboardLayouts: [
          { name: "Default Layout", widgets }
        ],
        activeLayoutName: "Default Layout"
      };

      // 4. Create Admin User
      const adminUserId = createId("user");
      const password = input.adminUser.password || createId("pw");

      const userMetadata: any = {
        workspaceSettings
      };
      if (input.adminUser.googleId) {
        userMetadata.googleId = input.adminUser.googleId;
      }

      const admin = await tx.user.create({
        data: {
          id: adminUserId,
          tenantId,
          roleId: ownerRole.id,
          email: input.adminUser.email,
          fullName: input.adminUser.fullName,
          passwordHash: hashPassword(password),
          status: "ACTIVE",
          userScope: "INTERNAL",
          metadata: userMetadata
        },
        include: {
          role: true
        }
      });

      // Helper to process location onboarding inventory
      const processInitialInventory = async (tx: any, locationId: string, inventory: any[]) => {
        for (const item of inventory) {
          const categorySlug = item.category.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
          let category = await tx.productCategory.findFirst({
            where: { slug: categorySlug, tenantId }
          });
          if (!category) {
            category = await tx.productCategory.create({
              data: {
                id: createId("cat"),
                tenantId,
                code: categorySlug,
                name: item.category,
                slug: categorySlug
              }
            });
          }

          let product = await tx.product.findFirst({
            where: { sku: { equals: item.sku, mode: "insensitive" }, tenantId }
          });
          if (!product) {
            product = await tx.product.create({
              data: {
                id: createId("prod"),
                tenantId,
                categoryId: category.id,
                sku: item.sku,
                name: item.name,
                unitOfMeasure: item.unit,
                reorderLevel: 10,
                reorderQuantity: 50,
                industry: input.businessType || input.industry || "general",
                status: "ACTIVE",
                metadata: {
                  purchasePrice: item.purchasePrice,
                  sellingPrice: item.sellingPrice
                }
              }
            });
          }

          await tx.inventory.create({
            data: {
              id: createId("inv"),
              tenantId,
              locationId,
              productId: product.id,
              qtyOnHand: item.quantity,
              qtyReserved: 0,
              reorderLevel: 10,
              reorderQuantity: 50
            }
          });

          await tx.inventoryMovement.create({
            data: {
              id: createId("move"),
              tenantId,
              productId: product.id,
              locationId,
              quantity: item.quantity,
              movementType: "INWARD",
              movementNumber: `ONB-${createId("mv")}`,
              sourceType: "ONBOARDING",
              notes: "Initial Onboarding Import",
              occurredAt: new Date()
            }
          });
        }
      };

      // 5. Create Warehouses
      if (input.warehouses?.length) {
        for (const wh of input.warehouses) {
          const warehouseLocationId = createId("loc");

          const warehouseLocation = await tx.location.create({
            data: {
              id: warehouseLocationId,
              tenantId,
              name: wh.name,
              code: wh.code,
              locationType: "WAREHOUSE",
              city: input.hq?.split(",")[0]?.trim() || "Mumbai",
              state: input.hq?.split(",")[1]?.trim() || "Maharashtra",
              country: "India",
              status: "ACTIVE"
            }
          });

          await tx.warehouse.create({
            data: {
              id: createId("wh"),
              tenantId,
              locationId: warehouseLocation.id,
              warehouseCode: warehouseLocation.code
            }
          });

          if (wh.inventory && wh.inventory.length > 0) {
            await processInitialInventory(tx, warehouseLocation.id, wh.inventory);
          }
        }
      }

      // 6. Create Stores
      if (input.stores?.length) {
        for (const store of input.stores) {
          const storeLocationId = createId("loc");

          const storeLocation = await tx.location.create({
            data: {
              id: storeLocationId,
              tenantId,
              name: store.name,
              code: store.code,
              locationType: "STORE",
              city: store.city,
              state:
                store.city === "Bengaluru"
                  ? "Karnataka"
                  : store.city === "Delhi"
                    ? "Delhi"
                    : "Maharashtra",
              country: "India",
              status: "ACTIVE"
            }
          });

          await tx.store.create({
            data: {
              id: createId("st"),
              tenantId,
              locationId: storeLocation.id,
              storeCode: storeLocation.code
            }
          });

          if (store.inventory && store.inventory.length > 0) {
            await processInitialInventory(tx, storeLocation.id, store.inventory);
          }
        }
      }

      return {
        tenant: created,
        adminUser: admin
      };
    }).catch((error: any) => {
      // Production-grade onboarding error logging
      console.error("[Onboarding] FAILED", {
        tenantId,
        timestamp: requestTimestamp,
        organization: input.organizationName,
        adminEmail: input.adminUser.email,
        code: error?.code,
        meta: error?.meta,
        message: error?.message,
        stack: error?.stack,
        payload: sanitizeForLog(input)
      });
      throw error;
    });

    // Generate Access Token
    const token = generateAccessToken({
      sub: adminUser.id,
      role: adminUser.role.code,
      tenantId,
      tokenVersion: adminUser.tokenVersion
    });

    const refreshToken = createId("ref");
    const sessionId = createId("sess");

    // Track active UserSession
    try {
      await prisma.userSession.create({
        data: {
          id: sessionId,
          tenantId,
          userId: adminUser.id,
          sessionTokenHash: refreshToken,
          deviceName: "Web Client",
          ipAddress: "127.0.0.1",
          userAgent: "Web",
          isActive: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          lastSeenAt: new Date()
        }
      });
    } catch (sessionErr) {
      console.error("Failed to track session log on onboarding launch:", sessionErr);
    }

    // Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        module: "onboarding",
        action: "tenant_created",
        summary: `Tenant ${input.organizationName} created and workspace configured by ${input.adminUser.fullName}`,
        entityType: "tenant",
        severity: "INFO"
      }
    });

    const effective = await PermissionService.getEffectivePermissions(adminUser.id, tenantId);
    return {
      token,
      refreshToken,
      user: toUserDTO(adminUser, effective),
      tenant: toTenantDTO(tenant, input.plan)
    };
  }

  async getSummary(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId
      }
    });

    if (!tenant) {
      throw new NotFoundError(`Tenant with ID ${tenantId} not found`);
    }

    const [
      usersCount,
      locationsCount,
      productsCount
    ] = await Promise.all([
      prisma.user.count({
        where: {
          tenantId
        }
      }),
      prisma.location.count({
        where: {
          tenantId
        }
      }),
      prisma.product.count({
        where: {
          tenantId
        }
      })
    ]);

    return {
      tenant: toTenantDTO(tenant),
      users: usersCount,
      locations: locationsCount,
      products: productsCount
    };
  }

  async updateTenant(
    tenantId: string,
    data: { name: string; legalName: string; timezone: string; primaryCurrency: string },
    actorUserId: string
  ) {
    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: data.name,
        legalName: data.legalName,
        timezone: data.timezone,
        primaryCurrency: data.primaryCurrency
      }
    });

    // Also update TenantSettings
    await prisma.tenantSettings.updateMany({
      where: { tenantId },
      data: {
        timezone: data.timezone,
        currencyCode: data.primaryCurrency
      }
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "tenant",
        action: "organization_updated",
        summary: `Updated organization settings (Name: ${data.name}, Legal: ${data.legalName})`,
        entityType: "tenant",
        severity: "INFO"
      }
    });

    return toTenantDTO(updated);
  }
}
