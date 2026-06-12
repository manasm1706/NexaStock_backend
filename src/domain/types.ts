export type Role =
  | "super_admin"
  | "business_owner"
  | "operations_manager"
  | "warehouse_manager"
  | "store_manager"
  | "cashier"
  | "supplier";

export type LocationType = "warehouse" | "store" | "external_warehouse";
export type ProductState = "active" | "inactive";
export type TransferStatus = "pending" | "approved" | "rejected" | "picked" | "dispatched" | "received";
export type InvoiceType = "sale" | "return" | "supplier_invoice";
export type MovementType = "receive" | "dispatch" | "sale" | "return" | "adjustment" | "transfer_out" | "transfer_in";

export interface Tenant {
  id: string;
  name: string;
  legalName: string;
  industry: string;
  status: "active" | "trial" | "suspended";
  plan: "starter" | "growth" | "professional" | "enterprise";
  createdAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: Role;
  locationIds: string[];
  status: "active" | "invited" | "disabled";
  createdAt: string;
}

export interface Location {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  type: LocationType;
  city: string;
  state: string;
  country: string;
  healthScore: number;
  staffCount: number;
}

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  contactName: string;
  phone: string;
  email: string;
  taxId?: string;
  status: "active" | "paused";
  performanceScore: number;
}

export interface Product {
  id: string;
  tenantId: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  subCategory?: string;
  brand?: string;
  unitOfMeasure: string;
  purchasePrice: number;
  sellingPrice: number;
  mrp?: number;
  reorderLevel: number;
  reorderQuantity: number;
  taxRate: number;
  supplierIds: string[];
  isActive: boolean;
  industry: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface StockBalance {
  tenantId: string;
  locationId: string;
  productId: string;
  quantity: number;
  reservedQuantity: number;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  tenantId: string;
  locationId: string;
  productId: string;
  type: MovementType;
  quantity: number;
  referenceType?: string;
  referenceId?: string;
  note?: string;
  createdAt: string;
}

export interface TransferRequest {
  id: string;
  tenantId: string;
  fromLocationId: string;
  toLocationId: string;
  status: TransferStatus;
  requestedBy: string;
  approvedBy?: string;
  items: Array<{
    productId: string;
    requestedQuantity: number;
    approvedQuantity: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLine {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
}

export interface Invoice {
  id: string;
  tenantId: string;
  locationId: string;
  type: InvoiceType;
  invoiceNumber: string;
  customerName?: string;
  customerPhone?: string;
  total: number;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  paymentMode: string;
  status: "draft" | "posted" | "voided";
  lines: InvoiceLine[];
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  tenantId: string;
  actorId?: string;
  module: string;
  action: string;
  summary: string;
  createdAt: string;
}

export interface AlertItem {
  id: string;
  tenantId: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  resolved: boolean;
  createdAt: string;
}

export interface DashboardSnapshot {
  revenue: number;
  grossMargin: number;
  inventoryValue: number;
  lowStockAlerts: number;
  pendingTransfers: number;
  topProducts: Array<{ productId: string; name: string; units: number; revenue: number }>;
  alerts: AlertItem[];
}
