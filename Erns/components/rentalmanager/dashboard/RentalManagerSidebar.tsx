"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  MessageSquare,
  Wallet,
  Bell,
  Plus,
  ChevronDown,
} from "lucide-react";
import styles from "./RentalManagerDashboard.module.css";

interface RentalManagerSidebarProps {
  userName?: string;
}

export function RentalManagerSidebar({ userName = "Tsenat Zeru" }: RentalManagerSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Properties",
      href: "/rentalmanager/properties",
      icon: Building2,
      showPlus: true,
      enabled: true,
    },
    {
      label: "Messages",
      icon: MessageSquare,
      enabled: false,
    },
    {
      label: "Payments",
      icon: Wallet,
      enabled: false,
    },
    {
      label: "Alerts",
      icon: Bell,
      enabled: false,
    },
  ];

  // User avatar initial e.g. "T"
  const avatarLetter = userName ? userName.trim().charAt(0).toUpperCase() : "T";

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarNav}>
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.enabled && item.href) {
            const isActive =
              pathname.startsWith(item.href) ||
              (pathname === "/rentalmanager/dashboard" && item.label === "Properties");

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              >
                <div className={styles.navItemLeft}>
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
                {item.showPlus && <Plus size={18} className={styles.navPlusIcon} />}
              </Link>
            );
          }

          // Disabled items with "Coming soon" tag
          return (
            <div key={item.label} className={styles.navItemDisabled}>
              <div className={styles.navItemLeft}>
                <Icon size={20} />
                <span>{item.label}</span>
              </div>
              <span className={styles.comingSoonBadge}>Coming soon</span>
            </div>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <button type="button" className={styles.profileButton}>
          <div className={styles.avatarCircle}>{avatarLetter}</div>
          <span className={styles.profileName}>{userName}</span>
          <ChevronDown size={16} color="#64748B" style={{ marginLeft: "auto" }} />
        </button>
      </div>
    </aside>
  );
}
