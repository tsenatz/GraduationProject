"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, X, ChevronRight } from "lucide-react";
import SignInButton from "@/components/auth/SignInButton";
import styles from "./Navbar.module.css";

const navLinksLeft = [
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/sell", label: "Sell" },
  { href: "/mortgage", label: "Get a mortgage" },
  { href: "/agents", label: "Find an agent" },
];

const navLinksRight = [
  { href: "/manage-rentals", label: "Manage rentals" },
  { href: "/advertise", label: "Advertise" },
  { href: "/get-help", label: "Get help" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper for dynamic breadcrumbs on mobile
  const getBreadcrumbLabel = () => {
    if (pathname === "/") return null;
    const allLinks = [...navLinksLeft, ...navLinksRight, { href: "/login", label: "Login" }];
    const match = allLinks.find((link) => link.href === pathname);
    if (match) return match.label;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return null;
    return segments[0].charAt(0).toUpperCase() + segments[0].slice(1).replace(/-/g, " ");
  };

  const currentBreadcrumb = getBreadcrumbLabel();

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Mobile Header Left Toggle Button */}
        <div className={styles.mobileToggleWrapper}>
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {isMenuOpen ? (
              <X className={styles.menuIcon} aria-hidden="true" />
            ) : (
              <Menu className={styles.menuIcon} aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop Left Navigation Items */}
        <nav className={styles.navSectionLeft} aria-label="Main primary navigation">
          {navLinksLeft.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Center Brand */}
        <div className={styles.brandContainer}>
          <Link href="/" className={styles.brand} aria-label="Erns Home">
            <Home className={styles.brandIcon} aria-hidden="true" />
            <span className={styles.brandText}>ERNS</span>
          </Link>
        </div>

        {/* Desktop Right Navigation Items & Mobile Right Profile */}
        <nav className={styles.navSectionRight} aria-label="Main secondary navigation">
          {navLinksRight.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <SignInButton />
        </nav>
      </div>

      {/* Mobile Breadcrumbs Container (Underneath Logo) */}
      {currentBreadcrumb && (
        <div className={styles.mobileBreadcrumbWrapper}>
          <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
            <ol className={styles.breadcrumbList}>
              <li className={styles.breadcrumbItem}>
                <Link href="/" className={styles.breadcrumbLink} aria-label="Home">
                  Home
                </Link>
              </li>
              <li className={styles.breadcrumbSeparator} aria-hidden="true">
                <ChevronRight className={styles.chevronIcon} />
              </li>
              <li className={styles.breadcrumbCurrent} aria-current="page">
                {currentBreadcrumb}
              </li>
            </ol>
          </nav>
        </div>
      )}

      {/* Mobile Drawer Overlay / Navigation Menu */}
      {isMenuOpen && (
        <div id="mobile-navigation-drawer" className={styles.mobileDrawer}>
          <nav aria-label="Mobile drawer navigation" className={styles.mobileDrawerNav}>
            <ul className={styles.mobileDrawerList}>
              {[...navLinksLeft, ...navLinksRight].map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href} className={styles.mobileDrawerItem}>
                    <Link
                      href={link.href}
                      className={`${styles.mobileDrawerLink} ${isActive ? styles.active : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className={styles.mobileDrawerItemBtn}>
                <SignInButton onClick={() => setIsMenuOpen(false)} />
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}