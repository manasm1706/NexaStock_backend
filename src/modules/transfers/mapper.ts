import type { TransferDTO } from "./dto";

export function toTransferDTO(trf: any): TransferDTO {
  return {
    id: trf.id,
    tenantId: trf.tenantId,
    fromLocationId: trf.fromLocationId,
    toLocationId: trf.toLocationId,
    status: trf.status.toLowerCase() as any,
    requestedBy: trf.requestedByUserId || "",
    items: trf.items?.map((it: any) => ({
      productId: it.productId,
      requestedQuantity: it.requestedQty,
      approvedQuantity: it.approvedQty || 0
    })) || [],
    createdAt: trf.createdAt.toISOString(),
    updatedAt: trf.updatedAt.toISOString()
  };
}
