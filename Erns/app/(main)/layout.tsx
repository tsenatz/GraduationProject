"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="app-container">
      <Navbar />
      <div className={`body-container ${isHomePage ? "home-body-container" : ""}`}>
        {!isHomePage && <Sidebar />}
        <main className={`main-content ${isHomePage ? "home-main-content" : ""}`}>
          {children}
        </main>
      </div>
      {!isHomePage && <Footer />}
      {!isHomePage && <BottomNav />}
    </div>
  );
}
