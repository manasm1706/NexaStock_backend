import { createId, hashPassword } from "../../lib/crypto";
import { toTenantDTO } from "./mapper";
import { NotFoundError } from "../../lib/errors";
import { prisma } from "../../lib/db";
import type { OnboardingInput } from "./schema";
import { generateAccessToken } from "../../lib/jwt";
import { toUserDTO } from "../auth/mapper";

export class TenantService {
  async startOnboarding(input: OnboardingInput) {
    const tenantId = createId("tenant");

    // Transaction-safe onboarding setup
    const { tenant, adminUser } = await prisma.$transaction(async (tx) => {

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

          industry: input.industry,
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
          aiPreferences: input.aiPreference || "Co-pilot"
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

      // 5. Create Warehouse
      if (input.warehouse) {
        const warehouseLocationId = createId("loc");

        const warehouseLocation = await tx.location.create({
          data: {
            id: warehouseLocationId,
            tenantId,
            name: input.warehouse.name,
            code: input.warehouse.code,
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
        }
      }

      return {
        tenant: created,
        adminUser: admin
      };
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
}
