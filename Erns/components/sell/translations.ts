export type Language = "en" | "am";

export const translations = {
  en: {
    hero: {
      badge: "ERNS Real Estate Marketplace",
      title: "Sell your home with confidence",
      subtitle:
        "Explore your selling options in Ethiopia and choose the path that best matches your timeline and goals.",
      seeOptions: "See your options",
      search: {
        subCityPlaceholder: "All Sub-Cities (Addis Ababa)",
        addressPlaceholder: "Enter neighborhood, street, or landmark (e.g. Atlas, CMC, Sarbet)",
        btnStart: "Get started",
        browseBelow: "Or explore all selling options below",
        modalTitle: "Selling in",
        modalSubtitle: "Select how you'd like to proceed with your property at",
        modalDefaultLocation: "Addis Ababa",
        optionAgentBadge: "Full-Service",
        optionAgentTitle: "Connect with a Local Verified Agent",
        optionAgentDesc: "Partner with an accredited agent specialized in your sub-city for pricing, showings, vetting, and title transfer.",
        optionAgentBtn: "Find Agents",
        optionFsboBadge: "Zero Commission",
        optionFsboTitle: "List Directly for Free (FSBO)",
        optionFsboDesc: "Publish your listing directly to thousands of verified buyers with 0% agent fees and direct phone calls.",
        optionFsboBtn: "Start Free Listing",
        modalClose: "Close",
      },
    },
    sellingOptions: {
      title: "Choose your selling path",
      subtitle:
        "Whether you want full-service guidance or prefer listing directly, ERNS gives you complete flexibility.",
      card1: {
        tag: "Full-Service Guidance",
        title: "Find a verified agent",
        desc: "Partner with an accredited local agent who knows market valuations in Addis Ababa. They manage professional photography, showings, buyer vetting, negotiation, and title deed paperwork.",
        features: [
          {
            title: "Local market pricing strategy",
            desc: "Expert pricing based on actual closed transactions in your sub-city.",
          },
          {
            title: "Pre-screened & verified buyers",
            desc: "We screen incoming inquiries so you only meet serious buyers.",
          },
          {
            title: "Deed & legal closing assistance",
            desc: "Full support through title search, bank escrow, and title deed transfer.",
          },
        ],
        buttonText: "Find an agent",
      },
      card2: {
        tag: "100% Free to List",
        title: "List it myself",
        desc: "Take full control of your sale. Post your property directly on ERNS without paying agent commissions. Connect directly with serious buyers from Ethiopia and the diaspora.",
        features: [
          {
            title: "Zero agent commission",
            desc: "Keep 100% of your sale proceeds with no hidden fees or charges.",
          },
          {
            title: "Direct buyer communication",
            desc: "Receive inquiries directly to your verified phone and message buyers.",
          },
          {
            title: "Local & diaspora buyer reach",
            desc: "Instant exposure to thousands of verified domestic and overseas home seekers.",
          },
        ],
        buttonText: "List it myself",
      },
    },
    trust: {
      title: "Built for trust and transparency in Ethiopia",
      subtitle: "A modern, secure marketplace built to eliminate scams and uncertainty.",
      pillars: [
        {
          title: "Verified Agents",
          desc: "Every agent profile is authenticated with official government identification and professional credentials.",
        },
        {
          title: "100% Free to List",
          desc: "No upfront fees, no listing charges, and no hidden subscriptions to publish your property on ERNS.",
        },
        {
          title: "Listings Moderated",
          desc: "Every property submission is reviewed to ensure accurate photos, clear pricing, and scam protection.",
        },
      ],
    },
    guides: {
      title: "Helpful guides for home sellers",
      subtitle: "Learn about the selling process, legal requirements, and market insights in Ethiopia.",
      readGuideBtn: "Read Full Guide",
      modalCloseBtn: "Close Guide",
      keyTakeawaysLabel: "Key Takeaways",
      checklistLabel: "Actionable Checklist",
      proTipLabel: "Pro Tip",
      warningLabel: "Important Warning",
      ctaBoxTitle: "Ready to take the next step?",
      ctaBoxDesc: "Put these insights into action with ERNS verified tools.",
      ctaListBtn: "List Your Property for Free",
      ctaAgentBtn: "Connect with an Expert Agent",
      items: [
        {
          id: "pricing",
          category: "Valuation",
          readTime: "6 min read",
          title: "Pricing your home right in Addis Ababa",
          excerpt:
            "Learn how price per square meter varies across sub-cities like Bole, Kazanchis, and CMC, and how to price competitively.",
          keyTakeaways: [
            "Overpricing by more than 8-10% in Addis Ababa causes listings to stagnate, deterring qualified buyers.",
            "Square meter valuations differ vastly between core commercial hubs (Bole, Kazanchis) and residential corridors (CMC, Ayat, Lebu).",
            "Essential amenities like 3-phase power and a 3,000L+ underground water tank can command up to a 15% price premium.",
            "Always build in a customary 3% to 5% negotiation buffer (ድርድር) without exceeding fair market thresholds."
          ],
          sections: [
            {
              heading: "1. Understanding Sub-City Square Meter Variations",
              paragraphs: [
                "Real estate in Addis Ababa is intensely localized. While Bole and Kazanchis attract high rental yields and diaspora demand commanding premium rates per square meter, residential zones such as CMC, Summit, and Sarbet follow different valuation benchmarks.",
                "When calculating your property's value, clearly distinguish between the total land plot (ግቢ) and the built-up living area (የተገነባ ስፋት). In multi-story villas (G+1 or G+2), evaluate the total usable floor area alongside compound utility."
              ],
              callout: {
                type: "tip",
                title: "Compare Completed Sales, Not Stale Asking Prices",
                message: "Avoid anchoring your asking price to neighbor signs that have sat unsold for 9+ months. Focus on actual closed contract prices registered in the last 60 to 90 days."
              }
            },
            {
              heading: "2. The Value Multipliers That Addis Ababa Buyers Prioritize",
              paragraphs: [
                "Infrastructure reliability directly dictates final selling price in Ethiopia. Buyers in Addis Ababa place heavy weight on reliable utilities and compound autonomy.",
                "Properties equipped with borehole water access or high-capacity underground reservoirs paired with an electric booster pump consistently sell faster than comparable properties relying strictly on municipal supply."
              ],
              bullets: [
                "Water Infrastructure: 3,000L - 5,000L underground backup tank with automatic booster.",
                "Electrical Stability: 3-Phase power meter with automatic generator changeover switch.",
                "Road Frontage: Direct access to paved asphalt vs cobblestone or gravel roads.",
                "Compound Security: High perimeter walls, electric fencing, and dedicated guardhouse."
              ]
            },
            {
              heading: "3. Strategic Pricing & The Ethiopian Negotiation Buffer (ድርድር)",
              paragraphs: [
                "In Ethiopian real estate culture, serious buyers virtually always expect room for bargaining (ድርድር). If you price strictly at your bottom line and refuse to negotiate, buyers may walk away feeling unheard.",
                "The winning strategy is to price 3% to 5% above your target net proceeds. This leaves comfortable room for constructive negotiation while maintaining competitive market positioning."
              ],
              callout: {
                type: "warning",
                title: "Beware the Stagnation Trap",
                message: "Properties priced over 10% above market value sit idle for over six months. When sellers eventually reduce the price, buyers assume the property has hidden title defects or structural issues."
              }
            }
          ],
          checklist: [
            "Review verified recent sales in your woreda within 500 meters",
            "Calculate total built-up square meters versus total compound plot",
            "Inspect and service backup water pump and generator before viewings",
            "Decide your absolute bottom-line net price and add a 3-5% buffer"
          ],
          conclusion: "Accurate pricing from day one attracts serious buyers within the first 14 days of listing, resulting in faster closings and higher net proceeds."
        },
        {
          id: "title-deed",
          category: "Legal & Title",
          readTime: "7 min read",
          title: "Title Deed (Carta/Libre) & Required Legal Documents",
          excerpt:
            "The complete checklist of property documents, verification procedures, and legal steps required to transfer ownership in Ethiopia.",
          keyTakeaways: [
            "A clean, unencumbered Landholding Certificate (ካርታ / Carta) is mandatory before accepting binding buyer funds.",
            "Sub-city land registry clearance verifies that the property has no court injunctions, inheritance disputes, or bank liens.",
            "All property contracts must be authenticated at the Federal Documents Authentication and Registration Agency (DARO).",
            "Standard financial closing utilizes Certified Payment Orders (CPO) rather than cash transactions for full security."
          ],
          sections: [
            {
              heading: "1. Core Document Verification Checklist",
              paragraphs: [
                "Before publishing your listing, ensure all primary ownership documents are in order. Missing or outdated paperwork is the leading reason property transactions collapse in Addis Ababa.",
                "Ensure that the name on the Title Deed matches your current National ID, Kebele ID, or Ethiopian Passport exactly. If the property was acquired during marriage, both spouses must be present or provide notarized power of attorney."
              ],
              bullets: [
                "Original Land Holding Certificate (የይዞታ ማረጋገጫ ካርታ / ዲጂታል ካዳስተር)",
                "Official National ID / Kebele ID or Passport of all registered owners",
                "Spousal consent affidavit and marriage certificate (የጋብቻ ማረጋገጫ)",
                "Approved architectural and site construction plans (የይዞታ ፕላን)",
                "Inheritance certificate (የውርስ ማረጋገጫ) and court clearance if inherited"
              ]
            },
            {
              heading: "2. Navigating Sub-City Land Registry Clearance (ክሊራንስ)",
              paragraphs: [
                "The seller must secure an official clearance (ክሊራንስ) from the Sub-City Land Management and Registration Office. This confirms the absence of outstanding property taxes, municipal fines, or public easements.",
                "The land office will verify that the digital cadastral coordinates match the physical boundary walls and that no court injunctions (የፍርድ ቤት እግድ) are registered against the title."
              ],
              callout: {
                type: "warning",
                title: "Avoid Informal Handwritten Agreements (የእጅ ውል)",
                message: "Never execute a private handwritten sales contract outside the authorized Documents Authentication and Registration Agency (DARO). In Ethiopia, unauthenticated agreements provide weak legal recourse in judicial disputes."
              }
            },
            {
              heading: "3. Safe Financial Settlement with Bank CPO",
              paragraphs: [
                "The universally accepted and secure settlement instrument in Ethiopian real estate is the Certified Payment Order (CPO) issued by an authorized commercial bank.",
                "On the day of signing at DARO, the buyer presents the CPO in the seller's name. The seller's bank verifies the authenticity of the instrument before title deed transfer documents are signed and stamped."
              ],
              callout: {
                type: "tip",
                title: "Budget for Taxes and Transfer Fees",
                message: "Ensure you account for the 4% title deed transfer fee and Capital Gains tax (15% on net capital gains profit) so there are no surprises at settlement."
              }
            }
          ],
          checklist: [
            "Verify Title Deed matches current IDs of all owners",
            "Obtain tax clearance certificate from your sub-city revenue office",
            "Confirm absence of bank liens or court injunctions at the Land Bureau",
            "Instruct buyer to issue Certified Payment Order (CPO) through an authorized bank"
          ],
          conclusion: "Preparing your legal documentation in advance protects both parties, prevents transaction delays, and guarantees a smooth title transfer."
        },
        {
          id: "staging",
          category: "Preparation",
          readTime: "5 min read",
          title: "Preparing & Photographing Your Property for Maximum Value",
          excerpt:
            "Tips on decluttering, capturing daylight photos, and highlighting key amenities like backup water tanks and generators.",
          keyTakeaways: [
            "Homes with bright, high-resolution daylight photos receive over 3x more qualified viewing requests on ERNS.",
            "Decluttering compounds, service rooms, and carports instantly elevates perceived value.",
            "Minor cosmetic fixes (paint touch-ups, repairing leaking fixtures) deliver the highest return on investment.",
            "Showcasing water reservoirs, backup power, and compound security builds instant buyer confidence."
          ],
          sections: [
            {
              heading: "1. Compound Curb Appeal & Deep Cleaning",
              paragraphs: [
                "In Ethiopian villas and compounds, buyer impressions start at the exterior gate. A clean, well-maintained compound signals that the entire property has been cared for conscientiously.",
                "Pressure-wash or sweep cobblestone pavers, trim overgrown landscaping, and declutter service quarters (የሰርቪስ ቤቶች) so prospective buyers can appreciate their true utility as guest rooms, offices, or rental units."
              ],
              callout: {
                type: "tip",
                title: "Maximize Light and Fresh Air",
                message: "Open all curtains, drapes, and windows 30 minutes before viewing appointments to fill the interior with natural light and fresh ventilation."
              }
            },
            {
              heading: "2. High-ROI Cosmetic Repairs Prior to Listing",
              paragraphs: [
                "You do not need an expensive complete renovation to command top dollar. Focus on high-visibility touch-ups that eliminate buyer doubts.",
                "When prospective buyers observe leaking faucets, flickering light switches, or peeling paint, they immediately deduct significantly more than the actual repair cost from their offer."
              ],
              bullets: [
                "Apply fresh neutral paint to high-traffic hallways and the living room entrance",
                "Service dripping faucets, toilet flush valves, and shower heads",
                "Replace burned-out bulbs with warm daylight LED lighting across all rooms",
                "Ensure gate locks, compound lighting, and security doors open smoothly"
              ]
            },
            {
              heading: "3. Capturing High-Impact Photos for ERNS",
              paragraphs: [
                "Most home searches begin online on a smartphone. High-quality daylight photography is your primary marketing tool to capture serious domestic and diaspora buyers.",
                "Photograph during peak morning light (9:00 AM – 11:30 AM) or gentle afternoon sunlight (3:00 PM – 5:00 PM). Avoid night photography with harsh artificial flash, which flattens room depth."
              ],
              callout: {
                type: "tip",
                title: "Highlight Strategic Amenities",
                message: "Always include crisp photos of the standby generator, water tank and booster pump, compound parking, and guardhouse. These are decisive selling points in Addis Ababa."
              }
            }
          ],
          checklist: [
            "Declutter living spaces, kitchen countertops, and compound walkways",
            "Repair visible minor plumbing and electrical defects",
            "Photograph in landscape orientation during bright morning daylight",
            "Capture dedicated photos of water reservoirs, generator, and parking"
          ],
          conclusion: "A meticulously prepared, brightly photographed home commands top market value and sells up to 40% faster on ERNS."
        }
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about selling your home on ERNS.",
      items: [
        {
          q: "Is it really free to list my home on ERNS?",
          a: "Yes! Listing your property for sale by owner is 100% free with zero upfront charges, hidden fees, or listing commissions.",
        },
        {
          q: "What documents do I need to list and sell my property?",
          a: "To list, you only need property photos and basic details. When transferring ownership, you will need a valid Title Deed (Libre), an official Kebele or National ID, and tax clearance documents.",
        },
        {
          q: "How do agents get verified on ERNS?",
          a: "Agents undergo identity authentication with valid government ID, professional license verification, and phone number validation before receiving an approved verified badge.",
        },
        {
          q: "How do I protect myself from scams when selling?",
          a: "Always verify the buyer's identity, never share original title documents without a certified lawyer or bank escrow agreement, and conduct financial transactions exclusively through official banking channels (e.g. CBE, Telebirr, Awash).",
        },
        {
          q: "Can diaspora buyers purchase properties through ERNS?",
          a: "Yes. ERNS connects local sellers directly with verified diaspora buyers looking to purchase homes in Ethiopia using foreign currency or bank accounts.",
        },
        {
          q: "Can I list myself first and hire an agent later?",
          a: "Absolutely. You can start with 'List it myself' and at any point connect with a verified partner agent if you want professional marketing and negotiation support.",
        },
      ],
    },
    cta: {
      title: "Find your perfect selling path in minutes",
      subtitle: "Answer a few simple questions to determine whether selling with a partner agent, listing yourself, or requesting an express investor sale is best for you.",
      btnQuiz: "Explore selling options",
      btnListDirect: "List it myself (Free)",
      btnAgentDirect: "Find an agent directly",
      orBrowse: "Already know what you want?",
      quiz: {
        modalTitle: "Find Your Ideal Selling Path",
        stepIndicator: "Step {step} of 4",
        btnBack: "Back",
        btnNext: "Next",
        btnSeeResult: "See My Selling Path",
        btnRetake: "Retake Quiz",
        step1Title: "Tell us about your property",
        step1Subtitle: "Select your property type and location in Addis Ababa",
        subCityLabel: "Sub-City",
        areaLabel: "Neighborhood / Landmark (Optional)",
        areaPlaceholder: "e.g. Atlas, CMC, Meganagna, Sarbet",
        typeLabel: "Property Type",
        step2Title: "When do you plan to sell?",
        step2Subtitle: "Choose the timeline that best matches your situation",
        timeline1Title: "Immediately (Under 30 days)",
        timeline1Desc: "I need to close as fast as possible with minimal wait time.",
        timeline2Title: "1 to 3 Months",
        timeline2Desc: "Standard market timeline. I want balanced speed and market price.",
        timeline3Title: "Just Exploring (3+ months)",
        timeline3Desc: "I'm testing buyer interest and seeking the absolute peak price.",
        step3Title: "What is your top priority?",
        step3Subtitle: "Every seller's goal is different. What matters most to you?",
        priority1Title: "Maximize Proceeds (0% Commission)",
        priority1Desc: "Keep 100% of my home's equity. I'm ready to answer buyer calls directly.",
        priority2Title: "Zero Hassle (Full Professional Service)",
        priority2Desc: "Let an accredited expert handle pricing, photos, vetting, and DARA title transfer.",
        priority3Title: "Speed & Guaranteed Sale",
        priority3Desc: "Fast cash closing, sell as-is with zero renovations and no open house showings.",
        resultTag: "Recommended for you",
        agentMatchTitle: "Sell with a Verified Partner Agent",
        agentMatchDesc: "Based on your need for a seamless, hassle-free process and strong negotiation in {location}, partnering with an accredited agent is your ideal match.",
        agentMatchBtn: "Connect with Verified Agents in {location}",
        fsboMatchTitle: "List Directly for Free (FSBO)",
        fsboMatchDesc: "Based on your goal to keep 100% of proceeds and your flexible timeline, listing directly by owner on ERNS will save you hundreds of thousands of Birr in broker fees.",
        fsboMatchBtn: "Start Free Owner Listing",
        expressMatchTitle: "Express Investor Cash Sale",
        expressMatchDesc: "Based on your urgent timeline and desire for speed, our network of verified cash buyers and diaspora investors can provide rapid closing with no public showings.",
        expressMatchBtn: "Request Express Evaluation",
        otherOptions: "Or consider other paths:",
      },
    },
    fsbo: {
      hero: {
        badge: "100% Free Listing • Zero Commission",
        title: "Post Your Home For Sale by Owner",
        subtitle:
          "Connect directly with thousands of qualified home buyers in Addis Ababa and the global diaspora. No brokers, no hidden fees, and zero commission.",
        cityPlaceholder: "Addis Ababa",
        subCityPlaceholder: "Select Sub-City (e.g. Bole, Yeka, Kirkos)",
        addressPlaceholder: "Street or landmark (e.g., Bole Medhanialem)",
        btnStart: "Start Free Listing",
        stats: [
          { value: "0%", label: "Commission Fee" },
          { value: "100%", label: "Direct Inquiries" },
          { value: "5 min", label: "Quick Setup" },
        ],
      },
      howItWorks: {
        title: "How For Sale By Owner Works",
        subtitle:
          "A proven, transparent step-by-step roadmap to successfully selling your home on your own in Ethiopia.",
        steps: [
          {
            step: "01",
            title: "Set a Realistic Market Price",
            desc: "Compare recent closed sales across your sub-city (Bole, CMC, Kazanchis, Summit). Accurate pricing attracts serious, pre-screened buyers right away.",
          },
          {
            step: "02",
            title: "Prepare Clean, Bright Photos",
            desc: "Showcase living rooms, modern kitchens, bedrooms, and key infrastructure like water backup tanks, standby generators, and secure parking.",
          },
          {
            step: "03",
            title: "Publish for Free on ERNS",
            desc: "Fill in your property specs, title deed (Libre) status, and verified phone number. Your listing goes live immediately to qualified buyers.",
          },
          {
            step: "04",
            title: "Manage Calls & Finalize the Deed",
            desc: "Receive calls directly from serious buyers, schedule daytime showings, negotiate your terms, and legally transfer the title deed at DARA.",
          },
        ],
      },
      prosCons: {
        title: "Is Selling By Owner Right For You?",
        subtitle:
          "Compare the benefits of selling independently with working alongside an accredited real estate agent.",
        prosTitle: "Why Sell by Owner (FSBO)",
        pros: [
          {
            title: "Zero Broker Commission",
            desc: "Keep 100% of your home equity. On typical Addis Ababa home sales, this saves you hundreds of thousands of Birr.",
          },
          {
            title: "Total Decision Control",
            desc: "You choose your asking price, photo gallery, open house schedule, and negotiate directly with interested buyers.",
          },
          {
            title: "Direct Buyer Relationships",
            desc: "Speak directly with home buyers without broker filters, speculative markups, or communication delays.",
          },
        ],
        consTitle: "Considerations to Keep in Mind",
        cons: [
          {
            title: "Time Commitment",
            desc: "You will handle incoming buyer calls, answer repeated questions, and coordinate in-person viewings yourself.",
          },
          {
            title: "Pricing & Negotiation Savvy",
            desc: "Without comparative market analysis, homes can be underpriced or sit on the market if priced above local comps.",
          },
          {
            title: "Legal & Title Paperwork",
            desc: "You must organize your Title Deed (Libre), tax clearance certificates, and navigate municipality transfer offices.",
          },
        ],
        agentBannerText:
          "Prefer an accredited professional to manage valuation, marketing, and legal paperwork for you?",
        agentBannerBtn: "Find a Verified Agent",
      },
      whyErns: {
        title: "Why Post on ERNS?",
        subtitle:
          "The trusted digital property marketplace engineered specifically for the Ethiopian market.",
        cards: [
          {
            title: "100% Free with Unlimited HD Photos",
            desc: "Upload high-resolution exterior and interior photos, floor plans, and architectural details with zero listing fees.",
          },
          {
            title: "Local & Diaspora Exposure",
            desc: "Put your property in front of home seekers in Addis Ababa, regional cities, and overseas Ethiopians investing back home.",
          },
          {
            title: "Direct Verified Inquiries",
            desc: "Interested buyers connect directly with your phone number via phone call or messaging. No unauthorized broker middleman.",
          },
        ],
      },
      builder: {
        title: "Create Your Free Owner Listing",
        subtitle:
          "Complete the details below to preview your listing and publish it to the ERNS marketplace in minutes.",
        step1: "1. Location & Type",
        step2: "2. Specs & Price",
        step3: "3. Amenities & Title",
        step4: "4. Photos & Contact",
        cityLabel: "City / Region",
        subCityLabel: "Sub-City",
        woredaLabel: "Woreda / Kebele",
        specificAreaLabel: "Street / Specific Area",
        propertyTypeLabel: "Property Type",
        propertyTypes: {
          apartment: "Apartment",
          condo: "Condominium",
          villa: "Villa / Standalone",
          townhouse: "Townhouse",
          penthouse: "Penthouse",
          commercial: "Commercial Property",
        },
        subCities: [
          "Bole",
          "Yeka",
          "Kirkos",
          "Arada",
          "Gulele",
          "Lideta",
          "Kolfe Keranio",
          "Nifas Silk-Lafto",
          "Akaky Kaliti",
          "Lemi Kura",
        ],
        bedroomsLabel: "Bedrooms",
        bathroomsLabel: "Bathrooms",
        areaLabel: "Total Area (m²)",
        priceLabel: "Asking Price (ETB)",
        priceNegotiableLabel: "Price is negotiable",
        titleDeedLabel: "Title Deed (Libre) Status",
        titleDeedOptions: {
          digital: "Digital Libre (ዲጂታል ካርታ)",
          paper: "Standard Paper Libre (ባህላዊ ካርታ)",
          lease: "Government Leasehold (ሊዝ)",
          processing: "Title in Transfer Process",
        },
        amenitiesLabel: "Key Amenities & Features",
        amenitiesList: [
          "Water Tank / Reserve (የውሃ ታንከር)",
          "Standby Generator (ጀነሬተር)",
          "Dedicated Parking (የመኪና ማቆሚያ)",
          "Balcony / Terrace (በረንዳ)",
          "Modern Fitted Kitchen (ዘመናዊ ኩሽና)",
          "24/7 Compound Security (ጥበቃ)",
          "Elevator / Lift (ሊፍት)",
          "Servant Quarters (የሰራተኛ ክፍል)",
        ],
        photosLabel: "Property Photos",
        photosHint:
          "Upload bright, high-quality images. Recommended: living room, kitchen, master bedroom, compound.",
        dropzoneText: "Drag and drop photos here, or click to browse",
        descLabel: "Property Description",
        descPlaceholder:
          "Describe the highlights of your home, nearby landmarks, road access, schools, shopping centers...",
        ownerNameLabel: "Owner Full Name",
        phoneLabel: "Contact Phone (+251)",
        preferredTimeLabel: "Best Time to Call",
        callTimeAnytime: "Anytime (8:00 AM - 8:00 PM)",
        callTimeMorning: "Mornings Only",
        callTimeEvening: "Evenings Only",
        previewTitle: "Live Listing Preview",
        btnNext: "Next Step",
        btnPrev: "Back",
        btnPublish: "Publish Free Listing",
        successTitle: "Your Property Has Been Submitted!",
        successDesc:
          "Your listing has been created and will appear live on ERNS shortly after automated verification.",
        successRef: "Listing Reference: #FSBO-",
        btnViewListing: "Preview on Marketplace",
        btnCreateAnother: "Post Another Home",
      },
      legalChecklist: {
        title: "Ethiopian Property Transfer Guide & Checklist",
        subtitle:
          "Follow these essential steps to ensure a legal, scam-free deed transfer in Addis Ababa.",
        items: [
          {
            title: "Original Title Deed (Libre / የይዞታ ማረጋገጫ ካርታ)",
            desc: "Ensure your original deed is under your name and verify with the sub-city Land Administration office that there are no active liens or court injunctions.",
          },
          {
            title: "Sub-City Tax Clearance Certificate (የግብር ክሊራንስ)",
            desc: "Obtain your property tax and land rental clearance up to the current fiscal year from your sub-city revenue bureau.",
          },
          {
            title: "Valid Identification & Marital Status Proof",
            desc: "Both seller and buyer must present valid National IDs or Kebele IDs. If the property is matrimonial property, spousal consent and signature are legally mandatory.",
          },
          {
            title: "DARA Contract Legalization (ውልና ማስረጃ)",
            desc: "Execute the contract of sale at the Federal Documents Authentication and Registration Agency (DARA) to legally bind the transfer.",
          },
          {
            title: "Guaranteed Bank Escrow or CPO Payment",
            desc: "Always mandate payment via Certified Payment Order (CPO) or secure bank escrow. Never hand over deed originals without confirmed bank clearance.",
          },
        ],
      },
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Everything you need to know about selling your home yourself on ERNS.",
        items: [
          {
            q: "Is it really free to list my home on ERNS?",
            a: "Yes, 100% free. There are no registration fees, listing fees, or commission deductions when you post your home as an owner.",
          },
          {
            q: "How will prospective buyers contact me?",
            a: "Buyers will see your verified Ethiopian phone number on the listing and can call you or message you directly.",
          },
          {
            q: "What documents do I need to prepare before hosting showings?",
            a: "Keep a copy of your Title Deed (Libre) and property tax receipts handy. Never hand over original documents until signing at DARA (ውልና ማስረጃ).",
          },
          {
            q: "How do I protect against payment fraud?",
            a: "Insist on a Certified Payment Order (CPO) issued by a reputable Ethiopian bank (Commercial Bank of Ethiopia, Awash, Dashen, etc.) before signing deed transfer documents.",
          },
          {
            q: "What if I get overwhelmed and want an agent later?",
            a: "You can easily switch anytime. Request an accredited ERNS verified agent from your dashboard and they will take over pricing, showings, and legal closing.",
          },
        ],
      },
      cta: {
        title: "Ready to Sell on Your Own Terms?",
        desc: "Publish your home directly on ERNS in minutes with zero commission, or let an accredited agent do the heavy lifting.",
        btnStart: "Create Free Listing",
        btnAgent: "Find a Verified Agent",
      },
    },
  },
  am: {
    hero: {
      badge: "የኢአርኤንኤስ የሪል እስቴት መድረክ",
      title: "ቤትዎን በእርግጠኝነት ይሽጡ",
      subtitle: "የቤትዎን የሽያጭ አማራጮች ያወዳድሩ እና ከእርስዎ ፍላጎትና የጊዜ ሰሌዳ ጋር የሚስማማውን መንገድ ይምረጡ።",
      seeOptions: "የሽያጭ አማራጮችን ይመልከቱ",
      search: {
        subCityPlaceholder: "ሁሉም ክፍለ ከተሞች (አዲስ አበባ)",
        addressPlaceholder: "ሰፈር፣ መንገድ ወይም አካባቢ ይፃፉ (ምሳሌ፡ አትላስ፣ ሲኤምሲ፣ ሳርቤት)",
        btnStart: "ይጀምሩ",
        browseBelow: "ወይም ሁሉንም የሽያጭ አማራጮች ከታች ይመልከቱ",
        modalTitle: "የሽያጭ መንገድ በ",
        modalSubtitle: "ለተመረጠው ንብረት የሽያጭ መንገድዎን ይምረጡ፡",
        modalDefaultLocation: "አዲስ አበባ",
        optionAgentBadge: "ሙሉ ሙያዊ ድጋፍ",
        optionAgentTitle: "ከተረጋገጠ የአካባቢው ወኪል ጋር ይገናኙ",
        optionAgentDesc: "በዚህ ክፍለ ከተማ ከተካነ ህጋዊ ወኪል ጋር በመስራት የገበያ ዋጋ፣ የገዢዎች ማጣሪያ እና የካርታ ዝውውር ድጋፍ ያግኙ።",
        optionAgentBtn: "ወኪሎችን ይመልከቱ",
        optionFsboBadge: "ዜሮ ኮሚሽን",
        optionFsboTitle: "በራስዎ በነፃ ይመዝግቡ (FSBO)",
        optionFsboDesc: "ቤትዎን በቀጥታ በERNS ላይ በመመዝገብ ለሺዎች ገዢዎች ያቅርቡ (ዜሮ ኮሚሽን፣ ቀጥተኛ ጥሪዎች)።",
        optionFsboBtn: "በነፃ ይመዝግቡ",
        modalClose: "ዝጋ",
      },
    },
    sellingOptions: {
      title: "የሽያጭ መንገድዎን ይምረጡ",
      subtitle: "ሙሉ ሙያዊ ድጋፍ ይፈልጉ ወይም ራስዎ በቀጥታ መዘርዘር ይመርጡ፣ ERNS የተሟላ ነፃነት ይሰጥዎታል።",
      card1: {
        tag: "ሙሉ ሙያዊ ድጋፍ",
        title: "የተረጋገጠ ወኪል ወይም ደላላ ያግኙ",
        desc: "በአዲስ አበባ ያለውን የገበያ ዋጋ ጠንቅቆ ከሚያውቅ ህጋዊ ወኪል ጋር ይስሩ። ፎቶዎችን ማዘጋጀት፣ ገዢዎችን ማነጋገር፣ ድርድር እና የካርታ ሰነዶችን ማጠናቀቅ ያከናውኑልዎታል።",
        features: [
          {
            title: "ትክክለኛ የገበያ ዋጋ ስትራቴጂ",
            desc: "በአካባቢዎ በተከናወኑ ትክክለኛ የሽያጭ ዋጋዎች ላይ የተመሰረተ ሙያዊ ግምት።",
          },
          {
            title: "የተረጋገጡና ዝግጁ ገዢዎች",
            desc: "ከማይረቡ ጥሪዎች ነፃ ሆነው ትክክለኛና ዝግጁ ገዢዎችን ብቻ ያስተናግዳሉ።",
          },
          {
            title: "የውል እና የካርታ ዝውውር ድጋፍ",
            desc: "የባንክ ክፍያ፣ የውል ስምምነት እና የይዞታ ማረጋገጫ ዝውውር ሙሉ የህግ ድጋፍ።",
          },
        ],
        buttonText: "ወኪል ያግኙ",
      },
      card2: {
        tag: "ሙሉ በሙሉ ነፃ ምዝገባ",
        title: "ራሴ እዘረዝራለሁ (ያለ ኮሚሽን)",
        desc: "የሽያጭ ሂደቱን በሙሉ ቁጥጥር ስር ያድርጉ። ያለምንም ኮሚሽን ቤትዎን በቀጥታ በERNS ላይ ይለጥፉ። ከሀገር ውስጥና ከውጭ ገዢዎች ጋር በቀጥታ ይገናኙ።",
        features: [
          {
            title: "ዜሮ ኮሚሽን — ሙሉ በሙሉ ነፃ",
            desc: "ያለምንም ክፍያ ወይም የኮሚሽን ቅናሽ የሽያጩን ሙሉ ገቢ ለራስዎ ያስቀሩ።",
          },
          {
            title: "ከገዢዎች ጋር ቀጥተኛ ግንኙነት",
            desc: "ጥሪዎችንና መልዕክቶችን በተረጋገጠ ስልክዎ በቀጥታ ይቀበሉ።",
          },
          {
            title: "ለሀገር ውስጥና ለዲያስፖራ ገዢዎች ተደራሽነት",
            desc: "በሺዎች ለሚቆጠሩ የሀገር ውስጥና የውጭ ሀገር ገዢዎች በቀላሉ ይታያሉ።",
          },
        ],
        buttonText: "ቤትዎን ይመዝግቡ",
      },
    },
    trust: {
      title: "በኢትዮጵያ ውስጥ ለአስተማማኝና ግልጽ ግብይት የተገነባ",
      subtitle: "ማጭበርበርን እና አለመተማመንን ለማስወገድ የተዘጋጀ ዘመናዊ የሪል እስቴት መድረክ።",
      pillars: [
        {
          title: "የተረጋገጡ ወኪሎች",
          desc: "እያንዳንዱ ወኪል ህጋዊ መታወቂያና የሙያ ማረጋገጫ ሰነድ በማቅረብ ማንነቱ በጥንቃቄ የተረጋገጠ ነው።",
        },
        {
          title: "100% ነፃ ምዝገባ",
          desc: "ንብረትዎን በERNS ላይ ለመመዝገብ ምንም ዓይነት የቅድመ ክፍያ ወይም ወርሃዊ ክፍያ አይጠየቁም።",
        },
        {
          title: "ቁጥጥር የሚደረግባቸው ማስታወቂያዎች",
          desc: "የተሳሳቱ ፎቶዎችንና ማጭበርበሮችን ለመከላከል እያንዳንዱ ማስታወቂያ በሙያተኞች ይመረመራል።",
        },
      ],
    },
    guides: {
      title: "ለቤት ሻጮች ጠቃሚ መመሪያዎች",
      subtitle: "ስለ ሽያጭ ሂደት፣ ህጋዊ ሰነዶች እና በአዲስ አበባ ስላለው የገበያ ሁኔታ ይወቁ።",
      readGuideBtn: "ሙሉ መመሪያውን ያንብቡ",
      modalCloseBtn: "መመሪያውን ዝጋ",
      keyTakeawaysLabel: "ዋና ዋና ነጥቦች",
      checklistLabel: "የተግባር ዝርዝር",
      proTipLabel: "ጠቃሚ ምክር",
      warningLabel: "አስፈላጊ ማስጠንቀቂያ",
      ctaBoxTitle: "ቀጣዩን እርምጃ ለመውሰድ ዝግጁ ነዎት?",
      ctaBoxDesc: "እነዚህን ጠቃሚ መረጃዎች በመጠቀም በERNS የተረጋገጡ መሳሪያዎች ስራዎን ይጀምሩ።",
      ctaListBtn: "ቤትዎን በነፃ ይመዝግቡ",
      ctaAgentBtn: "ከተረጋገጠ ወኪል ጋር ይገናኙ",
      items: [
        {
          id: "pricing",
          category: "የዋጋ ግምት",
          readTime: "6 ደቂቃ ንባብ",
          title: "በአዲስ አበባ የቤትዎን ትክክለኛ ዋጋ መወሰን",
          excerpt:
            "በቦሌ፣ በካዛንቺስ እና በሲኤምሲ ያለው የካሬ ሜትር ዋጋ እንዴት እንደሚለያይና ተወዳዳሪ ዋጋ እንዴት እንደሚሰጡ ይወቁ።",
          keyTakeaways: [
            "በአዲስ አበባ የቤትን ዋጋ ከገበያው ከ8-10% በላይ ማስቀመጥ ገዢዎችን በማሸሽ ሽያጩ ለረጅም ወራት እንዲጓተት ያደርጋል።",
            "በዋና የንግድ ማዕከላት (ቦሌ፣ ካዛንቺስ) እና በመኖሪያ መንደሮች (ሲኤምሲ፣ አያት፣ ለቡ) መካከል ከፍተኛ የካሬ ሜትር ዋጋ ልዩነት አለ።",
            "3-ፌዝ የኤሌክትሪክ ቆጣሪ እና ከ3,000 ሊትር በላይ የውሃ ታንከር መኖር የንብረቱን ዋጋ እስከ 15% ከፍ ያደርገዋል።",
            "የገበያውን ወሰን ሳያልፉ ለባህላዊው የዋጋ ድርድር (3% እስከ 5%) ቦታ መተው ይመረጣል።"
          ],
          sections: [
            {
              heading: "1. የክፍለ ከተሞች የካሬ ሜትር ዋጋ ልዩነት መረዳት",
              paragraphs: [
                "በአዲስ አበባ የሪል እስቴት ዋጋ እንደ አካባቢው በእጅጉ ይለያያል። ቦሌ እና ካዛንቺስ ከፍተኛ የኪራይ ገቢ እና የዲያስፖራ ፍላጎት ያላቸው በመሆናቸው በካሬ ሜትር ከፍተኛ ዋጋ ሲኖራቸው፣ እንደ ሲኤምሲ፣ ሰሚት እና ሳርቤት ያሉ የመኖሪያ መንደሮች ደግሞ የራሳቸው የሆነ የዋጋ ስሌት አላቸው።",
                "የንብረትዎን ዋጋ ሲተምኑ አጠቃላይ የይዞታውን ስፋት (ግቢ) እና የተገነባውን የወለል ስፋት በግልጽ ለይተው ያሰሉ። በቪላ ቤቶች (ጂ+1 ወይም ጂ+2) ላይ ጥቅም ላይ ሊውል የሚችለውን አጠቃላይ ስፋት ከግቢው አገልግሎት ጋር ማመዛዘን ተገቢ ነው።"
              ],
              callout: {
                type: "tip",
                title: "የተፈጸሙ ሽያጮችን ያወዳድሩ፣ ያልተሸጡ ዋጋዎችን አይደለም",
                message: "የቤትዎን ዋጋ ለ9 ወራት ባልተሸጡ የጎረቤት ማስታወቂያዎች ላይ ብቻ አይመስርቱ። ባለፉት 60 እና 90 ቀናት ውስጥ የተጠናቀቁ ትክክለኛ የውል ዋጋዎችን ያገናዝቡ።"
              }
            },
            {
              heading: "2. በአዲስ አበባ ገዢዎች ቅድሚያ የሚሰጧቸው የዋጋ አባዢዎች",
              paragraphs: [
                "የመሠረተ ልማት አስተማማኝነት የቤቱን የመጨረሻ የመሸጫ ዋጋ በቀጥታ ይወስናል። በአዲስ አበባ ያሉ ገዢዎች ለተሟላ የውሃ እና መብራት አማራጮች ልዩ ቦታ ይሰጣሉ።",
                "የከርሰ ምድር ውሃ (ቦርሆል) ወይም ከ3,000 ሊትር በላይ የውሃ ማጠራቀሚያ ታንከር ከፓምፕ ጋር የተገጠመላቸው ቤቶች፣ ከመንግስት መስመር ብቻ ጥገኛ ከሆኑ ቤቶች በበለጠ ፍጥነት ይሸጣሉ።"
              ],
              bullets: [
                "የውሃ መሠረተ ልማት፡ ከ3,000 እስከ 5,000 ሊትር የከርሰ ምድር ታንከር ከራስ-ሰር ፑሽ ፓምፕ ጋር።",
                "የኤሌክትሪክ አቅርቦት፡ 3-ፌዝ ቆጣሪ እና የጀነሬተር ማገናኛ መስመር።",
                "የመንገድ ተደራሽነት፡ በቀጥታ አስፋልት ላይ ያለ መንገድ ከኮብልስቶን ወይም ከጠጠር መንገድ በእጅጉ ይበልጣል።",
                "የግቢው ደህንነት፡ ጠንካራ አጥር፣ የኤሌክትሪክ ሽቦ ጥበቃ እና የጥበቃ ቤት።"
              ]
            },
            {
              heading: "3. ስልታዊ የዋጋ አወሳሰን እና የድርድር ቦታ",
              paragraphs: [
                "በኢትዮጵያ የቤት ግብይት ባህል እውነተኛ ገዢዎች ሁልጊዜም ድርድር ይጠብቃሉ። የመጨረሻውን የፈለጉትን ዋጋ ብቻ አስቀምጠው በፍጹም አልደራደርም ካሉ ገዢዎች ሊርቁ ይችላሉ።",
                "ትክክለኛው ዘዴ ከሚፈልጉት የተጣራ ገቢ ከ3% እስከ 5% ከፍ አድርገው መለጠፍ ነው። ይህ ለድርድር ምቹ ሁኔታን በመፍጠር የገበያ ተወዳዳሪነትዎን ሳያሳጣ ገዢዎችን ይስባል።"
              ],
              callout: {
                type: "warning",
                title: "የንብረት መጓተት አደጋን ይጠንቀቁ",
                message: "ከገበያ ዋጋ ከ10% በላይ የተለጠፉ ቤቶች ከስድስት ወር በላይ ገበያ ላይ ይቆያሉ። ከጊዜ በኋላ ዋጋው ሲቀንስ ገዢዎች በቤቱ ህጋዊነት ወይም ጥራት ላይ ጥርጣሬ ያድርባቸዋል።"
              }
            }
          ],
          checklist: [
            "በ500 ሜትር ራዲየስ ውስጥ በቅርቡ የተፈጸሙ ሽያጮችን ያጣሩ",
            "የተገነባውን የቤት ስፋት ከአጠቃላይ ግቢው ስፋት ለይተው ያሰሉ",
            "ገዢዎች ከመምጣታቸው በፊት የውሃ ፓምፑንና ጀነሬተሩን ሰርቪስ ያድርጉ",
            "የመጨረሻውን የሽያጭ ዋጋዎን ወስነው የ3-5% የድርድር ተጨማሪ ያክሉ"
          ],
          conclusion: "ከመጀመሪያው ቀን ጀምሮ ትክክለኛ የገበያ ዋጋ መወሰን በመጀመሪያዎቹ 14 ቀናት ውስጥ ዝግጁ ገዢዎችን በማምጣት ፈጣን ሽያጭ እንዲፈጸም ያደርጋል።"
        },
        {
          id: "title-deed",
          category: "ህጋዊ ሰነዶች",
          readTime: "7 ደቂቃ ንባብ",
          title: "የባለቤትነት ማረጋገጫ (ካርታ/ሊብሬ) እና አስፈላጊ ህጋዊ ሰነዶች",
          excerpt:
            "የይዞታ ማረጋገጫን ህጋዊነት ማረጋገጥ እና የባለቤትነት ዝውውር ለማከናወን የሚያስፈልጉ ወሳኝ ሰነዶች ዝርዝር።",
          keyTakeaways: [
            "ማንኛውንም מחያጭ ገንዘብ ከመቀበልዎ በፊት ከማንኛውም እገዳ ነፃ የሆነ ህጋዊ የይዞታ ማረጋገጫ ካርታ መኖር ግዴታ ነው።",
            "በክፍለ ከተማው የመሬት አስተዳደር የሚሰጥ ክሊራንስ ቤቱ ከፍርድ ቤት እግድ፣ ከውርስ ክርክር እና ከባንክ እዳ ነፃ መሆኑን ያረጋግጣል።",
            "ሁሉም የቤት ሽያጭ ውሎች በፌዴራል የሰነዶች ማረጋገጫና ምዝገባ ኤጀንሲ (DARA) ፊት መፈረም አለባቸው።",
            "አስተማማኝ የገንዘብ ክፍያ በጥሬ ገንዘብ ሳይሆን በባንክ የተረጋገጠ ሲፒኦ (CPO) ብቻ መፈጸም አለበት።"
          ],
          sections: [
            {
              heading: "1. አስፈላጊ የባለቤትነት ሰነዶች ማጣሪያ",
              paragraphs: [
                "ማስታወቂያ ከማውጣትዎ በፊት ዋና ዋና የባለቤትነት ሰነዶች የተሟሉ መሆናቸውን ያረጋግጡ። በአዲስ አበባ የቤት ሽያጭ ከሚሰረዝባቸው ዋነኛ ምክንያቶች አንዱ የሰነድ ጉድለት ነው።",
                "በካርታው ላይ ያለው ስም ከአሁኑ ብሔራዊ መታወቂያ፣ የቀበሌ መታወቂያ ወይም ፓስፖርት ጋር አንድ መሆኑን ያረጋግጡ። ንብረቱ በትዳር ወቅት የተገኘ ከሆነ ሁለቱም ባለትዳሮች በአካል መገኘት ወይም በውክልና ማረጋገጥ አለባቸው።"
              ],
              bullets: [
                "ዋናው የይዞታ ማረጋገጫ ምስክር ወረቀት (ካርታ / ዲጂታል ካዳስተር)",
                "የባለቤቱ/ባለቤቶቹ የታደሰ ብሔራዊ መታወቂያ፣ የቀበሌ መታወቂያ ወይም ፓስፖርት",
                "የትዳር አጋር ፈቃድ እና የጋብቻ ምስክር ወረቀት",
                "የተፈቀደ የሳይት እና የሕንፃ ፕላን",
                "በውርስ የተገኘ ከሆነ የውርስ ማረጋገጫ እና የውርስ አጣሪ ውሳኔ"
              ]
            },
            {
              heading: "2. የክፍለ ከተማ መሬት አስተዳደር ክሊራንስ",
              paragraphs: [
                "ሻጩ ከክፍለ ከተማው የመሬት አስተዳደርና ምዝገባ ጽ/ቤት ይፋዊ ክሊራንስ ማውጣት ይኖርበታል። ይህ ሰነድ ንብረቱ የግብር እና የሌሎች ቅጣቶች እዳ የሌለበት መሆኑን ያረጋግጣል።",
                "የመሬት ጽ/ቤቱ የዲጂታል ካዳስተር መረጃው ከአጥሩ ወሰን ጋር መገጠሙን እና በቤቱ ላይ ምንም ዓይነት የፍርድ ቤት እግድ አለመኖሩን ያጣራል።"
              ],
              callout: {
                type: "warning",
                title: "ያልተረጋገጡ የእጅ ውሎችን ያስወግዱ",
                message: "ከህጋዊው የሰነዶች ማረጋገጫና ምዝገባ ኤጀንሲ (DARA) ውጭ የተደረጉ የእጅ ውሎች በፍርድ ቤት ዘንድ ደካማ ተቀባይነት ያላቸው በመሆናቸው በፍጹም ውልዎን በግል አይፈጽሙ።"
              }
            },
            {
              heading: "3. በባንክ ሲፒኦ (CPO) የሚፈጸም አስተማማኝ ክፍያ",
              paragraphs: [
                "በኢትዮጵያ የቤት ሽያጭ ውስጥ ብቸኛው አስተማማኝ እና ተቀባይነት ያለው የክፍያ መንገድ በታወቀ ንግድ ባንክ የሚዘጋጅ ሲፒኦ (Certified Payment Order) ነው።",
                "በDARA ፊት ውል ከመፈረሙ በፊት ገዢው በሻጩ ስም የተዘጋጀውን ሲፒኦ ያቀርባል። ሻጩ ሲፒኦው ትክክለኛ መሆኑን በባንኩ ካረጋገጠ በኋላ ፊርማዎች ተጠናቀው የባለቤትነት ዝውውር ይካሄዳል።"
              ],
              callout: {
                type: "tip",
                title: "የግብር እና የስም ማዛወሪያ ክፍያዎችን ያስቡ",
                message: "የ4% የባለቤትነት ስም ማዛወሪያ ክፍያ እና የተጣራ የትርፍ ግብር (Capital Gains 15%) ስሌትን አስቀድመው ያቅዱ።"
              }
            }
          ],
          checklist: [
            "የካርታው ስም ከአሁኑ መታወቂያዎ ጋር መመሳከሩን ያረጋግጡ",
            "ከክፍለ ከተማው ገቢዎች ጽ/ቤት የግብር ክሊራንስ ያውጡ",
            "በመሬት አስተዳደር የፍርድ ቤት እግድ አለመኖሩን ያጣሩ",
            "ገዢው ክፍያውን በባንክ ሲፒኦ (CPO) እንዲያዘጋጅ ያሳስቡ"
          ],
          conclusion: "ህጋዊ ሰነዶችን አስቀድሞ ማዘጋጀት ሁለቱንም ወገኖች ከአላስፈላጊ ኪሳራና ጊዜ ማባከን ይጠብቃል።"
        },
        {
          id: "staging",
          category: "ዝግጅት",
          readTime: "5 ደቂቃ ንባብ",
          title: "ቤትዎን ለሽያጭና ለፎቶ እንዴት ማዘጋጀት እንዳለብዎ",
          excerpt:
            "ቤቱን ማጽዳት፣ ጥራት ያላቸውን ፎቶዎች ማንሳት እና የውሃ ታንከርና ጀነሬተርን የመሳሰሉ ጠቃሚ ነገሮች ማሳየት።",
          keyTakeaways: [
            "ጥራት ባለው የቀን ብርሃን የተነሱ ፎቶዎች ያሏቸው ቤቶች በERNS ላይ ከ3 እጥፍ በላይ የገዢዎች ጥሪ ያገኛሉ።",
            "ግቢውን፣ የሰርቪስ ቤቶችን እና የመኪና ማቆሚያውን ማጽዳት የንብረቱን ዋጋ በገዢዎች አይን ከፍ ያደርገዋል።",
            "ቀለል ያሉ የመዋቢያ ጥገናዎች (ቀለም መቀባት፣ ቧንቧ ማደስ) ከፍተኛ የትርፍ ውጤት ያስገኛሉ።",
            "የውሃ ታንከር፣ ጀነሬተር እና የግቢውን ጥበቃ ማሳየት የገዢዎችን አመኔታ ወዲያውኑ ይጨምራል።"
          ],
          sections: [
            {
              heading: "1. የግቢ ውበት እና አጠቃላይ ጽዳት",
              paragraphs: [
                "በኢትዮጵያ ቪላ ቤቶች የገዢው የመጀመሪያ ግንዛቤ የሚጀምረው ከውጭው በር ነው። ንጹህና የተስተካከለ ግቢ ቤቱ በጥንቃቄ የተያዘ መሆኑን ያሳያል።",
                "የኮብልስቶን ወለሎችን ያጽዱ፣ ሳርና አበቦችን ያስተካክሉ፣ እና የሰርቪስ ቤቶችን በማጽዳት ገዢዎች ለቢሮ፣ ለእንግዳ ማረፊያ ወይም ለኪራይ ያላቸውን ጥቅም እንዲያስተውሉ ያድርጉ።"
              ],
              callout: {
                type: "tip",
                title: "የተፈጥሮ ብርሃን እና ንጹህ አየር",
                message: "ገዢዎች ከመምጣታቸው 30 ደቂቃ በፊት መስኮቶችን እና መጋረጃዎችን በመክፈት ቤቱ በንጹህ አየር እና በተፈጥሮ ብርሃን እንዲሞላ ያድርጉ።"
              }
            },
            {
              heading: "2. ከመሸጥዎ በፊት ሊደረጉ የሚገቡ ቀላል ጥገናዎች",
              paragraphs: [
                "ከፍተኛ ዋጋ ለማግኘት ውድ ማደስ አያስፈልግዎትም። ይልቁንም የገዢዎችን ጥርጣሬ የሚያስወግዱ ቀላል ጥገናዎች ላይ ያተኩሩ።",
                "ገዢዎች የሚያንጠባጥብ ቧንቧ ወይም የተላጠ ቀለም ሲያዩ፣ ሌሎች ውስጣዊ ችግሮች አሉ ብለው በማሰብ ከሚቀርበው ዋጋ ላይ በከፍተኛ ሁኔታ ይቀንሳሉ።"
              ],
              bullets: [
                "በሳሎንና ኮሪደሮች ላይ የተላጡ ቀለሞችን በድጋሚ መቀባት",
                "የሚያንጠባጥቡ ቧንቧዎችን፣ የሻወር እና የመጸዳጃ ቤት እቃዎችን ማደስ",
                "የተቃጠሉ አምፖሎችን በብርሃን ሰጪ የኤልኢዲ (LED) አምፖሎች መተካት",
                "የውጭ መግቢያ በሮች እና ቁልፎች ያለችግር እንዲሰሩ ማድረግ"
              ]
            },
            {
              heading: "3. ለERNS ጥራት ያላቸው ፎቶዎችን ማንሳት",
              paragraphs: [
                "አብዛኛዎቹ ገዢዎች ቤትን መፈለግ የሚጀምሩት በስልካቸው ነው። ጥራት ያለው ፎቶ የሀገር ውስጥና የዲያስፖራ ገዢዎችን ለመሳብ ዋነኛው መሳሪያዎ ነው።",
                "ፎቶዎችን በማለዳ (ከጠዋቱ 3:00 - 5:30) ወይም ከሰዓት (ከቀኑ 9:00 - 11:00) በተፈጥሮ ብርሃን ያንሱ። የቤቱን ጥልቀት የሚያደበዝዙ የምሽት ፍላሽ ፎቶዎችን ያስወግዱ።"
              ],
              callout: {
                type: "tip",
                title: "ዋና ዋና አገልግሎቶችን ያሳዩ",
                message: "የውሃ ታንከሩን፣ ጀነሬተሩን፣ የመኪና ማቆሚያውን እና የጥበቃ ቤቱን የሚያሳዩ ፎቶዎችን ማካተት አይርሱ። እነዚህ በአዲስ አበባ ተፈላጊ ነገሮች ናቸው።"
              }
            }
          ],
          checklist: [
            "ሳሎኑን፣ ወጥ ቤቱን እና የግቢውን መተላለፊያ ማጽዳት",
            "የቧንቧ እና የመብራት ጥቃቅን ጉድለቶችን ማስተካከል",
            "በጠዋት የተፈጥሮ ብርሃን በወርድ (landscape) ፎቶ ማንሳት",
            "የውሃ ታንከር፣ ጀነሬተር እና የመኪና ማቆሚያ ፎቶዎችን መያዝ"
          ],
          conclusion: "በጥንቃቄ የተዘጋጀ እና ማራኪ ፎቶ ያለው ቤት በERNS ላይ በፍጥነት እና በተሻለ ዋጋ ይሸጣል።"
        }
      ],
    },
    faq: {
      title: "ተደጋግመው የሚጠየቁ ጥያቄዎች",
      subtitle: "በERNS ላይ ቤትዎን ስለመሸጥ ማወቅ የሚፈልጉት ሙሉ መረጃ።",
      items: [
        {
          q: "በERNS ላይ ቤቴን መመዝገብ በእርግጥ ነፃ ነው?",
          a: "አዎ! በባለቤቱ የሚደረግ የቤት ምዝገባ ሙሉ በሙሉ ነፃ ሲሆን ምንም ዓይነት ቅድመ ክፍያ፣ ድብቅ ወጪ ወይም የኮሚሽን ክፍያ የለውም።",
        },
        {
          q: "ቤቴን ለመዘርዘር እና ለመሸጥ ምን ዓይነት ሰነዶች ያስፈልጉኛል?",
          a: "ለመመዝገብ ፎቶዎችና መረጃዎች ብቻ በቂ ናቸው። በሽያጭ ወቅት ደግሞ ህጋዊ የባለቤትነት ማረጋገጫ (ካርታ/ሊብሬ)፣ የታደሰ መታወቂያ እና የግብር ማረጋገጫ ያስፈልጋል።",
        },
        {
          q: "በERNS ላይ ወኪሎችና ደላሎች እንዴት ይረጋገጣሉ?",
          a: "ደላሎችና ወኪሎች ህጋዊ መታወቂያ፣ የንግድ ፈቃድ እና የስልክ ማረጋገጫ አቅርበው ከተመረመሩ በኋላ ብቻ የተረጋገጠ ባጅ ይሰጣቸዋል።",
        },
        {
          q: "በሚሸጡበት ወቅት ማጭበርበርን እንዴት መከላከል ይቻላል?",
          a: "ሁልጊዜ የገዢውን ማንነት ያረጋግጡ፣ ኦሪጅናል ሰነዶችን ያለ ህጋዊ ውል አያስረክቡ፣ እንዲሁም ክፍያዎችን በህጋዊ የባንክ አካውንት (ሲቢኢ፣ ቴሌብር፣ አዋሽ) ብቻ ያከናውኑ።",
        },
        {
          q: "በውጭ ሀገር የሚኖሩ ኢትዮጵያውያን (ዲያስፖራ) በERNS መግዛት ይችላሉ?",
          a: "አዎ። ERNS በውጭ ሀገር የሚኖሩ ኢትዮጵያውያን በህጋዊ መንገድ የውጭ ምንዛሬ ወይም የባንክ ዝውውር ተጠቅመው ንብረት እንዲገዙ ያመቻቻል።",
        },
        {
          q: "መጀመሪያ ራሴ ዘርዝሬ በኋላ ወደ ወኪል መቀየር እችላለሁ?",
          a: "በእርግጥ። መጀመሪያ በነፃ ራስዎ መዘርዘር መጀመር ይችላሉ፤ በኋላም ሙያዊ ድጋፍ ከፈለጉ በማንኛውም ጊዜ ከተረጋገጡ ወኪሎች ጋር መገናኘት ይችላሉ።",
        },
      ],
    },
    cta: {
      title: "ትክክለኛውን የሽያጭ መንገድ በጥቂት ደቂቃዎች ውስጥ ይምረጡ",
      subtitle: "ጥቂት ቀላል ጥያቄዎችን በመመለስ ከተረጋገጠ ወኪል ጋር መስራት፣ ራስዎ መዘርዘር ወይም ፈጣን የባለሀብት ሽያጭ ለእርስዎ እንደሚበጅ ይወቁ።",
      btnQuiz: "የሽያጭ አማራጮችን ያወዳድሩ",
      btnListDirect: "ራሴ እዘረዝራለሁ (ነፃ)",
      btnAgentDirect: "ቀጥታ ወኪል ያግኙ",
      orBrowse: "የሚፈልጉትን አስቀድመው ያውቃሉ?",
      quiz: {
        modalTitle: "ተስማሚውን የሽያጭ መንገድ ይምረጡ",
        stepIndicator: "ደረጃ {step} ከ 4",
        btnBack: "ተመለስ",
        btnNext: "ቀጣይ",
        btnSeeResult: "የተመረጠውን መንገድ ይመልከቱ",
        btnRetake: "ፈተናውን እንደገና ይጀምሩ",
        step1Title: "ስለ ንብረትዎ ይንገሩን",
        step1Subtitle: "የንብረቱን ዓይነትና በአዲስ አበባ ያለበትን ክፍለ ከተማ ይምረጡ",
        subCityLabel: "ክፍለ ከተማ",
        areaLabel: "ሰፈር / አካባቢ (አማራጭ)",
        areaPlaceholder: "ምሳሌ፡ አትላስ፣ ሲኤምሲ፣ መገናኛ፣ ሳርቤት",
        typeLabel: "የንብረት ዓይነት",
        step2Title: "መቼ ለመሸጥ አቅደዋል?",
        step2Subtitle: "ከእርስዎ ሁኔታ ጋር የሚስማማውን የጊዜ ሰሌዳ ይምረጡ",
        timeline1Title: "አስቸኳይ (በ30 ቀናት ውስጥ)",
        timeline1Desc: "በፍጥነት እና ያለምንም መዘግየት መሸጥ እፈልጋለሁ።",
        timeline2Title: "ከ 1 እስከ 3 ወራት",
        timeline2Desc: "መደበኛ የገበያ ጊዜ። ተመጣጣኝ ፍጥነትና ተገቢውን የገበያ ዋጋ እፈልጋለሁ።",
        timeline3Title: "ገበያውን ለመቃኘት (ከ3 ወራት በላይ)",
        timeline3Desc: "የገዢዎችን ፍላጎትና ከፍተኛውን ዋጋ ለማየት ፈልጌ ነው።",
        step3Title: "ዋነኛው ቅድሚያ የሚሰጡት ጉዳይ ምንድን ነው?",
        step3Subtitle: "የእያንዳንዱ ሻጭ ግብ ይለያያል። ለእርስዎ ይበልጥ አስፈላጊ የሆነው የትኛው ነው?",
        priority1Title: "ከፍተኛ ገቢ ማግኘት (ዜሮ ኮሚሽን)",
        priority1Desc: "100% የሽያጩን ሙሉ ገንዘብ ለራስ ማስቀረት። ጥሪዎችን ራሴ ለማስተናገድ ዝግጁ ነኝ።",
        priority2Title: "ያለ ምንም ድካም ሙሉ አገልግሎት (Zero Hassle)",
        priority2Desc: "የዋጋ ግምት፣ ፎቶዎችን፣ ገዢዎችን ማጣራት እና የካርታ ዝውውር ባለሙያ እንዲያከናውንልኝ።",
        priority3Title: "ፈጣን እና አስተማማኝ ሽያጭ",
        priority3Desc: "ያለ ዕድሳት እና ያለ ሰፊ ጉብኝት ፈጣን የጥሬ ገንዘብ ክፍያ ማግኘት።",
        resultTag: "ለእርስዎ የተመረጠ",
        agentMatchTitle: "ከተረጋገጠ ህጋዊ ወኪል ጋር ይሽጡ",
        agentMatchDesc: "ያለ ምንም ድካም በ{location} ከፍተኛ ዋጋ እና አስተማማኝ የህግ ድጋፍ ለማግኘት ከተረጋገጠ ወኪል ጋር መስራት ተመራጭ ነው።",
        agentMatchBtn: "በ{location} ያሉ ወኪሎችን ይመልከቱ",
        fsboMatchTitle: "በራስዎ በነፃ ይመዝግቡ (FSBO)",
        fsboMatchDesc: "የሽያጩን ሙሉ ገንዘብ ለራስዎ ለማስቀረት እና ተለዋዋጭ ጊዜ ስላሎት፣ በERNS ላይ በቀጥታ በመመዝገብ በመቶ ሺዎች የሚቆጠር የደላላ ኮሚሽን ይቆጥባሉ።",
        fsboMatchBtn: "ነፃ ምዝገባ ይጀምሩ",
        expressMatchTitle: "ፈጣን የባለሀብት ሽያጭ (Investor Cash Sale)",
        expressMatchDesc: "አስቸኳይ የሽያጭ ፍላጎት ስላሎት፣ የእኛ የተረጋገጡ የጥሬ ገንዘብ ገዢዎች እና የዲያስፖራ ባለሀብቶች መረብ ያለ ድካም በፍጥነት እንዲሸጡ ያግዛል።",
        expressMatchBtn: "ፈጣን ግምገማ ይጠይቁ",
        otherOptions: "ወይም ሌሎች አማራጮችን ይሞክሩ፡",
      },
    },
    fsbo: {
      hero: {
        badge: "100% ነፃ ምዝገባ • ዜሮ ኮሚሽን",
        title: "የራስዎን ቤት በነፃ በቀጥታ ይሽጡ",
        subtitle:
          "በአዲስ አበባ እና በውጭ ሀገር ከሚገኙ በሺዎች ከሚቆጠሩ እውነተኛ ገዢዎች ጋር በቀጥታ ይገናኙ። ያለ ደላላ፣ ያለ ድብቅ ክፍያ እና ያለ ምንም ኮሚሽን በሙሉ ቁጥጥር ይሽጡ።",
        cityPlaceholder: "አዲስ አበባ",
        subCityPlaceholder: "ክፍለ ከተማ ይምረጡ (ለምሳሌ፡ ቦሌ፣ የካ፣ ቂርቆስ)",
        addressPlaceholder: "መንገድ ወይም ታዋቂ ቦታ (ለምሳሌ፡ ቦሌ መድኃኔዓለም)",
        btnStart: "በነፃ መመዝገብ ይጀምሩ",
        stats: [
          { value: "0%", label: "የኮሚሽን ክፍያ" },
          { value: "100%", label: "ቀጥተኛ ጥሪዎች" },
          { value: "5 ደቂቃ", label: "ፈጣን ምዝገባ" },
        ],
      },
      howItWorks: {
        title: "የራስን ቤት በራስ የመሸጥ ሂደት እንዴት ይሰራል?",
        subtitle:
          "በኢትዮጵያ ውስጥ ያለ ደላላ ቤትዎን በተሳካ ሁኔታ እና በህጋዊ መንገድ ለመሸጥ የሚረዳ ግልጽ መመሪያ።",
        steps: [
          {
            step: "01",
            title: "ትክክለኛ የገበያ ዋጋ ይወስኑ",
            desc: "በአካባቢዎ (ቦሌ፣ ሲኤምሲ፣ ካዛንቺስ፣ ሰሚት) በቅርቡ የተሸጡ ቤቶችን ዋጋ በማነጻጸር ተወዳዳሪ ዋጋ ያስቀምጡ። ትክክለኛ ዋጋ እውነተኛ ገዢዎችን ወዲያውኑ ይስባል።",
          },
          {
            step: "02",
            title: "ጥራት ያላቸው ፎቶዎችን ያንሱ",
            desc: "ሳሎን፣ መኝታ ቤት፣ ዘመናዊ ኩሽና እንዲሁም እንደ ውሃ ታንከር፣ ጀነሬተር እና የመኪና ማቆሚያ ያሉ ጠቃሚ ነገሮችን የሚያሳዩ ንጹህ ፎቶዎችን ያዘጋጁ።",
          },
          {
            step: "03",
            title: "በERNS ላይ በነፃ ይለጥፉ",
            desc: "የቤቱን ዝርዝር፣ የይዞታ ማረጋገጫ (ካርታ/ሊብሬ) ሁኔታ እና ስልክዎን ያስገቡ። ማስታወቂያዎ ወዲያውኑ ለሀገር ውስጥና ለዲያስፖራ ገዢዎች ይታያል።",
          },
          {
            step: "04",
            title: "ቀጥተኛ ጥሪዎችን ያስተናግዱ እና በህግ ያጠናቁ",
            desc: "ከገዢዎች የሚመጡ ጥሪዎችን ይመልሱ፣ ቤቱን ያስጎብኙ፣ በዋጋው ላይ ይደራደሩ እንዲሁም ውልና ማስረጃ (DARA) ላይ የባለቤትነት ዝውውሩን ያጠናቁ።",
          },
        ],
      },
      prosCons: {
        title: "ቤትዎን በራስዎ መሸጥ ለእርስዎ ተስማሚ ነው?",
        subtitle:
          "ቤትዎን በራስዎ የመሸጥን ጥቅሞች ከተረጋገጠ የሪል እስቴት ወኪል ጋር ከመስራት ጋር ያነጻጽሩ።",
        prosTitle: "በራስዎ የመሸጥ (FSBO) ጥቅሞች",
        pros: [
          {
            title: "ዜሮ የደላላ ኮሚሽን",
            desc: "የሽያጭ ገቢዎን 100% ለእርስዎ ያስቀሩ። በአማካይ የቤት ሽያጭ ላይ በመቶ ሺዎች የሚቆጠር ብር ይቆጥባሉ።",
          },
          {
            title: "ሙሉ የውሳኔ ቁጥጥር",
            desc: "የመሸጫ ዋጋዎን፣ የፎቶዎች ምርጫን፣ ቤቱ የሚጎበኝበትን ሰዓት እርስዎ ራስዎ ይወስናሉ፤ ከገዢዎች ጋርም በቀጥታ ይደራደራሉ።",
          },
          {
            title: "ቀጥተኛ ግንኙነት ከገዢዎች ጋር",
            desc: "ያለ ደላላ ጣልቃ ገብነት፣ ያለ የተጋነነ ትርፍ እና ያለ መረጃ መዛባት ከትክክለኛ ገዢዎች ጋር ይነጋገራሉ።",
          },
        ],
        consTitle: "ሊታሰቡባቸው የሚገቡ ጉዳዮች",
        cons: [
          {
            title: "የጊዜና የጉልበት መስዋዕትነት",
            desc: "የሚደውሉ በርካታ ገዢዎችን ጥሪ መመለስ፣ ጥያቄዎችን ማስተናገድ እና ሰዎችን በግል ማስጎብኘት የእርስዎን ጊዜ ይጠይቃል።",
          },
          {
            title: "የዋጋ ግምት እና ድርድር ችሎታ",
            desc: "ትክክለኛ የገበያ ጥናት ከሌለ ዋጋ ማሳነስ ወይም ከገበያ በላይ በማስቀመጥ ሽያጩ ረጅም ጊዜ ሊወስድ ይችላል።",
          },
          {
            title: "ህጋዊ ሰነዶች እና ቢሮክራሲ",
            desc: "የይዞታ ማረጋገጫ (ካርታ/ሊብሬ)፣ የታክስ ክሊራንስ ማዘጋጀት እና የመሬት አስተዳደር ሂደቶችን ራስዎ መከታተል ይኖርብዎታል።",
          },
        ],
        agentBannerText:
          "የዋጋ ግምትን፣ ማስተዋወቅንና ህጋዊ የሰነድ ሂደቶችን የተረጋገጠ የሪል እስቴት ባለሙያ እንዲያከናውንልዎ ይመርጣሉ?",
        agentBannerBtn: "የተረጋገጠ ወኪል ያግኙ",
      },
      whyErns: {
        title: "ለምን በERNS ላይ ይለጥፋሉ?",
        subtitle:
          "ለኢትዮጵያ ገበያ ተብሎ የተገነባ አስተማማኝ እና ዘመናዊ የዲጂታል ሪል እስቴት መድረክ።",
        cards: [
          {
            title: "100% ነፃ ከሙሉ ጥራት ፎቶዎች ጋር",
            desc: "የቤቱን ውጫዊና ውስጣዊ ክፍሎች የሚያሳዩ በርካታ ጥራት ያላቸው ፎቶዎችን ያለ ምንም ክፍያ ይለጥፉ።",
          },
          {
            title: "ለሀገር ውስጥና ለዲያስፖራ ገዢዎች ተደራሽነት",
            desc: "በአዲስ አበባ፣ በክልል ከተሞች እንዲሁም በውጭ ሀገር ሆነው ሀገር ቤት ንብረት ለመግዛት የሚፈልጉ ኢትዮጵያውያን ጋር ይድረሱ።",
          },
          {
            title: "ቀጥተኛና የተረጋገጡ ጥሪዎች",
            desc: "ገዢዎች በቀጥታ ወደ ስልክዎ ይደውላሉ ወይም መልዕክት ይልካሉ። ያልተፈቀደ የደላላ ጣልቃ ገብነት የለም።",
          },
        ],
      },
      builder: {
        title: "የራስዎን ቤት በነፃ ይመዝግቡ",
        subtitle:
          "የንብረትዎን መረጃዎች ከታች ሞልተው ቅድመ-ዕይታውን ይመልከቱ እና በደቂቃዎች ውስጥ ማስታወቂያዎን ያውጡ።",
        step1: "1. አድራሻ እና ዓይነት",
        step2: "2. ዝርዝር መረጃ እና ዋጋ",
        step3: "3. መገልገያዎች እና ካርታ",
        step4: "4. ፎቶዎች እና አድራሻ",
        cityLabel: "ከተማ / ክልል",
        subCityLabel: "ክፍለ ከተማ",
        woredaLabel: "ወረዳ / ቀበሌ",
        specificAreaLabel: "መንገድ / ልዩ ቦታ",
        propertyTypeLabel: "የንብረት ዓይነት",
        propertyTypes: {
          apartment: "አፓርታማ (Apartment)",
          condo: "ኮንዶሚኒየም (Condo)",
          villa: "ቪላ (Villa)",
          townhouse: "ታውን ሃውስ (Townhouse)",
          penthouse: "ፔንት ሃውስ (Penthouse)",
          commercial: "ለንግድ የሚሆን ህንፃ/ቦታ",
        },
        subCities: [
          "ቦሌ (Bole)",
          "የካ (Yeka)",
          "ቂርቆስ (Kirkos)",
          "አራዳ (Arada)",
          "ጉለሌ (Gulele)",
          "ልደታ (Lideta)",
          "ኮልፌ ቀራኒዮ (Kolfe)",
          "ንፋስ ስልክ ላፍቶ (Nifas Silk)",
          "አቃቂ ቃሊቲ (Akaky Kaliti)",
          "ለሚ ኩራ (Lemi Kura)",
        ],
        bedroomsLabel: "የመኝታ ክፍሎች",
        bathroomsLabel: "የመታጠቢያ ክፍሎች",
        areaLabel: "ጠቅላላ ስፋት (በካሬ ሜትር)",
        priceLabel: "የመሸጫ ዋጋ (በብር)",
        priceNegotiableLabel: "ዋጋው በድርድር ነው",
        titleDeedLabel: "የይዞታ ማረጋገጫ (ካርታ/ሊብሬ) ሁኔታ",
        titleDeedOptions: {
          digital: "ዲጂታል ካርታ (Digital Libre)",
          paper: "ባህላዊ የይዞታ ካርታ (Paper Libre)",
          lease: "የሊዝ ይዞታ (Leasehold)",
          processing: "በዝውውር ሂደት ላይ ያለ",
        },
        amenitiesLabel: "ዋና ዋና መገልገያዎች",
        amenitiesList: [
          "የውሃ ታንከር (Water Tank)",
          "ተጠባባቂ ጀነሬተር (Generator)",
          "የመኪና ማቆሚያ (Parking)",
          "በረንዳ (Balcony)",
          "ዘመናዊ ኩሽና (Modern Kitchen)",
          "የ24 ሰዓት ጥበቃ (Security)",
          "ሊፍት (Elevator)",
          "የሰራተኛ ክፍል (Servant Quarters)",
        ],
        photosLabel: "የቤት ፎቶዎች",
        photosHint:
          "ጥራት ያላቸው ንጹህ ፎቶዎችን ይምረጡ። ሳሎን፣ ኩሽና፣ መኝታ ቤት እና ግቢውን ማካተት ይመረጣል።",
        dropzoneText: "ፎቶዎችን እዚህ ይጎትቱ ወይም ፋይል ለመምረጥ ይጫኑ",
        descLabel: "የቤቱ ሙሉ መግለጫ",
        descPlaceholder:
          "ስለ ቤቱ ልዩ ገጽታዎች፣ የመንገድ መዳረሻ፣ ትምህርት ቤቶች፣ የገበያ ማዕከላት እና አጠቃላይ ሁኔታ በዝርዝር ይግለጹ...",
        ownerNameLabel: "የባለቤቱ ሙሉ ስም",
        phoneLabel: "የስልክ ቁጥር (+251)",
        preferredTimeLabel: "ገዢዎች እንዲደውሉ የሚመርጡት ሰዓት",
        callTimeAnytime: "በማንኛውም ሰዓት (2:00 ጠዋት - 2:00 ማታ)",
        callTimeMorning: "ጠዋት ብቻ",
        callTimeEvening: "ከሰዓት በኋላ ብቻ",
        previewTitle: "የማስታወቂያ ቅድመ-ዕይታ",
        btnNext: "ቀጣይ ደረጃ",
        btnPrev: "ተመለስ",
        btnPublish: "ማስታወቂያውን በነፃ አውጣ",
        successTitle: "ቤትዎ በተሳካ ሁኔታ ተመዝግቧል!",
        successDesc:
          "የቤትዎ ማስታወቂያ ተፈጥሯል። ፈጣን የማረጋገጫ ሂደት ካለፈ በኋላ በERNS ላይ በቀጥታ ይታያል።",
        successRef: "የማስታወቂያ መለያ ቁጥር፡ #FSBO-",
        btnViewListing: "በገበያው ላይ ይመልከቱ",
        btnCreateAnother: "ሌላ ቤት ይመዝግቡ",
      },
      legalChecklist: {
        title: "በኢትዮጵያ የቤት ባለቤትነት ዝውውር መመሪያ እና ቅደም ተከተል",
        subtitle:
          "በአዲስ አበባ ህጋዊ እና ከአደጋ የጸዳ የቤት ሽያጭ ለማከናወን እነዚህን ወሳኝ ቅደም ተከተሎች ይከተሉ።",
        items: [
          {
            title: "ኦሪጅናል የይዞታ ማረጋገጫ (ካርታ/ሊብሬ)",
            desc: "ኦሪጅናል ካርታው በስምዎ መሆኑን እና በክፍለ ከተማው የመሬት አስተዳደር ምንም ዓይነት ዕገዳ ወይም እዳ እንደሌለበት ያረጋግጡ።",
          },
          {
            title: "የክፍለ ከተማ ግብር እና ታክስ ክሊራንስ",
            desc: "እስከ አሁን ያለውን የንብረት ግብር እና የመሬት ኪራይ ክፍያ ማጠናቀቅዎን የሚያረጋግጥ ክሊራንስ ከገቢዎች ቢሮ ያዘጋጁ።",
          },
          {
            title: "ህጋዊ መታወቂያ እና የጋብቻ ሁኔታ ማስረጃ",
            desc: "ሻጭ እና ገዢ የታደሰ ህጋዊ መታወቂያ ሊኖራቸው ይገባል። ንብረቱ የጋራ ከሆነ የትዳር አጋር ፈቃድና ፊርማ በህግ ግዴታ ነው።",
          },
          {
            title: "ውልና ማስረጃ (DARA) ላይ ውል ማጽደቅ",
            desc: "የሽያጭ ውሉን በሰነዶች ማረጋገጫና ምዝገባ ኤጀንሲ (ውልና ማስረጃ) በህጋዊ መንገድ ፊት ለፊት ተገኝቶ ማጽደቅ።",
          },
          {
            title: "ክፍያን በህጋዊ ሲፒኦ (CPO) ወይም የባንክ ሂሳብ መቀበል",
            desc: "በጥሬ ገንዘብ ክፍያ በፍጹም አይቀበሉ። ገንዘቡ በታመነ ባንክ ሲፒኦ (CPO) መዘጋጀቱን ሳያረጋግጡ ካርታ አያስረክቡ።",
          },
        ],
      },
      faq: {
        title: "ተደጋግመው የሚጠየቁ ጥያቄዎች",
        subtitle: "ቤትዎን በራስዎ በERNS ላይ ስለመሸጥ ማወቅ የሚፈልጉት ጠቃሚ መረጃዎች።",
        items: [
          {
            q: "በERNS ላይ ቤቴን በነፃ መመዝገብ እችላለሁ?",
            a: "አዎ፣ 100% ነፃ ነው። የራስዎን ቤት እንደ ባለቤት ሲመዘግቡ ምንም ዓይነት የምዝገባ ክፍያ፣ የዝርዝር ክፍያ ወይም የኮሚሽን ቅናሽ የለም።",
          },
          {
            q: "ገዢዎች እንዴት ያገኙኛል?",
            a: "ገዢዎች የተረጋገጠውን የስልክ ቁጥርዎን በማስታወቂያው ላይ ያዩታል፤ በቀጥታ በመደወል ወይም መልዕክት በመላክ ያገኟችኋል።",
          },
          {
            q: "ሰዎችን ከማስጎብኘቴ በፊት ምን ዓይነት ሰነዶችን ማዘጋጀት አለብኝ?",
            a: "የካርታውን ኮፒ እና የታክስ ደረሰኞችን አዘጋጅተው ያስቀምጡ። ነገር ግን ኦሪጅናል ሰነዶችን ውልና ማስረጃ ፊት ካልሆነ በቀር በፍጹም ለገዢው አይስጡ።",
          },
          {
            q: "ከማጭበርበር ራሴን እንዴት እጠብቃለሁ?",
            a: "የባለቤትነት ዝውውር ከመፈረምዎ በፊት ክፍያው በታወቀ ባንክ (ሲቢኢ፣ አዋሽ፣ ዳሽን) በተዘጋጀ ሲፒኦ (CPO) መፈጸሙን ያረጋግጡ።",
          },
          {
            q: "ስራ ቢበዛብኝና በሽያጩ መሀል ወደ ወኪል መቀየር ብፈልግስ?",
            a: "በማንኛውም ሰዓት መቀየር ይችላሉ። ከዳሽቦርድዎ የተረጋገጠ የERNS ወኪል መጠየቅ ይችላሉ፤ እርሳቸውም የዋጋ ግምቱን፣ ማስተዋወቁን እና ህጋዊ ሂደቱን ተረክበው ያጠናቅቃሉ።",
          },
        ],
      },
      cta: {
        title: "ቤትዎን በራስዎ ውሳኔ ለመሸጥ ዝግጁ ነዎት?",
        desc: "በደቂቃዎች ውስጥ ያለ ምንም ኮሚሽን ቤትዎን በERNS ላይ ይለጥፉ፣ ወይም ስራውን ለተረጋገጠ ወኪል ይስጡ።",
        btnStart: "በነፃ ማስታወቂያ አውጡ",
        btnAgent: "የተረጋገጠ ወኪል ያግኙ",
      },
    },
  },
};
