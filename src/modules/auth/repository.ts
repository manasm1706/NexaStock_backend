import { prisma } from "../../lib/db";

export class AuthRepository {
  async findUserByEmail(email: string, tenantId: string) {
    return prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        tenantId
      },
      include: { role: true }
    });
  }

  async findUserByEmailGlobally(email: string) {
    return prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" }
      },
      include: { role: true }
    });
  }

  async findUserById(id: string, tenantId: string) {
    return prisma.user.findFirst({
      where: { id, tenantId },
      include: { role: true }
    });
  }
}
