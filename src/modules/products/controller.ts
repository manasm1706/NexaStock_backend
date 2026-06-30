import type { RequestContext } from "../../framework/types";
import { ProductsService } from "./service";

export class ProductsController {
  private readonly service = new ProductsService();

  list = async (context: RequestContext) => {
    const category = context.query.get("category") || undefined;
    return this.service.getProductsList(context.tenantId, category);
  };

  create = async (context: RequestContext) => {
    const actorId = context.actorId!;
    const roleCode = context.role!;
    return this.service.createProduct(context.body as any, actorId, roleCode, context.tenantId);
  };

  update = async (context: RequestContext) => {
    const id = context.params.id as string;
    const actorId = context.actorId!;
    const roleCode = context.role!;
    return this.service.updateProduct(id, context.body as any, actorId, roleCode, context.tenantId);
  };
}
