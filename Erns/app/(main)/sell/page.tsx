import { Metadata } from "next";
import {
  LanguageProvider,
  SellHero,
  SellingOptions,
  TrustStrip,
  GuidesRow,
  SellerFAQ,
  SellerCTA,
} from "@/components/sell";

export const metadata: Metadata = {
  title: "Sell Your Home in Ethiopia | ERNS Real Estate",
  description:
    "Explore your home selling options in Ethiopia. Connect with verified local agents or list your property directly for free on ERNS.",
};

export default function SellPage() {
  return (
    <LanguageProvider>
      {/* 2. Hero with Language Switcher */}
      <SellHero />

      {/* 3. Two cards: "Find a verified agent" & "List it myself" */}
      <SellingOptions />

      {/* 4. Trust strip (verified agents, free to list, listings moderated) */}
      <TrustStrip />

      {/* 5. Guides row (placeholder seller guides) */}
      <GuidesRow />

      {/* 6. FAQ (5 to 6 local questions) */}
      <SellerFAQ />

      {/* 7. Bottom call to action */}
      <SellerCTA />
    </LanguageProvider>
  );
}
