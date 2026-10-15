"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, X, Check, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { homeDirectoryTranslations, HomeDirectoryTranslations } from "./translations";
import styles from "./HomeDirectory.module.css";

type TabKey = "realEstate" | "rentals" | "mortgages" | "browseAddis";

export const HomeDirectory: React.FC = () => {
  const { language } = useLanguage();
  const t: HomeDirectoryTranslations =
    homeDirectoryTranslations[language] || homeDirectoryTranslations.en;

  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Privacy toggles state
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [personalizedEnabled, setPersonalizedEnabled] = useState(true);
  const [optOutDataSharing, setOptOutDataSharing] = useState(true);

  const toggleTab = (tab: TabKey) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  const handleOpenPrivacy = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsPrivacyModalOpen(true);
  };

  const handleSavePreferences = () => {
    setIsPrivacyModalOpen(false);
    triggerToast(t.privacyChoice.savedToast);
  };

  const handleAcceptAll = () => {
    setAnalyticsEnabled(true);
    setPersonalizedEnabled(true);
    setOptOutDataSharing(false);
    setIsPrivacyModalOpen(false);
    triggerToast(t.privacyChoice.savedToast);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const tabsConfig: { key: TabKey; title: string }[] = [
    { key: "realEstate", title: t.tabs.realEstate.tabTitle },
    { key: "rentals", title: t.tabs.rentals.tabTitle },
    { key: "mortgages", title: t.tabs.mortgages.tabTitle },
    { key: "browseAddis", title: t.tabs.browseAddis.tabTitle },
  ];

  const currentTabContent = activeTab ? t.tabs[activeTab] : null;

  return (
    <section className={styles.container} aria-label="Real Estate Directory and Legal Disclosures">
      <div className={styles.inner}>
        {/* 1. About ERNS's Recommendations */}
        <div className={styles.recommendationsNotice}>
          <h3 className={styles.recommendationsTitle}>
            {t.aboutRecommendations.title}
          </h3>
          <p className={styles.recommendationsDesc}>
            {t.aboutRecommendations.description}
          </p>
        </div>

        {/* 2. 4-Column Accordion Header Bar */}
        <nav className={styles.accordionNav} aria-label="Directory Navigation">
          {tabsConfig.map(({ key, title }) => {
            const isOpen = activeTab === key;
            return (
              <div key={key} className={styles.accordionCol}>
                <button
                  type="button"
                  className={`${styles.accordionTab} ${isOpen ? styles.accordionTabActive : ""}`}
                  onClick={() => toggleTab(key)}
                  aria-expanded={isOpen}
                  aria-controls={`accordion-panel-${key}`}
                >
                  <span>{title}</span>
                  <ChevronDown
                    size={18}
                    className={`${styles.chevron} ${isOpen ? styles.chevronActive : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            );
          })}
        </nav>

        {/* 3. Collapsible Accordion Drawer */}
        {currentTabContent && activeTab && (
          <div
            id={`accordion-panel-${activeTab}`}
            className={styles.accordionPanel}
            role="region"
            aria-label={currentTabContent.tabTitle}
          >
            <div className={styles.categoriesGrid}>
              {currentTabContent.categories.map((category, idx) => (
                <div key={idx} className={styles.categoryGroup}>
                  <h4 className={styles.categoryTitle}>{category.title}</h4>
                  <ul className={styles.categoryList}>
                    {category.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <Link href={link.href} className={styles.categoryLink}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Secondary & Tertiary Directory Links */}
        <div className={styles.linksContainer}>
          <div className={styles.secondaryLinksRow}>
            {t.secondaryLinks.map((item, idx) => (
              <Link key={idx} href={item.href} className={styles.secondaryLink}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className={styles.tertiaryLinksRow}>
            {t.tertiaryLinks.map((item, idx) => {
              if (item.href === "#cookies") {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={handleOpenPrivacy}
                    className={styles.tertiaryLink}
                  >
                    {item.label}
                  </button>
                );
              }
              return (
                <Link key={idx} href={item.href} className={styles.secondaryLink}>
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className={styles.networkLinksRow}>
            {t.networkLinks.map((item, idx) => (
              <Link key={idx} href={item.href} className={styles.networkLink}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 5. "Do Not Sell or Share My Personal Information →" */}
        <div className={styles.privacyActionWrapper}>
          <button
            type="button"
            onClick={handleOpenPrivacy}
            className={styles.privacyActionButton}
          >
            {t.privacyChoice.button}
          </button>
        </div>

        {/* 6. Legal & Accessibility Fine Print */}
        <div className={styles.legalSection}>
          <p className={styles.legalText}>
            {t.legal.accessibility}{" "}
            <a
              href="mailto:accessibility@erns.et?subject=Accessibility%20Request"
              className={styles.accessibilityLink}
            >
              {t.legal.accessibilityLink}
            </a>
          </p>

          <p className={styles.legalDisclosure}>{t.legal.licensing}</p>

          <div className={styles.bottomBar}>
            {/* Equal Housing Badge */}
            <div className={styles.equalHousingBadge}>
              <svg
                className={styles.equalHousingIcon}
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="16" x2="16" y2="16" />
              </svg>
              <span>{t.legal.equalHousing}</span>
            </div>

            {/* Social Icons */}
            <div className={styles.socialRow} aria-label="ERNS Social Media">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIconLink}
                aria-label="Facebook"
              >
                <FacebookIcon className={styles.socialSvg} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIconLink}
                aria-label="Twitter"
              >
                <TwitterIcon className={styles.socialSvg} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIconLink}
                aria-label="Instagram"
              >
                <InstagramIcon className={styles.socialSvg} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIconLink}
                aria-label="LinkedIn"
              >
                <LinkedinIcon className={styles.socialSvg} />
              </a>
            </div>

            {/* Copyright */}
            <div className={styles.copyright}>
              &copy; {new Date().getFullYear()} {t.legal.copyright}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Privacy Preferences Modal */}
      {isPrivacyModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsPrivacyModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h3 id="privacy-modal-title" className={styles.modalTitle}>
                  {t.privacyChoice.modalTitle}
                </h3>
                <p className={styles.modalSubtitle}>
                  {t.privacyChoice.modalSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
                className={styles.modalCloseBtn}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Necessary */}
              <div className={styles.preferenceItem}>
                <div className={styles.preferenceInfo}>
                  <h4 className={styles.preferenceTitle}>
                    {t.privacyChoice.necessaryTitle}
                  </h4>
                  <p className={styles.preferenceDesc}>
                    {t.privacyChoice.necessaryDesc}
                  </p>
                </div>
                <span className={styles.switchAlways}>
                  {t.privacyChoice.necessaryAlwaysActive}
                </span>
              </div>

              {/* Analytics */}
              <div className={styles.preferenceItem}>
                <div className={styles.preferenceInfo}>
                  <h4 className={styles.preferenceTitle}>
                    {t.privacyChoice.analyticsTitle}
                  </h4>
                  <p className={styles.preferenceDesc}>
                    {t.privacyChoice.analyticsDesc}
                  </p>
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              {/* Personalized Advertising */}
              <div className={styles.preferenceItem}>
                <div className={styles.preferenceInfo}>
                  <h4 className={styles.preferenceTitle}>
                    {t.privacyChoice.advertisingTitle}
                  </h4>
                  <p className={styles.preferenceDesc}>
                    {t.privacyChoice.advertisingDesc}
                  </p>
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={personalizedEnabled}
                    onChange={(e) => setPersonalizedEnabled(e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              {/* Global Opt-Out of Data Sharing */}
              <div className={styles.preferenceItem}>
                <div className={styles.preferenceInfo}>
                  <h4 className={styles.preferenceTitle}>
                    {t.privacyChoice.optOutTitle}
                  </h4>
                  <p className={styles.preferenceDesc}>
                    {t.privacyChoice.optOutDesc}
                  </p>
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={optOutDataSharing}
                    onChange={(e) => setOptOutDataSharing(e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={handleAcceptAll}
                className={styles.btnSecondary}
              >
                {t.privacyChoice.acceptAllBtn}
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className={styles.btnPrimary}
              >
                {t.privacyChoice.saveBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Toast */}
      {toastMessage && (
        <div className={styles.toastNotice} role="status">
          <ShieldCheck size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};

export default HomeDirectory;
