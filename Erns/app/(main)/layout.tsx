"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { SplashScreen } from "@/components/layout/SplashScreen";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="app-container">
      {isHomePage && <SplashScreen />}
      <Navbar />
      <div className={`body-container ${isHomePage ? "home-body-container" : ""}`}>
        <main className={`main-content ${isHomePage ? "home-main-content" : ""}`}>
          {children}
        </main>
      </div>
      <Footer />
      {!isHomePage && <BottomNav />}
    </div>
  );
}
