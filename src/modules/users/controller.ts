import type { RequestContext } from "../../framework/types";
import { UsersService } from "./service";
import { InvitationService } from "./invitation.service";
import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";
import { NotFoundError } from "../../lib/errors";

export class UsersController {
  private readonly service = new UsersService();
  private readonly invitationService = new InvitationService();

  list = async (context: RequestContext) => {
    return this.service.getUsersList(context.tenantId);
  };

  invite = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };

    const body = (context.body as {
      email?: string;
      fullName?: string;
      roleId?: string;
      assignedLocations?: string[];
      permissionOverrides?: { permissionId: string; allowed: boolean }[];
      department?: string;
      reportsTo?: string;
    }) || {};
    
    const extra: {
      assignedLocations?: string[];
      permissionOverrides?: { permissionId: string; allowed: boolean }[];
      department?: string;
      reportsTo?: string;
    } = {};

    if (body.assignedLocations !== undefined) extra.assignedLocations = body.assignedLocations;
    if (body.permissionOverrides !== undefined) extra.permissionOverrides = body.permissionOverrides;
    if (body.department !== undefined) extra.department = body.department;
    if (body.reportsTo !== undefined) extra.reportsTo = body.reportsTo;

    return this.invitationService.inviteUser(
      context.tenantId,
      body.email || "",
      body.fullName || "",
      body.roleId || "",
      actorUserId,
      Object.keys(extra).length > 0 ? extra : undefined,
      requestMeta
    );
  };

  resendInvite = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.invitationService.resendInvitation(id, context.tenantId, actorUserId, requestMeta);
  };

  cancelInvite = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.invitationService.cancelInvitation(id, context.tenantId, actorUserId, requestMeta);
  };

  updateRole = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const body = (context.body as { roleId?: string }) || {};
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.service.updateUserRole(id, body.roleId || "", context.tenantId, actorUserId, requestMeta);
  };

  deactivate = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.service.deactivateUser(id, context.tenantId, actorUserId, requestMeta);
  };

  reactivate = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.service.reactivateUser(id, context.tenantId, actorUserId, requestMeta);
  };

  remove = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.service.removeUser(id, context.tenantId, actorUserId, requestMeta);
  };

  updateLocations = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const body = (context.body as { locationIds?: string[] }) || {};
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.service.updateUserLocations(id, body.locationIds || [], context.tenantId, actorUserId, requestMeta);
  };

  updatePermissions = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const id = context.params.id as string;
    const body = (context.body as { overrides?: { permissionId: string; allowed: boolean }[] }) || {};
    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";
    const requestMeta = { requestId: context.requestId, ipAddress, userAgent };
    return this.service.updateUserPermissions(id, body.overrides || [], context.tenantId, actorUserId, requestMeta);
  };

  // ==========================================
  // User Profile Management (Task 11)
  // ==========================================

  getProfile = async (context: RequestContext) => {
    const userId = context.params.id as string;
    const tenantId = context.tenantId;

    const user = await prisma.user.findFirst({
      where: { id: userId, tenantId },
      include: {
        role: true,
        profile: true,
        assignedLocations: { include: { location: true } },
        permissionOverrides: { include: { permission: true } }
      }
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const profileData = user.profile ? {
      id: user.profile.id,
      tenantId: user.profile.tenantId,
      userId: user.profile.userId,
      employeeId: user.profile.employeeId,
      contactNumber: user.profile.contactNumber,
      shiftTiming: user.profile.shiftTiming,
      reportingManagerId: user.profile.reportingManagerId,
      maxDiscountPercent: user.profile.maxDiscountPercent,
      refundLimit: user.profile.refundLimit,
      posCounterId: user.profile.posCounterId,
      canApproveTransfers: user.profile.canApproveTransfers,
      canApproveGRN: user.profile.canApproveGRN,
      canApproveDC: user.profile.canApproveDC,
      canManageSuppliers: user.profile.canManageSuppliers,
      maxPOApprovalLimit: user.profile.maxPOApprovalLimit,
      createdAt: user.profile.createdAt,
      updatedAt: user.profile.updatedAt,
      ...(user.profile.metadata as Record<string, any> || {})
    } : null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      role: {
        id: user.role.id,
        code: user.role.code,
        name: user.role.name
      },
      profile: profileData,
      locations: user.assignedLocations.map((ul: any) => ({
        locationId: ul.locationId,
        name: ul.location.name,
        type: ul.location.locationType
      })),
      permissionOverrides: user.permissionOverrides.map((ov: any) => ({
        permissionId: ov.permissionId,
        permissionName: ov.permission.name,
        allowed: ov.allowed
      }))
    };
  };

  updateUserProfile = async (context: RequestContext) => {
    const actorUserId = context.actorId!;
    const userId = context.params.id as string;
    const tenantId = context.tenantId;
    const body = (context.body as any) || {};

    const user = await prisma.user.findFirst({
      where: { id: userId, tenantId }
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const userAgent = context.request.headers["user-agent"] || "Unknown Device";
    const ipAddress = (context.request.headers["x-forwarded-for"] as string) || context.request.socket.remoteAddress || "127.0.0.1";

    let profile = await prisma.userProfile.findFirst({
      where: { userId, tenantId }
    });

    const currentMeta = (profile?.metadata as Record<string, any>) || {};
    const updatedMeta = {
      ...currentMeta,
      jobTitle: body.jobTitle !== undefined ? body.jobTitle : currentMeta.jobTitle || null,
      dateOfBirth: body.dateOfBirth !== undefined ? body.dateOfBirth : currentMeta.dateOfBirth || null,
      phoneNumber: body.phoneNumber !== undefined ? body.phoneNumber : currentMeta.phoneNumber || null,
      emergencyContact: body.emergencyContact !== undefined ? body.emergencyContact : currentMeta.emergencyContact || null,
      emergencyPhone: body.emergencyPhone !== undefined ? body.emergencyPhone : currentMeta.emergencyPhone || null,
      hireDate: body.hireDate !== undefined ? body.hireDate : currentMeta.hireDate || null,
      employmentType: body.employmentType !== undefined ? body.employmentType : currentMeta.employmentType || null,
      workSchedule: body.workSchedule !== undefined ? body.workSchedule : currentMeta.workSchedule || null,
      probationEndDate: body.probationEndDate !== undefined ? body.probationEndDate : currentMeta.probationEndDate || null,
      managerUserId: body.managerUserId !== undefined ? body.managerUserId : currentMeta.managerUserId || null,
      skills: body.skills !== undefined ? body.skills : currentMeta.skills || null,
      certifications: body.certifications !== undefined ? body.certifications : currentMeta.certifications || null,
      nationalId: body.nationalId !== undefined ? body.nationalId : currentMeta.nationalId || null,
      passportNumber: body.passportNumber !== undefined ? body.passportNumber : currentMeta.passportNumber || null,
      taxId: body.taxId !== undefined ? body.taxId : currentMeta.taxId || null,
      bankAccountNumber: body.bankAccountNumber !== undefined ? body.bankAccountNumber : currentMeta.bankAccountNumber || null,
      bankName: body.bankName !== undefined ? body.bankName : currentMeta.bankName || null,
      bankBranch: body.bankBranch !== undefined ? body.bankBranch : currentMeta.bankBranch || null,
      languagesSpoken: body.languagesSpoken !== undefined ? body.languagesSpoken : currentMeta.languagesSpoken || null,
      profileImageUrl: body.profileImageUrl !== undefined ? body.profileImageUrl : currentMeta.profileImageUrl || null,
      notes: body.notes !== undefined ? body.notes : currentMeta.notes || null
    };

    if (profile) {
      profile = await prisma.userProfile.update({
        where: { id: profile.id },
        data: {
          metadata: updatedMeta
        }
      });
    } else {
      profile = await prisma.userProfile.create({
        data: {
          id: createId("uprof"),
          tenantId,
          userId,
          metadata: updatedMeta
        }
      });
    }

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "users",
        action: "profile_updated",
        summary: `Updated user profile for ${user.fullName}`,
        entityType: "user",
        severity: "INFO",
        afterData: { userId },
        requestId: context.requestId,
        ipAddress,
        userAgent
      }
    });

    const returnedProfile = {
      ...profile,
      ...updatedMeta
    };

    return { success: true, profile: returnedProfile };
  };
}
