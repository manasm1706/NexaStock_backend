export interface InventoryBalanceDTO {
  tenantId: string;
  locationId: string;
  productId: string;
  quantity: number;
  reservedQuantity: number;
  updatedAt: string;
}

export interface InventoryMovementDTO {
  id: string;
  tenantId: string;
  locationId: string;
  productId: string;
  type: "adjustment" | "sale" | "transfer" | "purchase" | "return";
  quantity: number;
  note?: string;
  createdAt: string;
}
