import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  RentalManagerDashboardLayout,
  PropertiesDashboardView,
} from "@/components/rentalmanager/dashboard";

export const metadata = {
  title: "Rental Manager Dashboard | ERNS Real Estate",
  description: "Manage your rental properties, listings, and tenant inquiries.",
};

export default async function RentalManagerDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/rentalmanager/dashboard");
  }

  const displayName = session.user.name || session.user.email || "Landlord";

  return (
    <RentalManagerDashboardLayout userName={displayName}>
      <PropertiesDashboardView userName={displayName} />
    </RentalManagerDashboardLayout>
  );
}
