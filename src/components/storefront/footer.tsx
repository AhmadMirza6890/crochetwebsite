"use client";

import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { LogoMark } from "./logo-mark";
import styles from "./footer.module.css";

interface StorefrontFooterProps {
  settings?: any;
}

export function StorefrontFooter({ settings = {} }: StorefrontFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* Brand & Mission */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logoLink}>
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.siteName || "Logo"}
                  className={styles.logoImage}
                />
              ) : (
                <>
                  <div className={styles.logoIconWrapper}>
                    <LogoMark className={styles.logoIconSvg} />
                  </div>
                  <span className={styles.logoText}>
                    {settings.siteName || "Hearthside Yarn"}
                  </span>
                </>
              )}
            </Link>
            <p className={styles.brandDesc}>
              {settings.description || "Crafting heirloom-quality crochet treasures with patience, passion, and premium organic cotton. Every stitch tells a story."}
            </p>
            <div className={styles.socialLinks}>
              {settings.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              )}
              {settings.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={styles.columnTitle}>Shop Categories</h3>
            <div className={styles.linkList}>
              <Link href="/shop" className={styles.footerLink}>All Creations</Link>
              <Link href="/category/amigurumi" className={styles.footerLink}>Amigurumi Plushies</Link>
              <Link href="/category/bags" className={styles.footerLink}>Handcrafted Bags</Link>
              <Link href="/category/bouquets" className={styles.footerLink}>Floral Bouquets</Link>
              <Link href="/category/clothing" className={styles.footerLink}>Apparel &amp; Accessories</Link>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className={styles.columnTitle}>Customer Care</h3>
            <div className={styles.linkList}>
              <Link href="/custom-order" className={styles.footerLink}>Custom Commissions</Link>
              <Link href="/track-order" className={styles.footerLink}>Track Your Order</Link>
              <Link href="/faq" className={styles.footerLink}>FAQs &amp; Shipping</Link>
              <Link href="/returns" className={styles.footerLink}>Returns &amp; Exchanges</Link>
              <Link href="/care-guide" className={styles.footerLink}>Crochet Care Guide</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className={styles.columnTitle}>Get in Touch</h3>
            <div className={styles.contactList}>
              {settings.contactEmail && (
                <div className={styles.contactItem}>
                  <Mail className={styles.contactIcon} />
                  <p className={styles.contactText}>{settings.contactEmail}</p>
                </div>
              )}
              {settings.contactPhone && (
                <div className={styles.contactItem}>
                  <Phone className={styles.contactIcon} />
                  <p className={styles.contactText}>{settings.contactPhone}</p>
                </div>
              )}
              <div className={styles.contactItem}>
                <MapPin className={styles.contactIcon} />
                <p className={styles.contactText}>
                  Crafted with love in<br />Lahore, Pakistan
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} {settings.siteName || "Hearthside Yarn"}. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
