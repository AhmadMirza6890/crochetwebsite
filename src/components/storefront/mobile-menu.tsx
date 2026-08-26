"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Search, Heart, User, ShoppingBag } from "lucide-react";
import { LogoMark } from "./logo-mark";
import styles from "./mobile-menu.module.css";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/category/amigurumi", label: "Amigurumi" },
  { href: "/category/bags", label: "Bags" },
  { href: "/category/bouquets", label: "Bouquets" },
  { href: "/custom-order", label: "Custom Commission" },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {open && (
        <div className={styles.overlay} onClick={onClose} />
      )}

      <div className={`${styles.sidebar} ${open ? "" : styles.closed}`}>
        <div className={styles.header}>
          <Link href="/" className={styles.headerLogo} onClick={onClose}>
            <div className={styles.logoMarkIcon}>
              <LogoMark className={styles.logoMarkSvg} />
            </div>
            <span className={styles.logoName}>Hearthside Yarn</span>
          </Link>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <ul className={styles.navList}>
          {navLinks.map((link) => (
            <li key={link.href} className={styles.navItem}>
              <Link href={link.href} className={styles.navLink} onClick={onClose}>
                {link.label}
              </Link>
            </li>
          ))}
          <li className={styles.divider} />
          <li className={styles.navItem}>
            <Link href="/shop?view=collections" className={styles.navLink} onClick={onClose}>
              Collections
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/about" className={styles.navLink} onClick={onClose}>
              About
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/blog" className={styles.navLink} onClick={onClose}>
              Blog
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/contact" className={styles.navLink} onClick={onClose}>
              Contact
            </Link>
          </li>
        </ul>

        <div className={styles.actions}>
          <Link href="/account" className={styles.actionLink} onClick={onClose}>
            <User size={18} />
            My Account
          </Link>
          <Link href="/wishlist" className={styles.actionLink} onClick={onClose}>
            <Heart size={18} />
            Wishlist
          </Link>
        </div>
      </div>
    </>
  );
}
