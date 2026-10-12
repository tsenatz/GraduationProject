import { Suspense } from "react";
import { auth } from "@/lib/auth";
import {
  RentalManagerDashboardLayout,
  PropertiesDashboardView,
} from "@/components/rentalmanager/dashboard";

export const metadata = {
  title: "Properties | ERNS Rental Manager",
  description: "Manage your rental properties, single-family homes, and listings.",
};

export default async function RentalManagerPropertiesPage() {
  const session = await auth();

  const displayName = session?.user?.name || session?.user?.email || "Manager";

  return (
    <RentalManagerDashboardLayout userName={displayName}>
      <Suspense fallback={<div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>Loading properties...</div>}>
        <PropertiesDashboardView userName={displayName} />
      </Suspense>
    </RentalManagerDashboardLayout>
  );
}
