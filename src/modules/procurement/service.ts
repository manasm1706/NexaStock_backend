import { ProcurementRepository } from "./repository";
import { toSupplierDTO } from "./mapper";
import { prisma } from "../../lib/db";

export class ProcurementService {
  private readonly repository = new ProcurementRepository();

  async getSuppliersList(tenantId: string) {
    const suppliers = await this.repository.findSuppliers(tenantId);
    return suppliers.map(toSupplierDTO);
  }

  async createSupplier(tenantId: string, input: {
    name: string;
    code?: string;
    taxId?: string;
    contactName?: string;
    phone?: string;
    email?: string;
  }) {
    if (!input.name) {
      throw new Error("Supplier name is required");
    }

    const code = input.code || `SUP-${Math.floor(1000 + Math.random() * 9000)}`;

    // Build data object without undefined values (exactOptionalPropertyTypes)
    const createData: Parameters<ProcurementRepository['createSupplier']>[1] = {
      name: input.name,
      code,
      ...(input.taxId !== undefined && { taxId: input.taxId }),
      ...(input.contactName !== undefined && { contactName: input.contactName }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.email !== undefined && { email: input.email }),
    };

    const supplier = await this.repository.createSupplier(tenantId, createData);

    return toSupplierDTO(supplier);
  }

  async updateSupplier(tenantId: string, id: string, input: {
    name?: string;
    code?: string;
    taxId?: string;
    contactName?: string;
    phone?: string;
    email?: string;
    status?: "active" | "paused";
  }) {
    const statusVal = input.status === "active" ? "ACTIVE" as const : input.status === "paused" ? "PAUSED" as const : undefined;

    // Build update object without undefined values (exactOptionalPropertyTypes)
    const updateData: Parameters<ProcurementRepository['updateSupplier']>[2] = {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.code !== undefined && { code: input.code }),
      ...(input.taxId !== undefined && { taxId: input.taxId }),
      ...(input.contactName !== undefined && { contactName: input.contactName }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.email !== undefined && { email: input.email }),
      ...(statusVal !== undefined && { status: statusVal }),
    };

    const supplier = await this.repository.updateSupplier(tenantId, id, updateData);

    return toSupplierDTO(supplier);
  }

  async deleteSupplier(tenantId: string, id: string) {
    await this.repository.deleteSupplier(tenantId, id);
    return { success: true };
  }

  async setSupplierProducts(tenantId: string, id: string, input: { productIds?: string[] }) {
    const supplier = await this.repository.findSupplierById(tenantId, id);
    if (!supplier) {
      throw new Error("Supplier not found");
    }

    const productIds = Array.isArray(input.productIds) ? input.productIds : [];

    if (productIds.length > 0) {
      const products = await prisma.product.findMany({
        where: { tenantId, id: { in: productIds } },
        select: { id: true }
      });
      const found = new Set(products.map((p: { id: string }) => p.id));
      const invalid = productIds.filter((pid) => !found.has(pid));
      if (invalid.length > 0) {
        throw new Error("One or more selected products are invalid for this tenant");
      }
    }

    await this.repository.setSupplierProducts(tenantId, id, productIds);
    return { success: true };
  }

  async sendSupplierOrder(tenantId: string, supplierId: string, input: {
    items: Array<{ productId: string; quantity: number }>;
    notes?: string;
  }, actorId?: string) {
    const supplier = await this.repository.findSupplierById(tenantId, supplierId);
    if (!supplier) {
      throw new Error("Supplier not found");
    }

    if (!input.items || input.items.length === 0) {
      throw new Error("Order items are required");
    }

    const productIds = input.items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { tenantId, id: { in: productIds } }
    });

    const itemsToCreate: any[] = [];
    let subtotal = 0;

    for (const item of input.items) {
      const product = products.find((p: { id: string }) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const meta = (product.metadata as Record<string, any>) || {};
      const unitCost = Number(meta.purchasePrice || 100);
      const taxRate = 0.18; // default 18% tax category
      const itemTotal = unitCost * item.quantity;
      subtotal += itemTotal;

      itemsToCreate.push({
        productId: product.id,
        itemName: product.name,
        quantityOrdered: item.quantity,
        unitCost,
        taxRate
      });
    }

    const taxTotal = subtotal * 0.18;
    const discountTotal = 0;
    const grandTotal = subtotal + taxTotal;
    const poNumber = `PO-${Date.now().toString().slice(-8)}`;

    // Build PO data without undefined values (exactOptionalPropertyTypes)
    const poData: Parameters<ProcurementRepository['createPurchaseOrder']>[1] = {
      supplierId,
      poNumber,
      subtotal,
      taxTotal,
      discountTotal,
      grandTotal,
      ...(input.notes !== undefined && { notes: input.notes }),
    };

    const po = await this.repository.createPurchaseOrder(tenantId, poData, itemsToCreate);

    // Build contact info
    const primaryContact = supplier.contacts.find((c: { isPrimary: boolean }) => c.isPrimary) || supplier.contacts[0];
    const phone = primaryContact?.phone || "";

    // Build natural order text
    let orderLines = "";
    itemsToCreate.forEach(item => {
      orderLines += `- ${item.quantityOrdered}x ${item.itemName} (@ $${item.unitCost.toFixed(2)} each)\n`;
    });

    const formattedMessage = `Hello ${supplier.name},\n\nWe would like to place a new inventory replenishment purchase order (${poNumber}) with you:\n\n${orderLines}\nTotal Amount (incl. Tax): $${grandTotal.toFixed(2)}\n\nNotes: ${input.notes || "Please confirm delivery time."}\n\nThank you!\nNexaStock Operations`;

    return {
      success: true,
      poId: po?.id,
      poNumber,
      grandTotal,
      formattedMessage,
      phone,
      email: primaryContact?.email || ""
    };
  }
}
