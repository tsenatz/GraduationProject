import { Property } from "@/components/favorites/types";
import { INITIAL_FAVORITE_PROPERTIES } from "@/components/favorites/mockProperties";

export const FEATURED_PROPERTIES: Property[] = [
  ...INITIAL_FAVORITE_PROPERTIES,
  {
    id: "prop-106",
    title: "Executive 3-Bedroom Serviced Apartment in Bole Medhanialem",
    titleAm: "የቅንጦት 3-መኝታ ሰርቪስ አፓርታማ ለኪራይ በቦሌ መድኃኔዓለም",
    priceETB: 120000,
    listingType: "rent",
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    areaSqM: 180,
    subCity: "Bole",
    subCityAm: "ቦሌ",
    woreda: "Woreda 03",
    specificArea: "Bole Medhanialem, Near Edna Mall",
    specificAreaAm: "ቦሌ መድኃኔዓለም፣ ከኤድና ሞል አጠገብ",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    ],
    isVerified: true,
    isFeatured: true,
    dateSaved: "2026-10-10T12:00:00Z",
    ownerOrAgentName: "Selamawit Girma (Verified Agent)",
    ownerOrAgentPhone: "+251 911 889 900",
    isAgentListing: true,
    yearBuilt: 2024,
    titleDeedStatus: "Verified Commercial Lease",
    titleDeedStatusAm: "የተረጋገጠ የንግድ ኪራይ ውል",
    description:
      "Prestigious serviced residence in prime Bole Medhanialem. Daily housekeeping, high-speed fiber internet, private gym access, 24/7 security, backup water and full automatic generator.",
    descriptionAm:
      "በዋናው የቦሌ መድኃኔዓለም አካባቢ የሚገኝ የቅንጦት ሰርቪስ አፓርታማ። የፅዳት አገልግሎት፣ ፈጣን የፋይበር ኢንተርኔት፣ የጂም አገልግሎት፣ የ24 ሰዓት ጥበቃ፣ አስተማማኝ ጀነሬተር እና የውሃ ማጠራቀሚያ አለው።",
    amenities: [
      "Daily Housekeeping Included",
      "High-Speed Fiber Internet",
      "Private Fitness Gym Access",
      "Automatic Standby Generator",
      "Underground Reserved Parking",
      "24/7 Concierge & Security",
    ],
    amenitiesAm: [
      "የየዕለቱ የፅዳት አገልግሎት",
      "ፈጣን የፋይበር ኢንተርኔት",
      "የግል የጂም አገልግሎት",
      "አውቶማቲክ የመጠባበቂያ ጀነሬተር",
      "የመሬት ውስጥ የተከለለ መኪና ማቆሚያ",
      "የ 24/7 የደህንነትና የጥበቃ አገልግሎት",
    ],
  },
];
