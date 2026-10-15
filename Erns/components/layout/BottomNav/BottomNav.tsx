"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Bell, Inbox, Tag } from "lucide-react";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { favoritesTranslations } from "@/components/favorites/translations";
import styles from "./BottomNav.module.css";

export function BottomNav() {
  const pathname = usePathname();
  const { count } = useFavorites();
  const { isAmharic } = useLanguage();
  const t = favoritesTranslations[isAmharic ? "am" : "en"].bottomNav;

  const navItems = [
    {
      href: "/search",
      label: t.search,
      icon: Search,
      isActive: pathname === "/search" || pathname === "/" || pathname === "/buy",
    },
    {
      href: "/updates",
      label: isAmharic ? "ዝማኔዎች" : "Updates",
      icon: Bell,
      isActive: pathname.startsWith("/updates"),
    },
    {
      href: "/favorites",
      label: t.saved,
      icon: Heart,
      badge: count,
      isActive: pathname === "/favorites",
    },
    {
      href: "/inbox",
      label: isAmharic ? "መልዕክት" : "Inbox",
      icon: Inbox,
      isActive: pathname.startsWith("/inbox"),
    },
    {
      href: "/sell",
      label: t.sell,
      icon: Tag,
      isActive: pathname.startsWith("/sell"),
    },
  ];

  return (
    <nav className={styles.bottomNavContainer} aria-label="Mobile navigation bar">
      <div className={styles.navBar}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isFav = item.href === "/favorites";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${item.isActive ? styles.navItemActive : ""}`}
              aria-current={item.isActive ? "page" : undefined}
            >
              <div className={styles.iconWrapper}>
                <Icon
                  size={20}
                  className={`${styles.navIcon} ${
                    isFav && item.isActive ? styles.heartActive : ""
                  }`}
                  fill={isFav && item.isActive ? "#e11d48" : "none"}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={styles.badge} aria-label={`${item.badge} favorites`}>
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
