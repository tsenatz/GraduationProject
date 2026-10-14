"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
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
 */
export async function getLandlordRentalPropertiesAction(): Promise<RentalActionResult> {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id || session?.user?.email || "demo-landlord";

    let properties: RentalPropertyRecord[] = [];

    if (process.env.DATABASE_URL) {
      try {
        const records = await (db as any).property.findMany({
          where: {
            OR: [
              { userId: currentUserId },
              ...(session?.user?.email ? [{ ownerEmail: session.user.email }] : []),
            ],
            listingType: "RENT",
          },
          orderBy: { createdAt: "desc" },
        });

        if (records && records.length > 0) {
          properties = records.map((r: any) => ({
            id: r.id,
            userId: r.userId,
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
            images: r.images && r.images.length > 0
              ? r.images
              : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80"],
            status: r.status === "SOLD" ? "RENTED" : (r.status || "FOR_RENT"),
            listingType: "RENT",
            createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
            inquiriesCount: r.inquiriesCount || 3,
            applicationsCount: r.applicationsCount || 1,
          }));

          return {
            success: true,
            isAuthenticated: !!session?.user,
            properties,
          };
        }
      } catch (dbErr) {
        console.warn("DB query skipped for rentals, using fallback:", dbErr);
      }
    }

    // In-memory fallback
    const store = getRentalMemoryStore();
    return {
      success: true,
      isAuthenticated: !!session?.user,
      properties: store,
    };
  } catch (error: any) {
    console.error("Failed to fetch landlord rental properties:", error);
    return {
      success: false,
      error: error.message || "Failed to load properties",
      properties: getRentalMemoryStore(),
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
    const currentUserId = session?.user?.id || session?.user?.email || "demo-landlord";
    const currentUserName = session?.user?.name || "Landlord";

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
    if (process.env.DATABASE_URL) {
      try {
        await (db as any).property.delete({
          where: { id: propertyId },
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
    const store = getPaymentsMemoryStore();
    const totalExpectedETB = store.reduce((acc, p) => acc + p.amountETB, 0);
    const totalCollectedETB = store
      .filter((p) => p.status === "PAID")
      .reduce((acc, p) => acc + p.amountETB, 0);
    const totalPendingETB = store
      .filter((p) => p.status === "PENDING")
      .reduce((acc, p) => acc + p.amountETB, 0);
    const totalOverdueETB = store
      .filter((p) => p.status === "OVERDUE")
      .reduce((acc, p) => acc + p.amountETB, 0);

    const totalTenants = store.length;
    const paidTenants = store.filter((p) => p.status === "PAID").length;
    const collectionRatePct =
      totalExpectedETB > 0
        ? Math.round((totalCollectedETB / totalExpectedETB) * 100)
        : 0;

    return {
      success: true,
      payments: [...store],
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
    return { success: false, error: error.message };
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
    const store = getApplicationsMemoryStore();
    const total = store.length;
    const pending = store.filter((a) => a.status === "PENDING").length;
    const approved = store.filter((a) => a.status === "APPROVED").length;
    const declined = store.filter((a) => a.status === "DECLINED").length;

    return {
      success: true,
      applications: [...store],
      stats: { total, pending, approved, declined },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateRentalApplicationStatusAction(
  applicationId: string,
  status: "PENDING" | "APPROVED" | "DECLINED"
): Promise<RentalActionResult> {
  try {
    const store = getApplicationsMemoryStore();
    const item = store.find((a) => a.id === applicationId);
    if (!item) {
      return { success: false, error: "Application not found" };
    }

    item.status = status;

    revalidatePath("/rentalmanager/applications");
    revalidatePath("/rentalmanager/dashboard");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

