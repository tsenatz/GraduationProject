import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse map boundaries from URL
    const neLat = parseFloat(searchParams.get("neLat") || "90");
    const neLng = parseFloat(searchParams.get("neLng") || "180");
    const swLat = parseFloat(searchParams.get("swLat") || "-90");
    const swLng = parseFloat(searchParams.get("swLng") || "-180");
    
    // Parse filters
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const status = searchParams.get("status"); // "FOR_SALE" or "FOR_RENT"
    const beds = searchParams.get("beds") && searchParams.get("beds") !== "Any" ? parseInt(searchParams.get("beds")!) : undefined;
    const baths = searchParams.get("baths") && searchParams.get("baths") !== "Any" ? parseFloat(searchParams.get("baths")!) : undefined;
    const exactMatchBeds = searchParams.get("exactMatchBeds") === "true";

    // Fetch properties from Prisma
    const properties = await db.property.findMany({
      where: {
        latitude: { lte: neLat, gte: swLat },
        longitude: { lte: neLng, gte: swLng },
        ...(minPrice || maxPrice
          ? {
              price: {
                ...(minPrice ? { gte: minPrice } : {}),
                ...(maxPrice ? { lte: maxPrice } : {}),
              },
            }
          : {}),
        ...(status && status !== "Any" ? { status } : {}),
        ...(beds ? { beds: exactMatchBeds ? beds : { gte: beds } } : {}),
        ...(baths ? { baths: { gte: baths } } : {}),
      },
      take: 100, // Reasonable limit for rendering on map
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}
