import { AsyncLocalStorage } from "node:async_hooks";
import type { RequestContext } from "../framework/types";

export const tenantLocalStorage = new AsyncLocalStorage<RequestContext>();

export function getTenantContext(): RequestContext | undefined {
  return tenantLocalStorage.getStore();
}

export function getTenantId(): string {
  const context = tenantLocalStorage.getStore();
  if (!context?.tenantId) {
    throw new Error("Tenant context is missing for this operation");
  }
  return context.tenantId;
}

