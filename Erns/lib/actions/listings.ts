"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { propertyListingSchema, type PropertyListingInput } from "@/lib/schema";

export interface ListingActionResult {
  success: boolean;
  error?: string;
  propertyId?: string;
  referenceNo?: string;
  property?: any;
  isAuthenticated?: boolean;
}

// In-memory fallback for local demo when DATABASE_URL is not set
declare const globalThis: {
  mockPropertyListings?: any[];
} & typeof global;

if (!globalThis.mockPropertyListings) {
  globalThis.mockPropertyListings = [];
}

/**
 * Creates a new property listing within an atomic Prisma transaction.
 * Strictly verifies server session and validates inputs via Zod.
 */
export async function createPropertyListingAction(
  rawData: PropertyListingInput
): Promise<ListingActionResult> {
  try {
    // 1. Authentication Security Gate
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "AUTH_REQUIRED",
        isAuthenticated: false,
      };
    }

    const userId = session.user.id;

    // 2. Strict Input Validation & Sanitization with Zod
    const validationResult = propertyListingSchema.safeParse(rawData);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]?.message || "Invalid input data";
      return {
        success: false,
        error: firstIssue,
        isAuthenticated: true,
      };
    }

    const data = validationResult.data;
    const refNumber = `ERN-${Math.floor(10000 + Math.random() * 90000)}`;
    const title = `${data.bedrooms} Bed ${data.propertyType.charAt(0).toUpperCase() + data.propertyType.slice(1)} in ${data.subCity}`;
    const address = `${data.specificArea || data.subCity}, Addis Ababa`;
    const calculatedSqft = Math.round(data.areaSqM * 10.764);

    let createdProperty: any = null;

    try {
      // 3. ACID Transaction: Atomically verify user and insert listing
      createdProperty = await db.$transaction(async (tx) => {
        // Ensure user account exists in DB
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true, role: true },
        });

        if (!user) {
          throw new Error("USER_NOT_FOUND");
        }

        return await tx.property.create({
          data: {
            userId: user.id,
            title,
            description: data.description || "",
            price: data.priceETB,
            isNegotiable: data.isNegotiable,
            beds: data.bedrooms,
            baths: data.bathrooms,
            sqft: calculatedSqft,
            areaSqM: data.areaSqM,
            propertyType: data.propertyType,
            status: "FOR_SALE",
            listingType: "SALE",
            titleDeedStatus: data.titleDeedStatus,
            subCity: data.subCity,
            woreda: data.woreda || "",
            specificArea: data.specificArea,
            address,
            city: "Addis Ababa",
            state: "Addis Ababa",
            zipCode: "1000",
            latitude: 9.0107,
            longitude: 38.7612,
            amenities: data.amenities,
            images: data.photos,
            ownerName: data.ownerName || user.name || "Owner",
            contactPhone: data.phone,
            preferredTime: data.preferredTime || "anytime",
            referenceNo: refNumber,
          },
        });
      });
    } catch (dbError) {
      console.warn("DB transaction fallback to local memory store:", dbError);
      // Fallback in-memory storage if DATABASE_URL is not yet connected
      createdProperty = {
        id: `prop-${Date.now()}`,
        userId,
        title,
        description: data.description || "",
        price: data.priceETB,
        isNegotiable: data.isNegotiable,
        beds: data.bedrooms,
        baths: data.bathrooms,
        sqft: calculatedSqft,
        areaSqM: data.areaSqM,
        propertyType: data.propertyType,
        status: "FOR_SALE",
        listingType: "SALE",
        titleDeedStatus: data.titleDeedStatus,
        subCity: data.subCity,
        woreda: data.woreda || "",
        specificArea: data.specificArea,
        address,
        city: "Addis Ababa",
        state: "Addis Ababa",
        zipCode: "1000",
        latitude: 9.0107,
        longitude: 38.7612,
        amenities: data.amenities,
        images: data.photos,
        ownerName: data.ownerName || session.user.name || "Owner",
        contactPhone: data.phone,
        preferredTime: data.preferredTime || "anytime",
        referenceNo: refNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      globalThis.mockPropertyListings?.unshift(createdProperty);
    }

    // 4. Cache revalidation
    revalidatePath("/sell/dashboard");
    revalidatePath("/sell/list");
    revalidatePath("/search");

    return {
      success: true,
      propertyId: createdProperty.id,
      referenceNo: refNumber,
      property: createdProperty,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Failed to create property listing:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create listing",
      isAuthenticated: true,
    };
  }
}

/**
 * Fetches all property listings owned exclusively by the authenticated user.
 */
export async function getSellerPropertiesAction() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: true,
        properties: [],
        isAuthenticated: false,
      };
    }

    const userId = session.user.id;

    let properties: any[] = [];
    try {
      properties = await db.property.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      properties = (globalThis.mockPropertyListings || []).filter(
        (p) => p.userId === userId
      );
    }

    return {
      success: true,
      properties,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Failed to fetch seller properties:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load listings",
      properties: [],
      isAuthenticated: true,
    };
  }
}

/**
 * Updates listing status within an atomic transaction.
 * Strict ownership check: guarantees a user can ONLY update their own properties.
 */
export async function updatePropertyStatusAction(
  propertyId: string,
  newStatus: "FOR_SALE" | "PENDING" | "SOLD"
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "AUTH_REQUIRED" };
    }

    const userId = session.user.id;

    try {
      await db.$transaction(async (tx) => {
        // Atomic ownership verification
        const existing = await tx.property.findUnique({
          where: { id: propertyId },
          select: { id: true, userId: true },
        });

        if (!existing) {
          throw new Error("NOT_FOUND");
        }

        if (existing.userId !== userId) {
          throw new Error("UNAUTHORIZED");
        }

        await tx.property.update({
          where: { id: propertyId },
          data: { status: newStatus },
        });
      });
    } catch (err: any) {
      if (err?.message === "UNAUTHORIZED") {
        return { success: false, error: "Forbidden: You do not own this listing." };
      }
      if (err?.message === "NOT_FOUND") {
        return { success: false, error: "Property not found." };
      }

      // Memory fallback for demo
      const found = (globalThis.mockPropertyListings || []).find(
        (p) => p.id === propertyId && p.userId === userId
      );
      if (found) {
        found.status = newStatus;
      }
    }

    revalidatePath("/sell/dashboard");
    revalidatePath("/search");

    return { success: true };
  } catch (error) {
    console.error("Failed to update listing status:", error);
    return { success: false, error: "Failed to update listing status" };
  }
}

/**
 * Retrieves a property listing specifically for editing.
 * Guarantees strict authentication and ownership: sellers can ONLY load their own property for editing.
 */
export async function getPropertyForEditAction(propertyId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "AUTH_REQUIRED", property: null };
    }

    const userId = session.user.id;
    let property: any = null;

    try {
      property = await db.property.findUnique({
        where: { id: propertyId },
      });
    } catch (dbErr) {
      // Memory fallback for demo mode
      property = (globalThis.mockPropertyListings || []).find((p) => p.id === propertyId);
    }

    if (!property) {
      return { success: false, error: "NOT_FOUND", property: null };
    }

    if (property.userId !== userId) {
      return { success: false, error: "UNAUTHORIZED", property: null };
    }

    return {
      success: true,
      property: {
        id: property.id,
        referenceNo: property.referenceNo,
        title: property.title,
        description: property.description || "",
        priceETB: property.price,
        isNegotiable: property.isNegotiable ?? true,
        bedrooms: property.beds || 1,
        bathrooms: property.baths || 1,
        areaSqM: property.areaSqM || Math.round((property.sqft || 100) / 10.764),
        propertyType: property.propertyType || "apartment",
        titleDeedStatus: property.titleDeedStatus || "digital",
        subCity: property.subCity || "Bole",
        woreda: property.woreda || "",
        specificArea: property.specificArea || "",
        amenities: property.amenities || [],
        photos: property.images || [],
        ownerName: property.ownerName || "",
        phone: property.contactPhone || "",
        preferredTime: property.preferredTime || "anytime",
        status: property.status || "FOR_SALE",
      },
    };
  } catch (error) {
    console.error("Failed to fetch property for edit:", error);
    return { success: false, error: "Failed to load listing for editing", property: null };
  }
}

/**
 * Updates an existing property listing within an atomic Prisma transaction.
 * Strictly verifies ownership and validates input data using Zod.
 */
export async function updatePropertyListingAction(
  propertyId: string,
  rawData: PropertyListingInput
): Promise<ListingActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "AUTH_REQUIRED", isAuthenticated: false };
    }

    const userId = session.user.id;

    // Strict input validation
    const validationResult = propertyListingSchema.safeParse(rawData);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]?.message || "Invalid input data";
      return { success: false, error: firstIssue, isAuthenticated: true };
    }

    const data = validationResult.data;
    const title = `${data.bedrooms} Bed ${data.propertyType.charAt(0).toUpperCase() + data.propertyType.slice(1)} in ${data.subCity}`;
    const address = `${data.specificArea || data.subCity}, Addis Ababa`;
    const calculatedSqft = Math.round(data.areaSqM * 10.764);

    let updatedProperty: any = null;

    try {
      updatedProperty = await db.$transaction(async (tx) => {
        // Atomic ownership check
        const existing = await tx.property.findUnique({
          where: { id: propertyId },
          select: { id: true, userId: true },
        });

        if (!existing) {
          throw new Error("NOT_FOUND");
        }

        if (existing.userId !== userId) {
          throw new Error("UNAUTHORIZED");
        }

        return await tx.property.update({
          where: { id: propertyId },
          data: {
            title,
            description: data.description || "",
            price: data.priceETB,
            isNegotiable: data.isNegotiable,
            beds: data.bedrooms,
            baths: data.bathrooms,
            sqft: calculatedSqft,
            areaSqM: data.areaSqM,
            propertyType: data.propertyType,
            titleDeedStatus: data.titleDeedStatus,
            subCity: data.subCity,
            woreda: data.woreda || "",
            specificArea: data.specificArea,
            address,
            amenities: data.amenities,
            images: data.photos,
            ownerName: data.ownerName,
            contactPhone: data.phone,
            preferredTime: data.preferredTime,
          },
        });
      });
    } catch (err: any) {
      if (err?.message === "UNAUTHORIZED") {
        return { success: false, error: "Forbidden: You do not own this listing.", isAuthenticated: true };
      }
      if (err?.message === "NOT_FOUND") {
        return { success: false, error: "Property not found.", isAuthenticated: true };
      }

      // Memory fallback for demo
      const found = (globalThis.mockPropertyListings || []).find(
        (p) => p.id === propertyId && p.userId === userId
      );

      if (found) {
        found.title = title;
        found.description = data.description || "";
        found.price = data.priceETB;
        found.isNegotiable = data.isNegotiable;
        found.beds = data.bedrooms;
        found.baths = data.bathrooms;
        found.sqft = calculatedSqft;
        found.areaSqM = data.areaSqM;
        found.propertyType = data.propertyType;
        found.titleDeedStatus = data.titleDeedStatus;
        found.subCity = data.subCity;
        found.woreda = data.woreda || "";
        found.specificArea = data.specificArea;
        found.address = address;
        found.amenities = data.amenities;
        found.images = data.photos;
        found.ownerName = data.ownerName;
        found.contactPhone = data.phone;
        found.preferredTime = data.preferredTime;
        found.updatedAt = new Date();
        updatedProperty = found;
      }
    }

    revalidatePath("/sell/dashboard");
    revalidatePath(`/sell/edit/${propertyId}`);
    revalidatePath("/search");

    return {
      success: true,
      propertyId,
      property: updatedProperty,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Failed to update property listing:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update property",
      isAuthenticated: true,
    };
  }
}

/**
 * Deletes a property within an atomic transaction.
 * Strict ownership check: guarantees a user can ONLY delete their own properties.
 */
export async function deletePropertyAction(propertyId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "AUTH_REQUIRED" };
    }

    const userId = session.user.id;

    try {
      await db.$transaction(async (tx) => {
        const existing = await tx.property.findUnique({
          where: { id: propertyId },
          select: { id: true, userId: true },
        });

        if (!existing) {
          throw new Error("NOT_FOUND");
        }

        if (existing.userId !== userId) {
          throw new Error("UNAUTHORIZED");
        }

        await tx.property.delete({
          where: { id: propertyId },
        });
      });
    } catch (err: any) {
      if (err?.message === "UNAUTHORIZED") {
        return { success: false, error: "Forbidden: You do not own this listing." };
      }
      if (err?.message === "NOT_FOUND") {
        return { success: false, error: "Property not found." };
      }

      if (globalThis.mockPropertyListings) {
        globalThis.mockPropertyListings = globalThis.mockPropertyListings.filter(
          (p) => !(p.id === propertyId && p.userId === userId)
        );
      }
    }

    revalidatePath("/sell/dashboard");
    revalidatePath("/search");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return { success: false, error: "Failed to delete property" };
  }
}
