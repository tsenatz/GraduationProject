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
 * 4. Delete rental property listing
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
