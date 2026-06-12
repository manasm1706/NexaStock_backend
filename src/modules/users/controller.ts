import type { RequestContext } from "../../framework/types";
import { UsersService } from "./service";

export class UsersController {
  private readonly service = new UsersService();

  list = async (context: RequestContext) => {
    return this.service.getUsersList(context.tenantId);
  };
}
