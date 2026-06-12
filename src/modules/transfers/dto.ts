export interface TransferItemDTO {
  productId: string;
  requestedQuantity: number;
  approvedQuantity: number;
}

export interface TransferDTO {
  id: string;
  tenantId: string;
  fromLocationId: string;
  toLocationId: string;
  status: "requested" | "approved" | "rejected" | "dispatched" | "received" | "cancelled";
  requestedBy: string;
  items: TransferItemDTO[];
  createdAt: string;
  updatedAt: string;
}
