import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { RentalManagerDashboardLayout } from "@/components/rentalmanager/dashboard";
import { LeasesDashboardView } from "@/components/rentalmanager/dashboard/LeasesDashboardView";

export const metadata = {
  title: "Lease Agreements & Terms | ERNS Rental Manager",
  description:
    "Manage residential lease contracts, security deposits, utility terms, and renewal dates in ETB.",
};

export default async function RentalManagerLeasesPage() {
  const session = await auth();
  const displayName = session?.user?.name || session?.user?.email || "Manager";

  return (
    <RentalManagerDashboardLayout userName={displayName}>
      <Suspense fallback={<div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>Loading lease agreements...</div>}>
        <LeasesDashboardView userName={displayName} />
      </Suspense>
    </RentalManagerDashboardLayout>
  );
}
