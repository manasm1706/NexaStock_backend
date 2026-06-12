import type { InventoryBalanceDTO, InventoryMovementDTO } from "./dto";

export function toInventoryBalanceDTO(inv: any): InventoryBalanceDTO {
  return {
    tenantId: inv.tenantId,
    locationId: inv.locationId,
    productId: inv.productId,
    quantity: inv.qtyOnHand,
    reservedQuantity: inv.qtyReserved,
    updatedAt: inv.updatedAt.toISOString()
  };
}

export function toInventoryMovementDTO(m: any): InventoryMovementDTO {
  return {
    id: m.id,
    tenantId: m.tenantId,
    locationId: m.locationId,
    productId: m.productId,
    type: m.movementType.toLowerCase() as any,
    quantity: m.quantity,
    note: m.notes || undefined,
    createdAt: m.occurredAt.toISOString()
  };
}
