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

  const displayName = session?.user?.name || session?.user?.email || "Manager";

  return (
    <RentalManagerDashboardLayout userName={displayName}>
      <PropertiesDashboardView userName={displayName} />
    </RentalManagerDashboardLayout>
  );
}
