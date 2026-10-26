"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { getAuthenticatedUser } from "@/lib/actions/listings";
import { revalidatePath } from "next/cache";

export interface RentalPropertyInput {
  title: string;
  titleAm?: string;
  description?: string;
  priceETB: number;
  depositETB?: number;
  isNegotiable?: boolean;
  bedrooms: number;
  bathrooms: number;
  areaSqM: number;
  propertyType: string; // "apartment" | "villa" | "condominium" | "townhouse" | "penthouse"
  subCity: string;
  specificArea?: string;
  woreda?: string;
  leaseTerm?: string; // "6_months" | "12_months" | "flexible"
  furnishedStatus?: "unfurnished" | "semi_furnished" | "fully_furnished";
  amenities?: string[];
  images?: string[];
  contactPhone?: string;
  availableDate?: string;
  status?: "FOR_RENT" | "RENTED" | "OFF_MARKET";
}

export interface RentalPropertyRecord {
  id: string;
  userId: string;
  referenceNo: string;
  title: string;
  titleAm?: string;
  description: string;
  priceETB: number;
  depositETB: number;
  isNegotiable: boolean;
  bedrooms: number;
  bathrooms: number;
  areaSqM: number;
  propertyType: string;
  subCity: string;
  specificArea: string;
  woreda?: string;
  address: string;
  leaseTerm: string;
  furnishedStatus: string;
  amenities: string[];
  images: string[];
  status: "FOR_RENT" | "RENTED" | "OFF_MARKET";
  listingType: "RENT";
  createdAt: string;
  inquiriesCount: number;
  applicationsCount: number;
}

export interface RentalActionResult<T = any> {
  success: boolean;
  error?: string;
  data?: T;
  properties?: RentalPropertyRecord[];
  property?: RentalPropertyRecord;
  isAuthenticated?: boolean;
}

export interface RentPaymentRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  unitName: string;
  tenantName: string;
  tenantPhone: string;
  amountETB: number;
  periodMonth: string;
  dueDate: string;
  paidDate?: string;
  status: "PAID" | "PENDING" | "OVERDUE";
  paymentMethod?: "Telebirr" | "CBE Birr" | "Bank Transfer" | "Cash" | "Check";
  referenceNo?: string;
  notes?: string;
}

export interface RentPaymentsSummary {
  totalExpectedETB: number;
  totalCollectedETB: number;
  totalPendingETB: number;
  totalOverdueETB: number;
  collectionRatePct: number;
  totalTenants: number;
  paidTenants: number;
}

export interface RentalPaymentsResult {
  success: boolean;
  error?: string;
  payments?: RentPaymentRecord[];
  summary?: RentPaymentsSummary;
}

export interface RentalApplicationRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  unitName?: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  monthlyIncomeETB: number;
  desiredMoveIn: string;
  householdSize: number;
  employment: string;
  message?: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  submittedAt: string;
}

export interface RentalApplicationsResult {
  success: boolean;
  error?: string;
  applications?: RentalApplicationRecord[];
  stats?: {
    total: number;
    pending: number;
    approved: number;
    declined: number;
  };
}

export interface LeaseRecord {
  id: string;
  leaseNumber: string;
  propertyId: string;
  propertyTitle: string;
  unitName: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail?: string;
  monthlyRentETB: number;
  depositETB: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "TERMINATED";
  utilitiesIncluded: string[];
  rules: string[];
  signedDate: string;
}

export interface LeasesResult {
  success: boolean;
  error?: string;
  leases?: LeaseRecord[];
  stats?: {
    totalActive: number;
    expiringSoon: number;
    expired: number;
    monthlyContractedETB: number;
  };
}

export interface LandlordAlertRecord {
  id: string;
  type: "RENT_DUE" | "RENT_OVERDUE" | "NEW_APPLICATION" | "LEASE_EXPIRING" | "TOUR_REQUEST" | "LISTING_MILESTONE";
  title: string;
  message: string;
  severity: "info" | "warning" | "error" | "success";
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface AlertsResult {
  success: boolean;
  error?: string;
  alerts?: LandlordAlertRecord[];
  unreadCount?: number;
}


// Initial mock properties for offline & local development demo
const SEED_RENTAL_PROPERTIES: RentalPropertyRecord[] = [
  {
    id: "rental-101",
    userId: "demo-landlord-1",
    referenceNo: "ERN-RNT-4821",
    title: "Luxury 2-Bedroom Furnished Apartment in Bole Atlas",
    titleAm: "የቅንጦት 2-መኝታ የተሟላ አፓርታማ ቦሌ አትላስ",
    description:
      "Fully furnished contemporary apartment with standby generator, high-capacity water reservoir, underground parking, and 24/7 security. Walking distance to Edna Mall and international restaurants.",
    priceETB: 55000,
    depositETB: 110000,
    isNegotiable: true,
    bedrooms: 2,
    bathrooms: 2,
    areaSqM: 120,
    propertyType: "Apartment",
    subCity: "Bole",
    specificArea: "Atlas, near Edna Mall",
    woreda: "03",
    address: "Atlas, Bole, Addis Ababa",
    leaseTerm: "12_months",
    furnishedStatus: "fully_furnished",
    amenities: [
      "Standby Generator",
      "Water Tank Reservoir",
      "24/7 Security",
      "High Speed WiFi",
      "Elevator",
      "Dedicated Parking",
      "Balcony City View",
    ],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
    ],
    status: "FOR_RENT",
    listingType: "RENT",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    inquiriesCount: 6,
    applicationsCount: 2,
  },
  {
    id: "rental-102",
    userId: "demo-landlord-1",
    referenceNo: "ERN-RNT-5914",
    title: "Modern 3-Bedroom Executive Flat in Kazanchis",
    titleAm: "ዘመናዊ 3-መኝታ የአስፈፃሚዎች አፓርታማ ካዛንቺስ",
    description:
      "Prime location in the diplomatic and business district of Kazanchis. Features spacious living room, fitted kitchen, master ensuite, and continuous backup power.",
    priceETB: 80000,
    depositETB: 160000,
    isNegotiable: false,
    bedrooms: 3,
    bathrooms: 3,
    areaSqM: 175,
    propertyType: "Apartment",
    subCity: "Kirkos",
    specificArea: "Kazanchis, near UNECA",
    woreda: "08",
    address: "Kazanchis, Kirkos, Addis Ababa",
    leaseTerm: "12_months",
    furnishedStatus: "semi_furnished",
    amenities: [
      "Standby Generator",
      "Water Tank Reservoir",
      "Biometric Security",
      "Gym Access",
      "Elevator",
      "Underground Parking",
    ],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
    ],
    status: "RENTED",
    listingType: "RENT",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    inquiriesCount: 12,
    applicationsCount: 5,
  },
];

// Server-side memory store fallback for offline/development mode
declare const globalThis: {
  __ernsLandlordRentals?: RentalPropertyRecord[];
  __ernsLandlordPayments?: RentPaymentRecord[];
  __ernsLandlordApplications?: RentalApplicationRecord[];
  __ernsLandlordLeases?: LeaseRecord[];
  __ernsLandlordAlerts?: LandlordAlertRecord[];
  __ernsReadAlertIds?: string[];
} & typeof global;

function getRentalMemoryStore(): RentalPropertyRecord[] {
  if (!globalThis.__ernsLandlordRentals) {
    globalThis.__ernsLandlordRentals = JSON.parse(
      JSON.stringify(SEED_RENTAL_PROPERTIES)
    );
  }
  return globalThis.__ernsLandlordRentals!;
}

/**
 * 1. Fetch landlord's rental properties
 * Strictly scoped to the authenticated user.
 */
export async function getLandlordRentalPropertiesAction(): Promise<RentalActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "AUTH_REQUIRED",
        isAuthenticated: false,
        properties: [],
      };
    }

    const user = await getAuthenticatedUser(session);
    const currentUserId = user?.id || session.user.id;
    const currentUserEmail = user?.email || session.user.email;
    const possibleUserIds = Array.from(
      new Set([currentUserId, session.user.id].filter(Boolean) as string[])
    );

    let dbProperties: RentalPropertyRecord[] = [];

    if (process.env.DATABASE_URL) {
      try {
        const records = await (db as any).property.findMany({
          where: {
            OR: [
              ...possibleUserIds.map((id) => ({ userId: id })),
              ...(currentUserEmail ? [{ user: { email: currentUserEmail } }] : []),
            ],
            listingType: "RENT",
          },
          orderBy: { createdAt: "desc" },
        });

        if (records && records.length > 0) {
          dbProperties = records.map((r: any) => ({
            id: r.id,
            userId: r.userId || currentUserId,
            referenceNo: r.referenceNo || `ERN-RNT-${r.id.slice(0, 4)}`,
            title: r.title,
            titleAm: r.titleAm || undefined,
            description: r.description || "",
            priceETB: r.price,
            depositETB: r.deposit || r.price * 2,
            isNegotiable: r.isNegotiable ?? true,
            bedrooms: r.beds || 1,
            bathrooms: r.baths ? Math.round(r.baths) : 1,
            areaSqM: r.areaSqM || 100,
            propertyType: r.propertyType || "Apartment",
            subCity: r.subCity || "Bole",
            specificArea: r.specificArea || r.subCity || "Addis Ababa",
            woreda: r.woreda || "",
            address: r.address || `${r.subCity}, Addis Ababa`,
            leaseTerm: r.leaseTerm || "12_months",
            furnishedStatus: r.furnishedStatus || "semi_furnished",
            amenities: r.amenities || [],
            images:
              r.images && r.images.length > 0
                ? r.images
                : [
                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80",
                  ],
            status: r.status === "SOLD" ? "RENTED" : (r.status || "FOR_RENT"),
            listingType: "RENT",
            createdAt: r.createdAt
              ? new Date(r.createdAt).toISOString()
              : new Date().toISOString(),
            inquiriesCount: r.inquiriesCount || 0,
            applicationsCount: r.applicationsCount || 0,
          }));
        }
      } catch (dbErr) {
        console.warn("DB query skipped for rentals, using fallback:", dbErr);
      }
    }

    // Merge in-memory properties strictly belonging to this user
    const store = getRentalMemoryStore();
    const existingDbIds = new Set(dbProperties.map((p) => p.id));
    const userMemoryProps = store.filter(
      (p) =>
        (possibleUserIds.includes(p.userId) ||
          (currentUserEmail && p.userId === currentUserEmail)) &&
        !existingDbIds.has(p.id)
    );

    const properties = [...dbProperties, ...userMemoryProps];

    return {
      success: true,
      isAuthenticated: true,
      properties,
    };
  } catch (error: any) {
    console.error("Failed to fetch landlord rental properties:", error);
    return {
      success: false,
      error: error.message || "Failed to load properties",
      properties: [],
    };
  }
}

/**
 * 2. Create a new rental property listing
 */
export async function createRentalPropertyAction(
  data: RentalPropertyInput
): Promise<RentalActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "AUTH_REQUIRED",
        isAuthenticated: false,
      };
    }

    const user = await getAuthenticatedUser(session);
    const currentUserId = user?.id || session.user.id || "user-landlord";
    const currentUserName = session.user.name || user?.name || "Landlord";

    const refNumber = `ERN-RNT-${Math.floor(10000 + Math.random() * 90000)}`;
    const address = `${data.specificArea || data.subCity}, Addis Ababa`;
    const deposit = data.depositETB || data.priceETB * 2;

    const newRecord: RentalPropertyRecord = {
      id: `rental-${Date.now()}`,
      userId: currentUserId,
      referenceNo: refNumber,
      title: data.title,
      titleAm: data.titleAm,
      description: data.description || "",
      priceETB: data.priceETB,
      depositETB: deposit,
      isNegotiable: data.isNegotiable ?? true,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      areaSqM: data.areaSqM,
      propertyType: data.propertyType,
      subCity: data.subCity,
      specificArea: data.specificArea || data.subCity,
      woreda: data.woreda,
      address,
      leaseTerm: data.leaseTerm || "12_months",
      furnishedStatus: data.furnishedStatus || "unfurnished",
      amenities: data.amenities || [
        "Water Reservoir Tank",
        "Standby Generator",
        "24/7 Compound Security",
      ],
      images:
        data.images && data.images.length > 0
          ? data.images
          : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80"],
      status: data.status || "FOR_RENT",
      listingType: "RENT",
      createdAt: new Date().toISOString(),
      inquiriesCount: 0,
      applicationsCount: 0,
    };

    // A. DB insertion if available
    if (process.env.DATABASE_URL) {
      try {
        const created = await (db as any).property.create({
          data: {
            userId: currentUserId,
            referenceNo: refNumber,
            title: data.title,
            titleAm: data.titleAm || null,
            description: data.description || "",
            price: data.priceETB,
            isNegotiable: data.isNegotiable ?? true,
            beds: data.bedrooms,
            baths: data.bathrooms,
            sqft: Math.round(data.areaSqM * 10.764),
            areaSqM: data.areaSqM,
            propertyType: data.propertyType,
            status: "FOR_RENT",
            listingType: "RENT",
            subCity: data.subCity,
            woreda: data.woreda || "",
            specificArea: data.specificArea || data.subCity,
            address,
            city: "Addis Ababa",
            state: "Addis Ababa",
            zipCode: "1000",
            latitude: 9.0105,
            longitude: 38.7615,
            amenities: newRecord.amenities,
            images: newRecord.images,
            ownerName: currentUserName,
            contactPhone: data.contactPhone || "+251911234567",
          },
        });
        newRecord.id = created.id;
      } catch (dbErr) {
        console.warn("DB insert skipped for new rental:", dbErr);
      }
    }

    // B. Memory store fallback
    const store = getRentalMemoryStore();
    store.unshift(newRecord);

    revalidatePath("/rentalmanager/properties");
    revalidatePath("/rentalmanager/dashboard");
    revalidatePath("/rentalmanager/alerts");
    revalidatePath("/search");

    return {
      success: true,
      property: newRecord,
    };
  } catch (error: any) {
    console.error("Failed to create rental property:", error);
    return {
      success: false,
      error: error.message || "Failed to create rental property",
    };
  }
}

/**
 * 3. Update property status (Listed, Rented / Occupied, Off-Market)
 */
export async function updateRentalStatusAction(
  propertyId: string,
  newStatus: "FOR_RENT" | "RENTED" | "OFF_MARKET"
): Promise<RentalActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED", isAuthenticated: false };
    }

    if (process.env.DATABASE_URL) {
      try {
        await (db as any).property.update({
          where: { id: propertyId },
          data: {
            status: newStatus === "RENTED" ? "SOLD" : newStatus,
          },
        });
      } catch (err) {
        console.warn("DB update status skipped:", err);
      }
    }

    const store = getRentalMemoryStore();
    const item = store.find((p) => p.id === propertyId);
    if (item) {
      item.status = newStatus;
    }

    revalidatePath("/rentalmanager/properties");
    revalidatePath("/rentalmanager/dashboard");
    revalidatePath("/rentalmanager/alerts");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 4. Update full rental property listing details (Edit mode)
 */
export async function updateRentalPropertyAction(
  propertyId: string,
  data: Partial<RentalPropertyInput>
): Promise<RentalActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED", isAuthenticated: false };
    }

    const store = getRentalMemoryStore();
    const existing = store.find((p) => p.id === propertyId);

    if (process.env.DATABASE_URL) {
      try {
        await (db as any).property.update({
          where: { id: propertyId },
          data: {
            ...(data.title ? { title: data.title } : {}),
            ...(data.priceETB ? { price: data.priceETB } : {}),
            ...(data.depositETB ? { deposit: data.depositETB } : {}),
            ...(data.bedrooms ? { beds: data.bedrooms } : {}),
            ...(data.bathrooms ? { baths: data.bathrooms } : {}),
            ...(data.areaSqM ? { areaSqM: data.areaSqM, sqft: Math.round(data.areaSqM * 10.764) } : {}),
            ...(data.propertyType ? { propertyType: data.propertyType } : {}),
            ...(data.subCity ? { subCity: data.subCity } : {}),
            ...(data.specificArea ? { specificArea: data.specificArea } : {}),
            ...(data.description ? { description: data.description } : {}),
            ...(data.amenities ? { amenities: data.amenities } : {}),
            ...(data.images ? { images: data.images } : {}),
            ...(data.contactPhone ? { contactPhone: data.contactPhone } : {}),
          },
        });
      } catch (err) {
        console.warn("DB update property skipped:", err);
      }
    }

    if (existing) {
      if (data.title) existing.title = data.title;
      if (data.priceETB !== undefined) existing.priceETB = data.priceETB;
      if (data.depositETB !== undefined) existing.depositETB = data.depositETB;
      if (data.bedrooms !== undefined) existing.bedrooms = data.bedrooms;
      if (data.bathrooms !== undefined) existing.bathrooms = data.bathrooms;
      if (data.areaSqM !== undefined) existing.areaSqM = data.areaSqM;
      if (data.propertyType) existing.propertyType = data.propertyType;
      if (data.subCity) existing.subCity = data.subCity;
      if (data.specificArea) {
        existing.specificArea = data.specificArea;
        existing.address = `${data.specificArea}, ${existing.subCity}, Addis Ababa`;
      }
      if (data.description !== undefined) existing.description = data.description;
      if (data.amenities) existing.amenities = data.amenities;
      if (data.images && data.images.length > 0) existing.images = data.images;
      if (data.furnishedStatus) existing.furnishedStatus = data.furnishedStatus;
      if (data.leaseTerm) existing.leaseTerm = data.leaseTerm;
    }

    revalidatePath("/rentalmanager/properties");
    revalidatePath("/rentalmanager/dashboard");

    return {
      success: true,
      property: existing,
    };
  } catch (error: any) {
    console.error("Failed to update rental property:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 5. Delete rental property listing
 */
export async function deleteRentalPropertyAction(
  propertyId: string
): Promise<RentalActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED", isAuthenticated: false };
    }

    const user = await getAuthenticatedUser(session);
    const currentUserId = user?.id || session.user.id;

    if (process.env.DATABASE_URL) {
      try {
        await (db as any).property.deleteMany({
          where: {
            id: propertyId,
            ...(currentUserId ? { userId: currentUserId } : {}),
          },
        });
      } catch (err) {
        console.warn("DB delete skipped:", err);
      }
    }

    const store = getRentalMemoryStore();
    const idx = store.findIndex((p) => p.id === propertyId);
    if (idx !== -1) {
      store.splice(idx, 1);
    }

    revalidatePath("/rentalmanager/properties");
    revalidatePath("/rentalmanager/dashboard");
    revalidatePath("/rentalmanager/alerts");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// -------------------------------------------------------------
// RENT PAYMENTS LEDGER ACTIONS & SEED DATA
// -------------------------------------------------------------
const SEED_RENTAL_PAYMENTS: RentPaymentRecord[] = [
  {
    id: "pay-101",
    propertyId: "rental-101",
    propertyTitle: "Luxury 2-Bedroom Furnished Apartment in Bole Atlas",
    unitName: "Unit 201",
    tenantName: "Dawit Haile",
    tenantPhone: "+251 91 145 6789",
    amountETB: 55000,
    periodMonth: "October 2026",
    dueDate: "2026-10-05",
    paidDate: "2026-10-03",
    status: "PAID",
    paymentMethod: "Telebirr",
    referenceNo: "TB-94182901",
    notes: "October rent paid early via Telebirr merchant code.",
  },
  {
    id: "pay-102",
    propertyId: "rental-102",
    propertyTitle: "Modern 3-Bedroom Executive Flat in Kazanchis",
    unitName: "Unit 4A",
    tenantName: "Helen Tadesse",
    tenantPhone: "+251 92 334 5566",
    amountETB: 80000,
    periodMonth: "October 2026",
    dueDate: "2026-10-05",
    paidDate: "2026-10-04",
    status: "PAID",
    paymentMethod: "CBE Birr",
    referenceNo: "CBE-4819203",
    notes: "Direct bank transfer verified by CBE notification.",
  },
  {
    id: "pay-103",
    propertyId: "rental-101",
    propertyTitle: "Luxury 2-Bedroom Furnished Apartment in Bole Atlas",
    unitName: "Unit 102",
    tenantName: "Yared Bekele",
    tenantPhone: "+251 93 456 7890",
    amountETB: 48000,
    periodMonth: "October 2026",
    dueDate: "2026-10-18",
    status: "PENDING",
    notes: "Upcoming due date in 4 days.",
  },
  {
    id: "pay-104",
    propertyId: "rental-102",
    propertyTitle: "Modern 3-Bedroom Executive Flat in Kazanchis",
    unitName: "Unit 1B",
    tenantName: "Michael Smith",
    tenantPhone: "+251 94 567 8901",
    amountETB: 65000,
    periodMonth: "October 2026",
    dueDate: "2026-10-01",
    status: "OVERDUE",
    notes: "Grace period expired on Oct 7. Reminder sent via SMS.",
  },
];

function getPaymentsMemoryStore(): RentPaymentRecord[] {
  if (!globalThis.__ernsLandlordPayments) {
    globalThis.__ernsLandlordPayments = JSON.parse(
      JSON.stringify(SEED_RENTAL_PAYMENTS)
    );
  }
  return globalThis.__ernsLandlordPayments!;
}

export async function getLandlordRentalPaymentsAction(): Promise<RentalPaymentsResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "AUTH_REQUIRED",
        payments: [],
      };
    }

    // Resolve current landlord's properties
    const propsRes = await getLandlordRentalPropertiesAction();
    const userProperties = propsRes.properties || [];
    const userPropertyIds = new Set(userProperties.map((p) => p.id));
    const userPropertyTitles = new Set(userProperties.map((p) => p.title.toLowerCase().trim()));

    const store = getPaymentsMemoryStore();
    // Only payments for properties belonging to this landlord
    const payments = store.filter(
      (p) =>
        userPropertyIds.has(p.propertyId) ||
        userPropertyTitles.has(p.propertyTitle.toLowerCase().trim())
    );

    const totalExpectedETB = payments.reduce((acc, p) => acc + p.amountETB, 0);
    const totalCollectedETB = payments
      .filter((p) => p.status === "PAID")
      .reduce((acc, p) => acc + p.amountETB, 0);
    const totalPendingETB = payments
      .filter((p) => p.status === "PENDING")
      .reduce((acc, p) => acc + p.amountETB, 0);
    const totalOverdueETB = payments
      .filter((p) => p.status === "OVERDUE")
      .reduce((acc, p) => acc + p.amountETB, 0);

    const totalTenants = payments.length;
    const paidTenants = payments.filter((p) => p.status === "PAID").length;
    const collectionRatePct =
      totalExpectedETB > 0
        ? Math.round((totalCollectedETB / totalExpectedETB) * 100)
        : 0;

    return {
      success: true,
      payments,
      summary: {
        totalExpectedETB,
        totalCollectedETB,
        totalPendingETB,
        totalOverdueETB,
        collectionRatePct,
        totalTenants,
        paidTenants,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message, payments: [] };
  }
}

export async function recordRentPaymentAction(
  paymentId: string,
  details: {
    paidDate?: string;
    paymentMethod: "Telebirr" | "CBE Birr" | "Bank Transfer" | "Cash" | "Check";
    referenceNo?: string;
    notes?: string;
  }
): Promise<RentalActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED", isAuthenticated: false };
    }

    const store = getPaymentsMemoryStore();
    const item = store.find((p) => p.id === paymentId);
    if (!item) {
      return { success: false, error: "Payment record not found" };
    }

    item.status = "PAID";
    item.paidDate = details.paidDate || new Date().toISOString().split("T")[0];
    item.paymentMethod = details.paymentMethod;
    if (details.referenceNo) item.referenceNo = details.referenceNo;
    if (details.notes) item.notes = details.notes;

    revalidatePath("/rentalmanager/payments");
    revalidatePath("/rentalmanager/dashboard");
    revalidatePath("/rentalmanager/alerts");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// -------------------------------------------------------------
// RENTAL APPLICATIONS & TENANT INQUIRIES ACTIONS & SEED DATA
// -------------------------------------------------------------
const SEED_RENTAL_APPLICATIONS: RentalApplicationRecord[] = [
  {
    id: "app-201",
    propertyId: "rental-101",
    propertyTitle: "Luxury 2-Bedroom Furnished Apartment in Bole Atlas",
    unitName: "Unit 201",
    applicantName: "Bethelhem Girma",
    applicantPhone: "+251 91 189 0123",
    applicantEmail: "bethelhem.g@example.com",
    monthlyIncomeETB: 140000,
    desiredMoveIn: "2026-11-01",
    householdSize: 2,
    employment: "Senior Software Engineer at UNECA",
    message: "Relocating for UN contract. Ready to pay 6 months upfront deposit in ETB.",
    status: "PENDING",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "app-202",
    propertyId: "rental-102",
    propertyTitle: "Modern 3-Bedroom Executive Flat in Kazanchis",
    unitName: "Unit 4A",
    applicantName: "Samuel Alemu",
    applicantPhone: "+251 92 456 7891",
    applicantEmail: "samuel.alemu@example.com",
    monthlyIncomeETB: 195000,
    desiredMoveIn: "2026-10-25",
    householdSize: 3,
    employment: "Branch Manager at Awash Bank",
    message: "Family of 3 with 1 child. Seeking quiet executive residence near Kazanchis financial hub.",
    status: "APPROVED",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "app-203",
    propertyId: "rental-101",
    propertyTitle: "Luxury 2-Bedroom Furnished Apartment in Bole Atlas",
    unitName: "Unit 102",
    applicantName: "Hana Kassa",
    applicantPhone: "+251 93 789 0124",
    applicantEmail: "hana.k@example.com",
    monthlyIncomeETB: 65000,
    desiredMoveIn: "2026-12-01",
    householdSize: 1,
    employment: "Accountant at Private Import Firm",
    message: "Looking for a furnished 1 or 2 bedroom flat in Bole.",
    status: "DECLINED",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
];

function getApplicationsMemoryStore(): RentalApplicationRecord[] {
  if (!globalThis.__ernsLandlordApplications) {
    globalThis.__ernsLandlordApplications = JSON.parse(
      JSON.stringify(SEED_RENTAL_APPLICATIONS)
    );
  }
  return globalThis.__ernsLandlordApplications!;
}

export async function getLandlordRentalApplicationsAction(): Promise<RentalApplicationsResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "AUTH_REQUIRED",
        applications: [],
      };
    }

    const propsRes = await getLandlordRentalPropertiesAction();
    const userProperties = propsRes.properties || [];
    const userPropertyIds = new Set(userProperties.map((p) => p.id));
    const userPropertyTitles = new Set(userProperties.map((p) => p.title.toLowerCase().trim()));

    const store = getApplicationsMemoryStore();
    const applications = store.filter(
      (a) =>
        userPropertyIds.has(a.propertyId) ||
        userPropertyTitles.has(a.propertyTitle.toLowerCase().trim())
    );

    const total = applications.length;
    const pending = applications.filter((a) => a.status === "PENDING").length;
    const approved = applications.filter((a) => a.status === "APPROVED").length;
    const declined = applications.filter((a) => a.status === "DECLINED").length;

    return {
      success: true,
      applications,
      stats: { total, pending, approved, declined },
    };
  } catch (error: any) {
    return { success: false, error: error.message, applications: [] };
  }
}

export async function updateRentalApplicationStatusAction(
  applicationId: string,
  status: "PENDING" | "APPROVED" | "DECLINED"
): Promise<RentalActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED", isAuthenticated: false };
    }

    const store = getApplicationsMemoryStore();
    const item = store.find((a) => a.id === applicationId);
    if (!item) {
      return { success: false, error: "Application not found" };
    }

    item.status = status;

    revalidatePath("/rentalmanager/applications");
    revalidatePath("/rentalmanager/dashboard");
    revalidatePath("/rentalmanager/alerts");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// -------------------------------------------------------------
// LEASE AGREEMENTS ACTIONS & SEED DATA
// -------------------------------------------------------------
const SEED_RENTAL_LEASES: LeaseRecord[] = [
  {
    id: "lease-301",
    leaseNumber: "ERN-LSE-2025-01",
    propertyId: "rental-101",
    propertyTitle: "Luxury 2-Bedroom Furnished Apartment in Bole Atlas",
    unitName: "Unit 201",
    tenantName: "Dawit Haile",
    tenantPhone: "+251 91 145 6789",
    tenantEmail: "dawit.h@example.com",
    monthlyRentETB: 55000,
    depositETB: 110000,
    startDate: "2025-11-01",
    endDate: "2026-11-01",
    status: "ACTIVE",
    utilitiesIncluded: [
      "Standby Generator Fuel Contribution",
      "Water Reservoir Tank Service",
      "24/7 Compound Security",
      "Building Elevator & Common Area Cleaning",
    ],
    rules: [
      "Residential occupancy only (max 3 persons)",
      "Quiet hours observed 10:00 PM – 7:00 AM",
      "Subletting or commercial use strictly prohibited",
    ],
    signedDate: "2025-10-28",
  },
  {
    id: "lease-302",
    leaseNumber: "ERN-LSE-2025-02",
    propertyId: "rental-102",
    propertyTitle: "Modern 3-Bedroom Executive Flat in Kazanchis",
    unitName: "Unit 4A",
    tenantName: "Helen Tadesse",
    tenantPhone: "+251 92 334 5566",
    tenantEmail: "helen.t@example.com",
    monthlyRentETB: 80000,
    depositETB: 160000,
    startDate: "2025-11-15",
    endDate: "2026-11-15",
    status: "EXPIRING_SOON",
    utilitiesIncluded: [
      "Standby Generator Access",
      "Dedicated Basement Parking",
      "Gym Access & Compound Security",
    ],
    rules: [
      "No smoking in common corridors",
      "One registered pet allowed with security deposit",
      "Rent payable within first 5 days of calendar month",
    ],
    signedDate: "2025-11-10",
  },
  {
    id: "lease-303",
    leaseNumber: "ERN-LSE-2026-03",
    propertyId: "rental-101",
    propertyTitle: "Luxury 2-Bedroom Furnished Apartment in Bole Atlas",
    unitName: "Unit 102",
    tenantName: "Yared Bekele",
    tenantPhone: "+251 93 456 7890",
    tenantEmail: "yared.b@example.com",
    monthlyRentETB: 48000,
    depositETB: 96000,
    startDate: "2026-02-01",
    endDate: "2027-02-01",
    status: "ACTIVE",
    utilitiesIncluded: [
      "Water Tank Reservoir",
      "Standby Generator",
      "Dedicated Parking",
    ],
    rules: [
      "Strict residential use",
      "Notice of renewal minimum 60 days before expiration",
    ],
    signedDate: "2026-01-25",
  },
];

function getLeasesMemoryStore(): LeaseRecord[] {
  if (!globalThis.__ernsLandlordLeases) {
    globalThis.__ernsLandlordLeases = JSON.parse(
      JSON.stringify(SEED_RENTAL_LEASES)
    );
  }
  return globalThis.__ernsLandlordLeases!;
}

export async function getLandlordLeasesAction(): Promise<LeasesResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "AUTH_REQUIRED",
        leases: [],
      };
    }

    const propsRes = await getLandlordRentalPropertiesAction();
    const userProperties = propsRes.properties || [];
    const userPropertyIds = new Set(userProperties.map((p) => p.id));
    const userPropertyTitles = new Set(userProperties.map((p) => p.title.toLowerCase().trim()));

    const store = getLeasesMemoryStore();
    const leases = store.filter(
      (l) =>
        userPropertyIds.has(l.propertyId) ||
        userPropertyTitles.has(l.propertyTitle.toLowerCase().trim())
    );

    const totalActive = leases.filter(
      (l) => l.status === "ACTIVE" || l.status === "EXPIRING_SOON"
    ).length;
    const expiringSoon = leases.filter((l) => l.status === "EXPIRING_SOON").length;
    const expired = leases.filter((l) => l.status === "EXPIRED" || l.status === "TERMINATED").length;
    const monthlyContractedETB = leases
      .filter((l) => l.status === "ACTIVE" || l.status === "EXPIRING_SOON")
      .reduce((sum, l) => sum + l.monthlyRentETB, 0);

    return {
      success: true,
      leases,
      stats: {
        totalActive,
        expiringSoon,
        expired,
        monthlyContractedETB,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message, leases: [] };
  }
}

export async function createLeaseAgreementAction(input: {
  propertyId: string;
  propertyTitle: string;
  unitName: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail?: string;
  monthlyRentETB: number;
  depositETB: number;
  startDate: string;
  endDate: string;
  utilitiesIncluded?: string[];
  rules?: string[];
}): Promise<RentalActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED", isAuthenticated: false };
    }

    const store = getLeasesMemoryStore();
    const newLease: LeaseRecord = {
      id: `lease-${Date.now()}`,
      leaseNumber: `ERN-LSE-${new Date().getFullYear()}-${String(store.length + 1).padStart(2, "0")}`,
      propertyId: input.propertyId,
      propertyTitle: input.propertyTitle,
      unitName: input.unitName,
      tenantName: input.tenantName,
      tenantPhone: input.tenantPhone,
      tenantEmail: input.tenantEmail,
      monthlyRentETB: input.monthlyRentETB,
      depositETB: input.depositETB,
      startDate: input.startDate,
      endDate: input.endDate,
      status: "ACTIVE",
      utilitiesIncluded: input.utilitiesIncluded || [
        "Water Tank Reservoir",
        "Compound Security",
      ],
      rules: input.rules || [
        "Residential use only",
        "Rent payable in advance within first 5 days of month",
      ],
      signedDate: new Date().toISOString().split("T")[0],
    };

    store.unshift(newLease);

    // Also mark property as RENTED
    await updateRentalStatusAction(input.propertyId, "RENTED");

    // Also create initial scheduled payment in payments ledger for this tenant
    const paymentsStore = getPaymentsMemoryStore();
    paymentsStore.unshift({
      id: `pay-${Date.now()}`,
      propertyId: input.propertyId,
      propertyTitle: input.propertyTitle,
      unitName: input.unitName,
      tenantName: input.tenantName,
      tenantPhone: input.tenantPhone,
      amountETB: input.monthlyRentETB,
      periodMonth: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString().split("T")[0],
      status: "PENDING",
    });

    revalidatePath("/rentalmanager/leases");
    revalidatePath("/rentalmanager/payments");
    revalidatePath("/rentalmanager/properties");
    revalidatePath("/rentalmanager/dashboard");
    revalidatePath("/rentalmanager/alerts");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function terminateLeaseAction(
  leaseId: string
): Promise<RentalActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED", isAuthenticated: false };
    }

    const store = getLeasesMemoryStore();
    const item = store.find((l) => l.id === leaseId);
    if (!item) return { success: false, error: "Lease not found" };

    item.status = "TERMINATED";
    revalidatePath("/rentalmanager/leases");
    revalidatePath("/rentalmanager/dashboard");
    revalidatePath("/rentalmanager/alerts");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// -------------------------------------------------------------
// DYNAMIC LANDLORD ALERTS & NOTIFICATIONS ACTIONS
// -------------------------------------------------------------
function getReadAlertIdsStore(): string[] {
  if (!globalThis.__ernsReadAlertIds) {
    globalThis.__ernsReadAlertIds = ["alert-pay-paid-pay-101", "alert-prop-inquiries-rental-102"];
  }
  return globalThis.__ernsReadAlertIds;
}

function computeDynamicLandlordAlerts(
  payments: RentPaymentRecord[],
  applications: RentalApplicationRecord[],
  leases: LeaseRecord[],
  rentals: RentalPropertyRecord[]
): LandlordAlertRecord[] {
  const readIds = getReadAlertIdsStore();

  const alerts: LandlordAlertRecord[] = [];

  // 1. Dynamic alerts from Payments Ledger
  for (const p of payments) {
    if (p.status === "OVERDUE") {
      const id = `alert-pay-overdue-${p.id}`;
      alerts.push({
        id,
        type: "RENT_OVERDUE",
        title: `Rent Overdue: ${p.propertyTitle} (${p.unitName})`,
        message: `${p.tenantName} has an overdue rent payment of ${p.amountETB.toLocaleString()} ETB for ${p.periodMonth}. Grace period expired on ${p.dueDate}.`,
        severity: "error",
        timestamp: "Action required",
        isRead: readIds.includes(id),
        actionUrl: "/rentalmanager/payments",
        actionLabel: "Collect Payment",
      });
    } else if (p.status === "PENDING") {
      const id = `alert-pay-pending-${p.id}`;
      alerts.push({
        id,
        type: "RENT_DUE",
        title: `Rent Due Soon: ${p.propertyTitle} (${p.unitName})`,
        message: `${p.tenantName}'s scheduled rent of ${p.amountETB.toLocaleString()} ETB for ${p.periodMonth} is due on ${p.dueDate}.`,
        severity: "info",
        timestamp: "Due soon",
        isRead: readIds.includes(id),
        actionUrl: "/rentalmanager/payments",
        actionLabel: "View Ledger",
      });
    } else if (p.status === "PAID") {
      const id = `alert-pay-paid-${p.id}`;
      alerts.push({
        id,
        type: "RENT_DUE",
        title: `Rent Payment Received: ${p.propertyTitle} (${p.unitName})`,
        message: `${p.tenantName} successfully paid ${p.amountETB.toLocaleString()} ETB for ${p.periodMonth} via ${p.paymentMethod || "Bank"}${p.referenceNo ? ` (Ref: ${p.referenceNo})` : ""}.`,
        severity: "success",
        timestamp: p.paidDate ? `Paid on ${p.paidDate}` : "Recently paid",
        isRead: readIds.includes(id),
        actionUrl: "/rentalmanager/payments",
        actionLabel: "View Receipt",
      });
    }
  }

  // 2. Dynamic alerts from Tenant Applications Hub
  for (const app of applications) {
    if (app.status === "PENDING") {
      const id = `alert-app-pending-${app.id}`;
      alerts.push({
        id,
        type: "NEW_APPLICATION",
        title: `New Tenant Application: ${app.applicantName}`,
        message: `${app.applicantName} submitted an application for ${app.propertyTitle} (${app.unitName || "Unit"}) with monthly income of ${app.monthlyIncomeETB.toLocaleString()} ETB.`,
        severity: "warning",
        timestamp: "Pending review",
        isRead: readIds.includes(id),
        actionUrl: "/rentalmanager/applications",
        actionLabel: "Screen Tenant",
      });
    } else if (app.status === "APPROVED") {
      const id = `alert-app-approved-${app.id}`;
      alerts.push({
        id,
        type: "NEW_APPLICATION",
        title: `Application Approved: ${app.applicantName}`,
        message: `Tenant screening verified for ${app.applicantName} (${app.propertyTitle}). Ready to create formal lease agreement.`,
        severity: "success",
        timestamp: "Approved",
        isRead: readIds.includes(id),
        actionUrl: "/rentalmanager/leases",
        actionLabel: "Build Lease",
      });
    }
  }

  // 3. Dynamic alerts from Digital Leases Hub
  for (const l of leases) {
    if (l.status === "EXPIRING_SOON") {
      const id = `alert-lease-expiring-${l.id}`;
      alerts.push({
        id,
        type: "LEASE_EXPIRING",
        title: `Lease Expiring Soon: ${l.propertyTitle} (${l.unitName})`,
        message: `${l.tenantName}'s lease ends on ${l.endDate}. Review agreement and initiate renewal notice.`,
        severity: "warning",
        timestamp: "Expiring soon",
        isRead: readIds.includes(id),
        actionUrl: "/rentalmanager/leases",
        actionLabel: "Manage Leases",
      });
    } else if (l.status === "TERMINATED") {
      const id = `alert-lease-terminated-${l.id}`;
      alerts.push({
        id,
        type: "LEASE_EXPIRING",
        title: `Lease Terminated: ${l.propertyTitle} (${l.unitName})`,
        message: `Lease ${l.leaseNumber} for ${l.tenantName} was terminated. Unit is vacant and ready to list.`,
        severity: "info",
        timestamp: "Terminated",
        isRead: readIds.includes(id),
        actionUrl: "/rentalmanager/properties",
        actionLabel: "Relist Unit",
      });
    }
  }

  // 4. Dynamic alerts from Properties Milestones
  for (const prop of rentals) {
    if (prop.inquiriesCount > 5) {
      const id = `alert-prop-inquiries-${prop.id}`;
      alerts.push({
        id,
        type: "LISTING_MILESTONE",
        title: `High Inquiries: ${prop.title}`,
        message: `${prop.inquiriesCount} prospective tenants have expressed interest in this ${prop.subCity} listing.`,
        severity: "info",
        timestamp: "High traffic",
        isRead: readIds.includes(id),
        actionUrl: "/rentalmanager/properties",
        actionLabel: "View Listing",
      });
    }
  }

  // Priority sorting: errors (overdue rent) first, then warnings (applications, expiring leases), then successes, then info
  const severityRank: Record<string, number> = {
    error: 0,
    warning: 1,
    success: 2,
    info: 3,
  };

  alerts.sort((a, b) => {
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    return (severityRank[a.severity] ?? 4) - (severityRank[b.severity] ?? 4);
  });

  return alerts;
}

export async function getLandlordAlertsAction(): Promise<AlertsResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED", alerts: [], unreadCount: 0 };
    }

    const propsRes = await getLandlordRentalPropertiesAction();
    const paymentsRes = await getLandlordRentalPaymentsAction();
    const appsRes = await getLandlordRentalApplicationsAction();
    const leasesRes = await getLandlordLeasesAction();

    const alerts = computeDynamicLandlordAlerts(
      paymentsRes.payments || [],
      appsRes.applications || [],
      leasesRes.leases || [],
      propsRes.properties || []
    );
    const unreadCount = alerts.filter((a) => !a.isRead).length;
    return {
      success: true,
      alerts,
      unreadCount,
    };
  } catch (error: any) {
    return { success: false, error: error.message, alerts: [], unreadCount: 0 };
  }
}

export async function markAlertAsReadAction(
  alertId: string
): Promise<RentalActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED", isAuthenticated: false };
    }

    const readIds = getReadAlertIdsStore();
    if (!readIds.includes(alertId)) {
      readIds.push(alertId);
    }
    revalidatePath("/rentalmanager/alerts");
    revalidatePath("/rentalmanager/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markAllAlertsAsReadAction(): Promise<RentalActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED", isAuthenticated: false };
    }

    const alertsRes = await getLandlordAlertsAction();
    const alerts = alertsRes.alerts || [];
    const readIds = getReadAlertIdsStore();
    alerts.forEach((a) => {
      if (!readIds.includes(a.id)) {
        readIds.push(a.id);
      }
    });
    revalidatePath("/rentalmanager/alerts");
    revalidatePath("/rentalmanager/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


