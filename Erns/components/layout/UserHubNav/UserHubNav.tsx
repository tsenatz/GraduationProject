"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Heart, Inbox, ClipboardCheck, Search } from "lucide-react";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import styles from "./UserHubNav.module.css";

export function UserHubNav() {
  const pathname = usePathname();
  const { count: favoritesCount } = useFavorites();
  const { isAmharic } = useLanguage();

  const hubItems = [
    {
      href: "/updates",
      label: "Saved Searches & Alerts",
      labelAm: "የተቀመጡ ፍለጋዎች",
      icon: Bell,
      badge: 4,
    },
    {
      href: "/favorites",
      label: "Saved Homes",
      labelAm: "የተመረጡ ቤቶች",
      icon: Heart,
      badge: favoritesCount,
    },
    {
      href: "/inbox",
      label: "Messages",
      labelAm: "መልዕክቶች",
      icon: Inbox,
    },
    {
      href: "/plan",
      label: "Tour Plan",
      labelAm: "የጉብኝት እቅድ",
      icon: ClipboardCheck,
    },
  ];

  return (
    <nav className={styles.hubNavWrapper} aria-label="My real estate activity navigation">
      <div className={styles.hubNavContainer}>
        <div className={styles.hubTabsList} role="tablist">
          {hubItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <div key={item.href} className={styles.hubTabItem}>
                <Link
                  href={item.href}
                  className={`${styles.hubTabLink} ${
                    isActive ? styles.hubTabLinkActive : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={styles.tabIcon} />
                  <span>{isAmharic ? item.labelAm : item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={styles.tabCountBadge}>{item.badge}</span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        <div className={styles.hubNavRight}>
          <Link href="/search" className={styles.hubBackToSearch}>
            <Search size={14} />
            <span>{isAmharic ? "ቤቶችን ፈልግ" : "Browse Homes"}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default UserHubNav;
