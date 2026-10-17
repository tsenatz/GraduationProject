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
    const query = searchParams.get("query")?.trim();
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const status = searchParams.get("status"); // "FOR_SALE" or "FOR_RENT"
    const propertyType = searchParams.get("propertyType")?.trim(); // e.g. "Apartment", "Villa"
    const beds = searchParams.get("beds") && searchParams.get("beds") !== "Any" ? parseInt(searchParams.get("beds")!) : undefined;
    const baths = searchParams.get("baths") && searchParams.get("baths") !== "Any" ? parseFloat(searchParams.get("baths")!) : undefined;
    const exactMatchBeds = searchParams.get("exactMatchBeds") === "true";

    // Fetch properties from Prisma
    const properties = await db.property.findMany({
      where: {
        latitude: { lte: neLat, gte: swLat },
        longitude: { lte: neLng, gte: swLng },
        ...(query
          ? {
            OR: [
              { address: { contains: query, mode: "insensitive" } },
              { city: { contains: query, mode: "insensitive" } },
              { state: { contains: query, mode: "insensitive" } },
              { title: { contains: query, mode: "insensitive" } },
              { subCity: { contains: query, mode: "insensitive" } },
            ],
          }
          : {}),
        ...(minPrice || maxPrice
          ? {
            price: {
              ...(minPrice ? { gte: minPrice } : {}),
              ...(maxPrice ? { lte: maxPrice } : {}),
            },
          }
          : {}),
        ...(status && status !== "Any" ? { status } : {}),
        ...(propertyType ? { propertyType: { equals: propertyType, mode: "insensitive" } } : {}),
        ...(beds ? { beds: exactMatchBeds ? beds : { gte: beds } } : {}),
        ...(baths ? { baths: { gte: baths } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("[Search API] Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

