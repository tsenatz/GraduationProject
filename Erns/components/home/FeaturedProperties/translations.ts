export interface FeaturedTranslations {
  eyebrow: string;
  title: string;
  subtitle: string;
  viewAllBtn: string;
  tabs: {
    all: string;
    sale: string;
    rent: string;
    villas: string;
  };
  filterCount: string;
  empty: string;
  aiBannerTitle: string;
  aiBannerDesc: string;
  aiBannerBtn: string;
  exploreMore: string;
}

export const featuredTranslations: Record<"en" | "am", FeaturedTranslations> = {
  en: {
    eyebrow: "VERIFIED HOMES IN ADDIS ABABA",
    title: "Featured & Trending Properties",
    subtitle: "Explore vetted luxury apartments, executive villas, and furnished rentals across prime sub-cities.",
    viewAllBtn: "View All 2,500+ Listings",
    tabs: {
      all: "All Properties",
      sale: "For Sale",
      rent: "For Rent",
      villas: "Villas & Penthouses",
    },
    filterCount: "Properties Available",
    empty: "No properties found in this category.",
    aiBannerTitle: "Tailored Property Recommendations",
    aiBannerDesc: "Save properties to your favorites to receive AI-powered home suggestions based on your budget and preferred Addis Ababa neighborhoods.",
    aiBannerBtn: "View My Saved Homes",
    exploreMore: "Explore All Homes for Sale & Rent in Addis Ababa →",
  },
  am: {
    eyebrow: "በአዲስ አበባ የተረጋገጡ ቤቶች",
    title: "ተወዳጅ እና ተመራጭ ቤቶች",
    subtitle: "በዋና ዋና ክፍለ ከተሞች የሚገኙ የተረጋገጡ የቅንጦት አፓርታማዎችን፣ ቪላዎችን እና የኪራይ ቤቶችን ይመልከቱ።",
    viewAllBtn: "ሁሉንም 2,500+ ቤቶች ይመልከቱ",
    tabs: {
      all: "ሁሉም ቤቶች",
      sale: "የሚሸጡ",
      rent: "የሚከራዩ",
      villas: "ቪላዎች እና ፔንትሃውስ",
    },
    filterCount: "የሚገኙ ቤቶች",
    empty: "በዚህ ምድብ ውስጥ የተገኘ ቤት የለም።",
    aiBannerTitle: "ለእርስዎ የተስማሙ የቤት ጥቆማዎች",
    aiBannerDesc: "ቤቶችን ወደ ተወዳጆችዎ በማስቀመጥ ለእርስዎ በጀትና ተመራጭ ሰፈር የሚሆኑ ልዩ ጥቆማዎችን በስማርት ቴክኖሎጂ ያግኙ።",
    aiBannerBtn: "የተቀመጡ ቤቶቼን ይመልከቱ",
    exploreMore: "ሁሉንም የአዲስ አበባ ቤቶች ይመልከቱ →",
  },
};
