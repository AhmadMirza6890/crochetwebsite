"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { CartDrawer } from "./cart-drawer";
import { ThemeToggle } from "./theme-toggle";
import { SearchModal } from "./search-modal";
import { LogoMark } from "./logo-mark";
import styles from "./navbar.module.css";

interface StorefrontNavbarProps {
  settings?: any;
}

export function StorefrontNavbar({ settings = {} }: StorefrontNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  
  const { totalItems, openDrawer } = useCart();
  const { totalWishlistItems } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/shop", label: "Shop All" },
    { href: "/category/amigurumi", label: "Amigurumi" },
    { href: "/category/bags", label: "Bags" },
    { href: "/category/bouquets", label: "Bouquets" },
    { href: "/custom-order", label: "Custom Commission" },
  ];

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.container}>
          <div className={`${styles.navWrapper} ${scrolled ? styles.navWrapperScrolled : ""}`}>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={styles.mobileMenuBtn}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            {/* Logo */}
            <Link href="/" className={styles.logoLink}>
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.siteName || "Logo"}
                  className={`${styles.logoImage} ${scrolled ? styles.logoImageScrolled : ""}`}
                />
              ) : (
                <>
                  <div className={styles.logoIconWrapper}>
                    <LogoMark className={styles.logoIconSvg} />
                  </div>
                  <span className={`${styles.logoText} ${scrolled ? styles.logoTextScrolled : ""}`}>
                    {settings.siteName || "Hearthside Yarn"}
                  </span>
                </>
              )}
            </Link>

            {/* Desktop nav */}
            <nav className={styles.desktopNav}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.navLink}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className={styles.actions}>
              <ThemeToggle />

              <button
                onClick={() => setSearchModalOpen(true)}
                className={styles.actionBtn}
                aria-label="Search items"
              >
                <Search size={18} />
              </button>

              <Link
                href="/wishlist"
                className={styles.actionBtn}
                aria-label="View Wishlist"
              >
                <Heart size={18} />
                {totalWishlistItems > 0 && (
                  <span className={styles.badge}>
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              <button
                onClick={openDrawer}
                className={`${styles.actionBtn} ${styles.cartBtn}`}
                aria-label="Open Cart"
              >
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span className={`${styles.badge} ${styles.cartBadge}`}>
                    {totalItems}
                  </span>
                )}
              </button>

              <Link
                href="/account"
                className={`${styles.actionBtn} ${styles.accountBtn}`}
                aria-label="Account profile"
              >
                <User size={18} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer />
      
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
