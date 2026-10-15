"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, X, ChevronRight, Bell, Bookmark, Inbox, ClipboardCheck } from "lucide-react";
import SignInButton from "@/components/auth/SignInButton";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import styles from "./Navbar.module.css";

import { NAV_LINKS_LEFT, NAV_LINKS_RIGHT } from "./navLinks";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { count: favoritesCount } = useFavorites();
  const { language, isAmharic } = useLanguage();

  const isFavoritesActive = pathname === "/favorites";

  const checkIsActive = (href: string) => {
    if (href === "/") return pathname === "/";
    const linkPathname = href.split("?")[0];
    return pathname.startsWith(linkPathname);
  };

  const savedLabel = isAmharic ? "የተቀመጡ ቤቶች" : "Saved Homes";

  // Helper for dynamic breadcrumbs on mobile
  const getBreadcrumbLabel = () => {
    if (pathname === "/") return null;
    const allLinks = [
      ...NAV_LINKS_LEFT,
      ...NAV_LINKS_RIGHT,
      { href: "/updates", label: isAmharic ? "ዝማኔዎች" : "Updates" },
      { href: "/favorites", label: savedLabel },
      { href: "/inbox", label: isAmharic ? "መልዕክቶች" : "Inbox" },
      { href: "/plan", label: isAmharic ? "የጉብኝት እቅድ" : "Tour Plan" },
      { href: "/login", label: "Login" },
    ];
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

        {/* Left Side: Brand Logo + Primary Nav Links */}
        <div className={styles.leftCluster}>
          <div className={styles.brandContainer}>
            <Link href="/" className={styles.brand} aria-label="Erns Home">
              <Home className={styles.brandIcon} aria-hidden="true" />
              <span className={styles.brandText}>ERNS</span>
            </Link>
          </div>

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
        </div>

        {/* Desktop Right Navigation Items & Utility Icons */}
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

          {/* Thin Vertical Divider between navigation links and tools */}
          <div className={styles.navDivider} aria-hidden="true" />

          {/* User Activity Utility Icons (Zillow/Airbnb Style) */}
          <div className={styles.utilityActionsGroup}>
            {/* Updates (Saved Searches & Alerts) */}
            <Link
              href="/updates"
              className={`${styles.utilityIconBtn} ${
                pathname.startsWith("/updates") ? styles.utilityIconBtnActive : ""
              }`}
              title={isAmharic ? "ዝማኔዎች እና የተቀመጡ ፍለጋዎች" : "Updates & Saved Searches"}
              aria-label="Updates and saved searches"
            >
              <Bell className={styles.utilityIcon} />
              <span className={styles.utilityDot} />
            </Link>

            {/* Bookmark / Saved Properties Link (Leader's integration) */}
            <Link
              href="/favorites"
              className={`${styles.bookmarkNavLink} ${isFavoritesActive ? styles.bookmarkActive : ""}`}
              aria-label={`${savedLabel} (${favoritesCount})`}
              title={savedLabel}
              aria-current={isFavoritesActive ? "page" : undefined}
            >
              <Bookmark
                size={20}
                className={styles.bookmarkIcon}
                fill={isFavoritesActive ? "currentColor" : "none"}
                strokeWidth={2}
              />
              {favoritesCount > 0 && (
                <span className={styles.bookmarkBadge} aria-hidden="true">
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
              )}
            </Link>

            {/* Inbox (Messages) */}
            <Link
              href="/inbox"
              className={`${styles.utilityIconBtn} ${
                pathname.startsWith("/inbox") ? styles.utilityIconBtnActive : ""
              }`}
              title={isAmharic ? "መልዕክቶች" : "Messages"}
              aria-label="Messages and inquiries"
            >
              <Inbox className={styles.utilityIcon} />
            </Link>
          </div>

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

              <li className={styles.mobileDrawerDivider} role="separator" />
              <li className={styles.mobileDrawerSubheading}>
                {isAmharic ? "የግል እንቅስቃሴ" : "My Activity"}
              </li>

              <li className={styles.mobileDrawerItem}>
                <Link
                  href="/updates"
                  className={`${styles.mobileDrawerLink} ${
                    pathname.startsWith("/updates") ? styles.active : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Bell size={18} style={{ marginRight: 8 }} />
                  {isAmharic ? "ዝማኔዎች" : "Updates & Saved Searches"}
                </Link>
              </li>

              <li className={styles.mobileDrawerItem}>
                <Link
                  href="/favorites"
                  className={`${styles.mobileDrawerLink} ${isFavoritesActive ? styles.active : ""}`}
                  aria-current={isFavoritesActive ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={styles.drawerBookmarkContent}>
                    <Bookmark
                      size={20}
                      strokeWidth={2.2}
                      className={styles.drawerBookmarkIcon}
                      fill={isFavoritesActive ? "currentColor" : "none"}
                    />
                    <span>{savedLabel}</span>
                  </span>
                  {favoritesCount > 0 && (
                    <span className={styles.drawerBookmarkBadge}>
                      {favoritesCount > 99 ? "99+" : favoritesCount}
                    </span>
                  )}
                </Link>
              </li>

              <li className={styles.mobileDrawerItem}>
                <Link
                  href="/inbox"
                  className={`${styles.mobileDrawerLink} ${
                    pathname.startsWith("/inbox") ? styles.active : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Inbox size={18} style={{ marginRight: 8 }} />
                  {isAmharic ? "መልዕክቶች" : "Messages"}
                </Link>
              </li>

              <li className={styles.mobileDrawerItem}>
                <Link
                  href="/plan"
                  className={`${styles.mobileDrawerLink} ${
                    pathname.startsWith("/plan") ? styles.active : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ClipboardCheck size={18} style={{ marginRight: 8 }} />
                  {isAmharic ? "የጉብኝት እቅድ" : "Tour Plan"}
                </Link>
              </li>

              <li className={styles.mobileDrawerDivider} role="separator" />

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