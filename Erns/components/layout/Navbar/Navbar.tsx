"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Menu, X, ChevronRight } from "lucide-react";
import SignInButton from "@/components/auth/SignInButton";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import styles from "./Navbar.module.css";

import { NAV_LINKS_LEFT, NAV_LINKS_RIGHT } from "./navLinks";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const checkIsActive = (href: string) => {
    const [basePath, searchStr] = href.split("?");
    if (basePath !== pathname) return false;
    if (!searchStr) return true;
    
    const linkParams = new URLSearchParams(searchStr);
    for (const [key, value] of Array.from(linkParams.entries())) {
      if (searchParams.get(key) !== value) {
        return false;
      }
    }
    return true;
  };

  // Helper for dynamic breadcrumbs on mobile
  const getBreadcrumbLabel = () => {
    if (pathname === "/") return null;
    const allLinks = [...NAV_LINKS_LEFT, ...NAV_LINKS_RIGHT, { href: "/login", label: "Login" }];
    const match = allLinks.find((link) => checkIsActive(link.href));
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
          {NAV_LINKS_LEFT.map((link) => {
                const isActive = checkIsActive(link.href);
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
          {NAV_LINKS_RIGHT.map((link) => {
                const isActive = checkIsActive(link.href);
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
          <LanguageSwitcher />
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
              {[...NAV_LINKS_LEFT, ...NAV_LINKS_RIGHT].map((link) => {
                    const isActive = checkIsActive(link.href);
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
              <li className={styles.mobileDrawerItem}>
                <LanguageSwitcher isMobileDrawer />
              </li>
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