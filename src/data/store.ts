import { createId, hashPassword } from "../lib/crypto";
import type {
  AlertItem,
  AuditEvent,
  DashboardSnapshot,
  Invoice,
  Location,
  Product,
  Role,
  StockBalance,
  StockMovement,
  Supplier,
  Tenant,
  TransferRequest,
  User
} from "../domain/types";

export interface BackendStore {
  tenants: Tenant[];
  users: User[];
  locations: Location[];
  suppliers: Supplier[];
  products: Product[];
  stockBalances: StockBalance[];
  stockMovements: StockMovement[];
  transferRequests: TransferRequest[];
  invoices: Invoice[];
  auditEvents: AuditEvent[];
  alerts: AlertItem[];
}

function now(): string {
  return new Date().toISOString();
}

function seedTenant(): Tenant {
  return {
    id: "tenant_acme",
    name: "Acme Retail Group",
    legalName: "Acme Retail Group Private Limited",
    industry: "multi-channel retail",
    status: "active",
    plan: "professional",
    createdAt: now()
  };
}

function seedUsers(tenantId: string): User[] {
  const roles: Array<{ fullName: string; email: string; role: Role }> = [
    { fullName: "Asha Rao", email: "owner@acme.example", role: "business_owner" },
    { fullName: "Dev Malhotra", email: "ops@acme.example", role: "operations_manager" },
    { fullName: "Nina Patel", email: "warehouse@acme.example", role: "warehouse_manager" },
    { fullName: "Ravi Kumar", email: "store@acme.example", role: "store_manager" },
    { fullName: "Maya Shah", email: "cashier@acme.example", role: "cashier" }
  ];

  return roles.map((entry, index) => ({
    id: `user_seed_${index + 1}`,
    tenantId,
    fullName: entry.fullName,
    email: entry.email,
    passwordHash: hashPassword("password123"),
    role: entry.role,
    locationIds: [],
    status: "active",
    createdAt: now()
  }));
}

function seedLocations(tenantId: string): Location[] {
  return [
    {
      id: "loc_wh_central",
      tenantId,
      name: "Central Warehouse",
      code: "WH-001",
      type: "warehouse",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      healthScore: 94,
      staffCount: 18
    },
    {
      id: "loc_store_01",
      tenantId,
      name: "Indiranagar Store",
      code: "ST-101",
      type: "store",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      healthScore: 91,
      staffCount: 7
    }
  ];
}

function seedSuppliers(tenantId: string): Supplier[] {
  return [
    {
      id: "sup_01",
      tenantId,
      name: "Prime Pharma Distributors",
      code: "SUP-PH-01",
      contactName: "Anand Iyer",
      phone: "+91-90000-11111",
      email: "orders@primepharma.example",
      taxId: "GSTIN1234PHARMA",
      status: "active",
      performanceScore: 96
    },
    {
      id: "sup_02",
      tenantId,
      name: "Urban FMCG Supply",
      code: "SUP-FMCG-02",
      contactName: "Isha Nair",
      phone: "+91-90000-22222",
      email: "support@urbanfmcg.example",
      taxId: "GSTIN5678FMCG",
      status: "active",
      performanceScore: 89
    }
  ];
}

function seedProducts(tenantId: string, supplierIds: string[]): Product[] {
  const timestamp = now();
  return [
    {
      id: "prod_paracetamol",
      tenantId,
      sku: "MED-PARA-500",
      barcode: "8901234567001",
      name: "Paracetamol 500mg Tablets",
      category: "Pharmacy",
      subCategory: "Analgesics",
      brand: "Acme Care",
      unitOfMeasure: "box",
      purchasePrice: 35,
      sellingPrice: 48,
      mrp: 52,
      reorderLevel: 40,
      reorderQuantity: 200,
      taxRate: 12,
      supplierIds,
      isActive: true,
      industry: "pharmacy",
      metadata: {
        batchNumber: "BATCH-PARA-001",
        expiryDate: "2026-12-31",
        medicineSchedule: "OTC"
      },
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
      id: "prod_denim_shirt",
      tenantId,
      sku: "APP-DENIM-SHIRT",
      barcode: "8901234567002",
      name: "Denim Shirt",
      category: "Apparel",
      subCategory: "Men Shirts",
      brand: "Northline",
      unitOfMeasure: "piece",
      purchasePrice: 650,
      sellingPrice: 1099,
      mrp: 1199,
      reorderLevel: 25,
      reorderQuantity: 80,
      taxRate: 5,
      supplierIds,
      isActive: true,
      industry: "garment",
      metadata: {
        sizeVariants: ["S", "M", "L", "XL"],
        colorVariants: ["Indigo", "Black"]
      },
      createdAt: timestamp,
      updatedAt: timestamp
    }
  ];
}

function seedStock(tenantId: string): StockBalance[] {
  return [
    {
      tenantId,
      locationId: "loc_wh_central",
      productId: "prod_paracetamol",
      quantity: 420,
      reservedQuantity: 40,
      updatedAt: now()
    },
    {
      tenantId,
      locationId: "loc_store_01",
      productId: "prod_paracetamol",
      quantity: 90,
      reservedQuantity: 5,
      updatedAt: now()
    },
    {
      tenantId,
      locationId: "loc_wh_central",
      productId: "prod_denim_shirt",
      quantity: 220,
      reservedQuantity: 15,
      updatedAt: now()
    },
    {
      tenantId,
      locationId: "loc_store_01",
      productId: "prod_denim_shirt",
      quantity: 64,
      reservedQuantity: 4,
      updatedAt: now()
    }
  ];
}

function seedAlerts(tenantId: string): AlertItem[] {
  return [
    {
      id: createId("alert"),
      tenantId,
      severity: "warning",
      title: "Low stock forecast",
      message: "Paracetamol 500mg Tablets will hit reorder threshold in 9 days.",
      resolved: false,
      createdAt: now()
    },
    {
      id: createId("alert"),
      tenantId,
      severity: "info",
      title: "Warehouse utilization healthy",
      message: "Central warehouse zone utilization remains under 72%.",
      resolved: false,
      createdAt: now()
    }
  ];
}

export function createStore(): BackendStore {
  const tenant = seedTenant();
  const suppliers = seedSuppliers(tenant.id);
  const products = seedProducts(tenant.id, suppliers.map((supplier) => supplier.id));

  return {
    tenants: [tenant],
    users: seedUsers(tenant.id),
    locations: seedLocations(tenant.id),
    suppliers,
    products,
    stockBalances: seedStock(tenant.id),
    stockMovements: [],
    transferRequests: [],
    invoices: [],
    auditEvents: [],
    alerts: seedAlerts(tenant.id)
  };
}

export const store = createStore();

export function recordAudit(event: Omit<AuditEvent, "id" | "createdAt">): AuditEvent {
  const auditEvent: AuditEvent = {
    id: createId("audit"),
    createdAt: now(),
    ...event
  };
  store.auditEvents.unshift(auditEvent);
  return auditEvent;
}

export function findTenant(tenantId: string): Tenant | undefined {
  return store.tenants.find((tenant) => tenant.id === tenantId);
}

export function listTenantUsers(tenantId: string): User[] {
  return store.users.filter((user) => user.tenantId === tenantId);
}

export function listTenantLocations(tenantId: string): Location[] {
  return store.locations.filter((location) => location.tenantId === tenantId);
}

export function listTenantProducts(tenantId: string): Product[] {
  return store.products.filter((product) => product.tenantId === tenantId);
}

export function listTenantSuppliers(tenantId: string): Supplier[] {
  return store.suppliers.filter((supplier) => supplier.tenantId === tenantId);
}

export function listTenantAlerts(tenantId: string): AlertItem[] {
  return store.alerts.filter((alert) => alert.tenantId === tenantId);
}

export function listTenantAuditEvents(tenantId: string): AuditEvent[] {
  return store.auditEvents.filter((event) => event.tenantId === tenantId);
}

export function listTenantStockBalances(tenantId: string): StockBalance[] {
  return store.stockBalances.filter((balance) => balance.tenantId === tenantId);
}

export function listTenantMovements(tenantId: string): StockMovement[] {
  return store.stockMovements.filter((movement) => movement.tenantId === tenantId);
}

export function listTenantInvoices(tenantId: string): Invoice[] {
  return store.invoices.filter((invoice) => invoice.tenantId === tenantId);
}

export function listTenantTransfers(tenantId: string): TransferRequest[] {
  return store.transferRequests.filter((transfer) => transfer.tenantId === tenantId);
}
