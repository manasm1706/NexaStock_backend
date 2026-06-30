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
        locations: { include: { location: true } },
        permissionOverrides: { include: { permission: true } }
      }
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

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
      profile: user.profile,
      locations: user.locations.map(ul => ({
        locationId: ul.locationId,
        name: ul.location.name,
        type: ul.location.locationType
      })),
      permissionOverrides: user.permissionOverrides.map(ov => ({
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

    if (profile) {
      profile = await prisma.userProfile.update({
        where: { id: profile.id },
        data: {
          jobTitle: body.jobTitle !== undefined ? body.jobTitle : profile.jobTitle,
          dateOfBirth: body.dateOfBirth !== undefined ? (body.dateOfBirth ? new Date(body.dateOfBirth) : null) : profile.dateOfBirth,
          phoneNumber: body.phoneNumber !== undefined ? body.phoneNumber : profile.phoneNumber,
          emergencyContact: body.emergencyContact !== undefined ? body.emergencyContact : profile.emergencyContact,
          emergencyPhone: body.emergencyPhone !== undefined ? body.emergencyPhone : profile.emergencyPhone,
          hireDate: body.hireDate !== undefined ? (body.hireDate ? new Date(body.hireDate) : null) : profile.hireDate,
          employmentType: body.employmentType !== undefined ? body.employmentType : profile.employmentType,
          workSchedule: body.workSchedule !== undefined ? body.workSchedule : profile.workSchedule,
          probationEndDate: body.probationEndDate !== undefined ? (body.probationEndDate ? new Date(body.probationEndDate) : null) : profile.probationEndDate,
          managerUserId: body.managerUserId !== undefined ? body.managerUserId : profile.managerUserId,
          skills: body.skills !== undefined ? body.skills : profile.skills,
          certifications: body.certifications !== undefined ? body.certifications : profile.certifications,
          nationalId: body.nationalId !== undefined ? body.nationalId : profile.nationalId,
          passportNumber: body.passportNumber !== undefined ? body.passportNumber : profile.passportNumber,
          taxId: body.taxId !== undefined ? body.taxId : profile.taxId,
          bankAccountNumber: body.bankAccountNumber !== undefined ? body.bankAccountNumber : profile.bankAccountNumber,
          bankName: body.bankName !== undefined ? body.bankName : profile.bankName,
          bankBranch: body.bankBranch !== undefined ? body.bankBranch : profile.bankBranch,
          languagesSpoken: body.languagesSpoken !== undefined ? body.languagesSpoken : profile.languagesSpoken,
          profileImageUrl: body.profileImageUrl !== undefined ? body.profileImageUrl : profile.profileImageUrl,
          notes: body.notes !== undefined ? body.notes : profile.notes
        }
      });
    } else {
      profile = await prisma.userProfile.create({
        data: {
          id: createId("uprof"),
          tenantId,
          userId,
          jobTitle: body.jobTitle || null,
          dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
          phoneNumber: body.phoneNumber || null,
          emergencyContact: body.emergencyContact || null,
          emergencyPhone: body.emergencyPhone || null,
          hireDate: body.hireDate ? new Date(body.hireDate) : null,
          employmentType: body.employmentType || null,
          workSchedule: body.workSchedule || null,
          probationEndDate: body.probationEndDate ? new Date(body.probationEndDate) : null,
          managerUserId: body.managerUserId || null,
          skills: body.skills || null,
          certifications: body.certifications || null,
          nationalId: body.nationalId || null,
          passportNumber: body.passportNumber || null,
          taxId: body.taxId || null,
          bankAccountNumber: body.bankAccountNumber || null,
          bankName: body.bankName || null,
          bankBranch: body.bankBranch || null,
          languagesSpoken: body.languagesSpoken || null,
          profileImageUrl: body.profileImageUrl || null,
          notes: body.notes || null
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

    return { success: true, profile };
  };
}
