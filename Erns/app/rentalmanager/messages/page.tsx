import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RentalManagerDashboardLayout } from "@/components/rentalmanager/dashboard";
import { InboxView } from "@/components/inbox";

export const metadata = {
  title: "Messages & Inquiries | ERNS Rental Manager",
  description:
    "Direct communication with prospective tenants, tour schedules, and applicant inquiries for your rental properties.",
};

export default async function RentalManagerMessagesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/rentalmanager/messages");
  }

  const displayName = session.user.name || session.user.email || "Landlord";

  return (
    <RentalManagerDashboardLayout userName={displayName}>
      <div style={{ flex: 1, padding: "1rem 1.5rem 2rem", width: "100%", minHeight: 0 }}>
        <Suspense
          fallback={
            <div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>
              Loading messages...
            </div>
          }
        >
          <InboxView initialPerspective="selling_hosting" />
        </Suspense>
      </div>
    </RentalManagerDashboardLayout>
  );
}
