import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";
import AccessDenied from "./AccessDenied";
import db from "@/lib/db";

export const metadata = {
  title: "ERNS Admin Portal",
  description: "Administrative command center and compliance verification for ERNS Real Estate.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // 1. Strict Authentication Gate: Must be logged in (all environments)
  if (!session?.user?.id && !session?.user?.email) {
    redirect("/login?callbackUrl=/admin");
  }

  // 2. Resolve authoritative User from database
  let dbUser = await db.user.findFirst({
    where: {
      OR: [
        session.user.id ? { id: session.user.id } : undefined,
        session.user.email ? { email: session.user.email } : undefined,
      ].filter(Boolean) as any,
    },
    select: { id: true, name: true, email: true, role: true, image: true },
  });

  // Check if current user is in designated ADMIN_EMAILS environment variable
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const currentUserEmail = session.user.email?.toLowerCase();
  if (dbUser && currentUserEmail && adminEmails.includes(currentUserEmail) && dbUser.role !== "ADMIN") {
    dbUser = await db.user.update({
      where: { id: dbUser.id },
      data: { role: "ADMIN" },
      select: { id: true, name: true, email: true, role: true, image: true },
    });
  }

  // 3. Strict Authorization Gate: Must have ADMIN role in the database
  if (!dbUser || dbUser.role !== "ADMIN") {
    return <AccessDenied userEmail={session.user.email} userRole={dbUser?.role || "USER"} />;
  }

  // 4. Real-time count of pending agent verifications
  let pendingCount = 0;
  try {
    pendingCount = await db.agentProfile.count({
      where: { verificationStatus: "PENDING" },
    });
  } catch (error) {
    console.error("Failed to query pending agent verifications:", error);
  }

  return (
    <AdminLayoutClient user={dbUser} pendingVerificationsCount={pendingCount}>
      {children}
    </AdminLayoutClient>
  );
}
