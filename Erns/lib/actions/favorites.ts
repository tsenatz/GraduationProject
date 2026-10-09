"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { Property, PropertyType } from "@/components/favorites/types";
import { INITIAL_FAVORITE_PROPERTIES } from "@/components/favorites/mockProperties";

export interface FavoritesActionResult {
  success: boolean;
  error?: string;
  isFavorited?: boolean;
  propertyId?: string;
  favorites?: Property[];
  isAuthenticated?: boolean;
}

/**
 * Helper to reconcile a Favorite DB record back into a full Property model.
 * If property is from our known catalog, hydrate full details; otherwise use cached DB fields.
 */
function recordToProperty(record: {
  propertyId: string;
  title: string | null;
  titleAm: string | null;
  priceETB: number | null;
  listingType: string | null;
  imageUrl: string | null;
  subCity: string | null;
  subCityAm: string | null;
  specificArea: string | null;
  specificAreaAm: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqM: number | null;
  propertyType: string | null;
  createdAt: Date;
}): Property {
  // Check if known in mock catalog
  const match = INITIAL_FAVORITE_PROPERTIES.find((p) => p.id === record.propertyId);
  if (match) {
    return {
      ...match,
      dateSaved: record.createdAt.toISOString(),
    };
  }

  // Fallback to DB cached snapshot
  return {
    id: record.propertyId,
    title: record.title || "Ethiopian Property",
    titleAm: record.titleAm || "የኢትዮጵያ ንብረት",
    priceETB: record.priceETB || 0,
    listingType: (record.listingType as "sale" | "rent") || "sale",
    imageUrl: record.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    images: [record.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"],
    subCity: record.subCity || "Addis Ababa",
    subCityAm: record.subCityAm || "አዲስ አበባ",
    specificArea: record.specificArea || "Bole",
    specificAreaAm: record.specificAreaAm || "ቦሌ",
    bedrooms: record.bedrooms || 1,
    bathrooms: record.bathrooms || 1,
    areaSqM: record.areaSqM || 100,
    propertyType: (record.propertyType as PropertyType) || "apartment",
    isVerified: true,
    ownerOrAgentName: "ERNS Verified Representative",
    ownerOrAgentPhone: "+251911223344",
    isAgentListing: true,
    dateSaved: record.createdAt.toISOString(),
  };
}

/**
 * Fetch all saved favorites for the currently authenticated user from the database.
 */
export async function getUserFavoritesAction(): Promise<FavoritesActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: true, favorites: [], isAuthenticated: false };
    }

    const records = await db.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const favorites = records.map(recordToProperty);

    return {
      success: true,
      favorites,
      isAuthenticated: true,
    };
  } catch (error) {
    console.warn("Could not query favorites from database:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Database query failed",
      favorites: [],
      isAuthenticated: false,
    };
  }
}

/**
 * Toggle favorite in database:
 * If it already exists for the user, removes it (Unlike).
 * If it does not exist, saves it (Like).
 */
export async function toggleFavoriteAction(
  property: Property
): Promise<FavoritesActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "UNAUTHENTICATED",
        isAuthenticated: false,
      };
    }

    const userId = session.user.id;

    // Check if favorite exists in DB
    const existing = await db.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId: property.id,
        },
      },
    });

    if (existing) {
      // UNLIKE: Remove from DB
      await db.favorite.delete({
        where: { id: existing.id },
      });

      return {
        success: true,
        isFavorited: false,
        propertyId: property.id,
        isAuthenticated: true,
      };
    } else {
      // LIKE: Insert into DB
      await db.favorite.create({
        data: {
          userId,
          propertyId: property.id,
          title: property.title,
          titleAm: property.titleAm,
          priceETB: property.priceETB,
          listingType: property.listingType,
          imageUrl: property.imageUrl,
          subCity: property.subCity,
          subCityAm: property.subCityAm,
          specificArea: property.specificArea,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          areaSqM: property.areaSqM,
          propertyType: property.propertyType,
        },
      });

      return {
        success: true,
        isFavorited: true,
        propertyId: property.id,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.warn("Could not toggle favorite in database:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Database toggle failed",
    };
  }
}

/**
 * Explicitly remove a favorite for the logged-in user from the database.
 */
export async function removeFavoriteAction(
  propertyId: string
): Promise<FavoritesActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "UNAUTHENTICATED",
        isAuthenticated: false,
      };
    }

    await db.favorite.deleteMany({
      where: {
        userId: session.user.id,
        propertyId,
      },
    });

    return {
      success: true,
      isFavorited: false,
      propertyId,
      isAuthenticated: true,
    };
  } catch (error) {
    console.warn("Could not remove favorite in database:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Database removal failed",
    };
  }
}

/**
 * Synchronize local guest favorites into the database when a user signs in.
 */
export async function syncLocalFavoritesAction(
  localProperties: Property[]
): Promise<FavoritesActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "UNAUTHENTICATED",
        isAuthenticated: false,
      };
    }

    const userId = session.user.id;

    for (const prop of localProperties) {
      await db.favorite.upsert({
        where: {
          userId_propertyId: {
            userId,
            propertyId: prop.id,
          },
        },
        create: {
          userId,
          propertyId: prop.id,
          title: prop.title,
          titleAm: prop.titleAm,
          priceETB: prop.priceETB,
          listingType: prop.listingType,
          imageUrl: prop.imageUrl,
          subCity: prop.subCity,
          subCityAm: prop.subCityAm,
          specificArea: prop.specificArea,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          areaSqM: prop.areaSqM,
          propertyType: prop.propertyType,
        },
        update: {},
      });
    }

    // Return current merged list
    const records = await db.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      favorites: records.map(recordToProperty),
      isAuthenticated: true,
    };
  } catch (error) {
    console.warn("Could not sync local favorites to database:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Database sync failed",
    };
  }
}
