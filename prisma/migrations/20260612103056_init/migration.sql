-- CreateEnum
CREATE TYPE "OperationalModel" AS ENUM ('CENTRALIZED_WAREHOUSE', 'DIRECT_STORE', 'EXTERNAL_WAREHOUSE', 'HYBRID');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('STARTER', 'GROWTH', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "RoleKey" AS ENUM ('SUPER_ADMIN', 'BUSINESS_OWNER', 'OPS_MANAGER', 'WAREHOUSE_MANAGER', 'STORE_MANAGER', 'CASHIER', 'SUPPLIER_PORTAL_USER');

-- CreateEnum
CREATE TYPE "PermissionKey" AS ENUM ('TENANT_ADMIN', 'USER_MANAGEMENT', 'PRODUCT_MANAGEMENT', 'SUPPLIER_MANAGEMENT', 'PROCUREMENT_MANAGEMENT', 'INVENTORY_READ', 'INVENTORY_WRITE', 'WAREHOUSE_MANAGEMENT', 'POS_SALES', 'ANALYTICS_READ', 'AI_READ', 'AUDIT_READ', 'SETTINGS_MANAGE');

-- CreateEnum
CREATE TYPE "UserScope" AS ENUM ('INTERNAL', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INVITED', 'DISABLED', 'LOCKED');

-- CreateEnum
CREATE TYPE "MfaMethod" AS ENUM ('TOTP', 'SMS', 'EMAIL', 'WEBAUTHN', 'BACKUP_CODES');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('STORE', 'WAREHOUSE', 'EXTERNAL_WAREHOUSE', 'TRANSIT', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "LocationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'CLOSED');

-- CreateEnum
CREATE TYPE "WarehouseType" AS ENUM ('CENTRAL', 'REGIONAL', 'SATELLITE', 'COLD_STORAGE', 'CROSS_DOCK', 'EXTERNAL_3PL');

-- CreateEnum
CREATE TYPE "ZoneStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "BinStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'FULL', 'EMPTY', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "ProductTrackingMode" AS ENUM ('NONE', 'BATCH', 'SERIAL', 'BATCH_AND_SERIAL');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BarcodeSymbology" AS ENUM ('EAN8', 'EAN13', 'UPCA', 'UPCE', 'CODE128', 'CODE39', 'QR', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SupplierStatus" AS ENUM ('ACTIVE', 'PAUSED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('PRIMARY', 'BILLING', 'SALES', 'OPERATIONS', 'SUPPORT');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('REGISTERED', 'BILLING', 'SHIPPING', 'WAREHOUSE', 'OTHER');

-- CreateEnum
CREATE TYPE "TaxJurisdiction" AS ENUM ('GST', 'VAT', 'HST', 'SALES_TAX', 'EXCISE');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT', 'ACKNOWLEDGED', 'PARTIALLY_RECEIVED', 'FULLY_RECEIVED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SupplierInvoiceStatus" AS ENUM ('RECEIVED', 'MATCHED', 'DISCREPANCY', 'APPROVED', 'POSTED', 'PAID', 'VOIDED');

-- CreateEnum
CREATE TYPE "GoodsReceiptNoteStatus" AS ENUM ('DRAFT', 'PARTIAL', 'CONFIRMED', 'DISCREPANCY', 'REJECTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('INWARD', 'OUTWARD', 'SALE', 'RETURN', 'ADJUSTMENT', 'TRANSFER', 'WRITEOFF', 'DISPATCH', 'GRN');

-- CreateEnum
CREATE TYPE "InventoryReservationStatus" AS ENUM ('ACTIVE', 'RELEASED', 'CONSUMED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InventoryTransferStatus" AS ENUM ('DRAFT', 'REQUESTED', 'APPROVED', 'PICKING', 'DISPATCHED', 'IN_TRANSIT', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DispatchChallanStatus" AS ENUM ('PREPARED', 'IN_TRANSIT', 'DELIVERED', 'PARTIALLY_DELIVERED', 'EXCEPTION', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PickingTaskStatus" AS ENUM ('PENDING', 'ASSIGNED', 'PICKING', 'STAGED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "POSSessionStatus" AS ENUM ('OPEN', 'PAUSED', 'CLOSED', 'SYNC_PENDING');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CHECKED_OUT', 'ABANDONED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('OPEN', 'COMPLETED', 'VOIDED', 'RETURNED', 'PARTIALLY_RETURNED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'VOIDED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'UPI', 'WALLET', 'BANK_TRANSFER', 'CREDIT', 'SPLIT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PARTIAL_REFUND', 'VOIDED');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('REQUESTED', 'APPROVED', 'PROCESSED', 'REJECTED', 'VOIDED');

-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('REQUESTED', 'RECEIVED', 'APPROVED', 'REJECTED', 'RESTOCKED', 'REFUNDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'SMS', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED');

-- CreateEnum
CREATE TYPE "ComplianceDocumentType" AS ENUM ('GST_REGISTRATION', 'DRUG_LICENSE', 'FSSAI_LICENSE', 'FIRE_SAFETY', 'BUSINESS_LICENSE', 'TAX_CERTIFICATE', 'INSURANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'PENDING_REVIEW');

-- CreateEnum
CREATE TYPE "KPIPeriod" AS ENUM ('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "ForecastModelStatus" AS ENUM ('DRAFT', 'TRAINING', 'ACTIVE', 'RETIRED', 'FAILED');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'APPLIED', 'DISMISSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AnomalyStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'FALSE_POSITIVE', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ActivitySource" AS ENUM ('UI', 'API', 'SYSTEM', 'WEBHOOK', 'IMPORT');

-- CreateTable
CREATE TABLE "AIRecommendation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "forecastModelId" TEXT,
    "recommendationType" VARCHAR(120) NOT NULL,
    "priority" VARCHAR(40) NOT NULL DEFAULT 'normal',
    "entityType" VARCHAR(120) NOT NULL,
    "entityId" VARCHAR(120) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "actionPayload" JSONB,
    "confidence" DOUBLE PRECISION NOT NULL,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'OPEN',
    "dueAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertRule" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "module" VARCHAR(120) NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "condition" JSONB,
    "scheduleCron" VARCHAR(120),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "channelTargets" JSONB,
    "createdByUserId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlertRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "alertRuleId" TEXT,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "status" "AlertStatus" NOT NULL DEFAULT 'OPEN',
    "entityType" VARCHAR(120) NOT NULL,
    "entityId" VARCHAR(120) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnomalyRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "forecastModelId" TEXT,
    "anomalyType" VARCHAR(120) NOT NULL,
    "entityType" VARCHAR(120) NOT NULL,
    "entityId" VARCHAR(120) NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "baselineValue" DECIMAL(18,4),
    "observedValue" DECIMAL(18,4),
    "explanation" TEXT,
    "status" "AnomalyStatus" NOT NULL DEFAULT 'OPEN',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnomalyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForecastModel" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "modelKey" VARCHAR(120) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "modelType" VARCHAR(120) NOT NULL,
    "version" VARCHAR(60) NOT NULL,
    "status" "ForecastModelStatus" NOT NULL DEFAULT 'DRAFT',
    "trainedAt" TIMESTAMP(3),
    "trainingWindowStart" TIMESTAMP(3),
    "trainingWindowEnd" TIMESTAMP(3),
    "features" JSONB,
    "metrics" JSONB,
    "artifactUri" VARCHAR(500),
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForecastModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForecastRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "forecastModelId" TEXT NOT NULL,
    "entityType" VARCHAR(120) NOT NULL,
    "entityId" VARCHAR(120) NOT NULL,
    "forecastDate" TIMESTAMP(3) NOT NULL,
    "horizonDays" INTEGER NOT NULL,
    "predictedValue" DECIMAL(18,4) NOT NULL,
    "lowerBound" DECIMAL(18,4),
    "upperBound" DECIMAL(18,4),
    "confidence" DOUBLE PRECISION NOT NULL,
    "actualValue" DECIMAL(18,4),
    "errorScore" DECIMAL(18,4),
    "dimensions" JSONB,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForecastRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KPIRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "kpiKey" VARCHAR(120) NOT NULL,
    "period" "KPIPeriod" NOT NULL DEFAULT 'DAILY',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "numericValue" DECIMAL(18,4) NOT NULL,
    "targetValue" DECIMAL(18,4),
    "varianceValue" DECIMAL(18,4),
    "dimensions" JSONB,
    "source" VARCHAR(80),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KPIRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportDefinition" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" VARCHAR(120) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "module" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "queryConfig" JSONB,
    "columns" JSONB,
    "defaultFilters" JSONB,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedReport" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "reportDefinitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "scheduleCron" VARCHAR(120),
    "filters" JSONB,
    "shareScope" VARCHAR(40) NOT NULL DEFAULT 'private',
    "lastRunAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductBarcode" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "barcode" VARCHAR(120) NOT NULL,
    "symbology" "BarcodeSymbology" NOT NULL DEFAULT 'EAN13',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "barcodeMeta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductBarcode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "parentCategoryId" TEXT,
    "code" VARCHAR(80) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "storageKey" VARCHAR(255) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSubCategory" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSupplier" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "supplierSku" VARCHAR(120),
    "preferred" BOOLEAN NOT NULL DEFAULT false,
    "leadTimeDays" INTEGER NOT NULL DEFAULT 0,
    "minimumOrderQty" INTEGER NOT NULL DEFAULT 1,
    "lastPurchasePrice" DECIMAL(14,4),
    "currencyCode" VARCHAR(8) NOT NULL DEFAULT 'USD',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSupplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantCode" VARCHAR(120) NOT NULL,
    "sku" VARCHAR(120) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "trackingMode" "ProductTrackingMode" NOT NULL DEFAULT 'NONE',
    "attributes" JSONB,
    "metadata" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subCategoryId" TEXT,
    "taxCategoryId" TEXT,
    "sku" VARCHAR(120) NOT NULL,
    "productCode" VARCHAR(120),
    "name" VARCHAR(255) NOT NULL,
    "shortName" VARCHAR(120),
    "brand" VARCHAR(180),
    "description" TEXT,
    "trackingMode" "ProductTrackingMode" NOT NULL DEFAULT 'NONE',
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "unitOfMeasure" VARCHAR(40) NOT NULL,
    "baseUom" VARCHAR(40),
    "reorderLevel" INTEGER NOT NULL DEFAULT 0,
    "reorderQuantity" INTEGER NOT NULL DEFAULT 0,
    "minimumOrderQty" INTEGER NOT NULL DEFAULT 1,
    "shelfLifeDays" INTEGER,
    "industry" VARCHAR(80) NOT NULL,
    "metadata" JSONB,
    "attributes" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierProduct" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "productId" TEXT,
    "externalSku" VARCHAR(120) NOT NULL,
    "supplierName" VARCHAR(255) NOT NULL,
    "purchasePrice" DECIMAL(14,4) NOT NULL,
    "mrp" DECIMAL(14,4),
    "currencyCode" VARCHAR(8) NOT NULL DEFAULT 'USD',
    "leadTimeDays" INTEGER NOT NULL DEFAULT 0,
    "minimumOrderQty" INTEGER NOT NULL DEFAULT 1,
    "packSize" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxCategory" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "jurisdiction" "TaxJurisdiction" NOT NULL DEFAULT 'GST',
    "rate" DECIMAL(7,4) NOT NULL,
    "isInclusive" BOOLEAN NOT NULL DEFAULT false,
    "breakdown" JSONB,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "notificationId" TEXT,
    "recipientEmail" VARCHAR(255) NOT NULL,
    "provider" VARCHAR(80) NOT NULL,
    "providerMessageId" VARCHAR(120),
    "subject" VARCHAR(255) NOT NULL,
    "status" VARCHAR(40) NOT NULL DEFAULT 'queued',
    "payload" JSONB,
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "recipientUserId" TEXT,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'QUEUED',
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "templateKey" VARCHAR(120),
    "payload" JSONB,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMSLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "notificationId" TEXT,
    "recipientPhone" VARCHAR(32) NOT NULL,
    "provider" VARCHAR(80) NOT NULL,
    "providerMessageId" VARCHAR(120),
    "status" VARCHAR(40) NOT NULL DEFAULT 'queued',
    "payload" JSONB,
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SMSLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceDocument" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "documentType" "ComplianceDocumentType" NOT NULL,
    "documentNumber" VARCHAR(120) NOT NULL,
    "issuingAuthority" VARCHAR(180),
    "status" "ComplianceStatus" NOT NULL DEFAULT 'ACTIVE',
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "relatedEntityType" VARCHAR(120),
    "relatedEntityId" VARCHAR(120),
    "fileAttachmentId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplianceDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAttachment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "ownerType" VARCHAR(120) NOT NULL,
    "ownerId" VARCHAR(120) NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(120) NOT NULL,
    "storageProvider" VARCHAR(80) NOT NULL,
    "storageKey" VARCHAR(255) NOT NULL,
    "checksum" VARCHAR(255),
    "sizeBytes" INTEGER,
    "uploadedByUserId" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "source" "ActivitySource" NOT NULL DEFAULT 'UI',
    "eventType" VARCHAR(120) NOT NULL,
    "entityType" VARCHAR(120) NOT NULL,
    "entityId" VARCHAR(120),
    "action" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "payload" JSONB,
    "sessionId" TEXT,
    "requestId" VARCHAR(120),
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "requestId" VARCHAR(120),
    "entityType" VARCHAR(120) NOT NULL,
    "entityId" VARCHAR(120),
    "action" VARCHAR(120) NOT NULL,
    "module" VARCHAR(120) NOT NULL,
    "summary" VARCHAR(500) NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "beforeData" JSONB,
    "afterData" JSONB,
    "ipAddress" VARCHAR(64),
    "userAgent" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MFAConfiguration" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "method" "MfaMethod" NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "secretEncrypted" VARCHAR(255),
    "recoveryCodesHash" JSONB,
    "phoneNumber" VARCHAR(32),
    "backupEmail" VARCHAR(255),
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MFAConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "quietHoursStart" VARCHAR(16),
    "quietHoursEnd" VARCHAR(16),
    "digestFrequency" VARCHAR(40) NOT NULL DEFAULT 'instant',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "permissionKey" "PermissionKey",
    "code" VARCHAR(140) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "module" VARCHAR(120) NOT NULL,
    "action" VARCHAR(120) NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,
    "scope" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "roleKey" "RoleKey",
    "code" VARCHAR(120) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionTokenHash" VARCHAR(255) NOT NULL,
    "refreshTokenHash" VARCHAR(255),
    "deviceId" VARCHAR(120),
    "deviceName" VARCHAR(120),
    "ipAddress" VARCHAR(64),
    "userAgent" VARCHAR(500),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSeenAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "legalName" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "status" "TenantStatus" NOT NULL DEFAULT 'TRIAL',
    "onboardingStatus" VARCHAR(60) NOT NULL DEFAULT 'pending',
    "operationalModel" "OperationalModel" NOT NULL DEFAULT 'HYBRID',
    "industry" VARCHAR(120) NOT NULL,
    "subdomain" VARCHAR(120),
    "primaryCurrency" VARCHAR(8) NOT NULL DEFAULT 'USD',
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'UTC',
    "locale" VARCHAR(32) NOT NULL DEFAULT 'en-US',
    "branding" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "tier" "PlanTier" NOT NULL,
    "billingCycle" "BillingCycle" NOT NULL,
    "priceMonthly" DECIMAL(14,2) NOT NULL,
    "priceYearly" DECIMAL(14,2) NOT NULL,
    "limits" JSONB,
    "featureSet" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "subscriptionPlanId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "billingCycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "seatsPurchased" INTEGER NOT NULL DEFAULT 1,
    "seatsUsed" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trialEndsAt" TIMESTAMP(3),
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "renewsAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "externalCustomerId" VARCHAR(120),
    "externalSubscriptionId" VARCHAR(120),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "operationalModel" "OperationalModel" NOT NULL DEFAULT 'HYBRID',
    "currencyCode" VARCHAR(8) NOT NULL DEFAULT 'USD',
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'UTC',
    "locale" VARCHAR(32) NOT NULL DEFAULT 'en-US',
    "dateFormat" VARCHAR(32) NOT NULL DEFAULT 'YYYY-MM-DD',
    "numberFormat" VARCHAR(32) NOT NULL DEFAULT 'standard',
    "valuationMethod" VARCHAR(32) NOT NULL DEFAULT 'FIFO',
    "invoicePrefix" VARCHAR(24) NOT NULL DEFAULT 'INV',
    "poPrefix" VARCHAR(24) NOT NULL DEFAULT 'PO',
    "grnPrefix" VARCHAR(24) NOT NULL DEFAULT 'GRN',
    "dcPrefix" VARCHAR(24) NOT NULL DEFAULT 'DC',
    "warehousePrefix" VARCHAR(24) NOT NULL DEFAULT 'WH',
    "storePrefix" VARCHAR(24) NOT NULL DEFAULT 'ST',
    "branding" JSONB,
    "operationalPreferences" JSONB,
    "aiPreferences" JSONB,
    "securityPreferences" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantFeatureFlag" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "flagKey" VARCHAR(120) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "value" JSONB,
    "source" VARCHAR(40) NOT NULL DEFAULT 'manual',
    "rollout" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantFeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "supplierId" TEXT,
    "userScope" "UserScope" NOT NULL DEFAULT 'INTERNAL',
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(32),
    "username" VARCHAR(120),
    "fullName" VARCHAR(180) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'INVITED',
    "lastLoginAt" TIMESTAMP(3),
    "emailVerifiedAt" TIMESTAMP(3),
    "phoneVerifiedAt" TIMESTAMP(3),
    "avatarUrl" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardSnapshot" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "snapshotType" VARCHAR(80) NOT NULL,
    "revenue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "grossMargin" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "inventoryValue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "salesCount" INTEGER NOT NULL DEFAULT 0,
    "ordersCount" INTEGER NOT NULL DEFAULT 0,
    "alertsCount" INTEGER NOT NULL DEFAULT 0,
    "metrics" JSONB,
    "dimensions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "customerId" TEXT,
    "invoiceNumber" VARCHAR(120) NOT NULL,
    "invoiceStatus" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "billingType" VARCHAR(20) NOT NULL DEFAULT 'B2C',
    "gstTreatment" VARCHAR(40) NOT NULL DEFAULT 'tax_invoice',
    "placeOfSupply" VARCHAR(120),
    "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "subtotal" DECIMAL(14,2) NOT NULL,
    "discountTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "taxTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL(14,2) NOT NULL,
    "balanceDue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "taxBreakdown" JSONB,
    "qrCodeData" JSONB,
    "irn" VARCHAR(120),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "paymentNumber" VARCHAR(120) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(14,2) NOT NULL,
    "currencyCode" VARCHAR(8) NOT NULL DEFAULT 'USD',
    "referenceNumber" VARCHAR(120),
    "gatewayResponse" JSONB,
    "splitGroupId" VARCHAR(120),
    "paidAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "paymentId" TEXT,
    "refundNumber" VARCHAR(120) NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'REQUESTED',
    "method" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "reason" TEXT,
    "gatewayResponse" JSONB,
    "refundedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryBatch" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "batchNumber" VARCHAR(120) NOT NULL,
    "serialBatchCode" VARCHAR(120),
    "manufacturedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "qtyOnHand" INTEGER NOT NULL DEFAULT 0,
    "qtyReserved" INTEGER NOT NULL DEFAULT 0,
    "unitCost" DECIMAL(14,4),
    "status" VARCHAR(40) NOT NULL DEFAULT 'active',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryMovement" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "inventoryId" TEXT,
    "batchId" TEXT,
    "serialId" TEXT,
    "locationId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "movementNumber" VARCHAR(120) NOT NULL,
    "movementType" "InventoryMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DECIMAL(14,4),
    "sourceType" VARCHAR(80),
    "sourceId" VARCHAR(120),
    "referenceType" VARCHAR(80),
    "referenceId" VARCHAR(120),
    "reasonCode" VARCHAR(80),
    "notes" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isImmutable" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "binId" TEXT,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryReservation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "sourceType" VARCHAR(80) NOT NULL,
    "sourceId" VARCHAR(120) NOT NULL,
    "reservedQty" INTEGER NOT NULL,
    "releasedQty" INTEGER NOT NULL DEFAULT 0,
    "status" "InventoryReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventorySerial" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "batchId" TEXT,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "serialNumber" VARCHAR(160) NOT NULL,
    "imei" VARCHAR(40),
    "status" VARCHAR(40) NOT NULL DEFAULT 'available',
    "currentLocationId" TEXT,
    "currentBinId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventorySerial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventorySnapshot" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "snapshotAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "granularity" "KPIPeriod" NOT NULL DEFAULT 'DAILY',
    "qtyOnHand" INTEGER NOT NULL,
    "qtyReserved" INTEGER NOT NULL,
    "qtyInTransit" INTEGER NOT NULL,
    "availableQty" INTEGER NOT NULL,
    "valuation" DECIMAL(14,4),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventorySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "qtyOnHand" INTEGER NOT NULL DEFAULT 0,
    "qtyReserved" INTEGER NOT NULL DEFAULT 0,
    "qtyInTransit" INTEGER NOT NULL DEFAULT 0,
    "reorderLevel" INTEGER NOT NULL DEFAULT 0,
    "reorderQuantity" INTEGER NOT NULL DEFAULT 0,
    "averageCost" DECIMAL(14,4),
    "valuationMethod" VARCHAR(32) NOT NULL DEFAULT 'FIFO',
    "lastMovementAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockAdjustment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "adjustmentNumber" VARCHAR(120) NOT NULL,
    "reasonCode" VARCHAR(80) NOT NULL,
    "quantityBefore" INTEGER NOT NULL,
    "quantityAfter" INTEGER NOT NULL,
    "varianceQty" INTEGER NOT NULL,
    "status" VARCHAR(40) NOT NULL DEFAULT 'pending',
    "approvedByUserId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalWarehouse" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "providerName" VARCHAR(180) NOT NULL,
    "providerCode" VARCHAR(80),
    "contractReference" VARCHAR(120),
    "serviceLevel" VARCHAR(120),
    "apiEndpoint" VARCHAR(255),
    "integrationConfig" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "zoneId" TEXT,

    CONSTRAINT "ExternalWarehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationZone" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "zoneType" VARCHAR(80) NOT NULL,
    "status" "ZoneStatus" NOT NULL DEFAULT 'ACTIVE',
    "temperatureRange" VARCHAR(80),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "parentLocationId" TEXT,
    "code" VARCHAR(80) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "locationType" "LocationType" NOT NULL,
    "status" "LocationStatus" NOT NULL DEFAULT 'ACTIVE',
    "operationalModel" "OperationalModel" NOT NULL DEFAULT 'HYBRID',
    "email" VARCHAR(255),
    "phone" VARCHAR(32),
    "addressLine1" VARCHAR(255),
    "addressLine2" VARCHAR(255),
    "city" VARCHAR(120),
    "state" VARCHAR(120),
    "postalCode" VARCHAR(40),
    "country" VARCHAR(120),
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'UTC',
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageBin" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "parentBinId" TEXT,
    "code" VARCHAR(120) NOT NULL,
    "aisle" VARCHAR(40),
    "rack" VARCHAR(40),
    "shelf" VARCHAR(40),
    "bin" VARCHAR(40),
    "status" "BinStatus" NOT NULL DEFAULT 'ACTIVE',
    "capacityUnits" INTEGER NOT NULL DEFAULT 0,
    "occupiedUnits" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageBin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "storeManagerUserId" TEXT,
    "storeCode" VARCHAR(80) NOT NULL,
    "openingHours" JSONB,
    "posEnabled" BOOLEAN NOT NULL DEFAULT true,
    "defaultTaxCategoryId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "zoneId" TEXT,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "warehouseCode" VARCHAR(80) NOT NULL,
    "warehouseType" "WarehouseType" NOT NULL DEFAULT 'CENTRAL',
    "temperatureProfile" VARCHAR(120),
    "isTemperatureControlled" BOOLEAN NOT NULL DEFAULT false,
    "receivingDockCount" INTEGER NOT NULL DEFAULT 0,
    "dispatchDockCount" INTEGER NOT NULL DEFAULT 0,
    "capacityUnits" INTEGER NOT NULL DEFAULT 0,
    "pickingStrategy" VARCHAR(80),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "zoneId" TEXT,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "lineNumber" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(14,4) NOT NULL,
    "discountAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "taxRate" DECIMAL(7,4) NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "posSessionId" TEXT NOT NULL,
    "customerId" TEXT,
    "cartNumber" VARCHAR(120) NOT NULL,
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "discountTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "taxTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currencyCode" VARCHAR(8) NOT NULL DEFAULT 'USD',
    "clientMutationId" VARCHAR(120),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "customerCode" VARCHAR(120) NOT NULL,
    "customerType" VARCHAR(20) NOT NULL DEFAULT 'B2C',
    "fullName" VARCHAR(180) NOT NULL,
    "phone" VARCHAR(32),
    "email" VARCHAR(255),
    "gstin" VARCHAR(40),
    "loyaltyNumber" VARCHAR(120),
    "creditLimit" DECIMAL(14,2),
    "addressLine1" VARCHAR(255),
    "addressLine2" VARCHAR(255),
    "city" VARCHAR(120),
    "state" VARCHAR(120),
    "postalCode" VARCHAR(40),
    "country" VARCHAR(120),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "POSSession" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "openedByUserId" TEXT NOT NULL,
    "sessionNumber" VARCHAR(120) NOT NULL,
    "status" "POSSessionStatus" NOT NULL DEFAULT 'OPEN',
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "cashDrawerOpenAmount" DECIMAL(14,2),
    "cashDrawerClosingAmount" DECIMAL(14,2),
    "offlineMode" BOOLEAN NOT NULL DEFAULT false,
    "deviceInfo" JSONB,
    "syncState" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "POSSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "returnId" TEXT NOT NULL,
    "saleItemId" TEXT,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "lineNumber" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(14,4) NOT NULL,
    "taxAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "restockQty" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReturnItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Return" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "returnNumber" VARCHAR(120) NOT NULL,
    "status" "ReturnStatus" NOT NULL DEFAULT 'REQUESTED',
    "reason" TEXT,
    "restockStatus" VARCHAR(40) NOT NULL DEFAULT 'pending',
    "refundAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "receivedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT,

    CONSTRAINT "Return_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "lineNumber" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(14,4) NOT NULL,
    "discountAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "taxRate" DECIMAL(7,4) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(14,2) NOT NULL,
    "inventoryMovementId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "posSessionId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "customerId" TEXT,
    "sourceCartId" TEXT,
    "saleNumber" VARCHAR(120) NOT NULL,
    "status" "SaleStatus" NOT NULL DEFAULT 'OPEN',
    "saleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(14,2) NOT NULL,
    "discountTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "taxTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL(14,2) NOT NULL,
    "roundingAdjustment" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "syncStatus" VARCHAR(40) NOT NULL DEFAULT 'pending',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdByUserId" TEXT,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsReceiptNoteItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "goodsReceiptNoteId" TEXT NOT NULL,
    "purchaseOrderItemId" TEXT,
    "supplierInvoiceItemId" TEXT,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "lineNumber" INTEGER NOT NULL,
    "batchNumber" VARCHAR(120),
    "expiryDate" TIMESTAMP(3),
    "manufacturedAt" TIMESTAMP(3),
    "expectedQty" INTEGER NOT NULL,
    "receivedQty" INTEGER NOT NULL,
    "acceptedQty" INTEGER NOT NULL DEFAULT 0,
    "rejectedQty" INTEGER NOT NULL DEFAULT 0,
    "damagedQty" INTEGER NOT NULL DEFAULT 0,
    "qualityStatus" VARCHAR(60) NOT NULL DEFAULT 'pending',
    "storageBinId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoodsReceiptNoteItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsReceiptNote" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "purchaseOrderId" TEXT,
    "supplierInvoiceId" TEXT,
    "dispatchChallanId" TEXT,
    "grnNumber" VARCHAR(120) NOT NULL,
    "status" "GoodsReceiptNoteStatus" NOT NULL DEFAULT 'DRAFT',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedByUserId" TEXT,
    "qualityStatus" VARCHAR(60) NOT NULL DEFAULT 'pending',
    "discrepancyNotes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GoodsReceiptNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrderItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "taxCategoryId" TEXT,
    "lineNumber" INTEGER NOT NULL,
    "itemName" VARCHAR(255) NOT NULL,
    "quantityOrdered" INTEGER NOT NULL,
    "quantityReceived" INTEGER NOT NULL DEFAULT 0,
    "quantityInvoiced" INTEGER NOT NULL DEFAULT 0,
    "unitCost" DECIMAL(14,4) NOT NULL,
    "discountAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "taxRate" DECIMAL(7,4) NOT NULL DEFAULT 0,
    "discrepancyQty" INTEGER NOT NULL DEFAULT 0,
    "discrepancyReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "poNumber" VARCHAR(120) NOT NULL,
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedDeliveryAt" TIMESTAMP(3),
    "approvedByUserId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "acknowledgedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "subtotal" DECIMAL(14,2) NOT NULL,
    "taxTotal" DECIMAL(14,2) NOT NULL,
    "discountTotal" DECIMAL(14,2) NOT NULL,
    "grandTotal" DECIMAL(14,2) NOT NULL,
    "currencyCode" VARCHAR(8) NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierInvoiceItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "supplierInvoiceId" TEXT NOT NULL,
    "purchaseOrderItemId" TEXT,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "lineNumber" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DECIMAL(14,4) NOT NULL,
    "taxRate" DECIMAL(7,4) NOT NULL DEFAULT 0,
    "amount" DECIMAL(14,2) NOT NULL,
    "discrepancyQty" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierInvoice" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "purchaseOrderId" TEXT,
    "invoiceNumber" VARCHAR(120) NOT NULL,
    "supplierReference" VARCHAR(120),
    "status" "SupplierInvoiceStatus" NOT NULL DEFAULT 'RECEIVED',
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "subtotal" DECIMAL(14,2) NOT NULL,
    "taxTotal" DECIMAL(14,2) NOT NULL,
    "discountTotal" DECIMAL(14,2) NOT NULL,
    "grandTotal" DECIMAL(14,2) NOT NULL,
    "paidTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "balanceDue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "matchingStatus" VARCHAR(60) NOT NULL DEFAULT 'pending',
    "discrepancyNotes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SupplierInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierAddress" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "addressType" "AddressType" NOT NULL DEFAULT 'OTHER',
    "line1" VARCHAR(255) NOT NULL,
    "line2" VARCHAR(255),
    "city" VARCHAR(120),
    "state" VARCHAR(120),
    "postalCode" VARCHAR(40),
    "country" VARCHAR(120),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierContact" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "contactType" "ContactType" NOT NULL DEFAULT 'PRIMARY',
    "name" VARCHAR(180) NOT NULL,
    "designation" VARCHAR(120),
    "email" VARCHAR(255),
    "phone" VARCHAR(32),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierPerformanceMetric" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "metricKey" VARCHAR(120) NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "value" DECIMAL(18,4) NOT NULL,
    "benchmarkValue" DECIMAL(18,4),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierPerformanceMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "supplierCode" VARCHAR(120) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "legalName" VARCHAR(255),
    "status" "SupplierStatus" NOT NULL DEFAULT 'ACTIVE',
    "gstNumber" VARCHAR(40),
    "panNumber" VARCHAR(40),
    "tanNumber" VARCHAR(40),
    "drugLicenseNumber" VARCHAR(80),
    "fssaiLicenseNumber" VARCHAR(80),
    "paymentTermsDays" INTEGER NOT NULL DEFAULT 30,
    "creditLimit" DECIMAL(14,2),
    "leadTimeDays" INTEGER NOT NULL DEFAULT 0,
    "performanceScore" DECIMAL(5,2),
    "website" VARCHAR(255),
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "taxCategoryId" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DispatchChallanItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "dispatchChallanId" TEXT NOT NULL,
    "inventoryTransferItemId" TEXT,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "lineNumber" INTEGER NOT NULL,
    "requestedQty" INTEGER NOT NULL,
    "packedQty" INTEGER NOT NULL DEFAULT 0,
    "dispatchedQty" INTEGER NOT NULL DEFAULT 0,
    "batchNumber" VARCHAR(120),
    "serialNumbers" JSONB,
    "storageBinId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DispatchChallanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DispatchChallan" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "challanNumber" VARCHAR(120) NOT NULL,
    "inventoryTransferId" TEXT,
    "originLocationId" TEXT NOT NULL,
    "destinationLocationId" TEXT NOT NULL,
    "status" "DispatchChallanStatus" NOT NULL DEFAULT 'PREPARED',
    "transportMode" VARCHAR(80),
    "transporterName" VARCHAR(180),
    "vehicleNumber" VARCHAR(80),
    "driverName" VARCHAR(180),
    "driverPhone" VARCHAR(32),
    "lrNumber" VARCHAR(120),
    "dispatchedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DispatchChallan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransferItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "inventoryTransferId" TEXT NOT NULL,
    "transferRequestItemId" TEXT,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "batchId" TEXT,
    "lineNumber" INTEGER NOT NULL,
    "requestedQty" INTEGER NOT NULL,
    "pickedQty" INTEGER NOT NULL DEFAULT 0,
    "dispatchedQty" INTEGER NOT NULL DEFAULT 0,
    "receivedQty" INTEGER NOT NULL DEFAULT 0,
    "unitCost" DECIMAL(14,4),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryTransferItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransfer" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "transferNumber" VARCHAR(120) NOT NULL,
    "transferRequestId" TEXT,
    "fromLocationId" TEXT NOT NULL,
    "toLocationId" TEXT NOT NULL,
    "status" "InventoryTransferStatus" NOT NULL DEFAULT 'DRAFT',
    "requestedByUserId" TEXT,
    "approvedByUserId" TEXT,
    "pickedByUserId" TEXT,
    "dispatchedByUserId" TEXT,
    "receivedByUserId" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "dispatchedAt" TIMESTAMP(3),
    "inTransitAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "transportMetadata" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InventoryTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickingTaskItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "pickingTaskId" TEXT NOT NULL,
    "transferRequestItemId" TEXT,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "lineNumber" INTEGER NOT NULL,
    "quantityRequired" INTEGER NOT NULL,
    "quantityPicked" INTEGER NOT NULL DEFAULT 0,
    "storageBinId" TEXT,
    "batchId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PickingTaskItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickingTask" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "taskNumber" VARCHAR(120) NOT NULL,
    "transferRequestId" TEXT,
    "dispatchChallanId" TEXT,
    "assignedToUserId" TEXT,
    "zoneId" TEXT,
    "binId" TEXT,
    "status" "PickingTaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" VARCHAR(40) NOT NULL DEFAULT 'normal',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "instructions" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locationId" TEXT,

    CONSTRAINT "PickingTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferRequestItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "transferRequestId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "lineNumber" INTEGER NOT NULL,
    "requestedQty" INTEGER NOT NULL,
    "approvedQty" INTEGER NOT NULL DEFAULT 0,
    "fulfilledQty" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransferRequestItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferRequest" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "requestNumber" VARCHAR(120) NOT NULL,
    "fromLocationId" TEXT NOT NULL,
    "toLocationId" TEXT NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "approvedByUserId" TEXT,
    "priority" VARCHAR(40) NOT NULL DEFAULT 'normal',
    "status" "InventoryTransferStatus" NOT NULL DEFAULT 'REQUESTED',
    "reason" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "requiredBy" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TransferRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIRecommendation_tenantId_entityType_entityId_idx" ON "AIRecommendation"("tenantId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "AIRecommendation_tenantId_status_idx" ON "AIRecommendation"("tenantId", "status");

-- CreateIndex
CREATE INDEX "AlertRule_tenantId_module_idx" ON "AlertRule"("tenantId", "module");

-- CreateIndex
CREATE INDEX "Alert_tenantId_status_idx" ON "Alert"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Alert_tenantId_severity_idx" ON "Alert"("tenantId", "severity");

-- CreateIndex
CREATE INDEX "Alert_tenantId_entityType_entityId_idx" ON "Alert"("tenantId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "AnomalyRecord_tenantId_entityType_entityId_idx" ON "AnomalyRecord"("tenantId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "AnomalyRecord_tenantId_status_idx" ON "AnomalyRecord"("tenantId", "status");

-- CreateIndex
CREATE INDEX "ForecastModel_tenantId_status_idx" ON "ForecastModel"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ForecastModel_tenantId_modelKey_version_key" ON "ForecastModel"("tenantId", "modelKey", "version");

-- CreateIndex
CREATE INDEX "ForecastRecord_tenantId_entityType_entityId_idx" ON "ForecastRecord"("tenantId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "ForecastRecord_tenantId_forecastDate_idx" ON "ForecastRecord"("tenantId", "forecastDate");

-- CreateIndex
CREATE INDEX "KPIRecord_tenantId_kpiKey_periodStart_idx" ON "KPIRecord"("tenantId", "kpiKey", "periodStart");

-- CreateIndex
CREATE INDEX "ReportDefinition_tenantId_module_idx" ON "ReportDefinition"("tenantId", "module");

-- CreateIndex
CREATE UNIQUE INDEX "ReportDefinition_tenantId_code_key" ON "ReportDefinition"("tenantId", "code");

-- CreateIndex
CREATE INDEX "SavedReport_tenantId_userId_idx" ON "SavedReport"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "ProductBarcode_tenantId_productId_idx" ON "ProductBarcode"("tenantId", "productId");

-- CreateIndex
CREATE INDEX "ProductBarcode_tenantId_variantId_idx" ON "ProductBarcode"("tenantId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductBarcode_tenantId_barcode_key" ON "ProductBarcode"("tenantId", "barcode");

-- CreateIndex
CREATE INDEX "ProductCategory_tenantId_parentCategoryId_idx" ON "ProductCategory"("tenantId", "parentCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_tenantId_code_key" ON "ProductCategory"("tenantId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_tenantId_slug_key" ON "ProductCategory"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "ProductImage_tenantId_productId_idx" ON "ProductImage"("tenantId", "productId");

-- CreateIndex
CREATE INDEX "ProductImage_tenantId_variantId_idx" ON "ProductImage"("tenantId", "variantId");

-- CreateIndex
CREATE INDEX "ProductSubCategory_tenantId_categoryId_idx" ON "ProductSubCategory"("tenantId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSubCategory_tenantId_code_key" ON "ProductSubCategory"("tenantId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSubCategory_tenantId_slug_key" ON "ProductSubCategory"("tenantId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSubCategory_tenantId_categoryId_name_key" ON "ProductSubCategory"("tenantId", "categoryId", "name");

-- CreateIndex
CREATE INDEX "ProductSupplier_tenantId_supplierId_idx" ON "ProductSupplier"("tenantId", "supplierId");

-- CreateIndex
CREATE INDEX "ProductSupplier_tenantId_productId_idx" ON "ProductSupplier"("tenantId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSupplier_tenantId_productId_supplierId_key" ON "ProductSupplier"("tenantId", "productId", "supplierId");

-- CreateIndex
CREATE INDEX "ProductVariant_tenantId_productId_idx" ON "ProductVariant"("tenantId", "productId");

-- CreateIndex
CREATE INDEX "ProductVariant_tenantId_isDefault_idx" ON "ProductVariant"("tenantId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_tenantId_sku_key" ON "ProductVariant"("tenantId", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_tenantId_productId_variantCode_key" ON "ProductVariant"("tenantId", "productId", "variantCode");

-- CreateIndex
CREATE INDEX "Product_tenantId_categoryId_idx" ON "Product"("tenantId", "categoryId");

-- CreateIndex
CREATE INDEX "Product_tenantId_subCategoryId_idx" ON "Product"("tenantId", "subCategoryId");

-- CreateIndex
CREATE INDEX "Product_tenantId_taxCategoryId_idx" ON "Product"("tenantId", "taxCategoryId");

-- CreateIndex
CREATE INDEX "Product_tenantId_status_idx" ON "Product"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Product_tenantId_name_idx" ON "Product"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_tenantId_sku_key" ON "Product"("tenantId", "sku");

-- CreateIndex
CREATE INDEX "SupplierProduct_tenantId_supplierId_idx" ON "SupplierProduct"("tenantId", "supplierId");

-- CreateIndex
CREATE INDEX "SupplierProduct_tenantId_productId_idx" ON "SupplierProduct"("tenantId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierProduct_tenantId_supplierId_externalSku_key" ON "SupplierProduct"("tenantId", "supplierId", "externalSku");

-- CreateIndex
CREATE INDEX "TaxCategory_tenantId_jurisdiction_idx" ON "TaxCategory"("tenantId", "jurisdiction");

-- CreateIndex
CREATE UNIQUE INDEX "TaxCategory_tenantId_code_key" ON "TaxCategory"("tenantId", "code");

-- CreateIndex
CREATE INDEX "EmailLog_tenantId_providerMessageId_idx" ON "EmailLog"("tenantId", "providerMessageId");

-- CreateIndex
CREATE INDEX "Notification_tenantId_recipientUserId_idx" ON "Notification"("tenantId", "recipientUserId");

-- CreateIndex
CREATE INDEX "Notification_tenantId_status_idx" ON "Notification"("tenantId", "status");

-- CreateIndex
CREATE INDEX "SMSLog_tenantId_providerMessageId_idx" ON "SMSLog"("tenantId", "providerMessageId");

-- CreateIndex
CREATE INDEX "ComplianceDocument_tenantId_documentType_idx" ON "ComplianceDocument"("tenantId", "documentType");

-- CreateIndex
CREATE INDEX "ComplianceDocument_tenantId_expiresAt_idx" ON "ComplianceDocument"("tenantId", "expiresAt");

-- CreateIndex
CREATE INDEX "FileAttachment_tenantId_ownerType_ownerId_idx" ON "FileAttachment"("tenantId", "ownerType", "ownerId");

-- CreateIndex
CREATE INDEX "FileAttachment_tenantId_uploadedAt_idx" ON "FileAttachment"("tenantId", "uploadedAt");

-- CreateIndex
CREATE INDEX "ActivityEvent_tenantId_occurredAt_idx" ON "ActivityEvent"("tenantId", "occurredAt");

-- CreateIndex
CREATE INDEX "ActivityEvent_tenantId_entityType_entityId_idx" ON "ActivityEvent"("tenantId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "ActivityEvent_tenantId_eventType_idx" ON "ActivityEvent"("tenantId", "eventType");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_createdAt_idx" ON "AuditLog"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_entityType_entityId_idx" ON "AuditLog"("tenantId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_module_action_idx" ON "AuditLog"("tenantId", "module", "action");

-- CreateIndex
CREATE UNIQUE INDEX "MFAConfiguration_userId_key" ON "MFAConfiguration"("userId");

-- CreateIndex
CREATE INDEX "MFAConfiguration_tenantId_isEnabled_idx" ON "MFAConfiguration"("tenantId", "isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "Permission_tenantId_module_idx" ON "Permission"("tenantId", "module");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_tenantId_code_key" ON "Permission"("tenantId", "code");

-- CreateIndex
CREATE INDEX "RolePermission_tenantId_roleId_idx" ON "RolePermission"("tenantId", "roleId");

-- CreateIndex
CREATE INDEX "RolePermission_tenantId_permissionId_idx" ON "RolePermission"("tenantId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_tenantId_roleId_permissionId_key" ON "RolePermission"("tenantId", "roleId", "permissionId");

-- CreateIndex
CREATE INDEX "Role_tenantId_roleKey_idx" ON "Role"("tenantId", "roleKey");

-- CreateIndex
CREATE UNIQUE INDEX "Role_tenantId_code_key" ON "Role"("tenantId", "code");

-- CreateIndex
CREATE INDEX "UserSession_tenantId_userId_idx" ON "UserSession"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "UserSession_tenantId_expiresAt_idx" ON "UserSession"("tenantId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_subdomain_key" ON "Tenant"("subdomain");

-- CreateIndex
CREATE INDEX "Tenant_slug_idx" ON "Tenant"("slug");

-- CreateIndex
CREATE INDEX "Tenant_status_operationalModel_idx" ON "Tenant"("status", "operationalModel");

-- CreateIndex
CREATE INDEX "Tenant_createdAt_idx" ON "Tenant"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_code_key" ON "SubscriptionPlan"("code");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_tier_isActive_idx" ON "SubscriptionPlan"("tier", "isActive");

-- CreateIndex
CREATE INDEX "Subscription_tenantId_status_idx" ON "Subscription"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Subscription_tenantId_renewsAt_idx" ON "Subscription"("tenantId", "renewsAt");

-- CreateIndex
CREATE INDEX "Subscription_subscriptionPlanId_idx" ON "Subscription"("subscriptionPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "TenantSettings_tenantId_key" ON "TenantSettings"("tenantId");

-- CreateIndex
CREATE INDEX "TenantSettings_tenantId_operationalModel_idx" ON "TenantSettings"("tenantId", "operationalModel");

-- CreateIndex
CREATE INDEX "TenantFeatureFlag_tenantId_enabled_idx" ON "TenantFeatureFlag"("tenantId", "enabled");

-- CreateIndex
CREATE UNIQUE INDEX "TenantFeatureFlag_tenantId_flagKey_key" ON "TenantFeatureFlag"("tenantId", "flagKey");

-- CreateIndex
CREATE INDEX "User_tenantId_roleId_idx" ON "User"("tenantId", "roleId");

-- CreateIndex
CREATE INDEX "User_tenantId_status_idx" ON "User"("tenantId", "status");

-- CreateIndex
CREATE INDEX "User_tenantId_supplierId_idx" ON "User"("tenantId", "supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "User_tenantId_email_key" ON "User"("tenantId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "User_tenantId_username_key" ON "User"("tenantId", "username");

-- CreateIndex
CREATE INDEX "DashboardSnapshot_tenantId_snapshotDate_idx" ON "DashboardSnapshot"("tenantId", "snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardSnapshot_tenantId_snapshotDate_snapshotType_key" ON "DashboardSnapshot"("tenantId", "snapshotDate", "snapshotType");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_saleId_key" ON "Invoice"("saleId");

-- CreateIndex
CREATE INDEX "Invoice_tenantId_invoiceDate_idx" ON "Invoice"("tenantId", "invoiceDate");

-- CreateIndex
CREATE INDEX "Invoice_tenantId_billingType_idx" ON "Invoice"("tenantId", "billingType");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_tenantId_invoiceNumber_key" ON "Invoice"("tenantId", "invoiceNumber");

-- CreateIndex
CREATE INDEX "Payment_tenantId_saleId_idx" ON "Payment"("tenantId", "saleId");

-- CreateIndex
CREATE INDEX "Payment_tenantId_status_idx" ON "Payment"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_tenantId_paymentNumber_key" ON "Payment"("tenantId", "paymentNumber");

-- CreateIndex
CREATE INDEX "Refund_tenantId_saleId_idx" ON "Refund"("tenantId", "saleId");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_tenantId_refundNumber_key" ON "Refund"("tenantId", "refundNumber");

-- CreateIndex
CREATE INDEX "InventoryBatch_tenantId_expiresAt_idx" ON "InventoryBatch"("tenantId", "expiresAt");

-- CreateIndex
CREATE INDEX "InventoryBatch_tenantId_inventoryId_idx" ON "InventoryBatch"("tenantId", "inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryBatch_tenantId_inventoryId_batchNumber_key" ON "InventoryBatch"("tenantId", "inventoryId", "batchNumber");

-- CreateIndex
CREATE INDEX "InventoryMovement_tenantId_locationId_occurredAt_idx" ON "InventoryMovement"("tenantId", "locationId", "occurredAt");

-- CreateIndex
CREATE INDEX "InventoryMovement_tenantId_productId_occurredAt_idx" ON "InventoryMovement"("tenantId", "productId", "occurredAt");

-- CreateIndex
CREATE INDEX "InventoryMovement_tenantId_movementType_occurredAt_idx" ON "InventoryMovement"("tenantId", "movementType", "occurredAt");

-- CreateIndex
CREATE INDEX "InventoryMovement_tenantId_inventoryId_idx" ON "InventoryMovement"("tenantId", "inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryMovement_tenantId_movementNumber_key" ON "InventoryMovement"("tenantId", "movementNumber");

-- CreateIndex
CREATE INDEX "InventoryReservation_tenantId_inventoryId_idx" ON "InventoryReservation"("tenantId", "inventoryId");

-- CreateIndex
CREATE INDEX "InventoryReservation_tenantId_status_idx" ON "InventoryReservation"("tenantId", "status");

-- CreateIndex
CREATE INDEX "InventoryReservation_tenantId_expiresAt_idx" ON "InventoryReservation"("tenantId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryReservation_tenantId_sourceType_sourceId_key" ON "InventoryReservation"("tenantId", "sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "InventorySerial_tenantId_inventoryId_idx" ON "InventorySerial"("tenantId", "inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "InventorySerial_tenantId_serialNumber_key" ON "InventorySerial"("tenantId", "serialNumber");

-- CreateIndex
CREATE INDEX "InventorySnapshot_tenantId_snapshotDate_idx" ON "InventorySnapshot"("tenantId", "snapshotDate");

-- CreateIndex
CREATE INDEX "InventorySnapshot_tenantId_locationId_idx" ON "InventorySnapshot"("tenantId", "locationId");

-- CreateIndex
CREATE INDEX "InventorySnapshot_tenantId_productId_idx" ON "InventorySnapshot"("tenantId", "productId");

-- CreateIndex
CREATE INDEX "Inventory_tenantId_locationId_idx" ON "Inventory"("tenantId", "locationId");

-- CreateIndex
CREATE INDEX "Inventory_tenantId_productId_idx" ON "Inventory"("tenantId", "productId");

-- CreateIndex
CREATE INDEX "Inventory_tenantId_variantId_idx" ON "Inventory"("tenantId", "variantId");

-- CreateIndex
CREATE INDEX "Inventory_tenantId_updatedAt_idx" ON "Inventory"("tenantId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_tenantId_locationId_productId_variantId_key" ON "Inventory"("tenantId", "locationId", "productId", "variantId");

-- CreateIndex
CREATE INDEX "StockAdjustment_tenantId_inventoryId_idx" ON "StockAdjustment"("tenantId", "inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "StockAdjustment_tenantId_adjustmentNumber_key" ON "StockAdjustment"("tenantId", "adjustmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalWarehouse_locationId_key" ON "ExternalWarehouse"("locationId");

-- CreateIndex
CREATE INDEX "ExternalWarehouse_tenantId_providerName_idx" ON "ExternalWarehouse"("tenantId", "providerName");

-- CreateIndex
CREATE INDEX "LocationZone_tenantId_locationId_idx" ON "LocationZone"("tenantId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationZone_tenantId_locationId_code_key" ON "LocationZone"("tenantId", "locationId", "code");

-- CreateIndex
CREATE INDEX "Location_tenantId_locationType_idx" ON "Location"("tenantId", "locationType");

-- CreateIndex
CREATE INDEX "Location_tenantId_status_idx" ON "Location"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Location_tenantId_code_key" ON "Location"("tenantId", "code");

-- CreateIndex
CREATE INDEX "StorageBin_tenantId_locationId_idx" ON "StorageBin"("tenantId", "locationId");

-- CreateIndex
CREATE INDEX "StorageBin_tenantId_zoneId_idx" ON "StorageBin"("tenantId", "zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "StorageBin_tenantId_zoneId_code_key" ON "StorageBin"("tenantId", "zoneId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Store_locationId_key" ON "Store"("locationId");

-- CreateIndex
CREATE INDEX "Store_tenantId_posEnabled_idx" ON "Store"("tenantId", "posEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "Store_tenantId_storeCode_key" ON "Store"("tenantId", "storeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_locationId_key" ON "Warehouse"("locationId");

-- CreateIndex
CREATE INDEX "Warehouse_tenantId_warehouseType_idx" ON "Warehouse"("tenantId", "warehouseType");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_tenantId_warehouseCode_key" ON "Warehouse"("tenantId", "warehouseCode");

-- CreateIndex
CREATE INDEX "CartItem_tenantId_productId_idx" ON "CartItem"("tenantId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_lineNumber_key" ON "CartItem"("cartId", "lineNumber");

-- CreateIndex
CREATE INDEX "Cart_tenantId_posSessionId_idx" ON "Cart"("tenantId", "posSessionId");

-- CreateIndex
CREATE INDEX "Cart_tenantId_status_idx" ON "Cart"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_tenantId_cartNumber_key" ON "Cart"("tenantId", "cartNumber");

-- CreateIndex
CREATE INDEX "Customer_tenantId_phone_idx" ON "Customer"("tenantId", "phone");

-- CreateIndex
CREATE INDEX "Customer_tenantId_email_idx" ON "Customer"("tenantId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_tenantId_customerCode_key" ON "Customer"("tenantId", "customerCode");

-- CreateIndex
CREATE INDEX "POSSession_tenantId_locationId_status_idx" ON "POSSession"("tenantId", "locationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "POSSession_tenantId_sessionNumber_key" ON "POSSession"("tenantId", "sessionNumber");

-- CreateIndex
CREATE INDEX "ReturnItem_tenantId_productId_idx" ON "ReturnItem"("tenantId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "ReturnItem_returnId_lineNumber_key" ON "ReturnItem"("returnId", "lineNumber");

-- CreateIndex
CREATE INDEX "Return_tenantId_saleId_idx" ON "Return"("tenantId", "saleId");

-- CreateIndex
CREATE UNIQUE INDEX "Return_tenantId_returnNumber_key" ON "Return"("tenantId", "returnNumber");

-- CreateIndex
CREATE INDEX "SaleItem_tenantId_productId_idx" ON "SaleItem"("tenantId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleItem_saleId_lineNumber_key" ON "SaleItem"("saleId", "lineNumber");

-- CreateIndex
CREATE INDEX "Sale_tenantId_locationId_saleDate_idx" ON "Sale"("tenantId", "locationId", "saleDate");

-- CreateIndex
CREATE INDEX "Sale_tenantId_status_idx" ON "Sale"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_tenantId_saleNumber_key" ON "Sale"("tenantId", "saleNumber");

-- CreateIndex
CREATE INDEX "GoodsReceiptNoteItem_tenantId_productId_idx" ON "GoodsReceiptNoteItem"("tenantId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "GoodsReceiptNoteItem_goodsReceiptNoteId_lineNumber_key" ON "GoodsReceiptNoteItem"("goodsReceiptNoteId", "lineNumber");

-- CreateIndex
CREATE INDEX "GoodsReceiptNote_tenantId_supplierId_idx" ON "GoodsReceiptNote"("tenantId", "supplierId");

-- CreateIndex
CREATE INDEX "GoodsReceiptNote_tenantId_status_idx" ON "GoodsReceiptNote"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "GoodsReceiptNote_tenantId_grnNumber_key" ON "GoodsReceiptNote"("tenantId", "grnNumber");

-- CreateIndex
CREATE INDEX "PurchaseOrderItem_tenantId_productId_idx" ON "PurchaseOrderItem"("tenantId", "productId");

-- CreateIndex
CREATE INDEX "PurchaseOrderItem_tenantId_purchaseOrderId_idx" ON "PurchaseOrderItem"("tenantId", "purchaseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrderItem_purchaseOrderId_lineNumber_key" ON "PurchaseOrderItem"("purchaseOrderId", "lineNumber");

-- CreateIndex
CREATE INDEX "PurchaseOrder_tenantId_status_idx" ON "PurchaseOrder"("tenantId", "status");

-- CreateIndex
CREATE INDEX "PurchaseOrder_tenantId_supplierId_idx" ON "PurchaseOrder"("tenantId", "supplierId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_tenantId_orderDate_idx" ON "PurchaseOrder"("tenantId", "orderDate");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_tenantId_poNumber_key" ON "PurchaseOrder"("tenantId", "poNumber");

-- CreateIndex
CREATE INDEX "SupplierInvoiceItem_tenantId_productId_idx" ON "SupplierInvoiceItem"("tenantId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierInvoiceItem_supplierInvoiceId_lineNumber_key" ON "SupplierInvoiceItem"("supplierInvoiceId", "lineNumber");

-- CreateIndex
CREATE INDEX "SupplierInvoice_tenantId_supplierId_idx" ON "SupplierInvoice"("tenantId", "supplierId");

-- CreateIndex
CREATE INDEX "SupplierInvoice_tenantId_status_idx" ON "SupplierInvoice"("tenantId", "status");

-- CreateIndex
CREATE INDEX "SupplierInvoice_tenantId_invoiceDate_idx" ON "SupplierInvoice"("tenantId", "invoiceDate");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierInvoice_tenantId_invoiceNumber_key" ON "SupplierInvoice"("tenantId", "invoiceNumber");

-- CreateIndex
CREATE INDEX "SupplierAddress_tenantId_supplierId_idx" ON "SupplierAddress"("tenantId", "supplierId");

-- CreateIndex
CREATE INDEX "SupplierContact_tenantId_supplierId_idx" ON "SupplierContact"("tenantId", "supplierId");

-- CreateIndex
CREATE INDEX "SupplierContact_tenantId_email_idx" ON "SupplierContact"("tenantId", "email");

-- CreateIndex
CREATE INDEX "SupplierPerformanceMetric_tenantId_supplierId_metricKey_idx" ON "SupplierPerformanceMetric"("tenantId", "supplierId", "metricKey");

-- CreateIndex
CREATE INDEX "SupplierPerformanceMetric_tenantId_periodStart_periodEnd_idx" ON "SupplierPerformanceMetric"("tenantId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "Supplier_tenantId_status_idx" ON "Supplier"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Supplier_tenantId_gstNumber_idx" ON "Supplier"("tenantId", "gstNumber");

-- CreateIndex
CREATE INDEX "Supplier_tenantId_name_idx" ON "Supplier"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_tenantId_supplierCode_key" ON "Supplier"("tenantId", "supplierCode");

-- CreateIndex
CREATE INDEX "DispatchChallanItem_tenantId_productId_idx" ON "DispatchChallanItem"("tenantId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "DispatchChallanItem_dispatchChallanId_lineNumber_key" ON "DispatchChallanItem"("dispatchChallanId", "lineNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DispatchChallan_inventoryTransferId_key" ON "DispatchChallan"("inventoryTransferId");

-- CreateIndex
CREATE INDEX "DispatchChallan_tenantId_originLocationId_idx" ON "DispatchChallan"("tenantId", "originLocationId");

-- CreateIndex
CREATE INDEX "DispatchChallan_tenantId_destinationLocationId_idx" ON "DispatchChallan"("tenantId", "destinationLocationId");

-- CreateIndex
CREATE INDEX "DispatchChallan_tenantId_status_idx" ON "DispatchChallan"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "DispatchChallan_tenantId_challanNumber_key" ON "DispatchChallan"("tenantId", "challanNumber");

-- CreateIndex
CREATE INDEX "InventoryTransferItem_tenantId_productId_idx" ON "InventoryTransferItem"("tenantId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryTransferItem_inventoryTransferId_lineNumber_key" ON "InventoryTransferItem"("inventoryTransferId", "lineNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryTransfer_transferRequestId_key" ON "InventoryTransfer"("transferRequestId");

-- CreateIndex
CREATE INDEX "InventoryTransfer_tenantId_fromLocationId_idx" ON "InventoryTransfer"("tenantId", "fromLocationId");

-- CreateIndex
CREATE INDEX "InventoryTransfer_tenantId_toLocationId_idx" ON "InventoryTransfer"("tenantId", "toLocationId");

-- CreateIndex
CREATE INDEX "InventoryTransfer_tenantId_status_idx" ON "InventoryTransfer"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryTransfer_tenantId_transferNumber_key" ON "InventoryTransfer"("tenantId", "transferNumber");

-- CreateIndex
CREATE INDEX "PickingTaskItem_tenantId_productId_idx" ON "PickingTaskItem"("tenantId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "PickingTaskItem_pickingTaskId_lineNumber_key" ON "PickingTaskItem"("pickingTaskId", "lineNumber");

-- CreateIndex
CREATE INDEX "PickingTask_tenantId_status_idx" ON "PickingTask"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PickingTask_tenantId_taskNumber_key" ON "PickingTask"("tenantId", "taskNumber");

-- CreateIndex
CREATE INDEX "TransferRequestItem_tenantId_productId_idx" ON "TransferRequestItem"("tenantId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "TransferRequestItem_transferRequestId_lineNumber_key" ON "TransferRequestItem"("transferRequestId", "lineNumber");

-- CreateIndex
CREATE INDEX "TransferRequest_tenantId_status_idx" ON "TransferRequest"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TransferRequest_tenantId_requestNumber_key" ON "TransferRequest"("tenantId", "requestNumber");

-- AddForeignKey
ALTER TABLE "AIRecommendation" ADD CONSTRAINT "AIRecommendation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRecommendation" ADD CONSTRAINT "AIRecommendation_forecastModelId_fkey" FOREIGN KEY ("forecastModelId") REFERENCES "ForecastModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertRule" ADD CONSTRAINT "AlertRule_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertRule" ADD CONSTRAINT "AlertRule_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_alertRuleId_fkey" FOREIGN KEY ("alertRuleId") REFERENCES "AlertRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomalyRecord" ADD CONSTRAINT "AnomalyRecord_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomalyRecord" ADD CONSTRAINT "AnomalyRecord_forecastModelId_fkey" FOREIGN KEY ("forecastModelId") REFERENCES "ForecastModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForecastModel" ADD CONSTRAINT "ForecastModel_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForecastRecord" ADD CONSTRAINT "ForecastRecord_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForecastRecord" ADD CONSTRAINT "ForecastRecord_forecastModelId_fkey" FOREIGN KEY ("forecastModelId") REFERENCES "ForecastModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KPIRecord" ADD CONSTRAINT "KPIRecord_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDefinition" ADD CONSTRAINT "ReportDefinition_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDefinition" ADD CONSTRAINT "ReportDefinition_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedReport" ADD CONSTRAINT "SavedReport_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedReport" ADD CONSTRAINT "SavedReport_reportDefinitionId_fkey" FOREIGN KEY ("reportDefinitionId") REFERENCES "ReportDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedReport" ADD CONSTRAINT "SavedReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBarcode" ADD CONSTRAINT "ProductBarcode_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBarcode" ADD CONSTRAINT "ProductBarcode_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBarcode" ADD CONSTRAINT "ProductBarcode_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSubCategory" ADD CONSTRAINT "ProductSubCategory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSubCategory" ADD CONSTRAINT "ProductSubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSupplier" ADD CONSTRAINT "ProductSupplier_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSupplier" ADD CONSTRAINT "ProductSupplier_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSupplier" ADD CONSTRAINT "ProductSupplier_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "ProductSubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_taxCategoryId_fkey" FOREIGN KEY ("taxCategoryId") REFERENCES "TaxCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxCategory" ADD CONSTRAINT "TaxCategory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSLog" ADD CONSTRAINT "SMSLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSLog" ADD CONSTRAINT "SMSLog_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceDocument" ADD CONSTRAINT "ComplianceDocument_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceDocument" ADD CONSTRAINT "ComplianceDocument_fileAttachmentId_fkey" FOREIGN KEY ("fileAttachmentId") REFERENCES "FileAttachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAttachment" ADD CONSTRAINT "FileAttachment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAttachment" ADD CONSTRAINT "FileAttachment_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MFAConfiguration" ADD CONSTRAINT "MFAConfiguration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MFAConfiguration" ADD CONSTRAINT "MFAConfiguration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_subscriptionPlanId_fkey" FOREIGN KEY ("subscriptionPlanId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantSettings" ADD CONSTRAINT "TenantSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantFeatureFlag" ADD CONSTRAINT "TenantFeatureFlag_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardSnapshot" ADD CONSTRAINT "DashboardSnapshot_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryBatch" ADD CONSTRAINT "InventoryBatch_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryBatch" ADD CONSTRAINT "InventoryBatch_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryBatch" ADD CONSTRAINT "InventoryBatch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryBatch" ADD CONSTRAINT "InventoryBatch_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_binId_fkey" FOREIGN KEY ("binId") REFERENCES "StorageBin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "InventoryBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_serialId_fkey" FOREIGN KEY ("serialId") REFERENCES "InventorySerial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryReservation" ADD CONSTRAINT "InventoryReservation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryReservation" ADD CONSTRAINT "InventoryReservation_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySerial" ADD CONSTRAINT "InventorySerial_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySerial" ADD CONSTRAINT "InventorySerial_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySerial" ADD CONSTRAINT "InventorySerial_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "InventoryBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySerial" ADD CONSTRAINT "InventorySerial_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySerial" ADD CONSTRAINT "InventorySerial_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySerial" ADD CONSTRAINT "InventorySerial_currentLocationId_fkey" FOREIGN KEY ("currentLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySerial" ADD CONSTRAINT "InventorySerial_currentBinId_fkey" FOREIGN KEY ("currentBinId") REFERENCES "StorageBin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySnapshot" ADD CONSTRAINT "InventorySnapshot_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySnapshot" ADD CONSTRAINT "InventorySnapshot_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySnapshot" ADD CONSTRAINT "InventorySnapshot_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySnapshot" ADD CONSTRAINT "InventorySnapshot_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySnapshot" ADD CONSTRAINT "InventorySnapshot_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAdjustment" ADD CONSTRAINT "StockAdjustment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAdjustment" ADD CONSTRAINT "StockAdjustment_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAdjustment" ADD CONSTRAINT "StockAdjustment_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalWarehouse" ADD CONSTRAINT "ExternalWarehouse_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "LocationZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalWarehouse" ADD CONSTRAINT "ExternalWarehouse_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalWarehouse" ADD CONSTRAINT "ExternalWarehouse_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationZone" ADD CONSTRAINT "LocationZone_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationZone" ADD CONSTRAINT "LocationZone_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_parentLocationId_fkey" FOREIGN KEY ("parentLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageBin" ADD CONSTRAINT "StorageBin_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageBin" ADD CONSTRAINT "StorageBin_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageBin" ADD CONSTRAINT "StorageBin_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "LocationZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageBin" ADD CONSTRAINT "StorageBin_parentBinId_fkey" FOREIGN KEY ("parentBinId") REFERENCES "StorageBin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "LocationZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_storeManagerUserId_fkey" FOREIGN KEY ("storeManagerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "LocationZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_posSessionId_fkey" FOREIGN KEY ("posSessionId") REFERENCES "POSSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POSSession" ADD CONSTRAINT "POSSession_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POSSession" ADD CONSTRAINT "POSSession_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POSSession" ADD CONSTRAINT "POSSession_openedByUserId_fkey" FOREIGN KEY ("openedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnItem" ADD CONSTRAINT "ReturnItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnItem" ADD CONSTRAINT "ReturnItem_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "Return"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnItem" ADD CONSTRAINT "ReturnItem_saleItemId_fkey" FOREIGN KEY ("saleItemId") REFERENCES "SaleItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnItem" ADD CONSTRAINT "ReturnItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnItem" ADD CONSTRAINT "ReturnItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Return" ADD CONSTRAINT "Return_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Return" ADD CONSTRAINT "Return_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Return" ADD CONSTRAINT "Return_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Return" ADD CONSTRAINT "Return_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_inventoryMovementId_fkey" FOREIGN KEY ("inventoryMovementId") REFERENCES "InventoryMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_posSessionId_fkey" FOREIGN KEY ("posSessionId") REFERENCES "POSSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_sourceCartId_fkey" FOREIGN KEY ("sourceCartId") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptNoteItem" ADD CONSTRAINT "GoodsReceiptNoteItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptNoteItem" ADD CONSTRAINT "GoodsReceiptNoteItem_goodsReceiptNoteId_fkey" FOREIGN KEY ("goodsReceiptNoteId") REFERENCES "GoodsReceiptNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptNoteItem" ADD CONSTRAINT "GoodsReceiptNoteItem_purchaseOrderItemId_fkey" FOREIGN KEY ("purchaseOrderItemId") REFERENCES "PurchaseOrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptNoteItem" ADD CONSTRAINT "GoodsReceiptNoteItem_supplierInvoiceItemId_fkey" FOREIGN KEY ("supplierInvoiceItemId") REFERENCES "SupplierInvoiceItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptNoteItem" ADD CONSTRAINT "GoodsReceiptNoteItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptNoteItem" ADD CONSTRAINT "GoodsReceiptNoteItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptNoteItem" ADD CONSTRAINT "GoodsReceiptNoteItem_storageBinId_fkey" FOREIGN KEY ("storageBinId") REFERENCES "StorageBin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptNote" ADD CONSTRAINT "GoodsReceiptNote_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptNote" ADD CONSTRAINT "GoodsReceiptNote_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptNote" ADD CONSTRAINT "GoodsReceiptNote_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptNote" ADD CONSTRAINT "GoodsReceiptNote_supplierInvoiceId_fkey" FOREIGN KEY ("supplierInvoiceId") REFERENCES "SupplierInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptNote" ADD CONSTRAINT "GoodsReceiptNote_dispatchChallanId_fkey" FOREIGN KEY ("dispatchChallanId") REFERENCES "DispatchChallan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptNote" ADD CONSTRAINT "GoodsReceiptNote_verifiedByUserId_fkey" FOREIGN KEY ("verifiedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_taxCategoryId_fkey" FOREIGN KEY ("taxCategoryId") REFERENCES "TaxCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierInvoiceItem" ADD CONSTRAINT "SupplierInvoiceItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierInvoiceItem" ADD CONSTRAINT "SupplierInvoiceItem_supplierInvoiceId_fkey" FOREIGN KEY ("supplierInvoiceId") REFERENCES "SupplierInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierInvoiceItem" ADD CONSTRAINT "SupplierInvoiceItem_purchaseOrderItemId_fkey" FOREIGN KEY ("purchaseOrderItemId") REFERENCES "PurchaseOrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierInvoiceItem" ADD CONSTRAINT "SupplierInvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierInvoiceItem" ADD CONSTRAINT "SupplierInvoiceItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierInvoice" ADD CONSTRAINT "SupplierInvoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierInvoice" ADD CONSTRAINT "SupplierInvoice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierInvoice" ADD CONSTRAINT "SupplierInvoice_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierAddress" ADD CONSTRAINT "SupplierAddress_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierAddress" ADD CONSTRAINT "SupplierAddress_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierContact" ADD CONSTRAINT "SupplierContact_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierContact" ADD CONSTRAINT "SupplierContact_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierPerformanceMetric" ADD CONSTRAINT "SupplierPerformanceMetric_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierPerformanceMetric" ADD CONSTRAINT "SupplierPerformanceMetric_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_taxCategoryId_fkey" FOREIGN KEY ("taxCategoryId") REFERENCES "TaxCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchChallanItem" ADD CONSTRAINT "DispatchChallanItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchChallanItem" ADD CONSTRAINT "DispatchChallanItem_dispatchChallanId_fkey" FOREIGN KEY ("dispatchChallanId") REFERENCES "DispatchChallan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchChallanItem" ADD CONSTRAINT "DispatchChallanItem_inventoryTransferItemId_fkey" FOREIGN KEY ("inventoryTransferItemId") REFERENCES "InventoryTransferItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchChallanItem" ADD CONSTRAINT "DispatchChallanItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchChallanItem" ADD CONSTRAINT "DispatchChallanItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchChallanItem" ADD CONSTRAINT "DispatchChallanItem_storageBinId_fkey" FOREIGN KEY ("storageBinId") REFERENCES "StorageBin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchChallan" ADD CONSTRAINT "DispatchChallan_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchChallan" ADD CONSTRAINT "DispatchChallan_inventoryTransferId_fkey" FOREIGN KEY ("inventoryTransferId") REFERENCES "InventoryTransfer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchChallan" ADD CONSTRAINT "DispatchChallan_originLocationId_fkey" FOREIGN KEY ("originLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchChallan" ADD CONSTRAINT "DispatchChallan_destinationLocationId_fkey" FOREIGN KEY ("destinationLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransferItem" ADD CONSTRAINT "InventoryTransferItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransferItem" ADD CONSTRAINT "InventoryTransferItem_inventoryTransferId_fkey" FOREIGN KEY ("inventoryTransferId") REFERENCES "InventoryTransfer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransferItem" ADD CONSTRAINT "InventoryTransferItem_transferRequestItemId_fkey" FOREIGN KEY ("transferRequestItemId") REFERENCES "TransferRequestItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransferItem" ADD CONSTRAINT "InventoryTransferItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransferItem" ADD CONSTRAINT "InventoryTransferItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransferItem" ADD CONSTRAINT "InventoryTransferItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "InventoryBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransfer" ADD CONSTRAINT "InventoryTransfer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransfer" ADD CONSTRAINT "InventoryTransfer_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransfer" ADD CONSTRAINT "InventoryTransfer_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransfer" ADD CONSTRAINT "InventoryTransfer_transferRequestId_fkey" FOREIGN KEY ("transferRequestId") REFERENCES "TransferRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTaskItem" ADD CONSTRAINT "PickingTaskItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTaskItem" ADD CONSTRAINT "PickingTaskItem_pickingTaskId_fkey" FOREIGN KEY ("pickingTaskId") REFERENCES "PickingTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTaskItem" ADD CONSTRAINT "PickingTaskItem_transferRequestItemId_fkey" FOREIGN KEY ("transferRequestItemId") REFERENCES "TransferRequestItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTaskItem" ADD CONSTRAINT "PickingTaskItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTaskItem" ADD CONSTRAINT "PickingTaskItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTaskItem" ADD CONSTRAINT "PickingTaskItem_storageBinId_fkey" FOREIGN KEY ("storageBinId") REFERENCES "StorageBin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTaskItem" ADD CONSTRAINT "PickingTaskItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "InventoryBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTask" ADD CONSTRAINT "PickingTask_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTask" ADD CONSTRAINT "PickingTask_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTask" ADD CONSTRAINT "PickingTask_transferRequestId_fkey" FOREIGN KEY ("transferRequestId") REFERENCES "TransferRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTask" ADD CONSTRAINT "PickingTask_dispatchChallanId_fkey" FOREIGN KEY ("dispatchChallanId") REFERENCES "DispatchChallan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTask" ADD CONSTRAINT "PickingTask_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTask" ADD CONSTRAINT "PickingTask_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "LocationZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickingTask" ADD CONSTRAINT "PickingTask_binId_fkey" FOREIGN KEY ("binId") REFERENCES "StorageBin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRequestItem" ADD CONSTRAINT "TransferRequestItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRequestItem" ADD CONSTRAINT "TransferRequestItem_transferRequestId_fkey" FOREIGN KEY ("transferRequestId") REFERENCES "TransferRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRequestItem" ADD CONSTRAINT "TransferRequestItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRequestItem" ADD CONSTRAINT "TransferRequestItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRequest" ADD CONSTRAINT "TransferRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRequest" ADD CONSTRAINT "TransferRequest_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRequest" ADD CONSTRAINT "TransferRequest_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRequest" ADD CONSTRAINT "TransferRequest_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRequest" ADD CONSTRAINT "TransferRequest_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
