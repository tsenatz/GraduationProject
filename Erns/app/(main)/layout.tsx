"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { UserHubNav } from "@/components/layout/UserHubNav";
import { BottomNav } from "@/components/layout/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isUserHubPage =
    pathname.startsWith("/updates") ||
    pathname.startsWith("/favorites") ||
    pathname.startsWith("/inbox") ||
    pathname.startsWith("/plan");

  return (
    <div className="app-container">
      <Navbar />
      <div className={`body-container ${isHomePage ? "home-body-container" : ""}`}>
        {isUserHubPage && <UserHubNav />}
        <main className={`main-content ${isHomePage ? "home-main-content" : ""}`}>
          {children}
        </main>
      </div>
      <Footer />
      {!isHomePage && <BottomNav />}
    </div>
  );
}
