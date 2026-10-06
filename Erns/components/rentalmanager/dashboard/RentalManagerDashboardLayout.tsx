"use client";

import { RentalManagerTopHeader } from "./RentalManagerTopHeader";
import { RentalManagerSidebar } from "./RentalManagerSidebar";
import styles from "./RentalManagerDashboard.module.css";

interface RentalManagerDashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
  onAddProperty?: () => void;
}

export function RentalManagerDashboardLayout({
  children,
  userName = "Tsenat Zeru",
  onAddProperty,
}: RentalManagerDashboardLayoutProps) {
  return (
    <div className={styles.dashboardContainer}>
      {/* Top Bar with Logo */}
      <RentalManagerTopHeader />

      <div className={styles.dashboardBody}>
        {/* Dedicated Left Sidebar */}
        <RentalManagerSidebar userName={userName} />

        {/* Main Content Area */}
        {children}
      </div>
    </div>
  );
}
