export interface DirectoryCategory {
  title: string;
  links: { label: string; href: string }[];
}

export interface DirectorySection {
  tabTitle: string;
  categories: DirectoryCategory[];
}

export interface HomeDirectoryTranslations {
  aboutRecommendations: {
    title: string;
    description: string;
  };
  tabs: {
    realEstate: DirectorySection;
    rentals: DirectorySection;
    mortgages: DirectorySection;
    browseAddis: DirectorySection;
  };
  secondaryLinks: { label: string; href: string }[];
  tertiaryLinks: { label: string; href: string }[];
  networkLinks: { label: string; href: string }[];
  privacyChoice: {
    button: string;
    modalTitle: string;
    modalSubtitle: string;
    necessaryTitle: string;
    necessaryDesc: string;
    necessaryAlwaysActive: string;
    analyticsTitle: string;
    analyticsDesc: string;
    advertisingTitle: string;
    advertisingDesc: string;
    optOutTitle: string;
    optOutDesc: string;
    saveBtn: string;
    acceptAllBtn: string;
    savedToast: string;
  };
  legal: {
    accessibility: string;
    accessibilityLink: string;
    licensing: string;
    equalHousing: string;
    copyright: string;
  };
}

export const homeDirectoryTranslations: Record<'en' | 'am', HomeDirectoryTranslations> = {
  en: {
    aboutRecommendations: {
      title: "About ERNS's Recommendations",
      description:
        "Recommendations are based on your location and search activity, such as the homes you've viewed and saved and the filters you've used. We use this information to bring similar homes to your attention, so you don't miss out.",
    },
    tabs: {
      realEstate: {
        tabTitle: "Real Estate",
        categories: [
          {
            title: "Homes for Sale",
            links: [
              { label: "Addis Ababa Homes for Sale", href: "/search?status=FOR_SALE" },
              { label: "Bole Luxury Condos & Flats", href: "/search?status=FOR_SALE&location=Bole" },
              { label: "CMC Modern Apartments", href: "/search?status=FOR_SALE&location=CMC" },
              { label: "Sarbet & Old Airport Villas", href: "/search?status=FOR_SALE&location=Sarbet" },
              { label: "Kazanchis High-Rise Penthouses", href: "/search?status=FOR_SALE&location=Kazanchis" },
              { label: "Bisrate Gabriel Family Homes", href: "/search?status=FOR_SALE&location=Bisrate%20Gabriel" },
            ],
          },
          {
            title: "Property Types",
            links: [
              { label: "Apartments & Condos", href: "/search?status=FOR_SALE&propertyType=APARTMENT" },
              { label: "Single Family & Villas", href: "/search?status=FOR_SALE&propertyType=HOUSE" },
              { label: "Townhouses & Duplexes", href: "/search?status=FOR_SALE&propertyType=TOWNHOUSE" },
              { label: "Commercial Real Estate", href: "/search?status=FOR_SALE&propertyType=COMMERCIAL" },
              { label: "New Construction & Off-Plan", href: "/search?status=FOR_SALE&newDevelopment=true" },
              { label: "Luxury & Executive Estates", href: "/search?status=FOR_SALE&luxury=true" },
            ],
          },
          {
            title: "Special Search Options",
            links: [
              { label: "For Sale By Owner (FSBO)", href: "/sell" },
              { label: "Price Reduced Homes", href: "/search?status=FOR_SALE&priceDrop=true" },
              { label: "Upcoming Open Houses", href: "/search?status=FOR_SALE&openHouse=true" },
              { label: "Recently Sold Listings", href: "/search?status=SOLD" },
              { label: "Verified Agent Listings", href: "/agents" },
              { label: "Free Property Valuation", href: "/sell" },
            ],
          },
        ],
      },
      rentals: {
        tabTitle: "Rentals",
        categories: [
          {
            title: "Rental Properties",
            links: [
              { label: "All Addis Ababa Rentals", href: "/search?status=FOR_RENT" },
              { label: "Furnished Apartments", href: "/search?status=FOR_RENT&furnished=true" },
              { label: "Unfurnished Long-Term Flats", href: "/search?status=FOR_RENT" },
              { label: "Studio & 1-Bedroom Units", href: "/search?status=FOR_RENT&beds=1" },
              { label: "2 & 3 Bedroom Family Rentals", href: "/search?status=FOR_RENT&beds=2" },
              { label: "Private Villas & Townhomes", href: "/search?status=FOR_RENT&propertyType=HOUSE" },
            ],
          },
          {
            title: "Expat & Corporate Stays",
            links: [
              { label: "Diplomatic Compound Residences", href: "/search?status=FOR_RENT&expat=true" },
              { label: "Executive Serviced Apartments", href: "/search?status=FOR_RENT&luxury=true" },
              { label: "Short-Term & Vacation Rentals", href: "/search?status=FOR_RENT&shortTerm=true" },
              { label: "Commercial Office Spaces", href: "/search?status=FOR_RENT&propertyType=COMMERCIAL" },
              { label: "Pet-Friendly Rentals", href: "/search?status=FOR_RENT&pets=true" },
              { label: "Rental Manager for Landlords", href: "/rentalmanager" },
            ],
          },
          {
            title: "Top Rental Locations",
            links: [
              { label: "Bole Atlas & Medhanialem", href: "/search?status=FOR_RENT&location=Bole" },
              { label: "Kazanchis / UNECA Zone", href: "/search?status=FOR_RENT&location=Kazanchis" },
              { label: "Old Airport International Area", href: "/search?status=FOR_RENT&location=Old%20Airport" },
              { label: "Sarbet & Bisrate Gabriel", href: "/search?status=FOR_RENT&location=Sarbet" },
              { label: "CMC & Ayat Corridor", href: "/search?status=FOR_RENT&location=CMC" },
              { label: "Yeka & Meganagna Rentals", href: "/search?status=FOR_RENT&location=Yeka" },
            ],
          },
        ],
      },
      mortgages: {
        tabTitle: "Mortgage Rates",
        categories: [
          {
            title: "Calculators & Tools",
            links: [
              { label: "Mortgage Payment Calculator", href: "/mortgage/calculator" },
              { label: "Home Affordability Calculator", href: "/mortgage/affordability" },
              { label: "Down Payment & Escrow Guide", href: "/mortgage/downpayment" },
              { label: "Rent vs. Buy Comparison", href: "/mortgage/rent-vs-buy" },
              { label: "Foreign Currency (FX) Estimator", href: "/mortgage/diaspora" },
              { label: "Property Tax & Transfer Fee Tool", href: "/help/closing-costs" },
            ],
          },
          {
            title: "Ethiopian Bank Financing",
            links: [
              { label: "Commercial Bank of Ethiopia (CBE)", href: "/mortgage/cbe" },
              { label: "Awash Bank Diaspora Loans", href: "/mortgage/awash" },
              { label: "Dashen Bank Mortgage Financing", href: "/mortgage/partners" },
              { label: "Bank of Abyssinia Home Credit", href: "/mortgage/partners" },
              { label: "Cooperative Bank of Oromia", href: "/mortgage/partners" },
              { label: "Diaspora FX Account Privileges", href: "/mortgage/diaspora" },
            ],
          },
          {
            title: "Financing Advice & FAQ",
            links: [
              { label: "First-Time Buyer Checklist", href: "/help/first-time-buyer" },
              { label: "Land Registry Verification Guide", href: "/help/land-registry" },
              { label: "Current Bank Interest Rates (2026)", href: "/mortgage/rates" },
              { label: "Diaspora Housing Documentation", href: "/help/diaspora-guide" },
              { label: "Property Title Due Diligence", href: "/help/legal" },
              { label: "Consult an ERNS Mortgage Advisor", href: "/agents" },
            ],
          },
        ],
      },
      browseAddis: {
        tabTitle: "Browse Homes",
        categories: [
          {
            title: "Central Sub-Cities",
            links: [
              { label: "Bole Sub-city (ቦሌ)", href: "/search?location=Bole" },
              { label: "Kirkos Sub-city (ቂርቆስ)", href: "/search?location=Kirkos" },
              { label: "Arada Sub-city (አራዳ)", href: "/search?location=Arada" },
              { label: "Lideta Sub-city (ልደታ)", href: "/search?location=Lideta" },
              { label: "Kazanchis District", href: "/search?location=Kazanchis" },
              { label: "Meskel Flower & Olympia", href: "/search?location=Meskel%20Flower" },
            ],
          },
          {
            title: "Eastern & Southern",
            links: [
              { label: "Yeka Sub-city (የካ)", href: "/search?location=Yeka" },
              { label: "Nifas Silk-Lafto (ንፋስ ስልክ)", href: "/search?location=Nifas%20Silk" },
              { label: "Akaky Kaliti (አቃቂ ቃሊቲ)", href: "/search?location=Akaky" },
              { label: "CMC & Ayat Developments", href: "/search?location=CMC" },
              { label: "Summit & Gerji Neighborhoods", href: "/search?location=Gerji" },
              { label: "Lebu & Jomo Estates", href: "/search?location=Lebu" },
            ],
          },
          {
            title: "Western & Northern",
            links: [
              { label: "Gullele Sub-city (ጉለሌ)", href: "/search?location=Gullele" },
              { label: "Kolfe Keranio (ኮልፌ ቀራኒዮ)", href: "/search?location=Kolfe" },
              { label: "Old Airport & Vatican Zone", href: "/search?location=Old%20Airport" },
              { label: "Sarbet & Bisrate Gabriel", href: "/search?location=Sarbet" },
              { label: "Addis Ketema (አዲስ ከተማ)", href: "/search?location=Addis%20Ketema" },
              { label: "All Addis Ababa Locations", href: "/search" },
            ],
          },
        ],
      },
    },
    secondaryLinks: [
      { label: "ERNS Valuations", href: "/sell" },
      { label: "ERNS Rentals Network", href: "/search?status=FOR_RENT" },
      { label: "ERNS Commercial & Office", href: "/search?propertyType=COMMERCIAL" },
      { label: "Verified Agents Directory", href: "/agents" },
    ],
    tertiaryLinks: [],
    networkLinks: [],
    privacyChoice: {
      button: "Do Not Sell or Share My Personal Information →",
      modalTitle: "Your Privacy Choices & Data Preferences",
      modalSubtitle:
        "Under ERNS Consumer Privacy Standards, you have the right to opt-out of the sharing of your personal information for targeted advertising or data brokerage.",
      necessaryTitle: "Strictly Necessary Data & Cookies",
      necessaryDesc: "Essential for site security, session authorization, and core real estate search features.",
      necessaryAlwaysActive: "Always Active",
      analyticsTitle: "Performance & Analytics Activity",
      analyticsDesc: "Helps ERNS understand how visitors interact with property listings to improve usability.",
      advertisingTitle: "Personalized Recommendations & Search Insights",
      advertisingDesc: "Enables tailored home recommendations based on previous filters and saved homes.",
      optOutTitle: "Opt-Out of Data Sharing for Cross-Context Advertising",
      optOutDesc: "When enabled, ERNS will not share your browsing patterns with external analytics or marketing partners.",
      saveBtn: "Save My Preferences",
      acceptAllBtn: "Accept All",
      savedToast: "Your privacy preferences have been successfully updated.",
    },
    legal: {
      accessibility:
        "ERNS Group is committed to ensuring digital accessibility for individuals with disabilities. We are continuously working to improve the accessibility of our web experience for everyone, and we welcome feedback and accommodation requests. If you wish to report an issue or seek an accommodation,",
      accessibilityLink: "please let us know.",
      licensing:
        "ERNS, Inc. holds real estate platform brokerage licensing in Ethiopia. Mortgage calculation tools and bank financing summaries are provided for informational purposes in collaboration with registered Ethiopian financial institutions.",
      equalHousing: "Equal Housing Opportunity",
      copyright: "ERNS, Inc. All rights reserved.",
    },
  },
  am: {
    aboutRecommendations: {
      title: "ስለ ERNS የቤት ጥቆማዎች",
      description:
        "ጥቆማዎች እርስዎ ባሉበት አካባቢ እና የፍለጋ እንቅስቃሴዎ ላይ የተመሰረቱ ናቸው—ለምሳሌ የተመለከቷቸው፣ ያስቀመጧቸው ቤቶች እና የተጠቀሟቸው ማጣሪያዎች። ተስማሚ ቤቶች እንዳያመልጥዎ ተመሳሳይ ቤቶችን ለእርስዎ ለማቅረብ ይህንን መረጃ እንጠቀማለን።",
    },
    tabs: {
      realEstate: {
        tabTitle: "የሪል እስቴት ቤቶች",
        categories: [
          {
            title: "የሚሸጡ ቤቶች",
            links: [
              { label: "አዲስ አበባ የሚሸጡ ቤቶች", href: "/search?status=FOR_SALE" },
              { label: "የቦሌ ዘመናዊ አፓርታማዎች", href: "/search?status=FOR_SALE&location=Bole" },
              { label: "የሲኤምሲ ኮንዶሚኒየሞች", href: "/search?status=FOR_SALE&location=CMC" },
              { label: "የሳርቤት እና ኦልድ ኤርፖርት ቪላዎች", href: "/search?status=FOR_SALE&location=Sarbet" },
              { label: "የካዛንቺስ ፔንትሃውስ ቤቶች", href: "/search?status=FOR_SALE&location=Kazanchis" },
              { label: "የብስራተ ገብርኤል መኖሪያዎች", href: "/search?status=FOR_SALE&location=Bisrate%20Gabriel" },
            ],
          },
          {
            title: "የንብረት አይነቶች",
            links: [
              { label: "አፓርታማዎች እና ኮንዶዎች", href: "/search?status=FOR_SALE&propertyType=APARTMENT" },
              { label: "ቪላዎች እና የቤተሰብ ቤቶች", href: "/search?status=FOR_SALE&propertyType=HOUSE" },
              { label: "ታውንሃውስ እና ዱፕሌክስ", href: "/search?status=FOR_SALE&propertyType=TOWNHOUSE" },
              { label: "የንግድ እና የቢሮ ህንፃዎች", href: "/search?status=FOR_SALE&propertyType=COMMERCIAL" },
              { label: "አዳዲስ የሪል እስቴት ፕሮጀክቶች", href: "/search?status=FOR_SALE&newDevelopment=true" },
              { label: "የቅንጦት መኖሪያዎች", href: "/search?status=FOR_SALE&luxury=true" },
            ],
          },
          {
            title: "ልዩ ፍለጋዎች",
            links: [
              { label: "በባለቤቱ የሚሸጡ ቤቶች (FSBO)", href: "/sell" },
              { label: "ዋጋቸው የቀነሱ ቤቶች", href: "/search?status=FOR_SALE&priceDrop=true" },
              { label: "ክፍት የጉብኝት ቤቶች (Open Houses)", href: "/search?status=FOR_SALE&openHouse=true" },
              { label: "በቅርቡ የተሸጡ ቤቶች", href: "/search?status=SOLD" },
              { label: "የተረጋገጡ የኤጀንት ቤቶች", href: "/agents" },
              { label: "ነፃ የቤት ዋጋ ግምት", href: "/sell" },
            ],
          },
        ],
      },
      rentals: {
        tabTitle: "ኪራይ ቤቶች",
        categories: [
          {
            title: "የሚከራዩ ቤቶች",
            links: [
              { label: "ሁሉም የአዲስ አበባ ኪራዮች", href: "/search?status=FOR_RENT" },
              { label: "ሙሉ እቃ የተሟላላቸው አፓርታማዎች", href: "/search?status=FOR_RENT&furnished=true" },
              { label: "ያልተሟሉ የረጅም ጊዜ ኪራዮች", href: "/search?status=FOR_RENT" },
              { label: "ስቱዲዮ እና 1 መኝታ ቤቶች", href: "/search?status=FOR_RENT&beds=1" },
              { label: "ባለ 2 እና 3 መኝታ ቤቶች", href: "/search?status=FOR_RENT&beds=2" },
              { label: "ኪራይ ቪላዎች እና ግቢ ቤቶች", href: "/search?status=FOR_RENT&propertyType=HOUSE" },
            ],
          },
          {
            title: "ዲፕሎማት እና የንግድ መኖሪያዎች",
            links: [
              { label: "የዲፕሎማት እና ኤምባሲ መኖሪያዎች", href: "/search?status=FOR_RENT&expat=true" },
              { label: "የስራ ኃላፊዎች ሰርቪስ አፓርታማዎች", href: "/search?status=FOR_RENT&luxury=true" },
              { label: "የአጭር ጊዜ እና የዕረፍት ኪራዮች", href: "/search?status=FOR_RENT&shortTerm=true" },
              { label: "የኪራይ ቢሮዎች እና የንግድ ቦታዎች", href: "/search?status=FOR_RENT&propertyType=COMMERCIAL" },
              { label: "የቤት እንስሳት የሚፈቀዱባቸው ቤቶች", href: "/search?status=FOR_RENT&pets=true" },
              { label: "የአከራዮች ማስተዳደሪያ ስርዓት", href: "/rentalmanager" },
            ],
          },
          {
            title: "ዋና ዋና የኪራይ ቦታዎች",
            links: [
              { label: "ቦሌ አትላስ እና መድኃኔዓለም", href: "/search?status=FOR_RENT&location=Bole" },
              { label: "ካዛንቺስ እና ኢኮኖሚክ ኮሚሽን", href: "/search?status=FOR_RENT&location=Kazanchis" },
              { label: "ኦልድ ኤርፖርት ዓለም አቀፍ ማዕከል", href: "/search?status=FOR_RENT&location=Old%20Airport" },
              { label: "ሳርቤት እና ብስራተ ገብርኤል", href: "/search?status=FOR_RENT&location=Sarbet" },
              { label: "ሲኤምሲ እና አያት መኖሪያዎች", href: "/search?status=FOR_RENT&location=CMC" },
              { label: "የካ እና መገናኛ", href: "/search?status=FOR_RENT&location=Yeka" },
            ],
          },
        ],
      },
      mortgages: {
        tabTitle: "የቤት ብድር",
        categories: [
          {
            title: "ማስያዎች እና መመሪያዎች",
            links: [
              { label: "የቤት ብድር ክፍያ ማስያ", href: "/mortgage/calculator" },
              { label: "የመግዛት አቅም መገመቻ", href: "/mortgage/affordability" },
              { label: "የቅድመ ክፍያ መመሪያ", href: "/mortgage/downpayment" },
              { label: "መከራየት ወይስ መግዛት?", href: "/mortgage/rent-vs-buy" },
              { label: "የውጭ ምንዛሪ ማስያ", href: "/mortgage/diaspora" },
              { label: "የስም ዝውውር እና ኖተሪ ክፍያዎች", href: "/help/closing-costs" },
            ],
          },
          {
            title: "የኢትዮጵያ ባንኮች ፋይናንስ",
            links: [
              { label: "የኢትዮጵያ ንግድ ባንክ (CBE)", href: "/mortgage/cbe" },
              { label: "የአዋሽ ባንክ ዳያስፖራ ብድር", href: "/mortgage/awash" },
              { label: "የዳሽን ባንክ የቤት ፋይናንስ", href: "/mortgage/partners" },
              { label: "የአቢሲንያ ባንክ የቤት ብድር", href: "/mortgage/partners" },
              { label: "የኦሮሚያ ህብረት ስራ ባንክ", href: "/mortgage/partners" },
              { label: "የዳያስፖራ የውጭ ምንዛሪ ጥቅሞች", href: "/mortgage/diaspora" },
            ],
          },
          {
            title: "ምክር እና የተደጋጋሚ ጥያቄዎች",
            links: [
              { label: "ለመጀመሪያ ጊዜ ቤት ገዢዎች መመሪያ", href: "/help/first-time-buyer" },
              { label: "የይዞታ ማረጋገጫ ካርታ ፍተሻ", href: "/help/land-registry" },
              { label: "የወቅቱ የባንክ ወለድ መጠኖች (2026)", href: "/mortgage/rates" },
              { label: "የዳያስፖራ ማመልከቻ ሰነዶች", href: "/help/diaspora-guide" },
              { label: "ህጋዊ የሪል እስቴት ምክክር", href: "/help/legal" },
              { label: "ከ ERNS ብድር አማካሪ ጋር ይነጋገሩ", href: "/agents" },
            ],
          },
        ],
      },
      browseAddis: {
        tabTitle: "አዲስ አበባን ያስሱ",
        categories: [
          {
            title: "መካከለኛ ክፍለ ከተሞች",
            links: [
              { label: "ቦሌ ክፍለ ከተማ", href: "/search?location=Bole" },
              { label: "ቂርቆስ ክፍለ ከተማ", href: "/search?location=Kirkos" },
              { label: "አራዳ ክፍለ ከተማ", href: "/search?location=Arada" },
              { label: "ልደታ ክፍለ ከተማ", href: "/search?location=Lideta" },
              { label: "ካዛንቺስ ሰፈር", href: "/search?location=Kazanchis" },
              { label: "መስቀል ፍላወር እና ኦሎምፒያ", href: "/search?location=Meskel%20Flower" },
            ],
          },
          {
            title: "ምስራቅ እና ደቡብ",
            links: [
              { label: "የካ ክፍለ ከተማ", href: "/search?location=Yeka" },
              { label: "ንፋስ ስልክ ላፍቶ", href: "/search?location=Nifas%20Silk" },
              { label: "አቃቂ ቃሊቲ", href: "/search?location=Akaky" },
              { label: "ሲኤምሲ እና አያት ሰፈሮች", href: "/search?location=CMC" },
              { label: "ሰሚት እና ገርጂ አካባቢዎች", href: "/search?location=Gerji" },
              { label: "ለቡ እና ጆሞ መኖሪያዎች", href: "/search?location=Lebu" },
            ],
          },
          {
            title: "ምዕራብ እና ሰሜን",
            links: [
              { label: "ጉለሌ ክፍለ ከተማ", href: "/search?location=Gullele" },
              { label: "ኮልፌ ቀራኒዮ", href: "/search?location=Kolfe" },
              { label: "ኦልድ ኤርፖርት እና ቫቲካን", href: "/search?location=Old%20Airport" },
              { label: "ሳርቤት እና ብስራተ ገብርኤል", href: "/search?location=Sarbet" },
              { label: "አዲስ ከተማ", href: "/search?location=Addis%20Ketema" },
              { label: "ሁሉም የአዲስ አበባ አካባቢዎች", href: "/search" },
            ],
          },
        ],
      },
    },
    secondaryLinks: [
      { label: "የቤት ዋጋ ግምት", href: "/sell" },
      { label: "ERNS ኪራዮች", href: "/search?status=FOR_RENT" },
      { label: "ERNS የንግድ እና ቢሮ ቤቶች", href: "/search?propertyType=COMMERCIAL" },
      { label: "የተረጋገጡ ወኪሎች ማውጫ", href: "/agents" },
    ],
    tertiaryLinks: [],
    networkLinks: [],
    privacyChoice: {
      button: "የግል መረጃዬ አይሸጥ ወይም አይጋራ →",
      modalTitle: "የግላዊነት ምርጫዎችዎ እና የመረጃ አጠቃቀም",
      modalSubtitle:
        "በ ERNS የግላዊነት መርሆዎች መሰረት የግል መረጃዎን ለሶስተኛ ወገን የግብይት ማስታወቂያ እንዳይጋራ የመከልከል መብት አለዎት።",
      necessaryTitle: "አስፈላጊ ኩኪዎች እና የደህንነት መረጃዎች",
      necessaryDesc: "ለጣቢያው ደህንነት፣ ክፍለ ጊዜ እና ዋና የፍለጋ አገልግሎቶች ግዴታ ናቸው።",
      necessaryAlwaysActive: "ሁልጊዜ ንቁ",
      analyticsTitle: "የጣቢያ አፈጻጸም እና አጠቃቀም ትንታኔ",
      analyticsDesc: "ጎብኚዎች የቤት ዝርዝሮችን እንዴት እንደሚጠቀሙ በመረዳት አገልግሎታችንን ለማሻሻል ያግዛል።",
      advertisingTitle: "የተስማሙ ጥቆማዎች እና ፍለጋዎች",
      advertisingDesc: "በቀድሞ ፍለጋዎችዎ እና በተመለከቷቸው ቤቶች ላይ ተመስርተው የሚቀርቡ ጥቆማዎችን ያነቃል።",
      optOutTitle: "የመረጃ መጋራት ይቁም (Opt-Out)",
      optOutDesc: "ሲበራ ERNS የእርስዎን የፍለጋ መረጃ ለውጭ የማስታወቂያ አጋሮች አያጋራም።",
      saveBtn: "ምርጫዬን መዝግብ",
      acceptAllBtn: "ሁሉንም ተቀበል",
      savedToast: "የግላዊነት ምርጫዎ በተሳካ ሁኔታ ተመዝግቧል።",
    },
    legal: {
      accessibility:
        "ERNS ለሁሉም ተጠቃሚዎች ምቹ እና ተደራሽ የዲጂታል አገልግሎት ለመስጠት ቁርጠኛ ነው። ስርዓታችንን ለማሻሻል ሁልጊዜ እንሰራለን፤ ማንኛውም አስተያየት ወይም ጥያቄ ካለዎት፣",
      accessibilityLink: "እባክዎን ያሳውቁን።",
      licensing:
        "ERNS በኢትዮጵያ የህግ ማዕቀፍ ውስጥ የተፈቀደለት የሪል እስቴት መድረክ ነው። የብድር ማስያ እና የባንክ መረጃዎች ለጠቅላላ ግንዛቤ ከህጋዊ የፋይናንስ ተቋማት ጋር በመተባበር የቀረቡ ናቸው።",
      equalHousing: "ፍትሃዊ የቤት ዕድል",
      copyright: "ERNS, Inc. መብቱ በህግ የተጠበቀ ነው።",
    },
  },
};
