import { createId, hashPassword } from "../../lib/crypto";
import { toTenantDTO } from "./mapper";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { prisma } from "../../lib/db";
import type { OnboardingInput } from "./schema";
import { generateAccessToken } from "../../lib/jwt";
import { toUserDTO } from "../auth/mapper";

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

      // 4. Create Admin User
      const adminUserId = createId("user");

      const admin = await tx.user.create({
        data: {
          id: adminUserId,
          tenantId,
          roleId: ownerRole.id,
          email: input.adminUser.email,
          fullName: input.adminUser.fullName,
          passwordHash: hashPassword(input.adminUser.password),
          status: "ACTIVE",
          userScope: "INTERNAL"
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
      tenantId
    });

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

    return {
      token,
      user: toUserDTO(adminUser),
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
