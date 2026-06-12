generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

/// NexaStock is a shared-database multi-tenant SaaS platform.
///
/// Design principles used here:
/// - tenant-scoped data for all operational entities
/// - ledger-style inventory history with immutable movements
/// - normalized operational records plus JSONB extensibility for industry metadata
/// - explicit status enums for workflow-critical entities
/// - high-cardinality indexes for tenant, SKU, barcode, invoice, movement, and timestamp lookups
/// - soft delete support on major business records

enum OperationalModel {
  CENTRALIZED_WAREHOUSE
  DIRECT_STORE
  EXTERNAL_WAREHOUSE
  HYBRID
}

enum TenantStatus {
  TRIAL
  ACTIVE
  PAST_DUE
  SUSPENDED
  CANCELLED
}

enum SubscriptionStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
  EXPIRED
}

enum BillingCycle {
  MONTHLY
  QUARTERLY
  YEARLY
}

enum PlanTier {
  STARTER
  GROWTH
  PROFESSIONAL
  ENTERPRISE
}

enum RoleKey {
  SUPER_ADMIN
  BUSINESS_OWNER
  OPS_MANAGER
  WAREHOUSE_MANAGER
  STORE_MANAGER
  CASHIER
  SUPPLIER_PORTAL_USER
}

enum PermissionKey {
  TENANT_ADMIN
  USER_MANAGEMENT
  PRODUCT_MANAGEMENT
  SUPPLIER_MANAGEMENT
  PROCUREMENT_MANAGEMENT
  INVENTORY_READ
  INVENTORY_WRITE
  WAREHOUSE_MANAGEMENT
  POS_SALES
  ANALYTICS_READ
  AI_READ
  AUDIT_READ
  SETTINGS_MANAGE
}

enum UserScope {
  INTERNAL
  EXTERNAL
}

enum UserStatus {
  ACTIVE
  INVITED
  DISABLED
  LOCKED
}

enum MfaMethod {
  TOTP
  SMS
  EMAIL
  WEBAUTHN
  BACKUP_CODES
}

enum LocationType {
  STORE
  WAREHOUSE
  EXTERNAL_WAREHOUSE
  TRANSIT
  VIRTUAL
}

enum LocationStatus {
  ACTIVE
  INACTIVE
  MAINTENANCE
  CLOSED
}

enum WarehouseType {
  CENTRAL
  REGIONAL
  SATELLITE
  COLD_STORAGE
  CROSS_DOCK
  EXTERNAL_3PL
}

enum ZoneStatus {
  ACTIVE
  INACTIVE
  MAINTENANCE
}

enum BinStatus {
  ACTIVE
  BLOCKED
  FULL
  EMPTY
  MAINTENANCE
}

enum ProductTrackingMode {
  NONE
  BATCH
  SERIAL
  BATCH_AND_SERIAL
}

enum ProductStatus {
  ACTIVE
  INACTIVE
  ARCHIVED
}

enum BarcodeSymbology {
  EAN8
  EAN13
  UPCA
  UPCE
  CODE128
  CODE39
  QR
  CUSTOM
}

enum SupplierStatus {
  ACTIVE
  PAUSED
  BLOCKED
}

enum ContactType {
  PRIMARY
  BILLING
  SALES
  OPERATIONS
  SUPPORT
}

enum AddressType {
  REGISTERED
  BILLING
  SHIPPING
  WAREHOUSE
  OTHER
}

enum TaxJurisdiction {
  GST
  VAT
  HST
  SALES_TAX
  EXCISE
}

enum PurchaseOrderStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  SENT
  ACKNOWLEDGED
  PARTIALLY_RECEIVED
  FULLY_RECEIVED
  CLOSED
  CANCELLED
}

enum SupplierInvoiceStatus {
  RECEIVED
  MATCHED
  DISCREPANCY
  APPROVED
  POSTED
  PAID
  VOIDED
}

enum GoodsReceiptNoteStatus {
  DRAFT
  PARTIAL
  CONFIRMED
  DISCREPANCY
  REJECTED
  CLOSED
}

enum InventoryMovementType {
  INWARD
  OUTWARD
  SALE
  RETURN
  ADJUSTMENT
  TRANSFER
  WRITEOFF
  DISPATCH
  GRN
}

enum InventoryReservationStatus {
  ACTIVE
  RELEASED
  CONSUMED
  EXPIRED
  CANCELLED
}

enum InventoryTransferStatus {
  DRAFT
  REQUESTED
  APPROVED
  PICKING
  DISPATCHED
  IN_TRANSIT
  PARTIALLY_RECEIVED
  RECEIVED
  CANCELLED
}

enum DispatchChallanStatus {
  PREPARED
  IN_TRANSIT
  DELIVERED
  PARTIALLY_DELIVERED
  EXCEPTION
  CANCELLED
}

enum PickingTaskStatus {
  PENDING
  ASSIGNED
  PICKING
  STAGED
  COMPLETED
  CANCELLED
}

enum POSSessionStatus {
  OPEN
  PAUSED
  CLOSED
  SYNC_PENDING
}

enum CartStatus {
  ACTIVE
  CHECKED_OUT
  ABANDONED
  EXPIRED
}

enum SaleStatus {
  OPEN
  COMPLETED
  VOIDED
  RETURNED
  PARTIALLY_RETURNED
}

enum InvoiceStatus {
  DRAFT
  ISSUED
  PARTIALLY_PAID
  PAID
  VOIDED
  REFUNDED
}

enum PaymentMethod {
  CASH
  CARD
  UPI
  WALLET
  BANK_TRANSFER
  CREDIT
  SPLIT
}

enum PaymentStatus {
  PENDING
  AUTHORIZED
  CAPTURED
  FAILED
  REFUNDED
  PARTIAL_REFUND
  VOIDED
}

enum RefundStatus {
  REQUESTED
  APPROVED
  PROCESSED
  REJECTED
  VOIDED
}

enum ReturnStatus {
  REQUESTED
  RECEIVED
  APPROVED
  REJECTED
  RESTOCKED
  REFUNDED
  CLOSED
}

enum AlertSeverity {
  INFO
  WARNING
  CRITICAL
}

enum AlertStatus {
  OPEN
  ACKNOWLEDGED
  RESOLVED
  DISMISSED
}

enum NotificationChannel {
  IN_APP
  EMAIL
  SMS
  WHATSAPP
}

enum NotificationStatus {
  QUEUED
  SENT
  DELIVERED
  READ
  FAILED
}

enum ComplianceDocumentType {
  GST_REGISTRATION
  DRUG_LICENSE
  FSSAI_LICENSE
  FIRE_SAFETY
  BUSINESS_LICENSE
  TAX_CERTIFICATE
  INSURANCE
  OTHER
}

enum ComplianceStatus {
  ACTIVE
  EXPIRING_SOON
  EXPIRED
  PENDING_REVIEW
}

enum KPIPeriod {
  HOURLY
  DAILY
  WEEKLY
  MONTHLY
  QUARTERLY
  YEARLY
}

enum ForecastModelStatus {
  DRAFT
  TRAINING
  ACTIVE
  RETIRED
  FAILED
}

enum RecommendationStatus {
  OPEN
  IN_PROGRESS
  APPLIED
  DISMISSED
  EXPIRED
}

enum AnomalyStatus {
  OPEN
  INVESTIGATING
  FALSE_POSITIVE
  RESOLVED
}

enum ActivitySource {
  UI
  API
  SYSTEM
  WEBHOOK
  IMPORT
}

model Tenant {
  id               String             @id @default(cuid())
  name             String             @db.VarChar(255)
  legalName        String             @db.VarChar(255)
  slug             String             @db.VarChar(120)
  status           TenantStatus       @default(TRIAL)
  onboardingStatus  String             @default("pending") @db.VarChar(60)
  operationalModel  OperationalModel   @default(HYBRID)
  industry         String             @db.VarChar(120)
  subdomain        String?            @unique @db.VarChar(120)
  primaryCurrency  String             @default("USD") @db.VarChar(8)
  timezone         String             @default("UTC") @db.VarChar(64)
  locale           String             @default("en-US") @db.VarChar(32)
  branding         Json?              
  metadata         Json?              
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt
  deletedAt        DateTime?

  subscriptions    Subscription[]
  settings         TenantSettings?
  featureFlags     TenantFeatureFlag[]
  users            User[]
  roles            Role[]
  permissions      Permission[]
  locations        Location[]
  productCategories ProductCategory[]
  taxCategories    TaxCategory[]
  suppliers        Supplier[]
  supplierContacts SupplierContact[]
  supplierAddresses SupplierAddress[]
  supplierProducts SupplierProduct[]
  supplierPerformanceMetrics SupplierPerformanceMetric[]
  purchaseOrders   PurchaseOrder[]
  supplierInvoices SupplierInvoice[]
  goodsReceiptNotes GoodsReceiptNote[]
  purchaseOrderItems PurchaseOrderItem[]
  supplierInvoiceItems SupplierInvoiceItem[]
  goodsReceiptNoteItems GoodsReceiptNoteItem[]
  inventories      Inventory[]
  inventoryBatches InventoryBatch[]
  inventorySerials InventorySerial[]
  inventoryReservations InventoryReservation[]
  stockAdjustments StockAdjustment[]
  inventoryMovements InventoryMovement[]
  inventoryTransfers InventoryTransfer[]
  dispatchChallans DispatchChallan[]
  transferRequests  TransferRequest[]
  transferRequestItems TransferRequestItem[]
  inventoryTransferItems InventoryTransferItem[]
  dispatchChallanItems DispatchChallanItem[]
  pickingTasks      PickingTask[]
  posSessions      POSSession[]
  carts            Cart[]
  sales            Sale[]
  invoices         Invoice[]
  payments         Payment[]
  refunds          Refund[]
  returns          Return[]
  customers        Customer[]
  dashboardSnapshots DashboardSnapshot[]
  reportDefinitions ReportDefinition[]
  savedReports     SavedReport[]
  kpiRecords       KPIRecord[]
  forecastModels   ForecastModel[]
  forecastRecords  ForecastRecord[]
  recommendations  AIRecommendation[]
  alertRules       AlertRule[]
  alerts           Alert[]
  anomalies        AnomalyRecord[]
  notifications    Notification[]
  notificationPreferences NotificationPreference[]
  emailLogs        EmailLog[]
  smsLogs          SMSLog[]
  auditLogs        AuditLog[]
  activityEvents   ActivityEvent[]
  complianceDocuments ComplianceDocument[]
  attachments      FileAttachment[]

  @@index([slug])
  @@index([status, operationalModel])
  @@index([createdAt])
}

/// Global plan catalog. These rows are platform-level, not tenant-specific.
model SubscriptionPlan {
  id             String          @id @default(cuid())
  code           String          @unique @db.VarChar(80)
  name           String          @db.VarChar(120)
  tier           PlanTier
  billingCycle   BillingCycle
  priceMonthly   Decimal         @db.Decimal(14, 2)
  priceYearly    Decimal         @db.Decimal(14, 2)
  limits         Json?
  featureSet     Json?
  isActive       Boolean         @default(true)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  subscriptions  Subscription[]

  @@index([tier, isActive])
}

model Subscription {
  id                   String             @id @default(cuid())
  tenantId             String
  subscriptionPlanId   String
  status               SubscriptionStatus @default(TRIALING)
  billingCycle         BillingCycle       @default(MONTHLY)
  seatsPurchased       Int                @default(1)
  seatsUsed            Int                @default(0)
  startedAt            DateTime           @default(now())
  trialEndsAt          DateTime?
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  renewsAt             DateTime?
  canceledAt           DateTime?
  cancelAtPeriodEnd    Boolean            @default(false)
  externalCustomerId   String?            @db.VarChar(120)
  externalSubscriptionId String?          @db.VarChar(120)
  metadata             Json?
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt
  deletedAt            DateTime?

  tenant               Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  plan                 SubscriptionPlan    @relation(fields: [subscriptionPlanId], references: [id], onDelete: Restrict)

  @@index([tenantId, status])
  @@index([tenantId, renewsAt])
  @@index([subscriptionPlanId])
}

model TenantSettings {
  id                        String           @id @default(cuid())
  tenantId                  String           @unique
  operationalModel          OperationalModel @default(HYBRID)
  currencyCode              String           @default("USD") @db.VarChar(8)
  timezone                  String           @default("UTC") @db.VarChar(64)
  locale                    String           @default("en-US") @db.VarChar(32)
  dateFormat                String           @default("YYYY-MM-DD") @db.VarChar(32)
  numberFormat              String           @default("standard") @db.VarChar(32)
  valuationMethod           String           @default("FIFO") @db.VarChar(32)
  invoicePrefix             String           @default("INV") @db.VarChar(24)
  poPrefix                  String           @default("PO") @db.VarChar(24)
  grnPrefix                 String           @default("GRN") @db.VarChar(24)
  dcPrefix                  String           @default("DC") @db.VarChar(24)
  warehousePrefix           String           @default("WH") @db.VarChar(24)
  storePrefix               String           @default("ST") @db.VarChar(24)
  branding                  Json?
  operationalPreferences    Json?
  aiPreferences             Json?
  securityPreferences       Json?
  metadata                  Json?
  createdAt                 DateTime         @default(now())
  updatedAt                 DateTime         @updatedAt

  tenant                    Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId, operationalModel])
}

model TenantFeatureFlag {
  id          String   @id @default(cuid())
  tenantId    String
  flagKey     String   @db.VarChar(120)
  enabled     Boolean  @default(false)
  value       Json?
  source      String   @default("manual") @db.VarChar(40)
  rollout     Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, flagKey])
  @@index([tenantId, enabled])
}

model Role {
  id          String      @id @default(cuid())
  tenantId    String
  roleKey     RoleKey?
  code        String      @db.VarChar(120)
  name        String      @db.VarChar(160)
  description String?
  isSystem    Boolean     @default(false)
  isActive    Boolean     @default(true)
  metadata    Json?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  deletedAt   DateTime?

  tenant      Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  users       User[]
  rolePermissions RolePermission[]

  @@unique([tenantId, code])
  @@index([tenantId, roleKey])
}

model Permission {
  id          String        @id @default(cuid())
  tenantId    String
  permissionKey PermissionKey?
  code        String        @db.VarChar(140)
  name        String        @db.VarChar(180)
  description String?
  module      String        @db.VarChar(120)
  action      String        @db.VarChar(120)
  isSystem    Boolean       @default(false)
  metadata    Json?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  tenant      Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  rolePermissions RolePermission[]

  @@unique([tenantId, code])
  @@index([tenantId, module])
}

model RolePermission {
  id           String     @id @default(cuid())
  tenantId     String
  roleId       String
  permissionId String
  allowed      Boolean    @default(true)
  scope        Json?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  tenant       Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([tenantId, roleId, permissionId])
  @@index([tenantId, roleId])
  @@index([tenantId, permissionId])
}

model User {
  id             String      @id @default(cuid())
  tenantId       String
  roleId         String
  supplierId     String?
  userScope      UserScope   @default(INTERNAL)
  email          String      @db.VarChar(255)
  phone          String?     @db.VarChar(32)
  username       String?     @db.VarChar(120)
  fullName       String      @db.VarChar(180)
  passwordHash   String      @db.VarChar(255)
  status         UserStatus  @default(INVITED)
  lastLoginAt    DateTime?
  emailVerifiedAt DateTime?
  phoneVerifiedAt DateTime?
  avatarUrl      String?
  metadata       Json?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  deletedAt      DateTime?

  tenant         Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  role           Role        @relation(fields: [roleId], references: [id], onDelete: Restrict)
  supplier       Supplier?   @relation(fields: [supplierId], references: [id], onDelete: SetNull)
  sessions       UserSession[]
  mfaConfiguration MFAConfiguration?
  createdAuditLogs AuditLog[] @relation("AuditActor")
  activityEvents  ActivityEvent[] @relation("ActivityActor")
  requestedTransferRequests TransferRequest[] @relation("TransferRequestRequestedBy")
  approvedTransferRequests  TransferRequest[] @relation("TransferRequestApprovedBy")
  approvedPurchaseOrders PurchaseOrder[] @relation("PurchaseOrderApprovedBy")
  verifiedGoodsReceiptNotes GoodsReceiptNote[] @relation("GoodsReceiptNoteVerifiedBy")
  approvedStockAdjustments StockAdjustment[] @relation("StockAdjustmentApprovedBy")
  notificationPreferences NotificationPreference?
  notifications  Notification[]

  @@unique([tenantId, email])
  @@unique([tenantId, username])
  @@index([tenantId, roleId])
  @@index([tenantId, status])
  @@index([tenantId, supplierId])
}

model UserSession {
  id               String    @id @default(cuid())
  tenantId         String
  userId           String
  sessionTokenHash String    @db.VarChar(255)
  refreshTokenHash String?   @db.VarChar(255)
  deviceId         String?   @db.VarChar(120)
  deviceName       String?   @db.VarChar(120)
  ipAddress        String?   @db.VarChar(64)
  userAgent        String?   @db.VarChar(500)
  isActive         Boolean   @default(true)
  lastSeenAt       DateTime?
  expiresAt        DateTime
  revokedAt        DateTime?
  metadata         Json?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  tenant           Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([tenantId, userId])
  @@index([tenantId, expiresAt])
}

model MFAConfiguration {
  id                 String    @id @default(cuid())
  tenantId           String
  userId             String    @unique
  method             MfaMethod
  isEnabled          Boolean   @default(false)
  secretEncrypted    String?   @db.VarChar(255)
  recoveryCodesHash  Json?
  phoneNumber        String?   @db.VarChar(32)
  backupEmail        String?   @db.VarChar(255)
  lastVerifiedAt     DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  tenant             Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user               User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([tenantId, isEnabled])
}

model AuditLog {
  id              String    @id @default(cuid())
  tenantId        String
  actorUserId     String?
  requestId       String?   @db.VarChar(120)
  entityType      String    @db.VarChar(120)
  entityId        String?   @db.VarChar(120)
  action          String    @db.VarChar(120)
  module          String    @db.VarChar(120)
  summary         String    @db.VarChar(500)
  severity        AlertSeverity @default(INFO)
  beforeData      Json?
  afterData       Json?
  ipAddress       String?   @db.VarChar(64)
  userAgent       String?   @db.VarChar(500)
  createdAt       DateTime  @default(now())

  tenant          Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  actor           User?     @relation("AuditActor", fields: [actorUserId], references: [id], onDelete: SetNull)

  @@index([tenantId, createdAt])
  @@index([tenantId, entityType, entityId])
  @@index([tenantId, module, action])
}

model ActivityEvent {
  id              String         @id @default(cuid())
  tenantId        String
  actorUserId     String?
  source          ActivitySource @default(UI)
  eventType       String         @db.VarChar(120)
  entityType      String         @db.VarChar(120)
  entityId        String?        @db.VarChar(120)
  action          String         @db.VarChar(120)
  description     String?
  payload         Json?
  sessionId       String?
  requestId       String?        @db.VarChar(120)
  metadata        Json?
  occurredAt      DateTime       @default(now())
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  tenant          Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  actor           User?          @relation("ActivityActor", fields: [actorUserId], references: [id], onDelete: SetNull)

  @@index([tenantId, occurredAt])
  @@index([tenantId, entityType, entityId])
  @@index([tenantId, eventType])
}

model Location {
  id              String         @id @default(cuid())
  tenantId        String
  parentLocationId String?
  code            String         @db.VarChar(80)
  name            String         @db.VarChar(180)
  locationType    LocationType
  status          LocationStatus @default(ACTIVE)
  operationalModel OperationalModel @default(HYBRID)
  email           String?        @db.VarChar(255)
  phone           String?        @db.VarChar(32)
  addressLine1    String?        @db.VarChar(255)
  addressLine2    String?        @db.VarChar(255)
  city            String?        @db.VarChar(120)
  state           String?        @db.VarChar(120)
  postalCode      String?        @db.VarChar(40)
  country         String?        @db.VarChar(120)
  timezone        String         @default("UTC") @db.VarChar(64)
  latitude        Decimal?       @db.Decimal(10, 7)
  longitude       Decimal?       @db.Decimal(10, 7)
  metadata        Json?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  deletedAt       DateTime?

  tenant          Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  parentLocation  Location?      @relation("LocationHierarchy", fields: [parentLocationId], references: [id], onDelete: SetNull)
  childLocations  Location[]     @relation("LocationHierarchy")
  store           Store?
  warehouse       Warehouse?
  externalWarehouse ExternalWarehouse?
  zones           LocationZone[]
  inventories     Inventory[]
  inventoryMovements InventoryMovement[]
  posSessions     POSSession[]
  inventorySerials InventorySerial[]
  transferRequestsFrom TransferRequest[] @relation("RequestFromLocation")
  transferRequestsTo   TransferRequest[] @relation("RequestToLocation")
  inventoryTransfersFrom InventoryTransfer[] @relation("TransferFromLocation")
  inventoryTransfersTo   InventoryTransfer[] @relation("TransferToLocation")
  dispatchChallansOrigin DispatchChallan[] @relation("DCOriginLocation")
  dispatchChallansDestination DispatchChallan[] @relation("DCDestinationLocation")

  @@unique([tenantId, code])
  @@index([tenantId, locationType])
  @@index([tenantId, status])
}

model Store {
  id                String   @id @default(cuid())
  tenantId          String
  locationId        String   @unique
  storeManagerUserId String?
  storeCode         String   @db.VarChar(80)
  openingHours      Json?
  posEnabled        Boolean  @default(true)
  defaultTaxCategoryId String?
  metadata          Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  location          Location @relation(fields: [locationId], references: [id], onDelete: Cascade)
  manager           User?    @relation(fields: [storeManagerUserId], references: [id], onDelete: SetNull)

  @@unique([tenantId, storeCode])
  @@index([tenantId, posEnabled])
}

model Warehouse {
  id                   String        @id @default(cuid())
  tenantId             String
  locationId           String        @unique
  warehouseCode        String        @db.VarChar(80)
  warehouseType        WarehouseType @default(CENTRAL)
  temperatureProfile   String?       @db.VarChar(120)
  isTemperatureControlled Boolean    @default(false)
  receivingDockCount   Int           @default(0)
  dispatchDockCount    Int           @default(0)
  capacityUnits        Int           @default(0)
  pickingStrategy      String?       @db.VarChar(80)
  metadata             Json?
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  tenant               Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  location             Location      @relation(fields: [locationId], references: [id], onDelete: Cascade)

  @@unique([tenantId, warehouseCode])
  @@index([tenantId, warehouseType])
}

model ExternalWarehouse {
  id                 String   @id @default(cuid())
  tenantId           String
  locationId         String   @unique
  providerName       String   @db.VarChar(180)
  providerCode       String?  @db.VarChar(80)
  contractReference  String?  @db.VarChar(120)
  serviceLevel       String?  @db.VarChar(120)
  apiEndpoint        String?  @db.VarChar(255)
  integrationConfig  Json?
  metadata           Json?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  tenant             Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  location           Location @relation(fields: [locationId], references: [id], onDelete: Cascade)

  @@index([tenantId, providerName])
}

model LocationZone {
  id            String     @id @default(cuid())
  tenantId      String
  locationId    String
  code          String     @db.VarChar(80)
  name          String     @db.VarChar(120)
  zoneType      String     @db.VarChar(80)
  status        ZoneStatus @default(ACTIVE)
  temperatureRange String?  @db.VarChar(80)
  metadata      Json?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  tenant        Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  location      Location   @relation(fields: [locationId], references: [id], onDelete: Cascade)
  bins          StorageBin[]
  stores        Store[]
  warehouses    Warehouse[]
  externalWarehouses ExternalWarehouse[]

  @@unique([tenantId, locationId, code])
  @@index([tenantId, locationId])
}

model StorageBin {
  id            String    @id @default(cuid())
  tenantId      String
  locationId    String
  zoneId        String
  parentBinId   String?
  code          String    @db.VarChar(120)
  aisle         String?   @db.VarChar(40)
  rack          String?   @db.VarChar(40)
  shelf         String?   @db.VarChar(40)
  bin           String?   @db.VarChar(40)
  status        BinStatus @default(ACTIVE)
  capacityUnits Int       @default(0)
  occupiedUnits Int       @default(0)
  metadata      Json?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  tenant        Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  location      Location  @relation(fields: [locationId], references: [id], onDelete: Cascade)
  zone          LocationZone @relation(fields: [zoneId], references: [id], onDelete: Cascade)
  parentBin     StorageBin? @relation("BinHierarchy", fields: [parentBinId], references: [id], onDelete: SetNull)
  childBins     StorageBin[] @relation("BinHierarchy")

  @@unique([tenantId, zoneId, code])
  @@index([tenantId, locationId])
  @@index([tenantId, zoneId])
}

model ProductCategory {
  id              String             @id @default(cuid())
  tenantId        String
  parentCategoryId String?
  code            String             @db.VarChar(80)
  name            String             @db.VarChar(180)
  slug            String             @db.VarChar(180)
  description     String?
  sortOrder       Int                 @default(0)
  metadata        Json?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
  deletedAt       DateTime?

  tenant          Tenant              @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  parentCategory  ProductCategory?    @relation("CategoryHierarchy", fields: [parentCategoryId], references: [id], onDelete: SetNull)
  childCategories ProductCategory[]   @relation("CategoryHierarchy")
  subCategories   ProductSubCategory[]
  products        Product[]

  @@unique([tenantId, code])
  @@unique([tenantId, slug])
  @@index([tenantId, parentCategoryId])
}

model ProductSubCategory {
  id            String   @id @default(cuid())
  tenantId      String
  categoryId    String
  code          String   @db.VarChar(80)
  name          String   @db.VarChar(180)
  slug          String   @db.VarChar(180)
  description   String?
  metadata      Json?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  tenant        Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  category      ProductCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  products      Product[]

  @@unique([tenantId, code])
  @@unique([tenantId, slug])
  @@unique([tenantId, categoryId, name])
  @@index([tenantId, categoryId])
}

model TaxCategory {
  id                String         @id @default(cuid())
  tenantId          String
  code              String         @db.VarChar(80)
  name              String         @db.VarChar(160)
  jurisdiction      TaxJurisdiction @default(GST)
  rate              Decimal        @db.Decimal(7, 4)
  isInclusive       Boolean        @default(false)
  breakdown         Json?
  effectiveFrom     DateTime?
  effectiveTo       DateTime?
  metadata          Json?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  tenant            Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  products          Product[]
  suppliers         Supplier[]
  purchaseOrderItems PurchaseOrderItem[]

  @@unique([tenantId, code])
  @@index([tenantId, jurisdiction])
}

model Product {
  id               String            @id @default(cuid())
  tenantId         String
  categoryId       String
  subCategoryId    String?
  taxCategoryId    String?
  sku              String            @db.VarChar(120)
  productCode      String?           @db.VarChar(120)
  name             String            @db.VarChar(255)
  shortName        String?           @db.VarChar(120)
  brand            String?           @db.VarChar(180)
  description      String?
  trackingMode     ProductTrackingMode @default(NONE)
  status           ProductStatus     @default(ACTIVE)
  unitOfMeasure    String            @db.VarChar(40)
  baseUom          String?           @db.VarChar(40)
  reorderLevel     Int               @default(0)
  reorderQuantity  Int               @default(0)
  minimumOrderQty  Int               @default(1)
  shelfLifeDays    Int?
  industry         String            @db.VarChar(80)
  metadata         Json?
  attributes       Json?
  tags             String[]          @default([])
  isActive         Boolean           @default(true)
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  deletedAt        DateTime?

  tenant           Tenant            @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  category         ProductCategory   @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  subCategory      ProductSubCategory? @relation(fields: [subCategoryId], references: [id], onDelete: SetNull)
  taxCategory      TaxCategory?      @relation(fields: [taxCategoryId], references: [id], onDelete: SetNull)
  variants         ProductVariant[]
  barcodes         ProductBarcode[]
  images           ProductImage[]
  supplierLinks    ProductSupplier[]
  supplierCatalogs  SupplierProduct[]
  inventories      Inventory[]
  batches          InventoryBatch[]
  movements        InventoryMovement[]
  serials          InventorySerial[]
  purchaseOrderItems PurchaseOrderItem[]
  supplierInvoiceItems SupplierInvoiceItem[]
  goodsReceiptNoteItems GoodsReceiptNoteItem[]
  transferRequestItems TransferRequestItem[]
  transferItems    InventoryTransferItem[]
  dispatchItems    DispatchChallanItem[]
  pickingTaskItems PickingTaskItem[]
  saleItems        SaleItem[]
  cartItems        CartItem[]
  returnItems      ReturnItem[]

  @@unique([tenantId, sku])
  @@index([tenantId, categoryId])
  @@index([tenantId, subCategoryId])
  @@index([tenantId, taxCategoryId])
  @@index([tenantId, status])
  @@index([tenantId, name])
}

model ProductVariant {
  id               String           @id @default(cuid())
  tenantId         String
  productId        String
  variantCode      String           @db.VarChar(120)
  sku              String           @db.VarChar(120)
  name             String           @db.VarChar(255)
  isDefault        Boolean          @default(false)
  trackingMode     ProductTrackingMode @default(NONE)
  attributes       Json?
  metadata         Json?
  isActive         Boolean          @default(true)
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt
  deletedAt        DateTime?

  tenant           Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  product          Product          @relation(fields: [productId], references: [id], onDelete: Cascade)
  barcodes         ProductBarcode[]
  images           ProductImage[]
  inventories      Inventory[]
  inventoryBatches InventoryBatch[]
  inventorySerials InventorySerial[]
  movements        InventoryMovement[]
  purchaseOrderItems PurchaseOrderItem[]
  supplierInvoiceItems SupplierInvoiceItem[]
  goodsReceiptNoteItems GoodsReceiptNoteItem[]
  transferRequestItems TransferRequestItem[]
  transferItems    InventoryTransferItem[]
  dispatchItems    DispatchChallanItem[]
  pickingTaskItems PickingTaskItem[]
  saleItems        SaleItem[]
  cartItems        CartItem[]
  returnItems      ReturnItem[]

  @@unique([tenantId, sku])
  @@unique([tenantId, productId, variantCode])
  @@index([tenantId, productId])
  @@index([tenantId, isDefault])
}

model ProductBarcode {
  id            String           @id @default(cuid())
  tenantId      String
  productId     String
  variantId     String?
  barcode       String           @db.VarChar(120)
  symbology     BarcodeSymbology @default(EAN13)
  isPrimary     Boolean          @default(false)
  barcodeMeta   Json?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  tenant        Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  product       Product          @relation(fields: [productId], references: [id], onDelete: Cascade)
  variant       ProductVariant?  @relation(fields: [variantId], references: [id], onDelete: SetNull)

  @@unique([tenantId, barcode])
  @@index([tenantId, productId])
  @@index([tenantId, variantId])
}

model ProductImage {
  id            String   @id @default(cuid())
  tenantId      String
  productId     String
  variantId     String?
  storageKey    String   @db.VarChar(255)
  url           String   @db.VarChar(500)
  altText       String?
  sortOrder     Int      @default(0)
  metadata      Json?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  tenant        Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  product       Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  variant       ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)

  @@index([tenantId, productId])
  @@index([tenantId, variantId])
}

model ProductSupplier {
  id                  String   @id @default(cuid())
  tenantId            String
  productId           String
  supplierId          String
  supplierSku         String?  @db.VarChar(120)
  preferred           Boolean  @default(false)
  leadTimeDays        Int      @default(0)
  minimumOrderQty     Int      @default(1)
  lastPurchasePrice   Decimal? @db.Decimal(14, 4)
  currencyCode        String   @default("USD") @db.VarChar(8)
  metadata            Json?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  tenant              Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  product             Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  supplier            Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)

  @@unique([tenantId, productId, supplierId])
  @@index([tenantId, supplierId])
  @@index([tenantId, productId])
}

model Supplier {
  id                 String          @id @default(cuid())
  tenantId           String
  supplierCode       String          @db.VarChar(120)
  name               String          @db.VarChar(255)
  legalName          String?         @db.VarChar(255)
  status             SupplierStatus  @default(ACTIVE)
  gstNumber          String?         @db.VarChar(40)
  panNumber          String?         @db.VarChar(40)
  tanNumber          String?         @db.VarChar(40)
  drugLicenseNumber  String?         @db.VarChar(80)
  fssaiLicenseNumber String?         @db.VarChar(80)
  paymentTermsDays   Int             @default(30)
  creditLimit        Decimal?        @db.Decimal(14, 2)
  leadTimeDays       Int             @default(0)
  performanceScore   Decimal?        @db.Decimal(5, 2)
  website            String?         @db.VarChar(255)
  notes              String?
  metadata           Json?
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt
  deletedAt          DateTime?

  tenant             Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  contacts           SupplierContact[]
  addresses          SupplierAddress[]
  products           SupplierProduct[]
  performanceMetrics SupplierPerformanceMetric[]
  users              User[]
  productLinks       ProductSupplier[]
  purchaseOrders     PurchaseOrder[]
  supplierInvoices   SupplierInvoice[]
  goodsReceiptNotes  GoodsReceiptNote[]

  @@unique([tenantId, supplierCode])
  @@index([tenantId, status])
  @@index([tenantId, gstNumber])
  @@index([tenantId, name])
}

model SupplierContact {
  id          String      @id @default(cuid())
  tenantId    String
  supplierId  String
  contactType ContactType  @default(PRIMARY)
  name        String      @db.VarChar(180)
  designation String?     @db.VarChar(120)
  email       String?     @db.VarChar(255)
  phone       String?     @db.VarChar(32)
  isPrimary   Boolean     @default(false)
  metadata    Json?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  tenant      Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  supplier    Supplier    @relation(fields: [supplierId], references: [id], onDelete: Cascade)

  @@index([tenantId, supplierId])
  @@index([tenantId, email])
}

model SupplierAddress {
  id           String       @id @default(cuid())
  tenantId     String
  supplierId   String
  addressType  AddressType  @default(OTHER)
  line1        String       @db.VarChar(255)
  line2        String?      @db.VarChar(255)
  city         String?      @db.VarChar(120)
  state        String?      @db.VarChar(120)
  postalCode   String?      @db.VarChar(40)
  country      String?      @db.VarChar(120)
  latitude     Decimal?     @db.Decimal(10, 7)
  longitude    Decimal?     @db.Decimal(10, 7)
  isPrimary    Boolean      @default(false)
  metadata     Json?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  supplier     Supplier     @relation(fields: [supplierId], references: [id], onDelete: Cascade)

  @@index([tenantId, supplierId])
}

model SupplierProduct {
  id                  String   @id @default(cuid())
  tenantId            String
  supplierId          String
  productId           String?
  externalSku         String   @db.VarChar(120)
  supplierName        String   @db.VarChar(255)
  purchasePrice       Decimal  @db.Decimal(14, 4)
  mrp                 Decimal? @db.Decimal(14, 4)
  currencyCode        String   @default("USD") @db.VarChar(8)
  leadTimeDays        Int      @default(0)
  minimumOrderQty     Int      @default(1)
  packSize            Int      @default(1)
  isActive            Boolean  @default(true)
  metadata            Json?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  tenant              Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  supplier            Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)
  product             Product? @relation(fields: [productId], references: [id], onDelete: SetNull)

  @@unique([tenantId, supplierId, externalSku])
  @@index([tenantId, supplierId])
  @@index([tenantId, productId])
}

model SupplierPerformanceMetric {
  id           String   @id @default(cuid())
  tenantId     String
  supplierId   String
  metricKey    String   @db.VarChar(120)
  periodStart  DateTime
  periodEnd    DateTime
  value        Decimal  @db.Decimal(18, 4)
  benchmarkValue Decimal? @db.Decimal(18, 4)
  metadata     Json?
  createdAt    DateTime @default(now())

  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  supplier     Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)

  goodsReceiptItems GoodsReceiptNoteItem[]
  inventorySerials InventorySerial[]
  dispatchItems DispatchChallanItem[]
  pickingItems  PickingTaskItem[]
  @@index([tenantId, supplierId, metricKey])
  @@index([tenantId, periodStart, periodEnd])
}

model PurchaseOrder {
  id                 String             @id @default(cuid())
  tenantId           String
  supplierId         String
  poNumber           String             @db.VarChar(120)
  status             PurchaseOrderStatus @default(DRAFT)
  orderDate          DateTime           @default(now())
  expectedDeliveryAt DateTime?
  approvedByUserId   String?
  approvedAt         DateTime?
  sentAt             DateTime?
  acknowledgedAt     DateTime?
  closedAt           DateTime?
  subtotal           Decimal            @db.Decimal(14, 2)
  taxTotal           Decimal            @db.Decimal(14, 2)
  discountTotal      Decimal            @db.Decimal(14, 2)
  grandTotal         Decimal            @db.Decimal(14, 2)
  currencyCode       String             @default("USD") @db.VarChar(8)
  notes              String?
  metadata           Json?
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
  deletedAt          DateTime?

  tenant             Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  supplier           Supplier           @relation(fields: [supplierId], references: [id], onDelete: Restrict)
  approvedBy         User?              @relation("PurchaseOrderApprovedBy", fields: [approvedByUserId], references: [id], onDelete: SetNull)
  items              PurchaseOrderItem[]
  supplierInvoices   SupplierInvoice[]
  goodsReceiptNotes  GoodsReceiptNote[]

  @@unique([tenantId, poNumber])
  @@index([tenantId, status])
  @@index([tenantId, supplierId])
  @@index([tenantId, orderDate])
}

model PurchaseOrderItem {
  id                    String   @id @default(cuid())
  tenantId              String
  purchaseOrderId       String
  productId             String
  variantId             String?
  taxCategoryId         String?
  lineNumber            Int
  itemName              String   @db.VarChar(255)

  quantityOrdered       Int
  quantityReceived      Int      @default(0)
  quantityInvoiced      Int      @default(0)

  unitCost              Decimal  @db.Decimal(14, 4)
  discountAmount        Decimal  @default(0) @db.Decimal(14, 2)
  taxRate               Decimal  @default(0) @db.Decimal(7, 4)

  discrepancyQty        Int      @default(0)
  discrepancyReason     String?

  metadata              Json?

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  tenant                Tenant            @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  purchaseOrder         PurchaseOrder     @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)

  product               Product           @relation(fields: [productId], references: [id], onDelete: Restrict)

  variant               ProductVariant?   @relation(fields: [variantId], references: [id], onDelete: SetNull)

  taxCategory           TaxCategory?      @relation(fields: [taxCategoryId], references: [id], onDelete: SetNull)

  supplierInvoiceItems  SupplierInvoiceItem[]

  goodsReceiptNoteItems GoodsReceiptNoteItem[]

  @@unique([purchaseOrderId, lineNumber])

  @@index([tenantId, productId])

  @@index([tenantId, purchaseOrderId])
}

model SupplierInvoice {
  id                 String              @id @default(cuid())
  tenantId           String
  supplierId         String
  purchaseOrderId    String?
  invoiceNumber      String              @db.VarChar(120)
  supplierReference  String?             @db.VarChar(120)
  status             SupplierInvoiceStatus @default(RECEIVED)
  invoiceDate        DateTime
  dueDate            DateTime?
  subtotal           Decimal             @db.Decimal(14, 2)
  taxTotal           Decimal             @db.Decimal(14, 2)
  discountTotal      Decimal             @db.Decimal(14, 2)
  grandTotal         Decimal             @db.Decimal(14, 2)
  paidTotal          Decimal             @default(0) @db.Decimal(14, 2)
  balanceDue         Decimal             @default(0) @db.Decimal(14, 2)
  matchingStatus     String              @default("pending") @db.VarChar(60)
  discrepancyNotes   String?
  metadata           Json?
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt
  deletedAt          DateTime?

  tenant             Tenant              @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  supplier           Supplier            @relation(fields: [supplierId], references: [id], onDelete: Restrict)
  purchaseOrder      PurchaseOrder?      @relation(fields: [purchaseOrderId], references: [id], onDelete: SetNull)
  items              SupplierInvoiceItem[]
  goodsReceiptNotes  GoodsReceiptNote[]

  @@unique([tenantId, invoiceNumber])
  @@index([tenantId, supplierId])
  @@index([tenantId, status])
  @@index([tenantId, invoiceDate])
}

model SupplierInvoiceItem {
  id                 String   @id @default(cuid())
  tenantId           String
  supplierInvoiceId  String
  purchaseOrderItemId String?
  productId          String
  variantId          String?
  lineNumber         Int
  description        String   @db.VarChar(255)
  quantity           Int
  unitCost           Decimal  @db.Decimal(14, 4)
  taxRate            Decimal  @default(0) @db.Decimal(7, 4)
  amount             Decimal  @db.Decimal(14, 2)
  discrepancyQty    Int      @default(0)
  metadata          Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  supplierInvoice   SupplierInvoice @relation(fields: [supplierInvoiceId], references: [id], onDelete: Cascade)
  purchaseOrderItem PurchaseOrderItem? @relation(fields: [purchaseOrderItemId], references: [id], onDelete: SetNull)
  product           Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant           ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)
  goodsReceiptNoteItems GoodsReceiptNoteItem[]

  @@unique([supplierInvoiceId, lineNumber])
  @@index([tenantId, productId])
}

model GoodsReceiptNote {
  id                 String              @id @default(cuid())
  tenantId           String
  supplierId         String
  purchaseOrderId    String?
  supplierInvoiceId  String?
  dispatchChallanId  String?
  grnNumber          String              @db.VarChar(120)
  status             GoodsReceiptNoteStatus @default(DRAFT)
  receivedAt         DateTime            @default(now())
  verifiedByUserId   String?
  qualityStatus      String              @default("pending") @db.VarChar(60)
  discrepancyNotes   String?
  metadata           Json?
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt
  deletedAt          DateTime?

  tenant             Tenant              @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  supplier           Supplier            @relation(fields: [supplierId], references: [id], onDelete: Restrict)
  purchaseOrder      PurchaseOrder?      @relation(fields: [purchaseOrderId], references: [id], onDelete: SetNull)
  supplierInvoice    SupplierInvoice?    @relation(fields: [supplierInvoiceId], references: [id], onDelete: SetNull)
  dispatchChallan    DispatchChallan?    @relation(fields: [dispatchChallanId], references: [id], onDelete: SetNull)
  verifiedBy         User?               @relation("GoodsReceiptNoteVerifiedBy", fields: [verifiedByUserId], references: [id], onDelete: SetNull)
  items              GoodsReceiptNoteItem[]

  @@unique([tenantId, grnNumber])
  @@index([tenantId, supplierId])
  @@index([tenantId, status])
}

model GoodsReceiptNoteItem {
  id                 String   @id @default(cuid())
  tenantId           String
  goodsReceiptNoteId String
  purchaseOrderItemId String?
  supplierInvoiceItemId String?
  productId          String
  variantId          String?
  lineNumber         Int
  batchNumber        String?  @db.VarChar(120)
  expiryDate         DateTime?
  manufacturedAt     DateTime?
  expectedQty        Int
  receivedQty        Int
  acceptedQty        Int      @default(0)
  rejectedQty        Int      @default(0)
  damagedQty         Int      @default(0)
  qualityStatus      String   @default("pending") @db.VarChar(60)
  storageBinId       String?
  metadata           Json?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  tenant             Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  goodsReceiptNote   GoodsReceiptNote @relation(fields: [goodsReceiptNoteId], references: [id], onDelete: Cascade)
  purchaseOrderItem  PurchaseOrderItem? @relation(fields: [purchaseOrderItemId], references: [id], onDelete: SetNull)
  supplierInvoiceItem SupplierInvoiceItem? @relation(fields: [supplierInvoiceItemId], references: [id], onDelete: SetNull)
  product            Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant            ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)
  storageBin         StorageBin? @relation(fields: [storageBinId], references: [id], onDelete: SetNull)

  @@unique([goodsReceiptNoteId, lineNumber])
  @@index([tenantId, productId])
}

model Inventory {
  id              String   @id @default(cuid())
  tenantId        String
  locationId      String
  productId       String
  variantId       String?
  qtyOnHand       Int      @default(0)
  qtyReserved     Int      @default(0)
  qtyInTransit    Int      @default(0)
  reorderLevel    Int      @default(0)
  reorderQuantity Int      @default(0)
  averageCost     Decimal? @db.Decimal(14, 4)
  valuationMethod String   @default("FIFO") @db.VarChar(32)
  lastMovementAt  DateTime?
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  location        Location @relation(fields: [locationId], references: [id], onDelete: Cascade)
  product         Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant         ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)
  batches         InventoryBatch[]
  serials         InventorySerial[]
  movements       InventoryMovement[]
  reservations    InventoryReservation[]
  snapshots       InventorySnapshot[]
  stockAdjustments StockAdjustment[]

  @@unique([tenantId, locationId, productId, variantId])
  @@index([tenantId, locationId])
  @@index([tenantId, productId])
  @@index([tenantId, variantId])
  @@index([tenantId, updatedAt])
}

model InventoryBatch {
  id              String   @id @default(cuid())
  tenantId        String
  inventoryId     String
  productId       String
  variantId       String?
  batchNumber     String   @db.VarChar(120)
  serialBatchCode String?  @db.VarChar(120)
  manufacturedAt  DateTime?
  expiresAt       DateTime?
  receivedAt      DateTime?
  qtyOnHand       Int      @default(0)
  qtyReserved     Int      @default(0)
  unitCost        Decimal? @db.Decimal(14, 4)
  status          String   @default("active") @db.VarChar(40)
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  inventory       Inventory @relation(fields: [inventoryId], references: [id], onDelete: Cascade)
  product         Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant         ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)
  serials         InventorySerial[]
  movements       InventoryMovement[]
  transferItems   InventoryTransferItem[]

  @@unique([tenantId, inventoryId, batchNumber])
  @@index([tenantId, expiresAt])
  @@index([tenantId, inventoryId])
}

model InventorySerial {
  id              String   @id @default(cuid())
  tenantId        String
  inventoryId     String
  batchId         String?
  productId       String
  variantId       String?
  serialNumber    String   @db.VarChar(160)
  imei            String?  @db.VarChar(40)
  status          String   @default("available") @db.VarChar(40)
  currentLocationId String?
  currentBinId    String?
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  inventory       Inventory @relation(fields: [inventoryId], references: [id], onDelete: Cascade)
  batch           InventoryBatch? @relation(fields: [batchId], references: [id], onDelete: SetNull)
  product         Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant         ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)
  currentLocation Location? @relation(fields: [currentLocationId], references: [id], onDelete: SetNull)
  currentBin      StorageBin? @relation(fields: [currentBinId], references: [id], onDelete: SetNull)
  movements       InventoryMovement[]

  @@unique([tenantId, serialNumber])
  @@index([tenantId, inventoryId])
}

model InventoryMovement {
  id              String              @id @default(cuid())
  tenantId        String
  inventoryId     String?
  batchId         String?
  serialId        String?
  locationId      String
  productId       String
  variantId       String?
  movementNumber  String              @db.VarChar(120)
  movementType    InventoryMovementType
  quantity        Int
  unitCost        Decimal?            @db.Decimal(14, 4)
  sourceType      String?             @db.VarChar(80)
  sourceId        String?             @db.VarChar(120)
  referenceType   String?             @db.VarChar(80)
  referenceId     String?             @db.VarChar(120)
  reasonCode      String?             @db.VarChar(80)
  notes           String?
  occurredAt      DateTime            @default(now())
  isImmutable     Boolean             @default(true)
  metadata        Json?
  createdAt       DateTime            @default(now())

  tenant          Tenant              @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  inventory       Inventory?          @relation(fields: [inventoryId], references: [id], onDelete: SetNull)
  batch           InventoryBatch?     @relation(fields: [batchId], references: [id], onDelete: SetNull)
  serial          InventorySerial?    @relation(fields: [serialId], references: [id], onDelete: SetNull)
  location        Location            @relation(fields: [locationId], references: [id], onDelete: Cascade)
  product         Product             @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant         ProductVariant?     @relation(fields: [variantId], references: [id], onDelete: SetNull)

  @@unique([tenantId, movementNumber])
  @@index([tenantId, locationId, occurredAt])
  @@index([tenantId, productId, occurredAt])
  @@index([tenantId, movementType, occurredAt])
  @@index([tenantId, inventoryId])
}

model InventoryReservation {
  id              String                  @id @default(cuid())
  tenantId        String
  inventoryId     String
  sourceType      String                  @db.VarChar(80)
  sourceId        String                  @db.VarChar(120)
  reservedQty     Int
  releasedQty     Int                     @default(0)
  status          InventoryReservationStatus @default(ACTIVE)
  expiresAt       DateTime?
  notes           String?
  metadata        Json?
  createdAt       DateTime                @default(now())
  updatedAt       DateTime                @updatedAt

  tenant          Tenant                  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  inventory       Inventory               @relation(fields: [inventoryId], references: [id], onDelete: Cascade)

  @@index([tenantId, inventoryId])
  @@index([tenantId, status])
  @@index([tenantId, expiresAt])
  @@unique([tenantId, sourceType, sourceId])
}

model StockAdjustment {
  id              String   @id @default(cuid())
  tenantId        String
  inventoryId     String
  adjustmentNumber String  @db.VarChar(120)
  reasonCode      String   @db.VarChar(80)
  quantityBefore  Int
  quantityAfter   Int
  varianceQty     Int
  status          String   @default("pending") @db.VarChar(40)
  approvedByUserId String?
  approvedAt      DateTime?
  notes           String?
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  inventory       Inventory @relation(fields: [inventoryId], references: [id], onDelete: Cascade)
  approvedBy      User?    @relation("StockAdjustmentApprovedBy", fields: [approvedByUserId], references: [id], onDelete: SetNull)

  @@unique([tenantId, adjustmentNumber])
  @@index([tenantId, inventoryId])
}

model InventoryTransfer {
  id               String               @id @default(cuid())
  tenantId         String
  transferNumber   String               @db.VarChar(120)
  transferRequestId String? @unique
  fromLocationId   String
  toLocationId     String
  status           InventoryTransferStatus @default(DRAFT)
  requestedByUserId String?
  approvedByUserId String?
  pickedByUserId   String?
  dispatchedByUserId String?
  receivedByUserId  String?
  requestedAt      DateTime             @default(now())
  approvedAt       DateTime?
  dispatchedAt     DateTime?
  inTransitAt      DateTime?
  receivedAt       DateTime?
  transportMetadata Json?
  metadata         Json?
  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt
  deletedAt        DateTime?

  tenant           Tenant               @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  fromLocation     Location             @relation("TransferFromLocation", fields: [fromLocationId], references: [id], onDelete: Restrict)
  toLocation       Location             @relation("TransferToLocation", fields: [toLocationId], references: [id], onDelete: Restrict)
  request          TransferRequest?     @relation("TransferRequestInventoryTransfer", fields: [transferRequestId], references: [id], onDelete: SetNull)
  dispatchChallan  DispatchChallan?     @relation("InventoryTransferDispatchChallan")
  items            InventoryTransferItem[]

  @@unique([tenantId, transferNumber])
  @@index([tenantId, fromLocationId])
  @@index([tenantId, toLocationId])
  @@index([tenantId, status])
}

model InventoryTransferItem {
  id               String   @id @default(cuid())
  tenantId         String
  inventoryTransferId String
  transferRequestItemId String?
  productId        String
  variantId        String?
  batchId          String?
  lineNumber       Int
  requestedQty     Int
  pickedQty        Int      @default(0)
  dispatchedQty    Int      @default(0)
  receivedQty      Int      @default(0)
  unitCost         Decimal? @db.Decimal(14, 4)
  metadata         Json?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  tenant           Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  transfer         InventoryTransfer @relation(fields: [inventoryTransferId], references: [id], onDelete: Cascade)
  requestItem      TransferRequestItem? @relation(fields: [transferRequestItemId], references: [id], onDelete: SetNull)
  product          Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant          ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)
  batch            InventoryBatch? @relation(fields: [batchId], references: [id], onDelete: SetNull)

  @@unique([inventoryTransferId, lineNumber])
  @@index([tenantId, productId])
}

model InventorySnapshot {
  id              String   @id @default(cuid())
  tenantId        String
  inventoryId     String
  locationId      String
  productId       String
  variantId       String?
  snapshotAt      DateTime @default(now())
  snapshotDate    DateTime
  granularity     KPIPeriod @default(DAILY)
  qtyOnHand       Int
  qtyReserved     Int
  qtyInTransit    Int
  availableQty    Int
  valuation       Decimal? @db.Decimal(14, 4)
  metadata        Json?
  createdAt       DateTime @default(now())

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  inventory       Inventory @relation(fields: [inventoryId], references: [id], onDelete: Cascade)
  location        Location @relation(fields: [locationId], references: [id], onDelete: Cascade)
  product         Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant         ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)

  @@index([tenantId, snapshotDate])
  @@index([tenantId, locationId])
  @@index([tenantId, productId])
}

model TransferRequest {
  id                String              @id @default(cuid())
  tenantId          String
  requestNumber     String              @db.VarChar(120)
  fromLocationId    String
  toLocationId      String
  requestedByUserId String
  approvedByUserId  String?
  priority          String              @default("normal") @db.VarChar(40)
  status            InventoryTransferStatus @default(REQUESTED)
  reason            String?
  requestedAt       DateTime            @default(now())
  approvedAt        DateTime?
  requiredBy        DateTime?
  metadata          Json?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  deletedAt         DateTime?

  tenant            Tenant              @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  fromLocation      Location            @relation("RequestFromLocation", fields: [fromLocationId], references: [id], onDelete: Restrict)
  toLocation        Location            @relation("RequestToLocation", fields: [toLocationId], references: [id], onDelete: Restrict)
  requestedBy       User                @relation("TransferRequestRequestedBy", fields: [requestedByUserId], references: [id], onDelete: Restrict)
  approvedBy        User?               @relation("TransferRequestApprovedBy", fields: [approvedByUserId], references: [id], onDelete: SetNull)
  items             TransferRequestItem[]
  transfer          InventoryTransfer? @relation("TransferRequestInventoryTransfer")
  pickingTasks      PickingTask[]

  @@unique([tenantId, requestNumber])
  @@index([tenantId, status])
}

model TransferRequestItem {
  id              String   @id @default(cuid())
  tenantId        String
  transferRequestId String
  productId       String
  variantId       String?
  lineNumber      Int
  requestedQty    Int
  approvedQty     Int      @default(0)
  fulfilledQty    Int      @default(0)
  notes           String?
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  request         TransferRequest @relation(fields: [transferRequestId], references: [id], onDelete: Cascade)
  product         Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant         ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)
  transferItems   InventoryTransferItem[]
  pickingItems    PickingTaskItem[]

  @@unique([transferRequestId, lineNumber])
  @@index([tenantId, productId])
}

model DispatchChallan {
  id                String              @id @default(cuid())
  tenantId          String
  challanNumber     String              @db.VarChar(120)
  inventoryTransferId String? @unique
  originLocationId  String
  destinationLocationId String
  status            DispatchChallanStatus @default(PREPARED)
  transportMode     String?             @db.VarChar(80)
  transporterName   String?             @db.VarChar(180)
  vehicleNumber     String?             @db.VarChar(80)
  driverName        String?             @db.VarChar(180)
  driverPhone       String?             @db.VarChar(32)
  lrNumber          String?             @db.VarChar(120)
  dispatchedAt      DateTime?
  deliveredAt       DateTime?
  metadata          Json?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  deletedAt         DateTime?

  tenant            Tenant              @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  transfer          InventoryTransfer?   @relation("InventoryTransferDispatchChallan", fields: [inventoryTransferId], references: [id], onDelete: SetNull)
  originLocation    Location            @relation("DCOriginLocation", fields: [originLocationId], references: [id], onDelete: Restrict)
  destinationLocation Location          @relation("DCDestinationLocation", fields: [destinationLocationId], references: [id], onDelete: Restrict)
  items             DispatchChallanItem[]
  grns              GoodsReceiptNote[]

  @@unique([tenantId, challanNumber])
  @@index([tenantId, originLocationId])
  @@index([tenantId, destinationLocationId])
  @@index([tenantId, status])
}

model DispatchChallanItem {
  id                String   @id @default(cuid())
  tenantId          String
  dispatchChallanId String
  inventoryTransferItemId String?
  productId         String
  variantId         String?
  lineNumber        Int
  requestedQty      Int
  packedQty         Int      @default(0)
  dispatchedQty     Int      @default(0)
  batchNumber       String?  @db.VarChar(120)
  serialNumbers     Json?
  storageBinId      String?
  metadata          Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  dispatchChallan   DispatchChallan @relation(fields: [dispatchChallanId], references: [id], onDelete: Cascade)
  transferItem      InventoryTransferItem? @relation(fields: [inventoryTransferItemId], references: [id], onDelete: SetNull)
  product           Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant           ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)
  storageBin        StorageBin? @relation(fields: [storageBinId], references: [id], onDelete: SetNull)

  @@unique([dispatchChallanId, lineNumber])
  @@index([tenantId, productId])
}

model PickingTask {
  id                String           @id @default(cuid())
  tenantId          String
  taskNumber        String           @db.VarChar(120)
  transferRequestId String?
  dispatchChallanId String?
  assignedToUserId  String?
  zoneId            String?
  binId             String?
  status            PickingTaskStatus @default(PENDING)
  priority          String           @default("normal") @db.VarChar(40)
  startedAt         DateTime?
  completedAt       DateTime?
  instructions      String?
  metadata          Json?
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt

  tenant            Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  request           TransferRequest? @relation(fields: [transferRequestId], references: [id], onDelete: SetNull)
  challan           DispatchChallan? @relation(fields: [dispatchChallanId], references: [id], onDelete: SetNull)
  assignedTo        User?            @relation(fields: [assignedToUserId], references: [id], onDelete: SetNull)
  zone              LocationZone?    @relation(fields: [zoneId], references: [id], onDelete: SetNull)
  bin               StorageBin?      @relation(fields: [binId], references: [id], onDelete: SetNull)
  items             PickingTaskItem[]

  @@unique([tenantId, taskNumber])
  @@index([tenantId, status])
}

model PickingTaskItem {
  id              String   @id @default(cuid())
  tenantId        String
  pickingTaskId   String
  transferRequestItemId String?
  productId       String
  variantId       String?
  lineNumber      Int
  quantityRequired Int
  quantityPicked  Int      @default(0)
  storageBinId    String?
  batchId         String?
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  task            PickingTask @relation(fields: [pickingTaskId], references: [id], onDelete: Cascade)
  requestItem     TransferRequestItem? @relation(fields: [transferRequestItemId], references: [id], onDelete: SetNull)
  product         Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant         ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)
  storageBin      StorageBin? @relation(fields: [storageBinId], references: [id], onDelete: SetNull)
  batch           InventoryBatch? @relation(fields: [batchId], references: [id], onDelete: SetNull)

  @@unique([pickingTaskId, lineNumber])
  @@index([tenantId, productId])
}

model POSSession {
  id                String          @id @default(cuid())
  tenantId          String
  locationId        String
  openedByUserId    String
  sessionNumber     String          @db.VarChar(120)
  status            POSSessionStatus @default(OPEN)
  openedAt          DateTime        @default(now())
  closedAt          DateTime?
  cashDrawerOpenAmount Decimal?      @db.Decimal(14, 2)
  cashDrawerClosingAmount Decimal?   @db.Decimal(14, 2)
  offlineMode       Boolean         @default(false)
  deviceInfo        Json?
  syncState         Json?
  metadata          Json?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  tenant            Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  location          Location        @relation(fields: [locationId], references: [id], onDelete: Restrict)
  openedBy          User            @relation(fields: [openedByUserId], references: [id], onDelete: Restrict)
  carts             Cart[]
  sales             Sale[]

  @@unique([tenantId, sessionNumber])
  @@index([tenantId, locationId, status])
}

model Cart {
  id                String       @id @default(cuid())
  tenantId          String
  posSessionId      String
  customerId        String?
  cartNumber        String       @db.VarChar(120)
  status            CartStatus   @default(ACTIVE)
  subtotal          Decimal      @default(0) @db.Decimal(14, 2)
  discountTotal     Decimal      @default(0) @db.Decimal(14, 2)
  taxTotal          Decimal      @default(0) @db.Decimal(14, 2)
  grandTotal        Decimal      @default(0) @db.Decimal(14, 2)
  currencyCode      String       @default("USD") @db.VarChar(8)
  clientMutationId  String?      @db.VarChar(120)
  metadata          Json?
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  tenant            Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  session           POSSession   @relation(fields: [posSessionId], references: [id], onDelete: Cascade)
  customer          Customer?    @relation(fields: [customerId], references: [id], onDelete: SetNull)
  items             CartItem[]

  @@unique([tenantId, cartNumber])
  @@index([tenantId, posSessionId])
  @@index([tenantId, status])
}

model CartItem {
  id               String   @id @default(cuid())
  tenantId         String
  cartId           String
  productId        String
  variantId        String?
  lineNumber       Int
  quantity         Int
  unitPrice        Decimal  @db.Decimal(14, 4)
  discountAmount   Decimal  @default(0) @db.Decimal(14, 2)
  taxRate          Decimal  @default(0) @db.Decimal(7, 4)
  metadata         Json?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  tenant           Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  cart             Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product          Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant          ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)

  @@unique([cartId, lineNumber])
  @@index([tenantId, productId])
}

model Customer {
  id               String   @id @default(cuid())
  tenantId         String
  customerCode     String   @db.VarChar(120)
  customerType     String   @default("B2C") @db.VarChar(20)
  fullName         String   @db.VarChar(180)
  phone            String?  @db.VarChar(32)
  email            String?  @db.VarChar(255)
  gstin            String?  @db.VarChar(40)
  loyaltyNumber    String?  @db.VarChar(120)
  creditLimit      Decimal? @db.Decimal(14, 2)
  addressLine1     String?  @db.VarChar(255)
  addressLine2     String?  @db.VarChar(255)
  city             String?  @db.VarChar(120)
  state            String?  @db.VarChar(120)
  postalCode       String?  @db.VarChar(40)
  country          String?  @db.VarChar(120)
  metadata         Json?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  deletedAt        DateTime?

  tenant           Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  carts            Cart[]
  sales            Sale[]
  returns          Return[]
  invoices         Invoice[]

  @@unique([tenantId, customerCode])
  @@index([tenantId, phone])
  @@index([tenantId, email])
}

model Sale {
  id               String      @id @default(cuid())
  tenantId         String
  posSessionId     String
  locationId       String
  customerId       String?
  sourceCartId     String?
  saleNumber       String      @db.VarChar(120)
  status           SaleStatus  @default(OPEN)
  saleDate         DateTime    @default(now())
  subtotal         Decimal     @db.Decimal(14, 2)
  discountTotal    Decimal     @default(0) @db.Decimal(14, 2)
  taxTotal         Decimal     @default(0) @db.Decimal(14, 2)
  grandTotal       Decimal     @db.Decimal(14, 2)
  roundingAdjustment Decimal   @default(0) @db.Decimal(14, 2)
  syncStatus       String      @default("pending") @db.VarChar(40)
  metadata         Json?
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
  deletedAt        DateTime?

  tenant           Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  session          POSSession  @relation(fields: [posSessionId], references: [id], onDelete: Restrict)
  location         Location    @relation(fields: [locationId], references: [id], onDelete: Restrict)
  customer         Customer?   @relation(fields: [customerId], references: [id], onDelete: SetNull)
  sourceCart       Cart?       @relation(fields: [sourceCartId], references: [id], onDelete: SetNull)
  items            SaleItem[]
  invoice          Invoice?
  payments         Payment[]
  refunds          Refund[]
  returns          Return[]

  @@unique([tenantId, saleNumber])
  @@index([tenantId, locationId, saleDate])
  @@index([tenantId, status])
}

model SaleItem {
  id               String   @id @default(cuid())
  tenantId         String
  saleId           String
  productId        String
  variantId        String?
  lineNumber       Int
  quantity         Int
  unitPrice        Decimal  @db.Decimal(14, 4)
  discountAmount   Decimal  @default(0) @db.Decimal(14, 2)
  taxRate          Decimal  @default(0) @db.Decimal(7, 4)
  taxAmount        Decimal  @default(0) @db.Decimal(14, 2)
  lineTotal        Decimal  @db.Decimal(14, 2)
  inventoryMovementId String?
  metadata         Json?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  tenant           Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  sale             Sale     @relation(fields: [saleId], references: [id], onDelete: Cascade)
  product          Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant          ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)
  inventoryMovement InventoryMovement? @relation(fields: [inventoryMovementId], references: [id], onDelete: SetNull)

  @@unique([saleId, lineNumber])
  @@index([tenantId, productId])
}

model Invoice {
  id               String        @id @default(cuid())
  tenantId         String
  saleId           String        @unique
  customerId       String?
  invoiceNumber    String        @db.VarChar(120)
  invoiceStatus    InvoiceStatus @default(DRAFT)
  billingType      String        @default("B2C") @db.VarChar(20)
  gstTreatment     String        @default("tax_invoice") @db.VarChar(40)
  placeOfSupply    String?       @db.VarChar(120)
  invoiceDate      DateTime      @default(now())
  dueDate          DateTime?
  subtotal         Decimal       @db.Decimal(14, 2)
  discountTotal    Decimal       @default(0) @db.Decimal(14, 2)
  taxTotal         Decimal       @default(0) @db.Decimal(14, 2)
  grandTotal       Decimal       @db.Decimal(14, 2)
  balanceDue       Decimal       @default(0) @db.Decimal(14, 2)
  taxBreakdown     Json?
  qrCodeData       Json?
  irn              String?       @db.VarChar(120)
  metadata         Json?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  tenant           Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  sale             Sale          @relation(fields: [saleId], references: [id], onDelete: Cascade)
  customer         Customer?     @relation(fields: [customerId], references: [id], onDelete: SetNull)

  @@unique([tenantId, invoiceNumber])
  @@index([tenantId, invoiceDate])
  @@index([tenantId, billingType])
}

model Payment {
  id               String         @id @default(cuid())
  tenantId         String
  saleId           String
  paymentNumber    String         @db.VarChar(120)
  method           PaymentMethod
  status           PaymentStatus  @default(PENDING)
  amount           Decimal        @db.Decimal(14, 2)
  currencyCode     String         @default("USD") @db.VarChar(8)
  referenceNumber  String?        @db.VarChar(120)
  gatewayResponse  Json?
  splitGroupId     String?        @db.VarChar(120)
  paidAt           DateTime?
  metadata         Json?
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  tenant           Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  sale             Sale           @relation(fields: [saleId], references: [id], onDelete: Cascade)
  refunds          Refund[]

  @@unique([tenantId, paymentNumber])
  @@index([tenantId, saleId])
  @@index([tenantId, status])
}

model Refund {
  id               String        @id @default(cuid())
  tenantId         String
  saleId           String
  paymentId        String?
  refundNumber     String        @db.VarChar(120)
  status           RefundStatus  @default(REQUESTED)
  method           PaymentMethod
  amount           Decimal       @db.Decimal(14, 2)
  reason           String?
  gatewayResponse  Json?
  refundedAt       DateTime?
  metadata         Json?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  tenant           Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  sale             Sale          @relation(fields: [saleId], references: [id], onDelete: Cascade)
  payment          Payment?      @relation(fields: [paymentId], references: [id], onDelete: SetNull)

  @@unique([tenantId, refundNumber])
  @@index([tenantId, saleId])
}

model Return {
  id               String       @id @default(cuid())
  tenantId         String
  saleId           String
  invoiceId        String?
  returnNumber     String       @db.VarChar(120)
  status           ReturnStatus @default(REQUESTED)
  reason           String?
  restockStatus    String       @default("pending") @db.VarChar(40)
  refundAmount     Decimal      @default(0) @db.Decimal(14, 2)
  receivedAt       DateTime?
  metadata         Json?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  tenant           Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  sale             Sale         @relation(fields: [saleId], references: [id], onDelete: Cascade)
  invoice          Invoice?     @relation(fields: [invoiceId], references: [id], onDelete: SetNull)
  items            ReturnItem[]

  @@unique([tenantId, returnNumber])
  @@index([tenantId, saleId])
}

model ReturnItem {
  id              String   @id @default(cuid())
  tenantId        String
  returnId        String
  saleItemId      String?
  productId       String
  variantId       String?
  lineNumber      Int
  quantity        Int
  unitPrice       Decimal  @db.Decimal(14, 4)
  taxAmount       Decimal  @default(0) @db.Decimal(14, 2)
  restockQty      Int      @default(0)
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  returnDoc       Return   @relation(fields: [returnId], references: [id], onDelete: Cascade)
  saleItem        SaleItem? @relation(fields: [saleItemId], references: [id], onDelete: SetNull)
  product         Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  variant         ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)

  @@unique([returnId, lineNumber])
  @@index([tenantId, productId])
}

model DashboardSnapshot {
  id              String   @id @default(cuid())
  tenantId        String
  snapshotDate    DateTime
  snapshotType    String   @db.VarChar(80)
  revenue         Decimal  @default(0) @db.Decimal(18, 2)
  grossMargin     Decimal  @default(0) @db.Decimal(18, 2)
  inventoryValue  Decimal  @default(0) @db.Decimal(18, 2)
  salesCount      Int      @default(0)
  ordersCount     Int      @default(0)
  alertsCount     Int      @default(0)
  metrics         Json?
  dimensions      Json?
  createdAt       DateTime @default(now())

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, snapshotDate, snapshotType])
  @@index([tenantId, snapshotDate])
}

model ReportDefinition {
  id              String   @id @default(cuid())
  tenantId        String
  code            String   @db.VarChar(120)
  name            String   @db.VarChar(180)
  module          String   @db.VarChar(120)
  description     String?
  queryConfig     Json?
  columns         Json?
  defaultFilters  Json?
  isSystem        Boolean  @default(false)
  createdByUserId String?
  version         Int      @default(1)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  createdBy       User?    @relation(fields: [createdByUserId], references: [id], onDelete: SetNull)
  savedReports    SavedReport[]

  @@unique([tenantId, code])
  @@index([tenantId, module])
}

model SavedReport {
  id               String   @id @default(cuid())
  tenantId         String
  reportDefinitionId String
  userId           String
  name             String   @db.VarChar(180)
  scheduleCron     String?  @db.VarChar(120)
  filters          Json?
  shareScope       String   @default("private") @db.VarChar(40)
  lastRunAt        DateTime?
  metadata         Json?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  tenant           Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  reportDefinition ReportDefinition @relation(fields: [reportDefinitionId], references: [id], onDelete: Cascade)
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([tenantId, userId])
}

model KPIRecord {
  id              String    @id @default(cuid())
  tenantId        String
  kpiKey          String    @db.VarChar(120)
  period          KPIPeriod @default(DAILY)
  periodStart     DateTime
  periodEnd       DateTime
  numericValue    Decimal   @db.Decimal(18, 4)
  targetValue     Decimal?  @db.Decimal(18, 4)
  varianceValue   Decimal?  @db.Decimal(18, 4)
  dimensions      Json?
  source          String?   @db.VarChar(80)
  createdAt       DateTime  @default(now())

  tenant          Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId, kpiKey, periodStart])
}

model ForecastModel {
  id                String             @id @default(cuid())
  tenantId          String
  modelKey          String             @db.VarChar(120)
  name              String             @db.VarChar(180)
  modelType         String             @db.VarChar(120)
  version           String             @db.VarChar(60)
  status            ForecastModelStatus @default(DRAFT)
  trainedAt         DateTime?
  trainingWindowStart DateTime?
  trainingWindowEnd DateTime?
  features          Json?
  metrics           Json?
  artifactUri       String?            @db.VarChar(500)
  isActive          Boolean            @default(false)
  metadata          Json?
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  tenant            Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  forecasts         ForecastRecord[]
  recommendations   AIRecommendation[]
  anomalies         AnomalyRecord[]

  @@unique([tenantId, modelKey, version])
  @@index([tenantId, status])
}

model ForecastRecord {
  id                String   @id @default(cuid())
  tenantId          String
  forecastModelId   String
  entityType        String   @db.VarChar(120)
  entityId          String   @db.VarChar(120)
  forecastDate      DateTime
  horizonDays       Int
  predictedValue    Decimal  @db.Decimal(18, 4)
  lowerBound        Decimal? @db.Decimal(18, 4)
  upperBound        Decimal? @db.Decimal(18, 4)
  confidence        Float
  actualValue       Decimal? @db.Decimal(18, 4)
  errorScore        Decimal? @db.Decimal(18, 4)
  dimensions        Json?
  generatedAt       DateTime @default(now())

  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  model             ForecastModel @relation(fields: [forecastModelId], references: [id], onDelete: Cascade)

  @@index([tenantId, entityType, entityId])
  @@index([tenantId, forecastDate])
}

model AIRecommendation {
  id                String              @id @default(cuid())
  tenantId          String
  forecastModelId   String?
  recommendationType String              @db.VarChar(120)
  priority          String              @default("normal") @db.VarChar(40)
  entityType        String              @db.VarChar(120)
  entityId          String              @db.VarChar(120)
  title             String              @db.VarChar(255)
  description       String?
  actionPayload     Json?
  confidence        Float
  status            RecommendationStatus @default(OPEN)
  dueAt             DateTime?
  resolvedAt        DateTime?
  metadata          Json?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt

  tenant            Tenant              @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  model             ForecastModel?      @relation(fields: [forecastModelId], references: [id], onDelete: SetNull)

  @@index([tenantId, entityType, entityId])
  @@index([tenantId, status])
}

model AlertRule {
  id                String        @id @default(cuid())
  tenantId          String
  name              String        @db.VarChar(180)
  module            String        @db.VarChar(120)
  severity          AlertSeverity  @default(INFO)
  condition         Json?
  scheduleCron      String?       @db.VarChar(120)
  isActive          Boolean       @default(true)
  channelTargets    Json?
  createdByUserId   String?
  metadata          Json?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  tenant            Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  createdBy         User?         @relation(fields: [createdByUserId], references: [id], onDelete: SetNull)
  alerts            Alert[]

  @@index([tenantId, module])
}

model Alert {
  id                String        @id @default(cuid())
  tenantId          String
  alertRuleId       String?
  severity          AlertSeverity @default(INFO)
  status            AlertStatus   @default(OPEN)
  entityType        String        @db.VarChar(120)
  entityId          String        @db.VarChar(120)
  title             String        @db.VarChar(255)
  message           String
  triggeredAt       DateTime      @default(now())
  acknowledgedAt    DateTime?
  resolvedAt        DateTime?
  metadata          Json?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  tenant            Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  rule              AlertRule?    @relation(fields: [alertRuleId], references: [id], onDelete: SetNull)

  @@index([tenantId, status])
  @@index([tenantId, severity])
  @@index([tenantId, entityType, entityId])
}

model AnomalyRecord {
  id                String       @id @default(cuid())
  tenantId          String
  forecastModelId   String?
  anomalyType       String       @db.VarChar(120)
  entityType        String       @db.VarChar(120)
  entityId          String       @db.VarChar(120)
  score             Float
  baselineValue     Decimal?     @db.Decimal(18, 4)
  observedValue     Decimal?     @db.Decimal(18, 4)
  explanation       String?
  status            AnomalyStatus @default(OPEN)
  detectedAt        DateTime     @default(now())
  resolvedAt        DateTime?
  metadata          Json?
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  tenant            Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  model             ForecastModel? @relation(fields: [forecastModelId], references: [id], onDelete: SetNull)

  @@index([tenantId, entityType, entityId])
  @@index([tenantId, status])
}

model NotificationPreference {
  id                String   @id @default(cuid())
  tenantId          String
  userId            String   @unique
  emailEnabled      Boolean  @default(true)
  smsEnabled        Boolean  @default(false)
  whatsappEnabled   Boolean  @default(false)
  inAppEnabled      Boolean  @default(true)
  quietHoursStart   String?  @db.VarChar(16)
  quietHoursEnd     String?  @db.VarChar(16)
  digestFrequency   String   @default("instant") @db.VarChar(40)
  metadata          Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Notification {
  id                String              @id @default(cuid())
  tenantId          String
  recipientUserId   String?
  channel           NotificationChannel
  status            NotificationStatus  @default(QUEUED)
  title             String              @db.VarChar(255)
  body              String
  templateKey       String?             @db.VarChar(120)
  payload           Json?
  sentAt            DateTime?
  deliveredAt       DateTime?
  readAt            DateTime?
  metadata          Json?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt

  tenant            Tenant              @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  recipientUser     User?               @relation(fields: [recipientUserId], references: [id], onDelete: SetNull)

  @@index([tenantId, recipientUserId])
  @@index([tenantId, status])
}

model EmailLog {
  id                String   @id @default(cuid())
  tenantId          String
  notificationId    String?
  recipientEmail    String   @db.VarChar(255)
  provider          String   @db.VarChar(80)
  providerMessageId String?  @db.VarChar(120)
  subject           String   @db.VarChar(255)
  status            String   @default("queued") @db.VarChar(40)
  payload           Json?
  errorMessage      String?
  sentAt            DateTime?
  createdAt         DateTime @default(now())

  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  notification      Notification? @relation(fields: [notificationId], references: [id], onDelete: SetNull)

  @@index([tenantId, providerMessageId])
}

model SMSLog {
  id                String   @id @default(cuid())
  tenantId          String
  notificationId    String?
  recipientPhone    String   @db.VarChar(32)
  provider          String   @db.VarChar(80)
  providerMessageId String?  @db.VarChar(120)
  status            String   @default("queued") @db.VarChar(40)
  payload           Json?
  errorMessage      String?
  sentAt            DateTime?
  createdAt         DateTime @default(now())

  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  notification      Notification? @relation(fields: [notificationId], references: [id], onDelete: SetNull)

  @@index([tenantId, providerMessageId])
}

model ComplianceDocument {
  id                String               @id @default(cuid())
  tenantId          String
  documentType      ComplianceDocumentType
  documentNumber    String               @db.VarChar(120)
  issuingAuthority  String?              @db.VarChar(180)
  status            ComplianceStatus     @default(ACTIVE)
  issuedAt          DateTime?
  expiresAt         DateTime?
  relatedEntityType String?              @db.VarChar(120)
  relatedEntityId   String?              @db.VarChar(120)
  fileAttachmentId  String?
  metadata          Json?
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt

  tenant            Tenant               @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  attachment        FileAttachment?      @relation(fields: [fileAttachmentId], references: [id], onDelete: SetNull)

  @@index([tenantId, documentType])
  @@index([tenantId, expiresAt])
}

model FileAttachment {
  id                String   @id @default(cuid())
  tenantId          String
  ownerType         String   @db.VarChar(120)
  ownerId           String   @db.VarChar(120)
  fileName          String   @db.VarChar(255)
  mimeType          String   @db.VarChar(120)
  storageProvider   String   @db.VarChar(80)
  storageKey        String   @db.VarChar(255)
  checksum          String?  @db.VarChar(255)
  sizeBytes         Int?
  uploadedByUserId  String?
  uploadedAt        DateTime @default(now())
  metadata          Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  uploadedBy        User?    @relation(fields: [uploadedByUserId], references: [id], onDelete: SetNull)
  complianceDocuments ComplianceDocument[]

  @@index([tenantId, ownerType, ownerId])
  @@index([tenantId, uploadedAt])
}
