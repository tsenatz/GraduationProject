"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Key, Tag, Users } from "lucide-react";
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
      href: "/",
      label: t.search,
      icon: Search,
      isActive: pathname === "/" || pathname === "/buy",
    },
    {
      href: "/rent",
      label: t.rent,
      icon: Key,
      isActive: pathname === "/rent",
    },
    {
      href: "/favorites",
      label: t.saved,
      icon: Heart,
      badge: count,
      isActive: pathname === "/favorites",
    },
    {
      href: "/sell",
      label: t.sell,
      icon: Tag,
      isActive: pathname.startsWith("/sell"),
    },
    {
      href: "/agents",
      label: t.agents,
      icon: Users,
      isActive: pathname.startsWith("/agents"),
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
