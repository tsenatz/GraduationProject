import { Metadata } from "next";
import {
  ApplyHero,
  ApplyBenefits,
  ApplyRequirements,
  ApplyFormWizard,
  ApplyTestimonial,
  ApplyFAQ,
  ApplyCTA,
} from "@/components/agents/apply";

export const metadata: Metadata = {
  title: "Apply as a Verified Agent | ERNS Real Estate Ethiopia",
  description:
    "Join Ethiopia's premier network of verified real estate agents. Connect with property sellers, diaspora investors, and verified buyers in Addis Ababa.",
};

export default function ApplyVerifiedAgentPage() {
  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--bg-color, #f6fafd)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ApplyHero />
      <ApplyBenefits />
      <ApplyRequirements />
      <ApplyFormWizard />
      <ApplyTestimonial />
      <ApplyFAQ />
      <ApplyCTA />
    </main>
  );
}
