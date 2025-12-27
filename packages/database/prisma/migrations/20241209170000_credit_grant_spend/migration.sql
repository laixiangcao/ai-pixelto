-- Create credit grant / spend tables and drop legacy credit_transaction

-- Legacy cleanup
DROP TABLE IF EXISTS "credit_transaction";

-- Create tables
CREATE TABLE "credit_grant" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "organizationId" TEXT,
    "amount" INTEGER NOT NULL,
    "remainingAmount" INTEGER NOT NULL,
    "type" "CreditType" NOT NULL,
    "reason" TEXT,
    "expiresAt" TIMESTAMP(3),
    "sourceRef" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "credit_grant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "credit_spend" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "organizationId" TEXT,
    "grantId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT,
    "spendRef" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "credit_spend_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "credit_grant_user_expires_remaining_idx" ON "credit_grant"("userId", "expiresAt", "remainingAmount");
CREATE INDEX "credit_grant_user_type_idx" ON "credit_grant"("userId", "type");
CREATE INDEX "credit_grant_org_idx" ON "credit_grant"("organizationId");
CREATE INDEX "credit_grant_expires_idx" ON "credit_grant"("expiresAt");

CREATE INDEX "credit_spend_user_idx" ON "credit_spend"("userId");
CREATE INDEX "credit_spend_org_idx" ON "credit_spend"("organizationId");
CREATE INDEX "credit_spend_grant_idx" ON "credit_spend"("grantId");

-- Foreign keys
ALTER TABLE "credit_grant" ADD CONSTRAINT "credit_grant_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "credit_grant" ADD CONSTRAINT "credit_grant_organization_id_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "credit_spend" ADD CONSTRAINT "credit_spend_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "credit_spend" ADD CONSTRAINT "credit_spend_organization_id_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "credit_spend" ADD CONSTRAINT "credit_spend_grant_id_fkey" FOREIGN KEY ("grantId") REFERENCES "credit_grant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
