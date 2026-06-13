import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { hashPassword } from "../src/lib/crypto";

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Rfdc7vVDCwO2@ep-solitary-pond-aoo2eznv-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function main() {
  console.log("Seeding database...");
  
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();
    console.log("Connected to database. Cleaning tables...");

    // Delete in dependency order
    await prisma.aIRecommendation.deleteMany({});
    await prisma.alert.deleteMany({});
    await prisma.forecastRecord.deleteMany({});
    await prisma.forecastModel.deleteMany({});
    await prisma.inventory.deleteMany({});
    await prisma.productSupplier.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.productCategory.deleteMany({});
    await prisma.supplierContact.deleteMany({});
    await prisma.supplier.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.warehouse.deleteMany({});
    await prisma.location.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.tenantSettings.deleteMany({});
    await prisma.tenant.deleteMany({});

    console.log("Tables cleaned. Creating tenant...");

    const tenant = await prisma.tenant.create({
      data: {
        id: "tenant_acme",
        name: "Acme Retail Group",
        legalName: "Acme Retail Group Private Limited",
        slug: "acme-retail",
        status: "ACTIVE",
        operationalModel: "HYBRID",
        industry: "multi-channel retail",
        primaryCurrency: "USD",
        timezone: "Asia/Kolkata",
        locale: "en-IN",
        onboardingStatus: "completed"
      }
    });

    await prisma.tenantSettings.create({
      data: {
        tenantId: tenant.id,
        operationalModel: "HYBRID",
        currencyCode: "USD",
        timezone: "Asia/Kolkata",
        locale: "en-IN",
        valuationMethod: "FIFO"
      }
    });

    console.log("Creating roles...");

    const roleOwner = await prisma.role.create({
      data: {
        id: "role_owner",
        tenantId: tenant.id,
        roleKey: "BUSINESS_OWNER",
        code: "business_owner",
        name: "Business Owner",
        isSystem: true
      }
    });

    const roleOps = await prisma.role.create({
      data: {
        id: "role_ops",
        tenantId: tenant.id,
        roleKey: "OPS_MANAGER",
        code: "operations_manager",
        name: "Operations Manager",
        isSystem: true
      }
    });

    const roleWarehouse = await prisma.role.create({
      data: {
        id: "role_wh",
        tenantId: tenant.id,
        roleKey: "WAREHOUSE_MANAGER",
        code: "warehouse_manager",
        name: "Warehouse Manager",
        isSystem: true
      }
    });

    const roleStore = await prisma.role.create({
      data: {
        id: "role_store",
        tenantId: tenant.id,
        roleKey: "STORE_MANAGER",
        code: "store_manager",
        name: "Store Manager",
        isSystem: true
      }
    });

    const roleCashier = await prisma.role.create({
      data: {
        id: "role_cashier",
        tenantId: tenant.id,
        roleKey: "CASHIER",
        code: "cashier",
        name: "Cashier",
        isSystem: true
      }
    });

    console.log("Creating users...");

    const userOwner = await prisma.user.create({
      data: {
        id: "user_owner",
        tenantId: tenant.id,
        roleId: roleOwner.id,
        email: "owner@acme.example",
        fullName: "Asha Rao",
        passwordHash: hashPassword("password123"),
        status: "ACTIVE",
        userScope: "INTERNAL"
      }
    });

    const userOps = await prisma.user.create({
      data: {
        id: "user_ops",
        tenantId: tenant.id,
        roleId: roleOps.id,
        email: "ops@acme.example",
        fullName: "Dev Malhotra",
        passwordHash: hashPassword("password123"),
        status: "ACTIVE",
        userScope: "INTERNAL"
      }
    });

    const userWarehouse = await prisma.user.create({
      data: {
        id: "user_wh",
        tenantId: tenant.id,
        roleId: roleWarehouse.id,
        email: "warehouse@acme.example",
        fullName: "Nina Patel",
        passwordHash: hashPassword("password123"),
        status: "ACTIVE",
        userScope: "INTERNAL"
      }
    });

    const userStore = await prisma.user.create({
      data: {
        id: "user_store",
        tenantId: tenant.id,
        roleId: roleStore.id,
        email: "store@acme.example",
        fullName: "Ravi Kumar",
        passwordHash: hashPassword("password123"),
        status: "ACTIVE",
        userScope: "INTERNAL"
      }
    });

    const userCashier = await prisma.user.create({
      data: {
        id: "user_cashier",
        tenantId: tenant.id,
        roleId: roleCashier.id,
        email: "cashier@acme.example",
        fullName: "Maya Shah",
        passwordHash: hashPassword("password123"),
        status: "ACTIVE",
        userScope: "INTERNAL"
      }
    });

    console.log("Creating locations...");

    const locWH = await prisma.location.create({
      data: {
        id: "loc_wh_central",
        tenantId: tenant.id,
        code: "WH-001",
        name: "Central Warehouse",
        locationType: "WAREHOUSE",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        status: "ACTIVE"
      }
    });

    const locStore = await prisma.location.create({
      data: {
        id: "loc_store_01",
        tenantId: tenant.id,
        code: "ST-101",
        name: "Indiranagar Store",
        locationType: "STORE",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        status: "ACTIVE"
      }
    });

    // Create Store and Warehouse specific details
    await prisma.warehouse.create({
      data: {
        tenantId: tenant.id,
        locationId: locWH.id,
        warehouseCode: "WH-001",
        warehouseType: "CENTRAL"
      }
    });

    await prisma.store.create({
      data: {
        tenantId: tenant.id,
        locationId: locStore.id,
        storeCode: "ST-101",
        storeManagerUserId: userStore.id
      }
    });

    console.log("Creating suppliers...");

    const sup1 = await prisma.supplier.create({
      data: {
        id: "sup_01",
        tenantId: tenant.id,
        supplierCode: "SUP-PH-01",
        name: "Prime Pharma Distributors",
        status: "ACTIVE",
        performanceScore: 96.00
      }
    });

    const sup2 = await prisma.supplier.create({
      data: {
        id: "sup_02",
        tenantId: tenant.id,
        supplierCode: "SUP-FMCG-02",
        name: "Urban FMCG Supply",
        status: "ACTIVE",
        performanceScore: 89.00
      }
    });

    await prisma.supplierContact.create({
      data: {
        tenantId: tenant.id,
        supplierId: sup1.id,
        name: "Anand Iyer",
        email: "orders@primepharma.example",
        phone: "+91-90000-11111",
        isPrimary: true
      }
    });

    await prisma.supplierContact.create({
      data: {
        tenantId: tenant.id,
        supplierId: sup2.id,
        name: "Isha Nair",
        email: "support@urbanfmcg.example",
        phone: "+91-90000-22222",
        isPrimary: true
      }
    });

    console.log("Creating categories and products...");

    const catPharmacy = await prisma.productCategory.create({
      data: {
        id: "cat_pharmacy",
        tenantId: tenant.id,
        code: "cat_pharmacy",
        name: "Pharmacy",
        slug: "pharmacy"
      }
    });

    const catApparel = await prisma.productCategory.create({
      data: {
        id: "cat_apparel",
        tenantId: tenant.id,
        code: "cat_apparel",
        name: "Apparel",
        slug: "apparel"
      }
    });

    const prodParacetamol = await prisma.product.create({
      data: {
        id: "prod_paracetamol",
        tenantId: tenant.id,
        categoryId: catPharmacy.id,
        sku: "MED-PARA-500",
        name: "Paracetamol 500mg Tablets",
        unitOfMeasure: "box",
        reorderLevel: 40,
        reorderQuantity: 200,
        industry: "pharmacy",
        status: "ACTIVE",
        metadata: {
          batchNumber: "BATCH-PARA-001",
          expiryDate: "2026-12-31",
          medicineSchedule: "OTC"
        }
      }
    });

    const prodDenim = await prisma.product.create({
      data: {
        id: "prod_denim_shirt",
        tenantId: tenant.id,
        categoryId: catApparel.id,
        sku: "APP-DENIM-SHIRT",
        name: "Denim Shirt",
        unitOfMeasure: "piece",
        reorderLevel: 25,
        reorderQuantity: 80,
        industry: "garment",
        status: "ACTIVE",
        metadata: {
          sizeVariants: ["S", "M", "L", "XL"],
          colorVariants: ["Indigo", "Black"]
        }
      }
    });

    // Link products to suppliers
    await prisma.productSupplier.create({
      data: {
        tenantId: tenant.id,
        productId: prodParacetamol.id,
        supplierId: sup1.id,
        preferred: true
      }
    });

    await prisma.productSupplier.create({
      data: {
        tenantId: tenant.id,
        productId: prodDenim.id,
        supplierId: sup2.id,
        preferred: true
      }
    });

    console.log("Seeding inventory balances...");

    await prisma.inventory.create({
      data: {
        tenantId: tenant.id,
        locationId: locWH.id,
        productId: prodParacetamol.id,
        qtyOnHand: 420,
        qtyReserved: 40,
        reorderLevel: 40,
        reorderQuantity: 200
      }
    });

    await prisma.inventory.create({
      data: {
        tenantId: tenant.id,
        locationId: locStore.id,
        productId: prodParacetamol.id,
        qtyOnHand: 90,
        qtyReserved: 5,
        reorderLevel: 40,
        reorderQuantity: 200
      }
    });

    await prisma.inventory.create({
      data: {
        tenantId: tenant.id,
        locationId: locWH.id,
        productId: prodDenim.id,
        qtyOnHand: 220,
        qtyReserved: 15,
        reorderLevel: 25,
        reorderQuantity: 80
      }
    });

    await prisma.inventory.create({
      data: {
        tenantId: tenant.id,
        locationId: locStore.id,
        productId: prodDenim.id,
        qtyOnHand: 64,
        qtyReserved: 4,
        reorderLevel: 25,
        reorderQuantity: 80
      }
    });

    console.log("Seeding alerts...");

    await prisma.alert.create({
      data: {
        tenantId: tenant.id,
        severity: "WARNING",
        status: "OPEN",
        entityType: "product",
        entityId: prodParacetamol.id,
        title: "Low stock forecast",
        message: "Paracetamol 500mg Tablets will hit reorder threshold in 9 days."
      }
    });

    await prisma.alert.create({
      data: {
        tenantId: tenant.id,
        severity: "INFO",
        status: "OPEN",
        entityType: "location",
        entityId: locWH.id,
        title: "Warehouse utilization healthy",
        message: "Central warehouse zone utilization remains under 72%."
      }
    });

    console.log("Seeding AI forecasting models and records...");

    const forecastModel = await prisma.forecastModel.create({
      data: {
        id: "forecast_model_1",
        tenantId: tenant.id,
        modelKey: "model_demand_v1",
        name: "Acme Demand Forecast",
        modelType: "Prophet",
        version: "1.0",
        isActive: true,
        status: "ACTIVE"
      }
    });

    await prisma.forecastRecord.create({
      data: {
        tenantId: tenant.id,
        forecastModelId: forecastModel.id,
        entityType: "product",
        entityId: prodParacetamol.id,
        forecastDate: new Date(),
        horizonDays: 30,
        predictedValue: 280,
        confidence: 0.92
      }
    });

    await prisma.forecastRecord.create({
      data: {
        tenantId: tenant.id,
        forecastModelId: forecastModel.id,
        entityType: "product",
        entityId: prodDenim.id,
        forecastDate: new Date(),
        horizonDays: 30,
        predictedValue: 96,
        confidence: 0.88
      }
    });

    console.log("Seeding AI recommendations...");

    await prisma.aIRecommendation.create({
      data: {
        tenantId: tenant.id,
        forecastModelId: forecastModel.id,
        recommendationType: "reorder",
        priority: "high",
        entityType: "product",
        entityId: prodParacetamol.id,
        title: "Place replenishment purchase order",
        description: "Place a replenishment PO for Paracetamol 500mg Tablets.",
        confidence: 0.94
      }
    });

    await prisma.aIRecommendation.create({
      data: {
        tenantId: tenant.id,
        forecastModelId: forecastModel.id,
        recommendationType: "transfer",
        priority: "medium",
        entityType: "product",
        entityId: prodDenim.id,
        title: "Redistribute excess denim shirts",
        description: "Move excess denim shirts from warehouse to store for weekend demand.",
        confidence: 0.88
      }
    });

    console.log("Seeding completed successfully!");

  } catch (error) {
    console.error("Failed to seed database:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
