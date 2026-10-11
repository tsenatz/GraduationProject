-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "titleAm" TEXT,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "isNegotiable" BOOLEAN NOT NULL DEFAULT true,
    "beds" INTEGER NOT NULL DEFAULT 1,
    "baths" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "sqft" INTEGER NOT NULL DEFAULT 100,
    "areaSqM" DOUBLE PRECISION,
    "propertyType" TEXT NOT NULL DEFAULT 'Apartment',
    "status" TEXT NOT NULL DEFAULT 'FOR_SALE',
    "listingType" TEXT NOT NULL DEFAULT 'SALE',
    "titleDeedStatus" TEXT,
    "subCity" TEXT,
    "subCityAm" TEXT,
    "woreda" TEXT,
    "specificArea" TEXT,
    "specificAreaAm" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Addis Ababa',
    "state" TEXT NOT NULL DEFAULT 'Addis Ababa',
    "zipCode" TEXT NOT NULL DEFAULT '1000',
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 9.0107,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 38.7612,
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ownerName" TEXT,
    "contactPhone" TEXT,
    "preferredTime" TEXT DEFAULT 'anytime',
    "referenceNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_referenceNo_key" ON "Property"("referenceNo");

-- CreateIndex
CREATE INDEX "Property_userId_idx" ON "Property"("userId");

-- CreateIndex
CREATE INDEX "Property_status_idx" ON "Property"("status");

-- CreateIndex
CREATE INDEX "Property_subCity_idx" ON "Property"("subCity");

-- CreateIndex
CREATE INDEX "Property_latitude_longitude_idx" ON "Property"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
