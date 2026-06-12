import { UsersRepository } from "./repository";
import { toUserItemDTO } from "./mapper";

export class UsersService {
  private readonly repository = new UsersRepository();

  async getUsersList(tenantId: string) {
    const users = await this.repository.findUsers(tenantId);
    return users.map(toUserItemDTO);
  }
}
