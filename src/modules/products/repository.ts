import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";

export class ProductsRepository {
  async findProducts(tenantId: string, categoryName?: string) {
    const whereClause: any = { tenantId };
    if (categoryName) {
      whereClause.category = { name: categoryName };
    }

    return prisma.product.findMany({
      where: whereClause,
      include: { category: true, supplierLinks: true }
    });
  }

  async findCategoryByName(name: string, tenantId: string) {
    return prisma.productCategory.findFirst({
      where: { name, tenantId }
    });
  }

  async createCategory(name: string, tenantId: string) {
    return prisma.productCategory.create({
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
  }) {
    return prisma.product.create({
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

  async linkSupplier(productId: string, supplierId: string, tenantId: string) {
    return prisma.productSupplier.create({
      data: {
        id: createId("psup"),
        tenantId,
        productId,
        supplierId
      }
    });
  }
}
