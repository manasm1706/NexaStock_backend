import { prisma } from "../../lib/db";
import { NotFoundError } from "../../lib/errors";

export class UsersRepository {
  async findUsers(tenantId: string) {
    return prisma.user.findMany({
      where: { tenantId },
      include: { role: true }
    });
  }

  async findUserById(id: string, tenantId: string) {
    return prisma.user.findFirst({
      where: { id, tenantId },
      include: { role: true }
    });
  }

  async updateUserRole(id: string, roleId: string, tenantId: string) {
    return prisma.user.update({
      where: { id },
      data: { roleId },
      include: { role: true }
    });
  }

  async updateUserStatus(id: string, status: "ACTIVE" | "DISABLED", tenantId: string) {
    return prisma.user.update({
      where: { id },
      data: { status },
      include: { role: true }
    });
  }

  async deleteUser(id: string, tenantId: string) {
    return prisma.user.delete({
      where: { id }
    });
  }

  /**
   * Helper to check if a user is the last active Owner in the tenant.
   */
  async isLastActiveOwner(userId: string, tenantId: string): Promise<boolean> {
    const user = await this.findUserById(userId, tenantId);
    if (!user || user.status !== "ACTIVE" || user.role.code !== "business_owner") {
      return false;
    }

    const activeOwnersCount = await prisma.user.count({
      where: {
        tenantId,
        status: "ACTIVE",
        role: {
          code: "business_owner"
        }
      }
    });

    return activeOwnersCount <= 1;
  }
}
