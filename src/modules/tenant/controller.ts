import type { RequestContext } from "../../framework/types";
import { TenantService } from "./service";
import { permissionMatrix } from "../../domain/permissions";
import { sendJson } from "../../framework/http";

export class TenantController {
  private readonly service = new TenantService();

  start = async (context: RequestContext) => {
    const body = context.body as any;
    try {
      return await this.service.startOnboarding(body);
    } catch (error: any) {
      console.error("=== ORGANIZATION CREATE ERROR ===");

      console.error({
        message: error.message,
        code: error.code,
        meta: error.meta,
        stack: error.stack,
        name: error.name,
      });

      // Sanitized request body (hiding adminUser password)
      const sanitizedBody = {
        ...body,
        adminUser: body?.adminUser ? {
          ...body.adminUser,
          password: "***hidden***",
        } : undefined,
      };
      console.error("REQUEST BODY:", JSON.stringify(sanitizedBody, null, 2));
      console.error("FAILING QUERY LOCATION: TenantService.startOnboarding");

      // Detect error types
      let statusCode = 500;
      let errorCode = "INTERNAL_SERVER_ERROR";
      let clientMessage = "Something went wrong while creating organization";
      let details: any = null;

      // Detect Prisma-specific errors
      if (error.code && typeof error.code === "string" && error.code.startsWith("P")) {
        errorCode = error.code;
        if (error.code === "P2002") {
          statusCode = 409;
          clientMessage = `Unique constraint violation: ${error.meta?.target || "a unique field already exists"}`;
          details = error.meta;
        } else if (error.code === "P2003") {
          statusCode = 400;
          clientMessage = `Foreign key constraint violation: ${error.meta?.field_name || "invalid relationship field"}`;
          details = error.meta;
        } else if (error.code === "P2025") {
          statusCode = 404;
          clientMessage = `An operation failed because a required record was not found: ${error.meta?.cause || "record not found"}`;
          details = error.meta;
        } else {
          clientMessage = `Database error: ${error.message}`;
        }
      } else if (error.name === "PrismaClientValidationError") {
        errorCode = "PRISMA_VALIDATION_ERROR";
        clientMessage = "Database validation failed. Please check field types and required fields.";
      } else if (error.name === "ValidationError") {
        statusCode = 400;
        errorCode = "VALIDATION_ERROR";
        clientMessage = error.message;
        details = error.details;
      } else if (error.name === "NotFoundError") {
        statusCode = 404;
        errorCode = "NOT_FOUND";
        clientMessage = error.message;
      }

      // Detect NeonDB or other connection/query failures if they match Postgres signatures
      if (error.message && (error.message.includes("NeonDb") || error.message.includes("postgres") || error.message.includes("connection"))) {
        console.error("NEONDB OBSERVED FAILURE DETAILS:", error.message);
      }

      const isDev = process.env.NODE_ENV === "development";

      sendJson(context.response, statusCode, {
        success: false,
        error: {
          code: errorCode,
          message: isDev ? error.message : clientMessage,
          details: isDev ? { ...details, stack: error.stack } : details,
          requestId: context.requestId,
        },
      });
      return;
    }
  };

  summary = async (context: RequestContext) => {
    const summary = await this.service.getSummary(context.tenantId);
    return {
      ...summary,
      permissions: permissionMatrix
    };
  };
}
