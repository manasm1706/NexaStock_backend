import { ProcurementRepository } from "./repository";
import { toSupplierDTO } from "./mapper";

export class ProcurementService {
  private readonly repository = new ProcurementRepository();

  async getSuppliersList(tenantId: string) {
    const suppliers = await this.repository.findSuppliers(tenantId);
    return suppliers.map(toSupplierDTO);
  }
}
