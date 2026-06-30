import { ProductsRepository } from "./repository";
import { toProductDTO } from "./mapper";
import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";
import type { CreateProductInput } from "./schema";

export class ProductsService {
  private readonly repository = new ProductsRepository();

  async getProductsList(tenantId: string, category?: string) {
    const products = await this.repository.findProducts(tenantId, category);
    return products.map((prod) => toProductDTO(prod));
  }

  async createProduct(input: CreateProductInput, actorId: string, roleCode: string, tenantId: string) {
    const { 
      category: catName, 
      sku, 
      name, 
      unitOfMeasure, 
      purchasePrice, 
      sellingPrice, 
      reorderLevel, 
      reorderQuantity, 
      industry, 
      brand, 
      isActive, 
      metadata, 
      supplierIds = [],
      quantity,
      locationId
    } = input;

    const result = await prisma.$transaction(async (tx) => {
      let category = await this.repository.findCategoryByName(catName, tenantId, tx);
      if (!category) {
        category = await this.repository.createCategory(catName, tenantId, tx);
      }

      const combinedMetadata = {
        ...(metadata || {}),
        purchasePrice,
        sellingPrice
      };

      const product = await this.repository.createProduct({
        tenantId,
        categoryId: category.id,
        sku,
        name,
        unitOfMeasure,
        reorderLevel,
        reorderQuantity,
        industry,
        brand: brand || null,
        isActive: isActive !== false,
        metadata: combinedMetadata
      }, tx);

      for (const supId of supplierIds) {
        await this.repository.linkSupplier(product.id, supId, tenantId, tx);
      }

      // Initial stock creation if locationId is provided
      if (locationId) {
        const initialQty = quantity ?? 0;
        const auditMeta = { actorUserId: actorId, roleCode, locationId };
        const invId = createId("inv");
        const inventory = await tx.inventory.create({
          data: {
            id: invId,
            tenantId,
            locationId,
            productId: product.id,
            qtyOnHand: initialQty,
            qtyReserved: 0,
            metadata: auditMeta
          }
        });

        if (initialQty > 0) {
          const movId = createId("mov");
          await tx.inventoryMovement.create({
            data: {
              id: movId,
              tenantId,
              locationId,
              productId: product.id,
              movementType: "INWARD",
              movementNumber: createId("MOV"),
              quantity: initialQty,
              notes: `Initial stock input during manual product creation`,
              occurredAt: new Date(),
              metadata: auditMeta
            }
          });

          const sadjId = createId("sadj");
          await tx.stockAdjustment.create({
            data: {
              id: sadjId,
              tenantId,
              inventoryId: inventory.id,
              adjustmentNumber: createId("ADJ"),
              quantityBefore: 0,
              quantityAfter: initialQty,
              varianceQty: initialQty,
              reasonCode: "INITIAL",
              status: "CONFIRMED",
              metadata: auditMeta
            }
          });
        }
      }

      return product;
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId: actorId,
        module: "products",
        action: "create",
        summary: `Created product SKU ${sku} (${name})`,
        entityType: "product",
        severity: "INFO"
      }
    });

    // Fetch fresh with relations
    const freshProduct = await prisma.product.findUnique({
      where: { id: result.id },
      include: { category: true, supplierLinks: true, taxCategory: true }
    });

    return toProductDTO(freshProduct, purchasePrice, sellingPrice);
  }

  async updateProduct(id: string, input: any, actorId: string, roleCode: string, tenantId: string) {
    const { 
      category: catName, 
      sku, 
      name, 
      unitOfMeasure, 
      purchasePrice, 
      sellingPrice, 
      reorderLevel, 
      reorderQuantity, 
      industry, 
      brand, 
      isActive, 
      metadata, 
      supplierIds
    } = input;

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.product.findFirst({
        where: { id, tenantId }
      });
      if (!existing) {
        throw new Error("Product not found");
      }

      let categoryId = existing.categoryId;
      if (catName) {
        let category = await this.repository.findCategoryByName(catName, tenantId, tx);
        if (!category) {
          category = await this.repository.createCategory(catName, tenantId, tx);
        }
        categoryId = category.id;
      }

      const existingMeta = (existing.metadata as Record<string, any>) || {};
      const combinedMetadata = {
        ...existingMeta,
        ...(metadata || {}),
        ...(purchasePrice !== undefined ? { purchasePrice } : {}),
        ...(sellingPrice !== undefined ? { sellingPrice } : {})
      };

      const product = await tx.product.update({
        where: { id, tenantId },
        data: {
          sku: sku ?? existing.sku,
          name: name ?? existing.name,
          categoryId,
          unitOfMeasure: unitOfMeasure ?? existing.unitOfMeasure,
          reorderLevel: reorderLevel !== undefined ? reorderLevel : existing.reorderLevel,
          reorderQuantity: reorderQuantity !== undefined ? reorderQuantity : existing.reorderQuantity,
          industry: industry ?? existing.industry,
          brand: brand !== undefined ? brand : existing.brand,
          isActive: isActive !== undefined ? isActive : existing.isActive,
          metadata: combinedMetadata
        }
      });

      if (supplierIds) {
        await tx.productSupplier.deleteMany({
          where: { productId: id, tenantId }
        });
        for (const supId of supplierIds) {
          await this.repository.linkSupplier(id, supId, tenantId, tx);
        }
      }

      return product;
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId: actorId,
        module: "products",
        action: "update",
        summary: `Updated product SKU ${result.sku} (${result.name})`,
        entityType: "product",
        severity: "INFO"
      }
    });

    // Fetch fresh with relations
    const freshProduct = await prisma.product.findUnique({
      where: { id: result.id },
      include: { category: true, supplierLinks: true, taxCategory: true }
    });

    return toProductDTO(freshProduct, purchasePrice, sellingPrice);
  }
}
