"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  ShoppingCart,
  Users,
  Star,
  Ticket,
  Paintbrush,
  FileText,
  ImageIcon,
  Layout,
  Palette,
  Settings,
  BarChart3,
  ChevronLeft,
  Menu,
  LogOut,
  Bell,
  Moon,
  Sun,
  X,
} from "lucide-react";
import styles from "@/app/admin/(panel)/admin-layout.module.css";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  ShoppingCart,
  Users,
  Star,
  Ticket,
  Paintbrush,
  FileText,
  Image: ImageIcon,
  Layout,
  Palette,
  Settings,
  BarChart3,
};

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Categories", href: "/admin/categories", icon: "FolderTree" },
  { label: "Collections", href: "/admin/collections", icon: "Layers" },
  { label: "Orders", href: "/admin/orders", icon: "ShoppingCart" },
  { label: "Customers", href: "/admin/customers", icon: "Users" },
  { label: "Reviews", href: "/admin/reviews", icon: "Star" },
  { label: "Coupons", href: "/admin/coupons", icon: "Ticket" },
  { label: "Custom Orders", href: "/admin/custom-orders", icon: "Paintbrush" },
  { label: "Blog", href: "/admin/blog", icon: "FileText" },
  { label: "Media", href: "/admin/media", icon: "Image" },
  { label: "Pages", href: "/admin/pages", icon: "Layout" },
  { label: "Theme", href: "/admin/theme", icon: "Palette" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className={styles.overlay}
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          styles.sidebar,
          collapsed ? styles.collapsed : styles.expanded,
          mobileOpen ? styles.mobileOpen : styles.mobileClosed
        )}
      >
        {/* Logo */}
        <div className={styles.logoArea}>
          {!collapsed && (
            <Link href="/admin/dashboard" className={styles.logoLink}>
              <span className={styles.logoMark}>H</span>
              <span className={styles.logoTextWrap}>
                <span className={styles.logoName}>
                  Hearthside<span className={styles.logoAccent}> Yarn</span>
                </span>
                <span className={styles.logoSub}>Studio Admin</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin/dashboard" className={styles.logoLink}>
              <span className={cn(styles.logoMark, styles.logoMarkSolo)}>H</span>
            </Link>
          )}
          <button
            onClick={onToggle}
            className={styles.toggleBtn}
          >
            <ChevronLeft
              className={cn(
                styles.toggleIcon,
                collapsed && styles.rotated
              )}
            />
          </button>
          <button
            onClick={onMobileClose}
            className={styles.mobileCloseBtn}
          >
            <X className={styles.navIcon} />
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.navArea}>
          <ul className={styles.navList}>
            {navItems.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      styles.navLink,
                      isActive && styles.active
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={styles.navIcon} />
                    {!collapsed && <span className={styles.navText}>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className={styles.footerArea}>
          <Link
            href="/"
            target="_blank"
            className={styles.navLink}
          >
            <Layout className={styles.navIcon} />
            {!collapsed && <span>View Store</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}

interface AdminHeaderProps {
  onMenuClick: () => void;
  collapsed: boolean;
}

export function AdminHeader({ onMenuClick, collapsed }: AdminHeaderProps) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header
      className={cn(
        styles.header,
        collapsed ? styles.collapsed : styles.expanded
      )}
    >
      <div className={styles.headerContent}>
        <div className={styles.headerActions}>
          <button
            onClick={onMenuClick}
            className={styles.mobileMenuBtn}
          >
            <Menu className={styles.actionIcon} />
          </button>
        </div>

        <div className={styles.headerActions}>
          <button
            onClick={toggleDarkMode}
            className={styles.actionBtn}
          >
            {darkMode ? (
              <Sun className={cn(styles.actionIcon, styles.sunIcon)} />
            ) : (
              <Moon className={styles.actionIcon} />
            )}
          </button>

          <button className={styles.actionBtn}>
            <Bell className={styles.actionIcon} />
            <span className={styles.badge} />
          </button>

          <Link
            href="/api/auth/signout"
            className={styles.actionBtn}
            title="Sign out"
          >
            <LogOut className={styles.actionIcon} />
          </Link>
        </div>
      </div>
    </header>
  );
}
