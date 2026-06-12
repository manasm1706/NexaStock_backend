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

  async createProduct(input: CreateProductInput, actorId: string, tenantId: string) {
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
      supplierIds = [] 
    } = input;

    const result = await prisma.$transaction(async () => {
      let category = await this.repository.findCategoryByName(catName, tenantId);
      if (!category) {
        category = await this.repository.createCategory(catName, tenantId);
      }

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
        metadata: metadata || {}
      });

      for (const supId of supplierIds) {
        await this.repository.linkSupplier(product.id, supId, tenantId);
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
      include: { category: true, supplierLinks: true }
    });

    return toProductDTO(freshProduct, purchasePrice, sellingPrice);
  }
}
