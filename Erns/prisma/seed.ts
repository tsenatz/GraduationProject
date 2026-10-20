import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../app/generated/prisma";
import ws from "ws";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required to seed database");
  process.exit(1);
}

let db: PrismaClient;
if (connectionString.includes("neon.tech")) {
  neonConfig.webSocketConstructor = ws;
  const adapter = new PrismaNeon({ connectionString });
  db = new PrismaClient({ adapter });
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require("pg");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaPg } = require("@prisma/adapter-pg");
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  db = new PrismaClient({ adapter });
}

const INITIAL_PROPERTIES = [
  {
    id: "prop-101",
    title: "Luxury 3-Bedroom Apartment in Bole Atlas",
    description: "Stunning high-floor luxury apartment located in prime Bole Atlas. Features an open-concept Italian kitchen, master suite with walk-in closet, balconies with city views, automatic backup generator, and underground parking.",
    price: 18500000,
    beds: 3,
    baths: 2,
    sqft: 1776,
    propertyType: "Apartment",
    status: "FOR_SALE",
    address: "Bole Atlas, Behind Edna Mall",
    city: "Addis Ababa",
    state: "Bole",
    zipCode: "1000",
    latitude: 9.0065,
    longitude: 38.7845,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "prop-102",
    title: "Modern 4-Bedroom Villa with Garden in Old Airport",
    description: "Prestigious standalone villa located minutes away from the International Community School (ICS) in Old Airport. Offers 4 spacious en-suite bedrooms, wood-beamed ceilings, private landscaped garden, servant quarters, and compound parking.",
    price: 42000000,
    beds: 4,
    baths: 4,
    sqft: 4090,
    propertyType: "Villa",
    status: "FOR_SALE",
    address: "Old Airport, Near ICS School",
    city: "Addis Ababa",
    state: "Kirkos",
    zipCode: "1000",
    latitude: 8.9880,
    longitude: 38.7360,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "prop-103",
    title: "Furnished 2-Bedroom Condo for Rent in Kazanchis",
    description: "Fully furnished, turn-key condominium in central Kazanchis, ideal for UN or embassy personnel. Features contemporary furnishings, high-speed fiber internet, and secure garage parking.",
    price: 75000,
    beds: 2,
    baths: 2,
    sqft: 1184,
    propertyType: "Condo",
    status: "FOR_RENT",
    address: "Kazanchis, Near UNECA",
    city: "Addis Ababa",
    state: "Kirkos",
    zipCode: "1000",
    latitude: 9.0185,
    longitude: 38.7660,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "prop-104",
    title: "Spacious 3-Bedroom Townhouse in CMC Tsehay",
    description: "Family-friendly multi-level townhouse in the secure, gated Tsehay Real Estate development in CMC. Features 3 bedrooms, private front patio, rooftop terrace, and 24-hour guarded access.",
    price: 15800000,
    beds: 3,
    baths: 3,
    sqft: 2098,
    propertyType: "Townhouse",
    status: "FOR_SALE",
    address: "CMC, Tsehay Real Estate Compound",
    city: "Addis Ababa",
    state: "Yeka",
    zipCode: "1000",
    latitude: 9.0230,
    longitude: 38.8350,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "prop-105",
    title: "Executive Penthouse with Panoramic City View in Sarbet",
    description: "Top-floor executive penthouse offering breathtaking 360-degree views of Addis Ababa and Mount Entoto. Boasts 360-degree terrace, custom marble floors, jacuzzi bath, and private elevator access.",
    price: 29000000,
    beds: 4,
    baths: 4,
    sqft: 3444,
    propertyType: "Penthouse",
    status: "FOR_SALE",
    address: "Sarbet, Near Canadian Embassy",
    city: "Addis Ababa",
    state: "Kirkos",
    zipCode: "1000",
    latitude: 8.9950,
    longitude: 38.7420,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "prop-106",
    title: "Modern 2-Bedroom Apartment in Bole Medhanialem",
    description: "Conveniently located luxury 2-bedroom apartment within walking distance of Bole Medhanialem Cathedral, shopping centers, and top cafes. Includes backup generator and underground parking.",
    price: 13500000,
    beds: 2,
    baths: 2,
    sqft: 1345,
    propertyType: "Apartment",
    status: "FOR_SALE",
    address: "Bole Medhanialem, Near Edna Mall",
    city: "Addis Ababa",
    state: "Bole",
    zipCode: "1000",
    latitude: 9.0012,
    longitude: 38.7895,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "prop-107",
    title: "Charming 1-Bedroom Studio for Rent in Bisrate Gabriel",
    description: "Quiet and secure 1-bedroom studio in Bisrate Gabriel, fully serviced with dedicated water reserve and 24/7 security guard.",
    price: 35000,
    beds: 1,
    baths: 1,
    sqft: 650,
    propertyType: "Apartment",
    status: "FOR_RENT",
    address: "Bisrate Gabriel, Laphto Mall Area",
    city: "Addis Ababa",
    state: "Nifas Silk-Lafto",
    zipCode: "1000",
    latitude: 8.9835,
    longitude: 38.7290,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
    ],
  },
];

async function seed() {
  console.log("Seeding properties...");
  for (const prop of INITIAL_PROPERTIES) {
    await db.property.upsert({
      where: { id: prop.id },
      update: prop,
      create: prop,
    });
  }
  const count = await db.property.count();
  console.log(`Database seeded successfully! Total properties: ${count}`);
}

seed()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Process will exit
  });
