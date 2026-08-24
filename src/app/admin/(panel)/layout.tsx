"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar, AdminHeader } from "@/components/admin/sidebar";
import styles from "./admin-layout.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={styles.layoutContainer}>
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <AdminHeader
        onMenuClick={() => setMobileOpen(true)}
        collapsed={collapsed}
      />
      <main
        className={cn(
          styles.mainContent,
          collapsed ? styles.expanded : styles.collapsed
        )}
      >
        {children}
      </main>
    </div>
  );
}
