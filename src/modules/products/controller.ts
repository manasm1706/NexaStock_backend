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
    return this.service.createProduct(context.body as any, actorId, context.tenantId);
  };
}
