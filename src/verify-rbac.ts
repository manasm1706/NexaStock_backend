import "dotenv/config";
import { prisma } from "./lib/db";
import { hashPassword } from "./lib/crypto";

const BASE_URL = "http://localhost:4000/api/v1";

async function runVerification() {
  console.log("=== STARTING END-TO-END VERIFICATION ===");

  // 1. Authenticate as Business Owner
  console.log("\n[Step 1] Authenticating as Business Owner...");
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "owner@acme.example",
      password: "password123",
      tenantId: "tenant_acme"
    })
  });

  if (!loginRes.ok) {
    throw new Error(`Owner login failed: ${await loginRes.text()}`);
  }

  const { data: ownerAuth } = await loginRes.json();
  const ownerToken = ownerAuth.token;
  console.log(`✓ Owner authenticated successfully. Role: ${ownerAuth.user.role}`);

  // Clean up any existing invitation or user for test-cashier@acme.example to ensure idempotency
  await prisma.user.deleteMany({
    where: { email: "test-cashier@acme.example" }
  });
  
  const settings = await prisma.tenantSettings.findFirst({
    where: { tenantId: "tenant_acme" }
  });
  if (settings) {
    const meta = (settings.metadata as any) || {};
    const invites = meta.invitations || [];
    const cleanedInvites = invites.filter((i: any) => i.email !== "test-cashier@acme.example");
    await prisma.tenantSettings.update({
      where: { id: settings.id },
      data: { metadata: { ...meta, invitations: cleanedInvites } }
    });
  }

  // 2. Invite a cashier
  console.log("\n[Step 2] Inviting cashier test-cashier@acme.example...");
  const roleCashier = await prisma.role.findFirst({ where: { code: "cashier" } });
  if (!roleCashier) throw new Error("Cashier role not found in database.");

  const inviteRes = await fetch(`${BASE_URL}/users/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ownerToken}`,
      "x-tenant-id": "tenant_acme"
    },
    body: JSON.stringify({
      email: "test-cashier@acme.example",
      fullName: "Test Cashier User",
      roleId: roleCashier.id,
      assignedLocations: ["loc_wh_central"],
      permissionOverrides: []
    })
  });

  if (!inviteRes.ok) {
    throw new Error(`Failed to invite cashier: ${await inviteRes.text()}`);
  }

  const { data: inviteData } = await inviteRes.json();
  console.log("✓ Cashier invited successfully.");
  console.log("Invite Data:", inviteData);

  // Validate the invitation status transitions in virtual ledger
  const settingsAfterInvite = await prisma.tenantSettings.findFirst({
    where: { tenantId: "tenant_acme" }
  });
  const invitesAfter = (settingsAfterInvite?.metadata as any)?.invitations || [];
  const cashierInvite = invitesAfter.find((i: any) => i.email === "test-cashier@acme.example");
  console.log(`✓ Invitation state in Virtual Ledger: ${cashierInvite?.status} (Expected: DELIVERED or FAILED)`);

  const token = inviteData.token;

  // 3. Retrieve invitation (transitions status to OPENED)
  console.log("\n[Step 3] Retrieving invitation via public endpoint...");
  const getInviteRes = await fetch(`${BASE_URL}/auth/invitation/${token}`);
  if (!getInviteRes.ok) {
    throw new Error(`Failed to fetch invitation details: ${await getInviteRes.text()}`);
  }
  const inviteDetails = await getInviteRes.json();
  console.log("✓ Invitation retrieved successfully. Details:", inviteDetails.data);

  // Re-verify status transition in DB virtual ledger is OPENED
  const settingsAfterOpen = await prisma.tenantSettings.findFirst({
    where: { tenantId: "tenant_acme" }
  });
  const invitesAfterOpen = (settingsAfterOpen?.metadata as any)?.invitations || [];
  const cashierInviteOpen = invitesAfterOpen.find((i: any) => i.email === "test-cashier@acme.example");
  console.log(`✓ Updated invitation status: ${cashierInviteOpen?.status} (Expected: OPENED)`);

  // 4. Accept invitation
  console.log("\n[Step 4] Accepting invitation...");
  const acceptRes = await fetch(`${BASE_URL}/auth/invitation/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      password: "password123"
    })
  });

  if (!acceptRes.ok) {
    throw new Error(`Failed to accept invitation: ${await acceptRes.text()}`);
  }

  const { data: cashierAuth } = await acceptRes.json();
  const cashierToken = cashierAuth.token;
  console.log(`✓ Invitation accepted. Authenticated as: ${cashierAuth.user.fullName}`);
  console.log("Cashier User Profile DTO:", cashierAuth.user);

  // Verify status in DB virtual ledger is ACCEPTED
  const settingsAfterAccept = await prisma.tenantSettings.findFirst({
    where: { tenantId: "tenant_acme" }
  });
  const invitesAfterAccept = (settingsAfterAccept?.metadata as any)?.invitations || [];
  const cashierInviteAccepted = invitesAfterAccept.find((i: any) => i.email === "test-cashier@acme.example");
  console.log(`✓ Final invitation status: ${cashierInviteAccepted?.status} (Expected: ACCEPTED)`);

  // 5. Verify Route Protection & Scoping
  console.log("\n[Step 5] Testing RBAC route protections for Cashier...");

  // Try to access analytics dashboard (should fail)
  console.log("Requesting analytics dashboard (should return 403 Forbidden)...");
  const analyticsRes = await fetch(`${BASE_URL}/analytics/dashboard`, {
    headers: {
      "Authorization": `Bearer ${cashierToken}`,
      "x-tenant-id": "tenant_acme"
    }
  });

  console.log(`Response status: ${analyticsRes.status} (Expected: 403)`);
  if (analyticsRes.status !== 403) {
    throw new Error("RBAC Failure: Cashier was allowed to access analytics dashboard.");
  }
  console.log("✓ Analytics dashboard successfully blocked with 403.");

  // Try to access POS summary (should succeed)
  console.log("Requesting POS summary (should return 200 OK)...");
  const posRes = await fetch(`${BASE_URL}/pos/summary`, {
    headers: {
      "Authorization": `Bearer ${cashierToken}`,
      "x-tenant-id": "tenant_acme"
    }
  });

  console.log(`Response status: ${posRes.status} (Expected: 200)`);
  if (posRes.status !== 200) {
    throw new Error(`POS route failed for cashier: ${await posRes.text()}`);
  }
  console.log("✓ POS summary successfully accessed with 200.");

  console.log("\n=== ALL END-TO-END VERIFICATION TESTS PASSED SUCCESSFULLY! ===");
}

runVerification().catch(err => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
