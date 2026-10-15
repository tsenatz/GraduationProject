"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bell, Heart, ClipboardCheck, Inbox } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import styles from "./Sidebar.module.css";

const sidebarLinks = [
  { href: "/", label: "Home", labelAm: "ዋና ገጽ", icon: Home },
  { href: "/search", label: "Search", labelAm: "ፍለጋ", icon: Search },
  { href: "/updates", label: "Updates", labelAm: "ዝማኔዎች", icon: Bell },
  { href: "/favorites", label: "Favorites", labelAm: "የተመረጡ", icon: Heart },
  { href: "/plan", label: "Plan", labelAm: "እቅድ", icon: ClipboardCheck },
  { href: "/inbox", label: "Inbox", labelAm: "መልዕክቶች", icon: Inbox },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isAmharic } = useLanguage();

  return (
    <nav className={styles.sidebar} aria-label="Main sidebar navigation">
      <ul className={styles.navList}>
        {sidebarLinks.map((item) => {
          const IconComponent = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href} className={styles.navItem}>
              <Link
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "page" : undefined}
                title={isAmharic ? item.labelAm : item.label}
              >
                <IconComponent className={styles.icon} aria-hidden="true" />
                <span className={styles.label}>
                  {isAmharic ? item.labelAm : item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
