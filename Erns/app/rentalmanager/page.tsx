import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLandlordRentalPropertiesAction } from "@/lib/actions/rentals";
import { RentalManagerOnboardingWizard } from "@/components/rentalmanager/onboarding";

export const metadata = {
  title: "Rental Manager | ERNS Real Estate",
  description: "Complete your rental manager profile and manage your rental portfolio.",
};

export default async function RentalManagerSetupPage({
  searchParams,
}: {
  searchParams?: Promise<{ onboarding?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  
  // Allow explicit onboarding if ?onboarding=true
  if (resolvedParams?.onboarding === "true") {
    return <RentalManagerOnboardingWizard />;
  }

  // If landlord has rental properties, route directly to the properties dashboard
  try {
    const res = await getLandlordRentalPropertiesAction();
    if (res.success && res.properties && res.properties.length > 0) {
      redirect("/rentalmanager/properties");
    }
  } catch (err) {
    // If redirect throws (Next.js standard behavior), let it propagate
    if (err && typeof err === "object" && "digest" in err && String((err as any).digest).startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    // Otherwise fallback to onboarding wizard
  }

  return <RentalManagerOnboardingWizard />;
}

