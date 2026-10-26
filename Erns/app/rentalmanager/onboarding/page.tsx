import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RentalManagerOnboardingWizard } from "@/components/rentalmanager/onboarding";

export const metadata = {
  title: "Rental Manager Setup | ERNS Real Estate",
  description: "Complete your rental manager profile and portfolio settings.",
};

export default async function RentalManagerOnboardingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/rentalmanager/onboarding");
  }

  return <RentalManagerOnboardingWizard />;
}
