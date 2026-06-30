import { prisma } from "../../lib/db";
import { createId } from "../../lib/crypto";
import { ValidationError, NotFoundError } from "../../lib/errors";
import { randomUUID, createHash } from "node:crypto";
import { sendMail, getBrandedInvitationTemplate } from "../../lib/mail";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface InvitationLedgerEntry {
  id: string;
  email: string;
  fullName: string;
  roleId: string;
  roleCode: string;
  roleName: string;
  assignedLocations: string[];
  permissionOverrides: { permissionId: string; allowed: boolean }[];
  department: string | null;
  reportsTo: string | null;
  userProfile: {
    jobTitle?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    hireDate?: string;
    employmentType?: string;
    workSchedule?: string;
    probationEndDate?: string;
    managerUserId?: string;
    skills?: string[];
    certifications?: string[];
    nationalId?: string;
    passportNumber?: string;
    taxId?: string;
    bankAccountNumber?: string;
    bankName?: string;
    bankBranch?: string;
    languagesSpoken?: string[];
    profileImageUrl?: string;
    notes?: string;
  } | null;
  token: string;
  status: 'CREATED' | 'EMAIL_SENT' | 'DELIVERED' | 'OPENED' | 'EXPIRED' | 'RESENT' | 'ACCEPTED' | 'REVOKED' | 'FAILED';
  expiresAt: string;
  invitedBy: string;
  createdAt: string;
  updatedAt: string;
}

export class InvitationService {
  /**
   * Invites a new employee and logs it to the virtual invitation ledger in TenantSettings.
   */
  async inviteUser(
    tenantId: string,
    email: string,
    fullName: string,
    roleId: string,
    actorUserId: string,
    extra?: {
      assignedLocations?: string[];
      permissionOverrides?: { permissionId: string; allowed: boolean }[];
      department?: string;
      reportsTo?: string;
      userProfile?: {
        jobTitle?: string;
        dateOfBirth?: string;
        phoneNumber?: string;
        emergencyContact?: string;
        emergencyPhone?: string;
        hireDate?: string;
        employmentType?: string;
        workSchedule?: string;
        probationEndDate?: string;
        managerUserId?: string;
        skills?: string[];
        certifications?: string[];
        nationalId?: string;
        passportNumber?: string;
        taxId?: string;
        bankAccountNumber?: string;
        bankName?: string;
        bankBranch?: string;
        languagesSpoken?: string[];
        profileImageUrl?: string;
        notes?: string;
      };
    },
    requestMeta?: { requestId?: string | undefined; ipAddress?: string | undefined; userAgent?: string | undefined }
  ) {
    // 1. Check if email already exists in the real User table
    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } }
    });

    if (existingUser) {
      throw new ValidationError("A user with this email address is already registered in NexaStock.");
    }

    // 2. Validate role
    const role = await prisma.role.findFirst({
      where: { id: roleId, tenantId }
    });
    if (!role) {
      throw new NotFoundError("Assigned role not found.");
    }

    // 3. Retrieve Tenant Settings or create them if missing
    let settings = await prisma.tenantSettings.findFirst({
      where: { tenantId }
    });

    if (!settings) {
      settings = await prisma.tenantSettings.create({
        data: {
          id: createId("tset"),
          tenantId,
          currencyCode: "INR",
          timezone: "Asia/Kolkata",
          locale: "en-IN"
        }
      });
    }

    const metadata = (settings.metadata as any) || {};
    const invitations: InvitationLedgerEntry[] = metadata.invitations || [];

    // 4. Check if a pending/active invitation already exists for this email
    const pendingInvite = invitations.find(
      i => i.email.toLowerCase() === email.toLowerCase() && !["ACCEPTED", "REVOKED"].includes(i.status)
    );
    if (pendingInvite) {
      throw new ValidationError("An active invitation is already pending for this email address.");
    }

    const invitationToken = randomUUID();
    const hashedToken = hashToken(invitationToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    const newInvite: InvitationLedgerEntry = {
      id: createId("inv"),
      email,
      fullName,
      roleId,
      roleCode: role.code,
      roleName: role.name,
      assignedLocations: extra?.assignedLocations || [],
      permissionOverrides: extra?.permissionOverrides || [],
      department: extra?.department || null,
      reportsTo: extra?.reportsTo || null,
      userProfile: extra?.userProfile || null,
      token: hashedToken,
      status: "CREATED",
      expiresAt: expiresAt.toISOString(),
      invitedBy: actorUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    invitations.push(newInvite);

    // Save initial CREATED status
    await prisma.tenantSettings.update({
      where: { id: settings.id },
      data: {
        metadata: {
          ...metadata,
          invitations
        }
      }
    });

    // 4.5. Retrieve Tenant/Workspace info and send email
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });
    const workspaceName = tenant?.name || "NexaStock Workspace";

    // Transition to EMAIL_SENT and update DB
    newInvite.status = "EMAIL_SENT";
    newInvite.updatedAt = new Date().toISOString();
    await prisma.tenantSettings.update({
      where: { id: settings.id },
      data: {
        metadata: {
          ...metadata,
          invitations
        }
      }
    });

    const inviteLink = `${process.env.FRONTEND_URL || "http://localhost:8080"}/accept-invitation?token=${invitationToken}`;
    const html = getBrandedInvitationTemplate(fullName, workspaceName, role.name, inviteLink);

    try {
      await sendMail({
        to: email,
        subject: `You have been invited to join ${workspaceName} on NexaStock`,
        html
      });
      newInvite.status = "DELIVERED";
    } catch (err) {
      console.error("Failed to send invitation email:", err);
      newInvite.status = "FAILED";
    }

    newInvite.updatedAt = new Date().toISOString();
    await prisma.tenantSettings.update({
      where: { id: settings.id },
      data: {
        metadata: {
          ...metadata,
          invitations
        }
      }
    });

    // 5. Log audit event
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "users",
        action: "user_invited",
        summary: `Invited user ${fullName} (${email}) as role ${role.name}`,
        entityType: "user",
        severity: "INFO",
        afterData: { inviteId: newInvite.id },
        requestId: requestMeta?.requestId ?? null,
        ipAddress: requestMeta?.ipAddress ?? null,
        userAgent: requestMeta?.userAgent ?? null
      }
    });

    return {
      user: {
        id: newInvite.id,
        email: newInvite.email,
        fullName: newInvite.fullName,
        status: newInvite.status.toLowerCase(),
        role: newInvite.roleCode,
        roleLabel: newInvite.roleName,
        lastLoginAt: null
      },
      token: invitationToken,
      inviteLink: `/accept-invitation?token=${invitationToken}`
    };
  }

  /**
   * Fetches invitation details by validating the token. Sets status to OPENED.
   */
  async getInvitationByToken(token: string) {
    const hashedToken = hashToken(token);
    const allSettings = await prisma.tenantSettings.findMany();
    let foundSetting: any = null;
    let invite: InvitationLedgerEntry | null = null;

    for (const s of allSettings) {
      const meta = (s.metadata as any) || {};
      const invites = meta.invitations || [];
      const found = invites.find((i: any) => i.token === hashedToken);
      if (found) {
        foundSetting = s;
        invite = found;
        break;
      }
    }

    if (!invite || !foundSetting) {
      throw new NotFoundError("Invitation token is invalid or has expired.");
    }

    if (invite.status === "REVOKED") {
      throw new ValidationError("Invitation has been revoked by the administrator.");
    }
    if (invite.status === "ACCEPTED") {
      throw new ValidationError("Invitation has already been accepted.");
    }

    const expiresAt = new Date(invite.expiresAt);
    if (expiresAt.getTime() < Date.now()) {
      // Mark as expired in DB
      invite.status = "EXPIRED";
      invite.updatedAt = new Date().toISOString();
      const meta = (foundSetting.metadata as any) || {};
      await prisma.tenantSettings.update({
        where: { id: foundSetting.id },
        data: { metadata: { ...meta } }
      });
      throw new ValidationError("Invitation token has expired. Please request a new invite.");
    }

    // Update status to OPENED
    if (
      invite.status === "DELIVERED" ||
      invite.status === "EMAIL_SENT" ||
      invite.status === "CREATED" ||
      invite.status === "RESENT" ||
      invite.status === "FAILED"
    ) {
      invite.status = "OPENED";
      invite.updatedAt = new Date().toISOString();
      const meta = (foundSetting.metadata as any) || {};
      await prisma.tenantSettings.update({
        where: { id: foundSetting.id },
        data: { metadata: { ...meta } }
      });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: foundSetting.tenantId }
    });

    return {
      id: invite.id,
      email: invite.email,
      fullName: invite.fullName,
      tenantId: foundSetting.tenantId,
      tenantName: tenant?.name || "NexaStock Workspace",
      roleId: invite.roleId,
      roleName: invite.roleName,
      department: invite.department,
      reportsTo: invite.reportsTo
    };
  }

  /**
   * Accepts invitation by setting the user's password, status, and generating actual database relations.
   */
  async acceptInvitation(token: string, passwordHash: string, requestMeta?: { requestId?: string | undefined; ipAddress?: string | undefined; userAgent?: string | undefined }) {
    const details = await this.getInvitationByToken(token);
    
    // Find the settings and the invite inside it
    const settings = await prisma.tenantSettings.findFirst({
      where: { tenantId: details.tenantId }
    });
    if (!settings) {
      throw new NotFoundError("Workspace settings not found.");
    }

    const metadata = (settings.metadata as any) || {};
    const invitations: InvitationLedgerEntry[] = metadata.invitations || [];
    const inviteIdx = invitations.findIndex(i => i.id === details.id);

    if (inviteIdx === -1) {
      throw new NotFoundError("Invitation record mismatch.");
    }

    const invite = invitations[inviteIdx];
    if (!invite) {
      throw new NotFoundError("Invitation record not found.");
    }

    // Create the User record in database
    const userId = createId("user");
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          id: userId,
          tenantId: details.tenantId,
          roleId: invite.roleId,
          email: invite.email,
          fullName: invite.fullName,
          passwordHash,
          status: "ACTIVE",
          userScope: "INTERNAL",
          tokenVersion: 1,
          metadata: {
            department: invite.department,
            reportsTo: invite.reportsTo
          }
        },
        include: { role: true }
      });

      // Create UserProfile if provided
      if (invite.userProfile) {
        await tx.userProfile.create({
          data: {
            id: createId("uprof"),
            tenantId: details.tenantId,
            userId,
            metadata: {
              jobTitle: invite.userProfile.jobTitle || null,
              dateOfBirth: invite.userProfile.dateOfBirth || null,
              phoneNumber: invite.userProfile.phoneNumber || null,
              emergencyContact: invite.userProfile.emergencyContact || null,
              emergencyPhone: invite.userProfile.emergencyPhone || null,
              hireDate: invite.userProfile.hireDate || null,
              employmentType: invite.userProfile.employmentType || null,
              workSchedule: invite.userProfile.workSchedule || null,
              probationEndDate: invite.userProfile.probationEndDate || null,
              managerUserId: invite.userProfile.managerUserId || null,
              skills: invite.userProfile.skills || null,
              certifications: invite.userProfile.certifications || null,
              nationalId: invite.userProfile.nationalId || null,
              passportNumber: invite.userProfile.passportNumber || null,
              taxId: invite.userProfile.taxId || null,
              bankAccountNumber: invite.userProfile.bankAccountNumber || null,
              bankName: invite.userProfile.bankName || null,
              bankBranch: invite.userProfile.bankBranch || null,
              languagesSpoken: invite.userProfile.languagesSpoken || null,
              profileImageUrl: invite.userProfile.profileImageUrl || null,
              notes: invite.userProfile.notes || null
            }
          }
        });
      }

      // Create location records
      if (invite.assignedLocations && invite.assignedLocations.length > 0) {
        await tx.userLocation.createMany({
          data: invite.assignedLocations.map((locId: string) => ({
            id: createId("uloc"),
            tenantId: details.tenantId,
            userId,
            locationId: locId
          }))
        });
      }

      // Create permission overrides
      if (invite.permissionOverrides && invite.permissionOverrides.length > 0) {
        await tx.userPermissionOverride.createMany({
          data: invite.permissionOverrides.map((ov: any) => ({
            id: createId("upov"),
            tenantId: details.tenantId,
            userId,
            permissionId: ov.permissionId,
            allowed: ov.allowed
          }))
        });
      }

      return newUser;
    });

    // Update invite status in ledger to ACCEPTED
    invite.status = "ACCEPTED";
    invite.updatedAt = new Date().toISOString();

    await prisma.tenantSettings.update({
      where: { id: settings.id },
      data: {
        metadata: {
          ...metadata,
          invitations
        }
      }
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId: details.tenantId,
        actorUserId: user.id,
        module: "users",
        action: "user_joined",
        summary: `User ${user.fullName} (${user.email}) accepted invitation and joined organization`,
        entityType: "user",
        severity: "INFO",
        requestId: requestMeta?.requestId ?? null,
        ipAddress: requestMeta?.ipAddress ?? null,
        userAgent: requestMeta?.userAgent ?? null
      }
    });

    return user;
  }

  /**
   * Resends the invitation: regenerates new token and sets status to RESENT.
   */
  async resendInvitation(inviteId: string, tenantId: string, actorUserId: string, requestMeta?: { requestId?: string | undefined; ipAddress?: string | undefined; userAgent?: string | undefined }) {
    const settings = await prisma.tenantSettings.findFirst({
      where: { tenantId }
    });
    if (!settings) {
      throw new NotFoundError("Workspace settings not found.");
    }

    const metadata = (settings.metadata as any) || {};
    const invitations: InvitationLedgerEntry[] = metadata.invitations || [];
    const invite = invitations.find(i => i.id === inviteId);

    if (!invite) {
      throw new NotFoundError("Pending invitation not found.");
    }

    if (invite.status === "ACCEPTED") {
      throw new ValidationError("This invitation has already been accepted.");
    }

    const invitationToken = randomUUID();
    const hashedToken = hashToken(invitationToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    invite.token = hashedToken;
    invite.status = "RESENT";
    invite.expiresAt = expiresAt.toISOString();
    invite.updatedAt = new Date().toISOString();

    await prisma.tenantSettings.update({
      where: { id: settings.id },
      data: {
        metadata: {
          ...metadata,
          invitations
        }
      }
    });

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });
    const workspaceName = tenant?.name || "NexaStock Workspace";

    // Transition to EMAIL_SENT and update DB
    invite.status = "EMAIL_SENT";
    invite.updatedAt = new Date().toISOString();
    await prisma.tenantSettings.update({
      where: { id: settings.id },
      data: {
        metadata: {
          ...metadata,
          invitations
        }
      }
    });

    const inviteLink = `${process.env.FRONTEND_URL || "http://localhost:8080"}/accept-invitation?token=${invitationToken}`;
    const html = getBrandedInvitationTemplate(invite.fullName, workspaceName, invite.roleName, inviteLink);

    try {
      await sendMail({
        to: invite.email,
        subject: `Re: Invitation to join ${workspaceName} on NexaStock`,
        html
      });
      invite.status = "DELIVERED";
    } catch (err) {
      console.error("Failed to send resent invitation email:", err);
      invite.status = "FAILED";
    }

    invite.updatedAt = new Date().toISOString();
    await prisma.tenantSettings.update({
      where: { id: settings.id },
      data: {
        metadata: {
          ...metadata,
          invitations
        }
      }
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "users",
        action: "invite_resent",
        summary: `Resent invitation to ${invite.fullName} (${invite.email})`,
        entityType: "user",
        severity: "INFO",
        requestId: requestMeta?.requestId ?? null,
        ipAddress: requestMeta?.ipAddress ?? null,
        userAgent: requestMeta?.userAgent ?? null
      }
    });

    return {
      user: {
        id: invite.id,
        email: invite.email,
        fullName: invite.fullName,
        status: invite.status.toLowerCase(),
        role: invite.roleCode,
        roleLabel: invite.roleName,
        lastLoginAt: null
      },
      token: invitationToken,
      inviteLink: `/accept-invitation?token=${invitationToken}`
    };
  }

  /**
   * Cancels/revokes a pending invitation.
   */
  async cancelInvitation(inviteId: string, tenantId: string, actorUserId: string, requestMeta?: { requestId?: string | undefined; ipAddress?: string | undefined; userAgent?: string | undefined }) {
    const settings = await prisma.tenantSettings.findFirst({
      where: { tenantId }
    });
    if (!settings) {
      throw new NotFoundError("Workspace settings not found.");
    }

    const metadata = (settings.metadata as any) || {};
    const invitations: InvitationLedgerEntry[] = metadata.invitations || [];
    const invite = invitations.find(i => i.id === inviteId);

    if (!invite) {
      throw new NotFoundError("Pending invitation not found.");
    }

    if (invite.status === "ACCEPTED") {
      throw new ValidationError("Cannot cancel an already accepted invitation.");
    }

    invite.status = "REVOKED";
    invite.updatedAt = new Date().toISOString();

    await prisma.tenantSettings.update({
      where: { id: settings.id },
      data: {
        metadata: {
          ...metadata,
          invitations
        }
      }
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        id: createId("audit"),
        tenantId,
        actorUserId,
        module: "users",
        action: "invite_cancelled",
        summary: `Cancelled invitation for ${invite.fullName} (${invite.email})`,
        entityType: "user",
        severity: "INFO",
        requestId: requestMeta?.requestId ?? null,
        ipAddress: requestMeta?.ipAddress ?? null,
        userAgent: requestMeta?.userAgent ?? null
      }
    });

    return {
      id: invite.id,
      email: invite.email,
      fullName: invite.fullName,
      status: invite.status.toLowerCase(),
      role: invite.roleCode,
      roleLabel: invite.roleName,
      lastLoginAt: null
    };
  }
}
