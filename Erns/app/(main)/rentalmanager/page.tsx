import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface RentalManagerPageProps {
  searchParams?: Promise<{ verified?: string }>;
}

export default async function RentalManagerPage({ searchParams }: RentalManagerPageProps) {
  const session = await auth();

  // 1. If not authenticated, redirect to login with callback URL
  if (!session?.user) {
    redirect("/login?callbackUrl=/rentalmanager");
  }

  // 2. Phone Verification Guard (Bypassed for development)
  // To re-enable in production, uncomment the block below:
  /*
  const params = searchParams ? await searchParams : undefined;
  const isVerified = params?.verified === "true";
  if (!isVerified) {
    redirect("/verify-phone?callbackUrl=/rentalmanager?verified=true");
  }
  */

  return (
    <main style={{ padding: "3rem 1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0a1931", marginBottom: "0.75rem" }}>
        Rental Manager Dashboard
      </h1>
      <p style={{ color: "#4a7fa7", fontSize: "1.05rem" }}>
        Welcome back, {session.user.name || session.user.email}! Manage your rental listings, lease agreements, and applications.
      </p>
    </main>
  );
}
