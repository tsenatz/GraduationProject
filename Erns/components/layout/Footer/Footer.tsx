import React from 'react';
import Link from 'next/link';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand & About */}
          <div className={styles.section}>
            <h2 className={styles.brandName}>
              <Home className={styles.brandIcon} size={24} /> ERNS
            </h2>
            <p className={styles.description}>
              Find your perfect home with ERNS. We make real estate simple, transparent, and accessible for everyone.
            </p>
            <div className={styles.socials}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h3 className={styles.title}>Quick Links</h3>
            <ul className={styles.links}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/properties">Properties</Link></li>
              <li><Link href="/agents">Our Agents</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className={styles.section}>
            <h3 className={styles.title}>Support</h3>
            <ul className={styles.links}>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.section}>
            <h3 className={styles.title}>Contact Us</h3>
            <ul className={styles.contactInfo}>
              <li>
                <MapPin size={18} className={styles.contactIcon} />
                <span>123 Real Estate Ave, Suite 100<br/>New York, NY 10001</span>
              </li>
              <li>
                <Phone size={18} className={styles.contactIcon} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <Mail size={18} className={styles.contactIcon} />
                <span>support@erns.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} ERNS Real Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
