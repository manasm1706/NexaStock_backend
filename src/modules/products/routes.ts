import type { Router } from "../../framework/router";
import { ProductsController } from "./controller";
import { validateBody } from "../../middleware/validation.middleware";
import { createProductSchema, updateProductSchema } from "./schema";
import { requireAuth } from "../../middleware/auth.middleware";
import { resolveTenant } from "../../middleware/tenant.middleware";
import { enrichContext } from "../../middleware/enrich-context.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

export function registerProductsRoutes(router: Router): void {
  const controller = new ProductsController();

  router.route("GET", "/api/v1/products", [requireAuth, resolveTenant, enrichContext], controller.list);
  router.route(
    "POST",
    "/api/v1/products",
    [requireAuth, resolveTenant, enrichContext, requirePermission("productManagement"), validateBody(createProductSchema)],
    controller.create
  );
  router.route(
    "PUT",
    "/api/v1/products/:id",
    [requireAuth, resolveTenant, enrichContext, requirePermission("productManagement"), validateBody(updateProductSchema)],
    controller.update
  );
}
