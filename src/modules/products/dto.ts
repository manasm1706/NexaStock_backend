export interface ProductDTO {
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
  mrp: number;
  reorderLevel: number;
  reorderQuantity: number;
  taxRate: number;
  supplierIds: string[];
  isActive: boolean;
  industry: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
