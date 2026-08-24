"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/actions/settings";
import { Settings, Save, Loader2, Megaphone, Globe, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";
import styles from "./settings.module.css";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "Hearthside Yarn",
    tagline: "Unique crochet pieces crafted slowly with love",
    email: "hello@hearthsideyarn.com",
    phone: "+1 (555) 789-2345",
    address: "Hearthside Yarn Studio, Lahore, Pakistan",
    announcementText: "Free shipping on orders over $50 | Handcrafted to order ✨",
    announcementBg: "#8B7355",
    announcementTextColor: "#ffffff",
    announcementActive: true,
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    pinterest: "https://pinterest.com",
    freeShippingThreshold: 50,
  });

  useEffect(() => {
    async function load() {
      const data = await getSiteSettings();
      if (data) setSettings(data as any);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSiteSettings({
        ...settings,
        freeShippingThreshold: parseFloat(settings.freeShippingThreshold as any) || 50,
      });
      toast.success("Storefront settings updated successfully!");
    } catch {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.headerTitle}>
          Storefront Settings & CMS
        </h1>
        <p className={styles.headerSubtitle}>
          Configure announcement banner, brand identity, contact information, and shipping thresholds
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Announcement Bar */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Megaphone className={styles.sectionIcon} /> Announcement Banner
            </h2>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={settings.announcementActive}
                onChange={(e) => setSettings((p) => ({ ...p, announcementActive: e.target.checked }))}
                className={styles.toggleInput}
              />
              <span className={styles.toggleText}>
                Show on Storefront
              </span>
            </label>
          </div>

          <div className={styles.formGroup}>
            <div>
              <label className={styles.label}>
                Banner Message
              </label>
              <input
                type="text"
                value={settings.announcementText || ""}
                onChange={(e) => setSettings((p) => ({ ...p, announcementText: e.target.value }))}
                placeholder="Free shipping on orders over $50"
                className={styles.inputField}
              />
            </div>

            <div className={styles.grid}>
              <div>
                <label className={styles.label}>
                  Background Color
                </label>
                <div className={styles.colorPickerGroup}>
                  <input
                    type="color"
                    value={settings.announcementBg || "#8B7355"}
                    onChange={(e) => setSettings((p) => ({ ...p, announcementBg: e.target.value }))}
                    className={styles.colorPickerInput}
                  />
                  <input
                    type="text"
                    value={settings.announcementBg || "#8B7355"}
                    onChange={(e) => setSettings((p) => ({ ...p, announcementBg: e.target.value }))}
                    className={styles.colorTextInput}
                  />
                </div>
              </div>

              <div>
                <label className={styles.label}>
                  Text Color
                </label>
                <div className={styles.colorPickerGroup}>
                  <input
                    type="color"
                    value={settings.announcementTextColor || "#ffffff"}
                    onChange={(e) => setSettings((p) => ({ ...p, announcementTextColor: e.target.value }))}
                    className={styles.colorPickerInput}
                  />
                  <input
                    type="text"
                    value={settings.announcementTextColor || "#ffffff"}
                    onChange={(e) => setSettings((p) => ({ ...p, announcementTextColor: e.target.value }))}
                    className={styles.colorTextInput}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand & Contact */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            <Globe className={styles.sectionIcon} /> Brand & Contact Details
          </h2>

          <div className={styles.grid}>
            <div>
              <label className={styles.label}>
                Brand Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings((p) => ({ ...p, siteName: e.target.value }))}
                className={styles.inputField}
              />
            </div>

            <div>
              <label className={styles.label}>
                Free Shipping Threshold ($)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold || 50}
                onChange={(e) => setSettings((p) => ({ ...p, freeShippingThreshold: parseFloat(e.target.value) || 0 }))}
                className={styles.inputField}
              />
            </div>

            <div>
              <label className={styles.label}>
                Contact Email
              </label>
              <input
                type="email"
                value={settings.email || ""}
                onChange={(e) => setSettings((p) => ({ ...p, email: e.target.value }))}
                className={styles.inputField}
              />
            </div>

            <div>
              <label className={styles.label}>
                Studio Phone
              </label>
              <input
                type="text"
                value={settings.phone || ""}
                onChange={(e) => setSettings((p) => ({ ...p, phone: e.target.value }))}
                className={styles.inputField}
              />
            </div>

            <div className={styles.colSpan2}>
              <label className={styles.label}>
                Studio Physical Address
              </label>
              <input
                type="text"
                value={settings.address || ""}
                onChange={(e) => setSettings((p) => ({ ...p, address: e.target.value }))}
                className={styles.inputField}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            Social Media Links
          </h2>

          <div className={styles.grid}>
            <div>
              <label className={styles.label}>
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagram || ""}
                onChange={(e) => setSettings((p) => ({ ...p, instagram: e.target.value }))}
                placeholder="https://instagram.com/yourhandle"
                className={styles.inputField}
              />
            </div>

            <div>
              <label className={styles.label}>
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebook || ""}
                onChange={(e) => setSettings((p) => ({ ...p, facebook: e.target.value }))}
                placeholder="https://facebook.com/yourhandle"
                className={styles.inputField}
              />
            </div>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button
            type="submit"
            disabled={loading}
            className={styles.saveBtn}
          >
            {loading ? <Loader2 className={cn(styles.saveIcon, styles.spinner)} /> : <Save className={styles.saveIcon} />}
            Save Store Settings
          </button>
        </div>
      </form>
    </div>
  );
}
