import { Metadata } from "next";
import { PricingCards } from "@/components/pricing/PricingCards";
import { getUserTierStatusAction } from "@/lib/actions/tier";

export const metadata: Metadata = {
  title: "Pricing Plans | ERNS Ethiopia Real Estate",
  description:
    "Choose the right plan for your real estate needs. Connect directly with verified property owners and certified brokers in Addis Ababa.",
};

export default async function PricingPage() {
  const status = await getUserTierStatusAction();

  return (
    <main style={{ minHeight: "85vh", backgroundColor: "#f8fafc", padding: "40px 16px" }}>
      <PricingCards
        currentTier={status.tier}
        currentCredits={status.contactCredits}
        isUnlimited={status.isUnlimited}
      />
    </main>
  );
}
