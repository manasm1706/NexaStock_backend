import { prisma } from "../../lib/db";

export class UsersRepository {
  async findUsers(tenantId: string) {
    return prisma.user.findMany({
      where: { tenantId },
      include: { role: true }
    });
  }
}
