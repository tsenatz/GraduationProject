import { RentalManagerOnboardingWizard } from "@/components/rentalmanager/onboarding";

export const metadata = {
  title: "Rental Manager Setup | ERNS Real Estate",
  description: "Complete your rental manager profile and portfolio settings.",
};

export default function RentalManagerSetupPage() {
  return <RentalManagerOnboardingWizard />;
}
