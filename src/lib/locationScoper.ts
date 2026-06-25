import { prisma } from "./db";

export interface LocationScope {
  isRestricted: boolean;
  locationIds: string[];
}

/**
 * Resolves the location scoping constraint for a given user.
 * Users with organization-wide roles (super_admin, business_owner, operations_manager)
 * have access to all locations. Other roles are constrained to their explicitly assigned locations.
 */
export async function resolveLocationScope(
  userId: string,
  tenantId: string,
  roleCode: string
): Promise<LocationScope> {
  // Organization-wide roles are unrestricted
  const unrestrictedRoles = ["super_admin", "business_owner", "operations_manager"];
  
  if (unrestrictedRoles.includes(roleCode)) {
    return {
      isRestricted: false,
      locationIds: []
    };
  }

  // Fetch location assignments from the database
  const assignments = await prisma.userLocation.findMany({
    where: {
      tenantId,
      userId
    },
    select: {
      locationId: true
    }
  });

  const locationIds = assignments.map(a => a.locationId);

  return {
    isRestricted: true,
    locationIds
  };
}

/**
 * Helper to build a Prisma query filter for location scoping.
 * Usage:
 * const scope = await resolveLocationScope(userId, tenantId, role);
 * const query = {
 *   where: {
 *     tenantId,
 *     ...buildLocationFilter(scope, "locationId")
 *   }
 * }
 */
export function buildLocationFilter(scope: LocationScope, fieldName: string = "locationId"): any {
  if (!scope.isRestricted) {
    return {};
  }
  return {
    [fieldName]: {
      in: scope.locationIds
    }
  };
}

export function buildAuditMetadata(
  actorId: string,
  roleCode: string,
  actingLocationId?: string,
  existingMetadata: any = {}
) {
  const meta = typeof existingMetadata === 'object' && existingMetadata !== null ? existingMetadata : {};
  return {
    ...meta,
    audit: {
      createdBy: actorId,
      updatedBy: actorId,
      actingRole: roleCode,
      actingLocation: actingLocationId || "all"
    }
  };
}
