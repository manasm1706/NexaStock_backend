import type { Middleware } from "../framework/types";
import { BadRequestError } from "../lib/errors";
import { prisma } from "../lib/db";

export const resolveTenant: Middleware = async (context, next) => {
  const headerTenantId = context.request.headers["x-tenant-id"];
  
  if (typeof headerTenantId === "string") {
    context.tenantId = headerTenantId;
  }

  if (!context.tenantId) {
    throw new BadRequestError("Tenant scope header (x-tenant-id) is missing");
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: context.tenantId }
  });

  if (!tenant) {
    throw new BadRequestError(`Invalid tenant: ${context.tenantId}`);
  }

  if (tenant.status !== "ACTIVE" && tenant.status !== "TRIAL") {
    throw new BadRequestError(`Tenant subscription status: ${tenant.status}`);
  }

  return next();
};
