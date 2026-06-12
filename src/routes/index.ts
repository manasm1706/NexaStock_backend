import type { AppEnv } from "../config/env";
import { defaultTenantId, tokenTtlHours } from "../config/constants";
import type { Product, Role } from "../domain/types";
import { permissionMatrix, roleLabels } from "../domain/permissions";
import { recordAudit, store } from "../data/store";
import { badRequest, forbidden, notFound } from "../framework/errors";
import type { RequestContext } from "../framework/types";
import { createToken } from "../framework/http";
import type { Router } from "../framework/router";
import { createId, verifyPassword } from "../lib/crypto";
import { asNumber, asOptionalString, asString, asStringArray } from "../modules/schemas";
import { requireManager, requireRole, requireTenant, requireUser } from "../modules/shared";

function formatAuthToken(user: { id: string; role: Role; tenantId: string }, secret: string): string {
  const expiresAt = new Date(Date.now() + tokenTtlHours * 60 * 60 * 1000).toISOString();
  return createToken({ sub: user.id, role: user.role, tenantId: user.tenantId, exp: expiresAt }, secret);
}

function auditPayload(context: RequestContext, moduleName: string, action: string, summary: string) {
  return context.actorId
    ? { tenantId: context.tenantId, actorId: context.actorId, module: moduleName, action, summary }
    : { tenantId: context.tenantId, module: moduleName, action, summary };
}

function optionalProductFields(body: Record<string, unknown>): Pick<Product, "subCategory" | "brand" | "mrp"> {
  const fields: Pick<Product, "subCategory" | "brand" | "mrp"> = {};
  const subCategory = asOptionalString(body.subCategory);
  const brand = asOptionalString(body.brand);

  if (subCategory) {
    fields.subCategory = subCategory;
  }

  if (brand) {
    fields.brand = brand;
  }

  if (typeof body.mrp === "number") {
    fields.mrp = body.mrp;
  }

  return fields;
}

function respondTenantSummary(context: RequestContext) {
  const tenant = requireTenant(context);
  const users = store.users.filter((user) => user.tenantId === tenant.id);
  const locations = store.locations.filter((location) => location.tenantId === tenant.id);
  const products = store.products.filter((product) => product.tenantId === tenant.id);

  return {
    tenant,
    users: users.length,
    locations: locations.length,
    products: products.length,
    permissions: Object.fromEntries(Object.entries(permissionMatrix))
  };
}

export function registerRoutes(router: Router, env: AppEnv): void {
  router.route("GET", "/api/v1/meta", () => ({
    appName: env.appName,
    apiPrefix: env.apiPrefix,
    tenantId: env.defaultTenantId,
    version: "1.0.0"
  }));

  router.route("GET", "/api/v1/health", () => ({
    status: "healthy",
    service: env.appName,
    timestamp: new Date().toISOString()
  }));

  router.route("POST", "/api/v1/auth/login", (context) => {
    const body = context.body as Record<string, unknown> | undefined;
    if (!body) {
      throw badRequest("Request body is required");
    }

    const email = asString(body.email, "email");
    const password = asString(body.password, "password");
    const tenantId = asOptionalString(body.tenantId) ?? defaultTenantId;
    const user = store.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.tenantId === tenantId);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw forbidden("Invalid credentials");
    }

    recordAudit({ tenantId, actorId: user.id, module: "auth", action: "login", summary: `User ${user.email} logged in` });

    return {
      token: formatAuthToken({ id: user.id, role: user.role, tenantId }, env.tokenSecret),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        roleLabel: roleLabels[user.role],
        tenantId
      }
    };
  });

  router.route("POST", "/api/v1/onboarding/start", (context) => {
    const body = context.body as Record<string, unknown> | undefined;
    if (!body) {
      throw badRequest("Request body is required");
    }

    const organizationName = asString(body.organizationName, "organizationName");
    const industry = asString(body.industry, "industry");
    const plan = asString(body.plan, "plan");
    const tenantId = createId("tenant");

    const tenant = {
      id: tenantId,
      name: organizationName,
      legalName: organizationName,
      industry,
      status: "trial" as const,
      plan: plan as "starter" | "growth" | "professional" | "enterprise",
      createdAt: new Date().toISOString()
    };

    store.tenants.push(tenant);
    recordAudit({ tenantId, module: "onboarding", action: "tenant_created", summary: `Tenant ${organizationName} created` });

    return tenant;
  });

  router.route("GET", "/api/v1/tenants/current", (context) => respondTenantSummary(context));

  router.route("GET", "/api/v1/users", (context) => {
    requireTenant(context);
    return store.users.filter((user) => user.tenantId === context.tenantId).map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      roleLabel: roleLabels[user.role],
      status: user.status
    }));
  });

  router.route("GET", "/api/v1/locations", (context) => {
    requireTenant(context);
    return store.locations.filter((location) => location.tenantId === context.tenantId);
  });

  router.route("POST", "/api/v1/locations", (context) => {
    requireManager(context);
    const body = context.body as Record<string, unknown> | undefined;
    if (!body) {
      throw badRequest("Request body is required");
    }

    const location = {
      id: createId("loc"),
      tenantId: context.tenantId,
      name: asString(body.name, "name"),
      code: asString(body.code, "code"),
      type: asString(body.type, "type") as "warehouse" | "store" | "external_warehouse",
      city: asString(body.city, "city"),
      state: asString(body.state, "state"),
      country: asString(body.country, "country"),
      healthScore: asNumber(body.healthScore ?? 90, "healthScore"),
      staffCount: asNumber(body.staffCount ?? 0, "staffCount")
    };

    store.locations.push(location);
    recordAudit(auditPayload(context, "locations", "create", `Created location ${location.name}`));
    return location;
  });

  router.route("GET", "/api/v1/products", (context) => {
    requireTenant(context);
    const category = asOptionalString(context.query.get("category"));
    return store.products.filter((product) => product.tenantId === context.tenantId && (!category || product.category === category));
  });

  router.route("POST", "/api/v1/products", (context) => {
    requireRole(context, ["super_admin", "business_owner", "operations_manager", "warehouse_manager"]);
    const body = context.body as Record<string, unknown> | undefined;
    if (!body) {
      throw badRequest("Request body is required");
    }

    const supplierIds = Array.isArray(body.supplierIds) ? asStringArray(body.supplierIds, "supplierIds") : [];
    const timestamp = new Date().toISOString();
    const product = {
      id: createId("prod"),
      tenantId: context.tenantId,
      sku: asString(body.sku, "sku"),
      barcode: asString(body.barcode, "barcode"),
      name: asString(body.name, "name"),
      category: asString(body.category, "category"),
      unitOfMeasure: asString(body.unitOfMeasure, "unitOfMeasure"),
      purchasePrice: asNumber(body.purchasePrice, "purchasePrice"),
      sellingPrice: asNumber(body.sellingPrice, "sellingPrice"),
      reorderLevel: asNumber(body.reorderLevel, "reorderLevel"),
      reorderQuantity: asNumber(body.reorderQuantity, "reorderQuantity"),
      taxRate: asNumber(body.taxRate ?? 0, "taxRate"),
      supplierIds,
      isActive: body.isActive !== false,
      industry: asString(body.industry, "industry"),
      metadata: typeof body.metadata === "object" && body.metadata !== null ? (body.metadata as Record<string, unknown>) : {},
      createdAt: timestamp,
      updatedAt: timestamp,
      ...optionalProductFields(body)
    };

    store.products.push(product);
    recordAudit(auditPayload(context, "products", "create", `Created product ${product.name}`));
    return product;
  });

  router.route("GET", "/api/v1/suppliers", (context) => {
    requireTenant(context);
    return store.suppliers.filter((supplier) => supplier.tenantId === context.tenantId);
  });

  router.route("GET", "/api/v1/inventory/balances", (context) => {
    requireTenant(context);
    return store.stockBalances.filter((balance) => balance.tenantId === context.tenantId);
  });

  router.route("GET", "/api/v1/inventory/movements", (context) => {
    requireTenant(context);
    return store.stockMovements.filter((movement) => movement.tenantId === context.tenantId);
  });

  router.route("POST", "/api/v1/inventory/adjustments", (context) => {
    const user = requireRole(context, ["super_admin", "business_owner", "operations_manager", "warehouse_manager", "store_manager"]);
    const body = context.body as Record<string, unknown> | undefined;
    if (!body) {
      throw badRequest("Request body is required");
    }

    const productId = asString(body.productId, "productId");
    const locationId = asString(body.locationId, "locationId");
    const quantity = asNumber(body.quantity, "quantity");
    const reason = asString(body.reason, "reason");

    const balance = store.stockBalances.find((entry) => entry.tenantId === context.tenantId && entry.productId === productId && entry.locationId === locationId);
    if (!balance) {
      throw notFound("Stock balance not found");
    }

    balance.quantity += quantity;
    balance.updatedAt = new Date().toISOString();

    const movement = {
      id: createId("mov"),
      tenantId: context.tenantId,
      locationId,
      productId,
      type: "adjustment" as const,
      quantity,
      note: reason,
      createdAt: new Date().toISOString()
    };

    store.stockMovements.unshift(movement);
    recordAudit({ tenantId: context.tenantId, actorId: user.id, module: "inventory", action: "adjustment", summary: `${reason} for ${productId} at ${locationId}` });
    return movement;
  });

  router.route("GET", "/api/v1/transfers", (context) => {
    requireTenant(context);
    return store.transferRequests.filter((transfer) => transfer.tenantId === context.tenantId);
  });

  router.route("POST", "/api/v1/transfers", (context) => {
    const user = requireRole(context, ["super_admin", "business_owner", "operations_manager", "warehouse_manager", "store_manager"]);
    const body = context.body as Record<string, unknown> | undefined;
    if (!body) {
      throw badRequest("Request body is required");
    }

    const rawItems = Array.isArray(body.items) ? body.items : [];
    const items = rawItems.map((item) => {
      const entry = item as Record<string, unknown>;
      return {
        productId: asString(entry.productId, "productId"),
        requestedQuantity: asNumber(entry.requestedQuantity, "requestedQuantity"),
        approvedQuantity: 0
      };
    });

    const transfer = {
      id: createId("trf"),
      tenantId: context.tenantId,
      fromLocationId: asString(body.fromLocationId, "fromLocationId"),
      toLocationId: asString(body.toLocationId, "toLocationId"),
      status: "pending" as const,
      requestedBy: user.id,
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.transferRequests.unshift(transfer);
    recordAudit({ tenantId: context.tenantId, actorId: user.id, module: "transfers", action: "create", summary: `Transfer request ${transfer.id} created` });
    return transfer;
  });

  router.route("GET", "/api/v1/pos/summary", (context) => {
    requireTenant(context);
    return {
      products: store.products.filter((product) => product.tenantId === context.tenantId).length,
      locations: store.locations.filter((location) => location.tenantId === context.tenantId).length,
      openInvoices: store.invoices.filter((invoice) => invoice.tenantId === context.tenantId && invoice.status !== "voided").length
    };
  });

  router.route("POST", "/api/v1/pos/invoices", (context) => {
    const user = requireRole(context, ["super_admin", "business_owner", "operations_manager", "store_manager", "cashier"]);
    const body = context.body as Record<string, unknown> | undefined;
    if (!body) {
      throw badRequest("Request body is required");
    }

    const locationId = asString(body.locationId, "locationId");
    const rawLines = Array.isArray(body.lines) ? body.lines : [];
    const invoiceLines = rawLines.map((line) => {
      const entry = line as Record<string, unknown>;
      return {
        productId: asString(entry.productId, "productId"),
        productName: asString(entry.productName, "productName"),
        quantity: asNumber(entry.quantity, "quantity"),
        unitPrice: asNumber(entry.unitPrice, "unitPrice"),
        taxRate: asNumber(entry.taxRate ?? 0, "taxRate"),
        discount: asNumber(entry.discount ?? 0, "discount")
      };
    });

    const subtotal = invoiceLines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
    const discountTotal = invoiceLines.reduce((sum, line) => sum + line.discount, 0);
    const taxTotal = invoiceLines.reduce((sum, line) => sum + line.quantity * line.unitPrice * (line.taxRate / 100), 0);
    const total = subtotal - discountTotal + taxTotal;
    const customerName = asOptionalString(body.customerName);
    const customerPhone = asOptionalString(body.customerPhone);

    const invoice = {
      id: createId("inv"),
      tenantId: context.tenantId,
      locationId,
      type: "sale" as const,
      invoiceNumber: `INV-${String(store.invoices.length + 1).padStart(6, "0")}`,
      total,
      subtotal,
      taxTotal,
      discountTotal,
      paymentMode: asString(body.paymentMode ?? "cash", "paymentMode"),
      status: "posted" as const,
      lines: invoiceLines,
      createdAt: new Date().toISOString(),
      ...(customerName ? { customerName } : {}),
      ...(customerPhone ? { customerPhone } : {})
    };

    store.invoices.unshift(invoice);
    recordAudit({ tenantId: context.tenantId, actorId: user.id, module: "pos", action: "invoice_created", summary: `Invoice ${invoice.invoiceNumber} posted at ${locationId}` });
    return invoice;
  });

  router.route("GET", "/api/v1/analytics/dashboard", (context) => {
    requireTenant(context);
    const products = store.products.filter((product) => product.tenantId === context.tenantId);
    const alerts = store.alerts.filter((alert) => alert.tenantId === context.tenantId);
    const invoices = store.invoices.filter((invoice) => invoice.tenantId === context.tenantId && invoice.status === "posted");
    const revenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const grossMargin = revenue * 0.31;
    const inventoryValue = store.stockBalances
      .filter((balance) => balance.tenantId === context.tenantId)
      .reduce((sum, balance) => {
        const product = products.find((entry) => entry.id === balance.productId);
        return sum + (product?.purchasePrice ?? 0) * balance.quantity;
      }, 0);

    return {
      revenue,
      grossMargin,
      inventoryValue,
      lowStockAlerts: products.filter((product) => {
        const balance = store.stockBalances.find((entry) => entry.tenantId === context.tenantId && entry.productId === product.id);
        return (balance?.quantity ?? 0) <= product.reorderLevel;
      }).length,
      pendingTransfers: store.transferRequests.filter((transfer) => transfer.tenantId === context.tenantId && transfer.status === "pending").length,
      topProducts: products.slice(0, 5).map((product) => ({
        productId: product.id,
        name: product.name,
        units: 120,
        revenue: product.sellingPrice * 120
      })),
      alerts
    };
  });

  router.route("GET", "/api/v1/ai/insights", (context) => {
    requireTenant(context);
    return {
      forecasting: [
        { productId: "prod_paracetamol", horizonDays: 30, expectedDemand: 280, confidence: 0.92 },
        { productId: "prod_denim_shirt", horizonDays: 30, expectedDemand: 96, confidence: 0.88 }
      ],
      recommendations: [
        "Place a replenishment PO for Paracetamol 500mg Tablets.",
        "Move excess denim shirts from warehouse to store for weekend demand.",
        "Review supplier delivery SLA for FMCG line items."
      ],
      anomalyScore: 0.17
    };
  });

  router.route("GET", "/api/v1/audit/events", (context) => {
    const user = requireUser(context);
    const events = store.auditEvents.filter((event) => event.tenantId === context.tenantId);
    return user.role === "cashier" ? events.slice(0, 10) : events;
  });

  router.route("GET", "/api/v1/settings/profile", (context) => {
    const user = requireUser(context);
    return {
      user,
      permissions: permissionMatrix,
      roleLabel: roleLabels[user.role]
    };
  });

  router.route("GET", "/api/v1/modules", (context) => {
    requireTenant(context);
    return {
      inventory: true,
      warehouse: store.locations.some((location) => location.tenantId === context.tenantId && location.type !== "store"),
      pos: true,
      analytics: true,
      ai: true,
      supplierManagement: true,
      accounting: true
    };
  });
}