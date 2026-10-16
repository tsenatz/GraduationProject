-- Safely add ALL columns that may be missing from the Property table.
-- Uses IF NOT EXISTS so this is idempotent and safe to run multiple times.

-- Relationship / ownership
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Core listing fields
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "titleAm" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "isNegotiable" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "areaSqM" DOUBLE PRECISION;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "propertyType" TEXT NOT NULL DEFAULT 'Apartment';
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'FOR_SALE';
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "listingType" TEXT NOT NULL DEFAULT 'SALE';
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "titleDeedStatus" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "beds" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "baths" DOUBLE PRECISION NOT NULL DEFAULT 1;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "sqft" INTEGER NOT NULL DEFAULT 100;

-- Location fields
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "subCity" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "subCityAm" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "woreda" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "specificArea" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "specificAreaAm" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "city" TEXT NOT NULL DEFAULT 'Addis Ababa';
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "state" TEXT NOT NULL DEFAULT 'Addis Ababa';
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "zipCode" TEXT NOT NULL DEFAULT '1000';
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION NOT NULL DEFAULT 9.0107;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION NOT NULL DEFAULT 38.7612;

-- Media & features
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Contact fields
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "ownerName" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "contactPhone" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "preferredTime" TEXT DEFAULT 'anytime';

-- referenceNo: add nullable first, populate existing rows, then add unique constraint
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "referenceNo" TEXT;
UPDATE "Property" SET "referenceNo" = gen_random_uuid()::text WHERE "referenceNo" IS NULL;

-- Timestamps
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add unique constraint on referenceNo if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Property_referenceNo_key'
  ) THEN
    ALTER TABLE "Property" ADD CONSTRAINT "Property_referenceNo_key" UNIQUE ("referenceNo");
  END IF;
END$$;

-- Add foreign key to User if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Property_userId_fkey'
  ) THEN
    ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;

-- Create indexes only after all columns are confirmed to exist
CREATE INDEX IF NOT EXISTS "Property_userId_idx" ON "Property"("userId");
CREATE INDEX IF NOT EXISTS "Property_status_idx" ON "Property"("status");
CREATE INDEX IF NOT EXISTS "Property_subCity_idx" ON "Property"("subCity");
CREATE INDEX IF NOT EXISTS "Property_latitude_longitude_idx" ON "Property"("latitude", "longitude");
