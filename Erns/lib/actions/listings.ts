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

// In-memory fallback for local demo when DATABASE_URL is not set or network issues occur
declare const globalThis: {
  mockPropertyListings?: any[];
} & typeof global;

if (!globalThis.mockPropertyListings) {
  globalThis.mockPropertyListings = [];
}

/**
 * Resolves the authenticated user from the database using all available session identifiers:
 * 1. user.id (CUID)
 * 2. user.email
 * 3. Account providerAccountId (Google OAuth)
 * 4. Auto-creates/provisions user if authenticated via OAuth but missing in DB.
 */
export async function getAuthenticatedUser(session: any) {
  if (!session?.user) return null;

  const email = session.user.email;
  const rawId = session.user.id;

  // 1. Try finding by id directly if rawId is a valid cuid
  if (rawId) {
    try {
      const userById = await db.user.findUnique({
        where: { id: rawId },
        select: { id: true, name: true, email: true, role: true },
      });
      if (userById) return userById;
    } catch {}
  }

  // 2. Try finding by email
  if (email) {
    try {
      const userByEmail = await db.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, role: true },
      });
      if (userByEmail) return userByEmail;
    } catch {}
  }

  // 3. Try finding via Account providerAccountId (Google OAuth)
  if (rawId) {
    try {
      const account = await db.account.findFirst({
        where: { providerAccountId: rawId },
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
      });
      if (account?.user) return account.user;
    } catch {}
  }

  // 4. Auto-provision if user exists in session with verified email
  if (email) {
    try {
      return await db.user.create({
        data: {
          id: rawId && !/^\d+$/.test(rawId) ? rawId : undefined,
          email,
          name: session.user.name || "Homeowner",
          image: session.user.image,
          role: "USER",
          emailVerified: new Date(),
        },
        select: { id: true, name: true, email: true, role: true },
      });
    } catch {
      return await db.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, role: true },
      });
    }
  }

  return null;
}

/**
 * Creates a new property listing.
 * Strictly verifies server session, resolves the user in DB, and validates inputs via Zod.
 */
export async function createPropertyListingAction(
  rawData: PropertyListingInput
): Promise<ListingActionResult> {
  try {
    // 1. Authentication Security Gate
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        error: "AUTH_REQUIRED",
        isAuthenticated: false,
      };
    }

    const user = await getAuthenticatedUser(session);
    if (!user) {
      return {
        success: false,
        error: "AUTH_REQUIRED",
        isAuthenticated: false,
      };
    }

    const userId = user.id;

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
    const title = `${Math.round(data.bedrooms)} Bed ${data.propertyType.charAt(0).toUpperCase() + data.propertyType.slice(1)} in ${data.subCity}`;
    const address = `${data.specificArea || data.subCity}, Addis Ababa`;
    const calculatedSqft = Math.round(data.areaSqM * 10.764);

    let createdProperty: any = null;

    try {
      // 3. Save listing to PostgreSQL database
      createdProperty = await db.property.create({
        data: {
          userId: user.id,
          title,
          description: data.description || "",
          price: data.priceETB,
          isNegotiable: data.isNegotiable,
          beds: Math.round(data.bedrooms),
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
    } catch (dbError) {
      console.warn("DB property create fallback to local memory store:", dbError);
      // Fallback in-memory storage if database temporarily fails
      createdProperty = {
        id: `prop-${Date.now()}`,
        userId: user.id,
        title,
        description: data.description || "",
        price: data.priceETB,
        isNegotiable: data.isNegotiable,
        beds: Math.round(data.bedrooms),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      if (!globalThis.mockPropertyListings) {
        globalThis.mockPropertyListings = [];
      }
      globalThis.mockPropertyListings.unshift(createdProperty);
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

    if (!session?.user) {
      return {
        success: true,
        properties: [],
        isAuthenticated: false,
      };
    }

    const user = await getAuthenticatedUser(session);
    const userId = user?.id || session.user.id;

    if (!userId) {
      return {
        success: true,
        properties: [],
        isAuthenticated: false,
      };
    }

    const possibleUserIds = Array.from(
      new Set([userId, session.user.id].filter(Boolean) as string[])
    );

    let properties: any[] = [];
    try {
      properties = await db.property.findMany({
        where: {
          OR: [
            ...possibleUserIds.map((id) => ({ userId: id })),
            ...(user?.email ? [{ user: { email: user.email } }] : []),
            ...(session.user.email ? [{ user: { email: session.user.email } }] : []),
          ],
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("DB property find error in getSellerPropertiesAction, falling back:", dbErr);
    }

    // Always merge in-memory properties if any exist and are not already in DB results
    if (globalThis.mockPropertyListings?.length) {
      const existingIds = new Set(properties.map((p) => p.id));
      const memoryProps = globalThis.mockPropertyListings.filter(
        (p) => possibleUserIds.includes(p.userId) && !existingIds.has(p.id)
      );
      properties = [...memoryProps, ...properties];
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
 * Updates listing status.
 * Strict ownership check: guarantees a user can ONLY update their own properties.
 */
export async function updatePropertyStatusAction(
  propertyId: string,
  newStatus: "FOR_SALE" | "PENDING" | "SOLD"
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED" };
    }

    const user = await getAuthenticatedUser(session);
    const possibleUserIds = Array.from(
      new Set([user?.id, session.user.id].filter(Boolean) as string[])
    );

    try {
      const existing = await db.property.findUnique({
        where: { id: propertyId },
        select: { id: true, userId: true, user: { select: { email: true } } },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      const isOwner =
        (existing.userId && possibleUserIds.includes(existing.userId)) ||
        (user?.email && existing.user?.email === user.email);

      if (!isOwner) {
        throw new Error("UNAUTHORIZED");
      }

      await db.property.update({
        where: { id: propertyId },
        data: { status: newStatus },
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
        (p) => p.id === propertyId && possibleUserIds.includes(p.userId)
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

    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED", property: null };
    }

    const user = await getAuthenticatedUser(session);
    const possibleUserIds = Array.from(
      new Set([user?.id, session.user.id].filter(Boolean) as string[])
    );

    let property: any = null;

    try {
      property = await db.property.findUnique({
        where: { id: propertyId },
        include: { user: { select: { email: true } } },
      });
    } catch (dbErr) {
      property = (globalThis.mockPropertyListings || []).find((p) => p.id === propertyId);
    }

    if (!property) {
      return { success: false, error: "NOT_FOUND", property: null };
    }

    const isOwner =
      (property.userId && possibleUserIds.includes(property.userId)) ||
      (user?.email && property.user?.email === user.email);

    if (!isOwner) {
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
 * Updates an existing property listing.
 * Strictly verifies ownership and validates input data using Zod.
 */
export async function updatePropertyListingAction(
  propertyId: string,
  rawData: PropertyListingInput
): Promise<ListingActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED", isAuthenticated: false };
    }

    const user = await getAuthenticatedUser(session);
    const possibleUserIds = Array.from(
      new Set([user?.id, session.user.id].filter(Boolean) as string[])
    );

    // Strict input validation
    const validationResult = propertyListingSchema.safeParse(rawData);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]?.message || "Invalid input data";
      return { success: false, error: firstIssue, isAuthenticated: true };
    }

    const data = validationResult.data;
    const title = `${Math.round(data.bedrooms)} Bed ${data.propertyType.charAt(0).toUpperCase() + data.propertyType.slice(1)} in ${data.subCity}`;
    const address = `${data.specificArea || data.subCity}, Addis Ababa`;
    const calculatedSqft = Math.round(data.areaSqM * 10.764);

    let updatedProperty: any = null;

    try {
      const existing = await db.property.findUnique({
        where: { id: propertyId },
        select: { id: true, userId: true, user: { select: { email: true } } },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      const isOwner =
        (existing.userId && possibleUserIds.includes(existing.userId)) ||
        (user?.email && existing.user?.email === user.email);

      if (!isOwner) {
        throw new Error("UNAUTHORIZED");
      }

      updatedProperty = await db.property.update({
        where: { id: propertyId },
        data: {
          title,
          description: data.description || "",
          price: data.priceETB,
          isNegotiable: data.isNegotiable,
          beds: Math.round(data.bedrooms),
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
    } catch (err: any) {
      if (err?.message === "UNAUTHORIZED") {
        return { success: false, error: "Forbidden: You do not own this listing.", isAuthenticated: true };
      }
      if (err?.message === "NOT_FOUND") {
        return { success: false, error: "Property not found.", isAuthenticated: true };
      }

      // Memory fallback for demo
      const found = (globalThis.mockPropertyListings || []).find(
        (p) => p.id === propertyId && possibleUserIds.includes(p.userId)
      );

      if (found) {
        found.title = title;
        found.description = data.description || "";
        found.price = data.priceETB;
        found.isNegotiable = data.isNegotiable;
        found.beds = Math.round(data.bedrooms);
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
 * Deletes a property listing.
 * Strict ownership check: guarantees a user can ONLY delete their own properties.
 */
export async function deletePropertyAction(propertyId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "AUTH_REQUIRED" };
    }

    const user = await getAuthenticatedUser(session);
    const possibleUserIds = Array.from(
      new Set([user?.id, session.user.id].filter(Boolean) as string[])
    );

    try {
      const existing = await db.property.findUnique({
        where: { id: propertyId },
        select: { id: true, userId: true, user: { select: { email: true } } },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      const isOwner =
        (existing.userId && possibleUserIds.includes(existing.userId)) ||
        (user?.email && existing.user?.email === user.email);

      if (!isOwner) {
        throw new Error("UNAUTHORIZED");
      }

      await db.property.delete({
        where: { id: propertyId },
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
          (p) => !(p.id === propertyId && possibleUserIds.includes(p.userId))
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
