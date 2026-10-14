import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { RentalManagerDashboardLayout } from "@/components/rentalmanager/dashboard";
import { AlertsDashboardView } from "@/components/rentalmanager/dashboard/AlertsDashboardView";

export const metadata = {
  title: "Alerts & Notifications | ERNS Rental Manager",
  description: "Real-time updates on rent payments, applications, and expiring leases.",
};

export default async function RentalManagerAlertsPage() {
  const session = await auth();
  const displayName = session?.user?.name || session?.user?.email || "Manager";

  return (
    <RentalManagerDashboardLayout userName={displayName}>
      <Suspense fallback={<div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>Loading alerts...</div>}>
        <AlertsDashboardView userName={displayName} />
      </Suspense>
    </RentalManagerDashboardLayout>
  );
}
