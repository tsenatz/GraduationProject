import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RentalManagerDashboardLayout } from "@/components/rentalmanager/dashboard";
import { PaymentsDashboardView } from "@/components/rentalmanager/dashboard/PaymentsDashboardView";

export const metadata = {
  title: "Rent Payments & Collections | ERNS Rental Manager",
  description: "Track monthly rent payments, receipts, and collection ledgers in ETB.",
};

export default async function RentalManagerPaymentsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/rentalmanager/payments");
  }

  const displayName = session.user.name || session.user.email || "Landlord";

  return (
    <RentalManagerDashboardLayout userName={displayName}>
      <Suspense fallback={<div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>Loading rent ledger...</div>}>
        <PaymentsDashboardView userName={displayName} />
      </Suspense>
    </RentalManagerDashboardLayout>
  );
}
