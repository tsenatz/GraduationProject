import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RentalManagerDashboardLayout } from "@/components/rentalmanager/dashboard";
import { ApplicationsDashboardView } from "@/components/rentalmanager/dashboard/ApplicationsDashboardView";

export const metadata = {
  title: "Tenant Applications & Inquiries | ERNS Rental Manager",
  description: "Review tenant applications, income verification, and lease inquiries.",
};

export default async function RentalManagerApplicationsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/rentalmanager/applications");
  }

  const displayName = session.user.name || session.user.email || "Landlord";

  return (
    <RentalManagerDashboardLayout userName={displayName}>
      <Suspense fallback={<div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>Loading tenant applications...</div>}>
        <ApplicationsDashboardView userName={displayName} />
      </Suspense>
    </RentalManagerDashboardLayout>
  );
}
