"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Heart, ClipboardCheck, Inbox } from "lucide-react";
import styles from "./Sidebar.module.css";

const sidebarLinks = [
  { href: "/search", label: "Search", icon: Search },
  { href: "/updates", label: "Updates", icon: Bell },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/plan", label: "Plan", icon: ClipboardCheck },
  { href: "/inbox", label: "Inbox", icon: Inbox },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar} aria-label="Mobile navigation">
      <ul className={styles.navList}>
        {sidebarLinks.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.href} className={styles.navItem}>
              <Link
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <IconComponent className={styles.icon} aria-hidden="true" />
                <span className={styles.label}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
