import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Building2, Plus, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Rental Manager Dashboard | ERNS Real Estate",
  description: "Manage your listings, applicants, and rental properties.",
};

export default async function RentalManagerDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/rentalmanager/dashboard");
  }

  return (
    <main style={{ padding: "3rem 1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0A1931", marginBottom: "0.5rem" }}>
            Rental Manager Dashboard
          </h1>
          <p style={{ color: "#4A7FA7", fontSize: "1.05rem" }}>
            Welcome back, {session.user.name || session.user.email}! Manage your properties, leases, and inquiries.
          </p>
        </div>

        <Link
          href="/rentalmanager"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            border: "1.5px solid #0A1931",
            color: "#0A1931",
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          <ArrowLeft size={16} /> Re-run Setup Wizard
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "1.75rem",
            borderRadius: "14px",
            border: "1px solid rgba(74, 127, 167, 0.2)",
            boxShadow: "0 4px 12px rgba(10, 25, 49, 0.04)",
          }}
        >
          <Building2 size={28} color="#0A1931" style={{ marginBottom: "0.75rem" }} />
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0A1931", marginBottom: "0.4rem" }}>
            My Properties
          </h3>
          <p style={{ color: "#4A7FA7", fontSize: "0.95rem", marginBottom: "1.25rem" }}>
            View and manage listed rental properties and single-family units.
          </p>
          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "#0A1931",
              color: "#FFFFFF",
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Plus size={16} /> Add Listing
          </button>
        </div>
      </div>
    </main>
  );
}
