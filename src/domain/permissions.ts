import type { Role } from "./types";

export const roleLabels: Record<Role, string> = {
  super_admin: "Super Admin",
  business_owner: "Business Owner",
  operations_manager: "Operations Manager",
  warehouse_manager: "Warehouse Manager",
  store_manager: "Store Manager",
  cashier: "Cashier",
  supplier: "Supplier"
};

export const permissionMatrix = {
  productManagement: {
    super_admin: false,
    business_owner: true,
    operations_manager: true,
    warehouse_manager: true,
    store_manager: true,
    cashier: false,
    supplier: false
  },
  inventoryRead: {
    super_admin: true,
    business_owner: true,
    operations_manager: true,
    warehouse_manager: true,
    store_manager: true,
    cashier: false,
    supplier: false
  },
  inventoryAdjustments: {
    super_admin: true,
    business_owner: true,
    operations_manager: true,
    warehouse_manager: true,
    store_manager: true,
    cashier: false,
    supplier: false
  },
  warehouseManagement: {
    super_admin: true,
    business_owner: true,
    operations_manager: true,
    warehouse_manager: true,
    store_manager: true,
    cashier: false,
    supplier: false
  },
  posSales: {
    super_admin: false,
    business_owner: true,
    operations_manager: true,
    warehouse_manager: false,
    store_manager: true,
    cashier: true,
    supplier: false
  },
  dispatchOperations: {
    super_admin: false,
    business_owner: true,
    operations_manager: true,
    warehouse_manager: true,
    store_manager: false,
    cashier: false,
    supplier: false
  },
  userManagement: {
    super_admin: true,
    business_owner: true,
    operations_manager: true,
    warehouse_manager: false,
    store_manager: false,
    cashier: false,
    supplier: false
  },
  settingsManage: {
    super_admin: true,
    business_owner: true,
    operations_manager: false,
    warehouse_manager: false,
    store_manager: false,
    cashier: false,
    supplier: false
  },
  analyticsRead: {
    super_admin: true,
    business_owner: true,
    operations_manager: true,
    warehouse_manager: true,
    store_manager: true,
    cashier: false,
    supplier: false
  },
  aiRead: {
    super_admin: true,
    business_owner: true,
    operations_manager: true,
    warehouse_manager: true,
    store_manager: true,
    cashier: false,
    supplier: false
  },
  auditRead: {
    super_admin: true,
    business_owner: true,
    operations_manager: true,
    warehouse_manager: false,
    store_manager: false,
    cashier: false,
    supplier: false
  }
} as const;
