"use client";

import React from 'react';
import Link from 'next/link';
import { Home, Mail, Phone, MapPin } from 'lucide-react';
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from '@/components/icons/SocialIcons';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { footerTranslations } from './translations';
import styles from './Footer.module.css';

export const Footer = () => {
  const { language } = useLanguage();
  const t = footerTranslations[language] || footerTranslations.en;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand & About */}
          <div className={styles.section}>
            <h2 className={styles.brandName}>
              <Home className={styles.brandIcon} size={24} /> ERNS
            </h2>
            <p className={styles.description}>{t.brandDesc}</p>
            <div className={styles.socials}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                <FacebookIcon className={styles.socialIcon} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
                <TwitterIcon className={styles.socialIcon} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <InstagramIcon className={styles.socialIcon} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                <LinkedinIcon className={styles.socialIcon} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h3 className={styles.title}>{t.quickLinksTitle}</h3>
            <ul className={styles.links}>
              <li><Link href="/">{t.links.home}</Link></li>
              <li><Link href="/search?status=FOR_SALE">{t.links.buy}</Link></li>
              <li><Link href="/search?status=FOR_RENT">{t.links.rent}</Link></li>
              <li><Link href="/sell">{t.links.sell}</Link></li>
              <li><Link href="/agents">{t.links.agents}</Link></li>
              <li><Link href="/rentalmanager">{t.links.rentalManager}</Link></li>
            </ul>
          </div>

          {/* Platform & Support */}
          <div className={styles.section}>
            <h3 className={styles.title}>{t.platformTitle}</h3>
            <ul className={styles.links}>
              <li><Link href="/favorites">{t.support.favorites}</Link></li>
              <li><Link href="/inbox">{t.support.inbox}</Link></li>
              <li><Link href="/agents/apply">{t.support.agentApply}</Link></li>
              <li><Link href="/sell/dashboard">{t.links.sell}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.section}>
            <h3 className={styles.title}>{t.contactTitle}</h3>
            <ul className={styles.contactInfo}>
              <li>
                <MapPin size={18} className={styles.contactIcon} aria-hidden="true" />
                <span>
                  {t.addressLine1}
                  <br />
                  {t.addressLine2}
                </span>
              </li>
              <li>
                <Phone size={18} className={styles.contactIcon} aria-hidden="true" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <a href={`tel:${t.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {t.phone}
                  </a>
                  <a href={`tel:${t.phoneMobile}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {t.phoneMobile}
                  </a>
                </div>
              </li>
              <li>
                <Mail size={18} className={styles.contactIcon} aria-hidden="true" />
                <a href={`mailto:${t.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {t.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} {t.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
