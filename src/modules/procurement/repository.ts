import { prisma } from "../../lib/db";

export class ProcurementRepository {
  async findSuppliers(tenantId: string) {
    return prisma.supplier.findMany({
      where: { tenantId, deletedAt: null },
      include: { contacts: true, productLinks: { select: { productId: true } } },
      orderBy: { createdAt: "desc" }
    });
  }

  async findSupplierById(tenantId: string, id: string) {
    return prisma.supplier.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { contacts: true, productLinks: { select: { productId: true } } }
    });
  }

  async createSupplier(tenantId: string, data: {
    name: string;
    code: string;
    taxId?: string;
    contactName?: string;
    phone?: string;
    email?: string;
  }) {
    return prisma.$transaction(async (tx: typeof prisma) => {
      const supplier = await tx.supplier.create({
        data: {
          tenantId,
          name: data.name,
          supplierCode: data.code,
          gstNumber: data.taxId,
          status: "ACTIVE"
        }
      });

      if (data.contactName || data.phone || data.email) {
        await tx.supplierContact.create({
          data: {
            tenantId,
            supplierId: supplier.id,
            name: data.contactName || "Primary Contact",
            phone: data.phone,
            email: data.email,
            isPrimary: true,
            contactType: "PRIMARY"
          }
        });
      }

      return tx.supplier.findUnique({
        where: { id: supplier.id },
        include: { contacts: true }
      });
    });
  }

  async updateSupplier(tenantId: string, id: string, data: {
    name?: string;
    code?: string;
    taxId?: string;
    contactName?: string;
    phone?: string;
    email?: string;
    status?: "ACTIVE" | "PAUSED";
  }) {
    return prisma.$transaction(async (tx: typeof prisma) => {
      const supplier = await tx.supplier.findFirst({
        where: { id, tenantId }
      });

      if (!supplier) {
        throw new Error("Supplier not found");
      }

      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.code !== undefined) updateData.supplierCode = data.code;
      if (data.taxId !== undefined) updateData.gstNumber = data.taxId;
      if (data.status !== undefined) updateData.status = data.status;

      await tx.supplier.update({
        where: { id },
        data: updateData
      });

      if (data.contactName !== undefined || data.phone !== undefined || data.email !== undefined) {
        const contact = await tx.supplierContact.findFirst({
          where: { supplierId: id, isPrimary: true }
        });

        if (contact) {
          const contactUpdate: any = {};
          if (data.contactName !== undefined) contactUpdate.name = data.contactName;
          if (data.phone !== undefined) contactUpdate.phone = data.phone;
          if (data.email !== undefined) contactUpdate.email = data.email;

          await tx.supplierContact.update({
            where: { id: contact.id },
            data: contactUpdate
          });
        } else {
          await tx.supplierContact.create({
            data: {
              tenantId,
              supplierId: id,
              name: data.contactName || "Primary Contact",
              phone: data.phone,
              email: data.email,
              isPrimary: true,
              contactType: "PRIMARY"
            }
          });
        }
      }

      return tx.supplier.findUnique({
        where: { id },
        include: { contacts: true }
      });
    });
  }

  async deleteSupplier(tenantId: string, id: string) {
    // Perform soft delete by setting deletedAt
    return prisma.supplier.updateMany({
      where: { id, tenantId },
      data: { deletedAt: new Date() }
    });
  }

  async setSupplierProducts(tenantId: string, supplierId: string, productIds: string[]) {
    return prisma.$transaction(async (tx: typeof prisma) => {
      await tx.productSupplier.deleteMany({
        where: { tenantId, supplierId }
      });

      const uniqueProductIds = Array.from(new Set(productIds.filter(Boolean)));
      if (uniqueProductIds.length > 0) {
        await tx.productSupplier.createMany({
          data: uniqueProductIds.map((productId) => ({
            tenantId,
            supplierId,
            productId
          })),
          skipDuplicates: true
        });
      }

      return tx.supplier.findFirst({
        where: { id: supplierId, tenantId, deletedAt: null },
        include: { contacts: true }
      });
    });
  }

  async createPurchaseOrder(tenantId: string, data: {
    supplierId: string;
    poNumber: string;
    subtotal: number;
    taxTotal: number;
    discountTotal: number;
    grandTotal: number;
    notes?: string;
  }, items: Array<{
    productId: string;
    itemName: string;
    quantityOrdered: number;
    unitCost: number;
    taxRate: number;
  }>) {
    return prisma.$transaction(async (tx: typeof prisma) => {
      const po = await tx.purchaseOrder.create({
        data: {
          tenantId,
          supplierId: data.supplierId,
          poNumber: data.poNumber,
          status: "DRAFT",
          subtotal: data.subtotal,
          taxTotal: data.taxTotal,
          discountTotal: data.discountTotal,
          grandTotal: data.grandTotal,
          notes: data.notes
        }
      });

      for (let i = 0; i < items.length; i++) {
        const item = items[i]!;
        await tx.purchaseOrderItem.create({
          data: {
            tenantId,
            purchaseOrderId: po.id,
            productId: item.productId,
            lineNumber: i + 1,
            itemName: item.itemName,
            quantityOrdered: item.quantityOrdered,
            unitCost: item.unitCost,
            taxRate: item.taxRate
          }
        });
      }

      return tx.purchaseOrder.findUnique({
        where: { id: po.id },
        include: { items: true }
      });
    });
  }
}
