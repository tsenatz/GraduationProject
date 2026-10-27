"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BadgeCheck,
  Building2,
  Users,
  ScrollText,
  ArrowLeft,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";
import styles from "./admin.module.css";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
  pendingVerificationsCount?: number;
}

export default function AdminLayoutClient({
  children,
  user,
  pendingVerificationsCount = 3,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/verifications",
      label: "Verifications",
      icon: BadgeCheck,
      badge: pendingVerificationsCount > 0 ? pendingVerificationsCount : undefined,
    },
    {
      href: "/admin/properties",
      label: "Properties",
      icon: Building2,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      href: "/admin/logs",
      label: "Audit Logs",
      icon: ScrollText,
    },
  ];

  const adminDisplayName = user.name || user.email?.split("@")[0] || "Admin";
  const adminInitial = adminDisplayName.charAt(0).toUpperCase();

  return (
    <div className={styles.adminRoot}>
      <div className={styles.dashboardContainer}>
        {/* ================= SIDEBAR ================= */}
        <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.mobileOpen : ""}`}>
          <div className={styles.sidebarTop}>
            <div className={styles.sidebarHeader}>
              <div className={styles.brandLogo}>E</div>
              <div className={styles.brandDetails}>
                <span className={styles.brandName}>ERNS</span>
                <span className={styles.brandSubtitle}>Admin Portal</span>
              </div>
            </div>

            <nav className={styles.navSection} aria-label="Admin Navigation">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className={styles.navIcon} />
                    <span className={styles.navLabel}>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={styles.navBadge}>{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className={styles.sidebarFooter}>
            <Link href="/" className={styles.exitLink} title="Return to ERNS marketplace">
              <ArrowLeft size={18} />
              <span>Exit to Main App</span>
            </Link>
          </div>
        </aside>

        {/* ================= MAIN CONTENT VIEWPORT ================= */}
        <main className={styles.mainContent}>
          {/* Top Bar */}
          <header className={styles.topBar}>
            <div className={styles.titleCluster}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <button
                  type="button"
                  className={`${styles.iconButton} ${styles.mobileMenuToggle}`}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <h1 className={styles.pageTitle}>
                  {pathname === "/admin" && "Executive Dashboard"}
                  {pathname.startsWith("/admin/verifications") && "Agent Verifications"}
                  {pathname.startsWith("/admin/properties") && "Property Moderation"}
                  {pathname.startsWith("/admin/users") && "User Management"}
                  {pathname.startsWith("/admin/logs") && "Audit Trail"}
                </h1>
              </div>
              <p className={styles.pageSubtitle}>
                {pathname === "/admin" && "Real-time Ethiopian marketplace overview and compliance tracking."}
                {pathname.startsWith("/admin/verifications") &&
                  `${pendingVerificationsCount} professional agent applications awaiting compliance review.`}
                {pathname.startsWith("/admin/properties") &&
                  "Review, moderate, and inspect Addis Ababa property listings."}
                {pathname.startsWith("/admin/users") &&
                  "Manage accounts, assign roles, and audit permissions."}
                {pathname.startsWith("/admin/logs") &&
                  "Permanent log of administrative decisions and security events."}
              </p>
            </div>

            <div className={styles.topBarRight}>
              <div className={styles.searchBox}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Global search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <button
                type="button"
                className={styles.iconButton}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell size={18} />
              </button>

              <div className={styles.adminProfileBadge}>
                <div className={styles.adminAvatar}>{adminInitial}</div>
                <div className={styles.adminMeta}>
                  <span className={styles.adminName}>{adminDisplayName}</span>
                  <span className={styles.adminRoleText}>Super Admin</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Contents */}
          {children}
        </main>
      </div>
    </div>
  );
}
