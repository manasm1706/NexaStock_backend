import { prisma, type PrismaInstance } from "../../lib/db";
import { createId } from "../../lib/crypto";

export class ProductsRepository {
  async findProducts(tenantId: string, categoryName?: string, tx: PrismaInstance = prisma) {
    const whereClause: any = { tenantId };
    if (categoryName) {
      whereClause.category = { name: categoryName };
    }

    return tx.product.findMany({
      where: whereClause,
      include: { category: true, supplierLinks: true, taxCategory: true }
    });
  }

  async findCategoryByName(name: string, tenantId: string, tx: PrismaInstance = prisma) {
    return tx.productCategory.findFirst({
      where: { name, tenantId }
    });
  }

  async createCategory(name: string, tenantId: string, tx: PrismaInstance = prisma) {
    return tx.productCategory.create({
      data: {
        id: createId("cat"),
        tenantId,
        code: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-")
      }
    });
  }

  async createProduct(data: {
    tenantId: string;
    categoryId: string;
    sku: string;
    name: string;
    unitOfMeasure: string;
    reorderLevel: number;
    reorderQuantity: number;
    industry: string;
    brand: string | null;
    isActive: boolean;
    metadata: any;
  }, tx: PrismaInstance = prisma) {
    return tx.product.create({
      data: {
        id: createId("prod"),
        tenantId: data.tenantId,
        categoryId: data.categoryId,
        sku: data.sku,
        name: data.name,
        unitOfMeasure: data.unitOfMeasure,
        reorderLevel: data.reorderLevel,
        reorderQuantity: data.reorderQuantity,
        industry: data.industry,
        brand: data.brand,
        isActive: data.isActive,
        metadata: data.metadata
      },
      include: { category: true }
    });
  }

  async linkSupplier(productId: string, supplierId: string, tenantId: string, tx: PrismaInstance = prisma) {
    return tx.productSupplier.create({
      data: {
        id: createId("psup"),
        tenantId,
        productId,
        supplierId
      }
    });
  }
}
