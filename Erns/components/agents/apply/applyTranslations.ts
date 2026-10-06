export const applyTranslations = {
  en: {
    hero: {
      badge: "ERNS Agent Partner Program",
      title: "Become an ERNS Verified Real Estate Agent",
      subtitle:
        "Grow your transaction volume in Addis Ababa. Connect with pre-vetted property sellers, diaspora investors, and verified buyers looking for trusted local representation.",
      perks: [
        "Zero Upfront Setup Fees",
        "Direct Seller Inquiries",
        "DARA & Legal Closing Support",
        "Official Verified Trust Badge",
      ],
      btnApply: "Start Application",
      btnLearnMore: "View Criteria",
    },
    benefits: {
      title: "Why Top Agents Choose ERNS",
      subtitle:
        "ERNS connects serious property buyers and sellers with Ethiopia's most reputable real estate professionals.",
      cards: [
        {
          title: "Pre-Vetted Seller Leads",
          desc: "Receive qualified listing inquiries from homeowners selling luxury villas, apartments, and commercial plots across Addis Ababa.",
        },
        {
          title: "Diaspora Investor Network",
          desc: "Gain exclusive access to Ethiopian diaspora buyers in North America, Europe, and the Middle East who require trusted local guidance.",
        },
        {
          title: "Verified Trust Badge",
          desc: "Stand out from informal brokers. Your verified profile highlights your license, transaction track record, and verified client reviews.",
        },
        {
          title: "DARA & Banking Escrow Support",
          desc: "Streamline contract execution with our standardized sales agreements, title due-diligence checklists, and bank CPO escrow guidance.",
        },
      ],
    },
    requirements: {
      title: "Application Requirements",
      subtitle: "We maintain strict standards to ensure only ethical and qualified agents represent properties on ERNS.",
      cards: [
        {
          number: "01",
          title: "Valid Business License or Broker Registration",
          desc: "Applicant or associated brokerage must possess a valid Trade License (የንግድ ፈቃድ) or TIN registration issued by Ethiopian authorities.",
        },
        {
          number: "02",
          title: "Demonstrated Addis Ababa Market Experience",
          desc: "Minimum 1 year of active real estate representation with verifiable transactions in prime Addis Ababa sub-cities.",
        },
        {
          number: "03",
          title: "Commitment to Ethical Representation",
          desc: "Agreement to adhere to ERNS anti-scam guidelines, transparent buyer/seller fee disclosures, and authenticated DARA title transfers.",
        },
      ],
    },
    wizard: {
      stepLabel: "Step {current} of {total}",
      steps: [
        { id: 1, title: "Personal Info" },
        { id: 2, title: "Areas & Specialties" },
        { id: 3, title: "Licensing & Bio" },
        { id: 4, title: "Review & Submit" },
      ],
      step1: {
        title: "Personal & Professional Information",
        desc: "Tell us about yourself and your real estate brokerage.",
        fullName: "Full Name (as on Ethiopian ID/Passport)",
        fullNamePlaceholder: "e.g., Dawit Haile",
        fullNameAm: "Full Name in Amharic (Optional)",
        fullNameAmPlaceholder: "ምሳሌ፡ ዳዊት ኃይሌ",
        phone: "Mobile Phone Number (Ethiopian format)",
        phonePlaceholder: "911 234 567",
        email: "Professional Email Address",
        emailPlaceholder: "dawit@prime-realty.et",
        agency: "Agency or Brokerage Name",
        agencyPlaceholder: "e.g., Addis Prime Realty (or 'Independent')",
        experience: "Years of Experience in Real Estate",
        experienceOptions: [
          "1 - 2 years",
          "3 - 5 years",
          "6 - 10 years",
          "10+ years",
        ],
      },
      step2: {
        title: "Service Areas & Specialties",
        desc: "Select the locations and transaction types you specialize in.",
        subCitiesLabel: "Primary Sub-Cities Served in Addis Ababa (Select up to 4)",
        specialtiesLabel: "Your Practice Specialties (Select all that apply)",
        specialtiesOptions: [
          { value: "listing-agent", label: "Listing Agent (Seller Representation)" },
          { value: "buyers-agent", label: "Buyer's Agent (Homebuyer Representation)" },
          { value: "relocation", label: "Relocation & Diaspora Investment" },
          { value: "commercial", label: "Commercial Buildings & Land" },
        ],
        languagesLabel: "Languages You Speak Fluently",
        languagesOptions: ["Amharic", "English", "Afaan Oromoo", "Tigrinya", "French", "Arabic"],
      },
      step3: {
        title: "Licensing & Profile Presentation",
        desc: "Provide your credential details and a concise bio for clients.",
        tinNumber: "TIN / Business License Number",
        tinPlaceholder: "e.g., 0012345678",
        uploadLabel: "Upload Trade License or National ID / Passport",
        uploadHint: "Drag and drop PDF, JPG, or PNG (Max 10MB) or click to browse",
        uploadSelected: "Document Attached:",
        bioLabel: "Professional Bio (1-3 paragraphs)",
        bioPlaceholder:
          "Briefly explain your experience, types of homes sold, and why clients should choose you to represent their property in Addis Ababa...",
        websiteLabel: "Website or LinkedIn / Telegram Profile (Optional)",
        websitePlaceholder: "https://t.me/yourusername or website URL",
      },
      step4: {
        title: "Review Your Application & Live Profile Preview",
        desc: "Check your information and review how your card will appear in the directory once verified.",
        previewHeader: "Live Directory Card Preview",
        termsAgreement:
          "I certify that the information provided is accurate and agree to adhere to the ERNS Code of Professional Ethics, transparent fee disclosure, and title verification standards.",
        btnBack: "Previous Step",
        btnNext: "Next Step",
        btnSubmit: "Submit Verification Application",
        submitting: "Submitting Application...",
      },
      success: {
        title: "Application Submitted Successfully!",
        refNumber: "Application Reference:",
        desc: "Thank you for applying to become an ERNS Verified Agent. Our partner verification team will review your submitted credentials and contact you via phone/email within 24 to 48 business hours.",
        whatNext: "What happens next?",
        nextSteps: [
          "Document verification with the Ministry of Trade / Sub-City authorities.",
          "Brief phone or video consultation to verify your identity.",
          "Profile activation and issuance of your official ERNS Verified Badge.",
        ],
        btnBrowseDirectory: "View Agent Directory",
        btnReturnHub: "Return to Seller Hub",
      },
    },
    testimonial: {
      quote:
        "Becoming a verified agent on ERNS transformed my business. Motivated sellers trust me because of the verified badge, and I have successfully closed 34 transactions in Bole and Kazanchis in just 12 months.",
      author: "Dawit Haile",
      agency: "Addis Prime Realty • Bole, Addis Ababa",
      salesMetric: "34 Completed Sales",
      rating: "5.0 Rating (62 Reviews)",
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about joining the ERNS Verified Agent Network.",
      items: [
        {
          q: "How long does the verification review take?",
          a: "Most applications are reviewed and processed within 24 to 48 business hours. Our team verifies your Trade License / TIN credentials and conducts a brief confirmation call.",
        },
        {
          q: "Is there an upfront fee to apply or join as an agent?",
          a: "No. Creating your basic profile and submitting your application is 100% free. Verified agents receive direct seller inquiries without upfront listing fees.",
        },
        {
          q: "Can independent real estate brokers apply without an agency?",
          a: "Yes. Independent brokers holding a valid Ethiopian TIN and verifiable transaction experience in Addis Ababa are warmly welcomed.",
        },
        {
          q: "How do motivated clients contact verified agents?",
          a: "Clients contact you directly through your verified card via direct phone calls, SMS, and secure inquiry forms delivered straight to your email.",
        },
        {
          q: "What are the requirements for maintaining verified status?",
          a: "Agents must maintain an average client rating above 4.5 stars, adhere to ethical pricing without hidden fees, and ensure all represented properties undergo basic title vetting.",
        },
      ],
    },
    cta: {
      title: "Ready to Expand Your Real Estate Reach?",
      subtitle: "Join the most trusted property network in Addis Ababa and start receiving verified inquiries today.",
      btnApply: "Start Application Now",
      btnContactSupport: "Contact Partner Support",
    },
  },
  am: {
    hero: {
      badge: "የ ERNS ወኪሎች አጋርነት ፕሮግራም",
      title: "የተረጋገጡ የ ERNS የሪል እስቴት ወኪል ይሁኑ",
      subtitle:
        "በአዲስ አበባ ውስጥ የቤት ሽያጭ ስራዎትን ያሳድጉ። አስተማማኝ ውክልና ከሚፈልጉ እውነተኛ የቤት ባለቤቶች፣ የዲያስፖራ ባለሀብቶች እና ገዢዎች ጋር በቀጥታ ይገናኙ።",
      perks: [
        "ምንም ቅድመ ክፍያ የለም",
        "ቀጥተኛ የሻጮች ጥያቄዎች",
        "የውልና ማስረጃ (DARA) የህግ ድጋፍ",
        "ይፋዊ የተረጋገጠ ባጅ (Badge)",
      ],
      btnApply: "ማመልከቻ ጀምር",
      btnLearnMore: "መስፈርቶችን ይመልከቱ",
    },
    benefits: {
      title: "ቀዳሚ ወኪሎች ERNSን ለምን ይመርጣሉ?",
      subtitle:
        "ERNS ትክክለኛ የቤት ሻጮችንና ገዢዎችን በኢትዮጵያ ውስጥ ካሉ ታማኝ የሪል እስቴት ባለሙያዎች ጋር ያገናኛል።",
      cards: [
        {
          title: "ትክክለኛ የሻጮች ጥያቄዎች",
          desc: "በአዲስ አበባ ውስጥ ቪላዎችን፣ አፓርታማዎችንና የንግድ ህንጻዎችን ከሚሸጡ ባለቤቶች ቀጥተኛ የሽያጭ ጥያቄዎችን ያግኙ።",
        },
        {
          title: "የዲያስፖራ ባለሀብቶች ተደራሽነት",
          desc: "በሰሜን አሜሪካ፣ አውሮፓ እና መካከለኛው ምስራቅ የሚኖሩ አስተማማኝ ወኪል የሚፈልጉ የዲያስፖራ ገዢዎችን በቀጥታ ያግኙ።",
        },
        {
          title: "ይፋዊ የተረጋገጠ ባጅ (Badge)",
          desc: "ካልተመዘገቡ ደላሎች ይለዩ። የተረጋገጠ ፕሮፋይልዎ የንግድ ፈቃድዎን፣ የተሳኩ ሽያጮችን እና የተገልጋዮች ምስክርነት ያሳያል።",
        },
        {
          title: "የውልና ማስረጃ እና የባንክ ድጋፍ",
          desc: "በተዘጋጁ ህጋዊ የሽያጭ ውሎች፣ የካርታ ማጣሪያ ሰነዶች እና በባንክ ሲፒኦ (CPO) ክፍያ ድጋፍ ስራዎትን ያቀላጥፉ።",
        },
      ],
    },
    requirements: {
      title: "የማመልከቻ መስፈርቶች",
      subtitle: "በ ERNS ላይ አስተማማኝና ስነ-ምግባር ያላቸው ባለሙያዎች ብቻ እንዲሰሩ ጥብቅ መስፈርቶችን እንከተላለን።",
      cards: [
        {
          number: "01",
          title: "ህጋዊ የንግድ ፈቃድ ወይም የግብር ከፋይ ቁጥር (TIN)",
          desc: "አመልካቹ ወይም ድርጅቱ በኢትዮጵያ ንግድ ቢሮ የተሰጠ ህጋዊ የንግድ ፈቃድ ወይም የግብር ከፋይ መለያ (TIN) ሊኖረው ይገባል።",
        },
        {
          number: "02",
          title: "የተረጋገጠ የስራ ልምድ በአዲስ አበባ",
          desc: "በአዲስ አበባ ክፍለ ከተሞች ውስጥ ቢያንስ የ1 ዓመት ንቁ የቤት ሽያጭ ልምድ እና የተከናወኑ ሽያጮች ማረጋገጫ።",
        },
        {
          number: "03",
          title: "ሙያዊ ስነ-ምግባር እና ግልጽነት",
          desc: "ህጋዊ የካርታ ዝውውር መመሪያዎችን፣ ግልጽ የአገልግሎት ክፍያ አሰራርን እና የደንበኞችን ደህንነት ለመጠበቅ መስማማት።",
        },
      ],
    },
    wizard: {
      stepLabel: "ደረጃ {current} ከ {total}",
      steps: [
        { id: 1, title: "የግል መረጃ" },
        { id: 2, title: "ቦታዎች እና ዘርፍ" },
        { id: 3, title: "ፈቃድ እና መግለጫ" },
        { id: 4, title: "ማጠቃለያ" },
      ],
      step1: {
        title: "የግል እና የሙያ መረጃ",
        desc: "ስለራስዎ እና ስለሚሰሩበት የሪል እስቴት ድርጅት ይንገሩን።",
        fullName: "ሙሉ ስም (በመታወቂያ/ፓስፖርት መሰረት)",
        fullNamePlaceholder: "ምሳሌ፡ ዳዊት ኃይሌ",
        fullNameAm: "ሙሉ ስም በእንግሊዝኛ (አማራጭ)",
        fullNameAmPlaceholder: "e.g., Dawit Haile",
        phone: "የሞባይል ስልክ ቁጥር",
        phonePlaceholder: "911 234 567",
        email: "የኢሜይል አድራሻ",
        emailPlaceholder: "dawit@prime-realty.et",
        agency: "የድርጅት ስም",
        agencyPlaceholder: "ምሳሌ፡ አዲስ ፕራይም ሪልቲ (ወይም 'ግለሰብ')",
        experience: "በሪል እስቴት ውስጥ የስራ ልምድ (በዓመታት)",
        experienceOptions: [
          "1 - 2 ዓመታት",
          "3 - 5 ዓመታት",
          "6 - 10 ዓመታት",
          "ከ10 ዓመታት በላይ",
        ],
      },
      step2: {
        title: "የስራ ቦታዎች እና የሙያ ዘርፎች",
        desc: "የሚሰሩባቸውን ክፍለ ከተሞች እና የሽያጭ አይነቶችን ይምረጡ።",
        subCitiesLabel: "የሚሰሩባቸው ዋና ክፍለ ከተሞች (እስከ 4 ይምረጡ)",
        specialtiesLabel: "የስራ መስኮችዎ (የሚመለከተውን ሁሉ ይምረጡ)",
        specialtiesOptions: [
          { value: "listing-agent", label: "የቤት ሻጭ ወኪል (Listing Agent)" },
          { value: "buyers-agent", label: "የቤት ገዢ ወኪል (Buyer's Agent)" },
          { value: "relocation", label: "የዲያስፖራ እና መልሶ ማቋቋም ወኪል" },
          { value: "commercial", label: "የንግድ ህንፃዎች እና ቦታዎች" },
        ],
        languagesLabel: "የሚናገሯቸው ቋንቋዎች",
        languagesOptions: ["አማርኛ", "እንግሊዝኛ", "አፋን ኦሮሞ", "ትግርኛ", "ፈረንሳይኛ", "አረብኛ"],
      },
      step3: {
        title: "የፈቃድ ሰነድ እና የሙያ መግለጫ",
        desc: "የፈቃድ ቁጥርዎን እና ለደንበኞች የሚታይ አጭር መግለጫ ያቅርቡ።",
        tinNumber: "የንግድ ፈቃድ ወይም የግብር ከፋይ (TIN) ቁጥር",
        tinPlaceholder: "ምሳሌ፡ 0012345678",
        uploadLabel: "የንግድ ፈቃድ ወይም የታደሰ መታወቂያ / ፓስፖርት ያያይዙ",
        uploadHint: "PDF፣ JPG ወይም PNG ፋይል ይጎትቱ ወይም ፋይሉን ይምረጡ (እስከ 10 ሜጋባይት)",
        uploadSelected: "የተያያዘ ሰነድ፡",
        bioLabel: "የሙያ ታሪክ እና መግለጫ (ከ1-3 አንቀጽ)",
        bioPlaceholder:
          "ስለ ስራ ልምድዎ፣ ስለሸጧቸው ቤቶች እና ደንበኞች እርስዎን ለምን መምረጥ እንዳለባቸው በአጭሩ ያብራሩ...",
        websiteLabel: "የድረ-ገጽ ወይም የቴሌግራም/ሊንክድኢን አድራሻ (አማራጭ)",
        websitePlaceholder: "https://t.me/yourusername ወይም የድረ-ገጽ አድራሻ",
      },
      step4: {
        title: "ማመልከቻውን ያረጋግጡ እና የቀጥታ ፕሮፋይል እይታ",
        desc: "ያስገቧቸውን መረጃዎች ያረጋግጡ፤ ከተፈቀደ በኋላ በዝርዝሩ ላይ እንዴት እንደሚታይ ይመልከቱ።",
        previewHeader: "በማውጫው ላይ የሚታየው ፕሮፋይል",
        termsAgreement:
          "ያስገባኋቸው መረጃዎች ትክክለኛ መሆናቸውን አረጋግጣለሁ፤ እንዲሁም የ ERNSን የስነ-ምግባር ደንብ፣ ግልጽ የአገልግሎት ክፍያ እና ህጋዊ የካርታ አሰራርን ለመከተል እስማማለሁ።",
        btnBack: "ተመለስ",
        btnNext: "ቀጣይ ደረጃ",
        btnSubmit: "የማረጋገጫ ማመልከቻውን አስገባ",
        submitting: "በማስገባት ላይ...",
      },
      success: {
        title: "ማመልከቻዎ በተሳካ ሁኔታ ገብቷል!",
        refNumber: "የማመልከቻ መለያ ቁጥር፡",
        desc: "የተረጋገጠ የ ERNS ወኪል ለመሆን ስላመለከቱ እናመሰግናለን። የባለሙያዎች ቡድናችን ያስገቧቸውን ሰነዶች በማጣራት በ24-48 የስራ ሰዓታት ውስጥ በስልክ ወይም በኢሜይል ያነጋግርዎታል።",
        whatNext: "ቀጣይ እርምጃዎች ምንድን ናቸው?",
        nextSteps: [
          "ሰነዶችን ከንግድ ቢሮ እና ከሚመለከታቸው አካላት ጋር ማጣራት።",
          "ማንነትን ለማረጋገጥ አጭር የስልክ ወይም የቪዲዮ ግንኙነት ማድረግ።",
          "ፕሮፋይልዎን ማጽደቅ እና ይፋዊውን የ ERNS የተረጋገጠ ባጅ (Badge) መስጠት።",
        ],
        btnBrowseDirectory: "የወኪሎች ዝርዝርን ይመልከቱ",
        btnReturnHub: "ወደ ሻጮች ማዕከል ተመለስ",
      },
    },
    testimonial: {
      quote:
        "በ ERNS ላይ የተረጋገጥኩ ወኪል መሆኔ ስራዬን በእጅጉ ለውጦታል። የተረጋገጠ ባጅ ስላለኝ የቤት ሻጮች ያምኑኛል፤ በ12 ወራት ውስጥ ብቻ በቦሌ እና በካዛንቺስ 34 ስኬታማ የቤት ሽያጮችን አጠናቅቄአለሁ።",
      author: "ዳዊት ኃይሌ",
      agency: "አዲስ ፕራይም ሪልቲ • ቦሌ፣ አዲስ አበባ",
      salesMetric: "34 የተጠናቀቁ ሽያጮች",
      rating: "5.0 ደረጃ (62 አስተያየቶች)",
    },
    faq: {
      title: "ተደጋግመው የሚጠየቁ ጥያቄዎች",
      subtitle: "የ ERNS የተረጋገጡ ወኪሎች መረብን ስለመቀላቀል ማወቅ የሚገቡዎት ነገሮች።",
      items: [
        {
          q: "የማመልከቻው ግምገማ ምን ያህል ጊዜ ይወስዳል?",
          a: "አብዛኛዎቹ ማመልከቻዎች በ24 እስከ 48 የስራ ሰዓታት ውስጥ ይገመገማሉ። ቡድናችን የንግድ ፈቃድዎን ወይም የግብር ከፋይ ቁጥርዎን አረጋግጦ አጭር የስልክ ጥሪ ያደርጋል።",
        },
        {
          q: "ለማመልከት ወይም ለመቀላቀል የሚከፈል ቅድመ ክፍያ አለ?",
          a: "የለም። ማመልከቻ ማስገባት እና መሰረታዊ ፕሮፋይል ማዘጋጀት 100% ነፃ ነው። የተረጋገጡ ወኪሎች ያለ ቅድመ ክፍያ ቀጥተኛ የደንበኞች ጥያቄዎችን ያገኛሉ።",
        },
        {
          q: "ገለልተኛ ደላሎች ያለ ድርጅት ማመልከት ይችላሉ?",
          a: "አዎ። ህጋዊ የግብር ከፋይ ቁጥር (TIN) እና በአዲስ አበባ ውስጥ የተረጋገጠ የስራ ልምድ ያላቸው ግለሰብ ደላሎች ማመልከት ይችላሉ።",
        },
        {
          q: "ደንበኞች ከተረጋገጡ ወኪሎች ጋር እንዴት ይገናኛሉ?",
          a: "ደንበኞች በቀጥታ የስልክ ጥሪ፣ በኤስኤምኤስ (SMS) እና በቀጥታ ወደ ኢሜይልዎ በሚደርስ አስተማማኝ ቅጽ አማካኝነት ይገናኛሉ።",
        },
        {
          q: "የተረጋገጠ ደረጃን ለማስጠበቅ ምን መስፈርቶች አሉ?",
          a: "ወኪሎች ከ4.5 ኮከብ በላይ የሆነ የተገልጋዮች እርካታ ማስጠበቅ፣ ግልጽ የሆነ አሰራር መከተል እና የተወከሉ ቤቶች ህጋዊ ካርታ እንዳላቸው ማረጋገጥ ይጠበቅባቸዋል።",
        },
      ],
    },
    cta: {
      title: "የሪል እስቴት ስራዎትን ወደ ላቀ ደረጃ ለማሳደግ ዝግጁ ነዎት?",
      subtitle: "በአዲስ አበባ ውስጥ እጅግ አስተማማኝ የሆነውን የሪል እስቴት መረብ ይቀላቀሉ እና ዛሬውኑ ጥያቄዎችን መቀበል ይጀምሩ።",
      btnApply: "አሁን ያመልክቱ",
      btnContactSupport: "የአጋርነት ድጋፍን ያነጋግሩ",
    },
  },
};
