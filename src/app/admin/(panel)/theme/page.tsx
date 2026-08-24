"use client";

import { useState, useEffect } from "react";
import { getThemeSettings, updateThemeSettings } from "@/lib/actions/settings";
import { FONTS } from "@/lib/constants";
import { Palette, Save, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import styles from "./theme.module.css";
import { cn } from "@/lib/utils";

export default function AdminThemePage() {
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState({
    primaryColor: "#8B7355",
    secondaryColor: "#D4A574",
    accentColor: "#C9A9A6",
    backgroundColor: "#FAF7F2",
    textColor: "#2D2926",
    mutedColor: "#8B8178",
    headingFont: "Playfair Display",
    bodyFont: "Inter",
    borderRadius: "0.75rem",
    buttonStyle: "rounded",
    cardStyle: "elevated",
    shadowStyle: "soft",
  });

  useEffect(() => {
    async function load() {
      const data = await getThemeSettings();
      if (data) setTheme(data as any);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateThemeSettings(theme);
      toast.success("Theme settings saved and applied across the entire storefront!");
    } catch {
      toast.error("Failed to update theme");
    } finally {
      setLoading(false);
    }
  };

  const presetPalettes = [
    {
      name: "Earthy Warmth (Default)",
      primary: "#8B7355",
      secondary: "#D4A574",
      accent: "#C9A9A6",
      bg: "#FAF7F2",
      text: "#2D2926",
    },
    {
      name: "Blush Botanical",
      primary: "#A36B73",
      secondary: "#E0B0B6",
      accent: "#A8B5A0",
      bg: "#FCF8F8",
      text: "#332225",
    },
    {
      name: "Sage Atelier",
      primary: "#6B7F67",
      secondary: "#B4C4B1",
      accent: "#D4A574",
      bg: "#F7FAF6",
      text: "#242B23",
    },
    {
      name: "Cozy Midnight (Dark Luxury)",
      primary: "#C4A882",
      secondary: "#D4A574",
      accent: "#C9A9A6",
      bg: "#1A1814",
      text: "#F5F0E8",
    },
  ];

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.headerTitle}>
          Theme Customizer
        </h1>
        <p className={styles.headerSubtitle}>
          Customize brand colors, typography, border radius, and card styling without code changes
        </p>
      </div>

      {/* Preset palettes */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionLabel}>
          Curated Palette Presets
        </h2>
        <div className={styles.presetGrid}>
          {presetPalettes.map((preset) => (
            <button
              key={preset.name}
              onClick={() =>
                setTheme((p) => ({
                  ...p,
                  primaryColor: preset.primary,
                  secondaryColor: preset.secondary,
                  accentColor: preset.accent,
                  backgroundColor: preset.bg,
                  textColor: preset.text,
                }))
              }
              className={styles.presetBtn}
            >
              <div className={styles.presetSwatches}>
                <div className={styles.presetSwatch} style={{ backgroundColor: preset.primary }} />
                <div className={styles.presetSwatch} style={{ backgroundColor: preset.secondary }} />
                <div className={styles.presetSwatch} style={{ backgroundColor: preset.accent }} />
                <div className={styles.presetSwatch} style={{ backgroundColor: preset.bg }} />
              </div>
              <p className={styles.presetName}>
                {preset.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className={styles.form}>
        {/* Colors */}
        <div className={styles.formSectionCard}>
          <h2 className={styles.sectionTitle}>
            Brand Color Palette
          </h2>

          <div className={styles.grid3}>
            <div>
              <label className={styles.label}>
                Primary Brand Color
              </label>
              <div className={styles.colorPickerGroup}>
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme((p) => ({ ...p, primaryColor: e.target.value }))}
                  className={styles.colorPickerInput}
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme((p) => ({ ...p, primaryColor: e.target.value }))}
                  className={styles.colorTextInput}
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>
                Secondary Accent Color
              </label>
              <div className={styles.colorPickerGroup}>
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme((p) => ({ ...p, secondaryColor: e.target.value }))}
                  className={styles.colorPickerInput}
                />
                <input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme((p) => ({ ...p, secondaryColor: e.target.value }))}
                  className={styles.colorTextInput}
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>
                Accent Highlight Color
              </label>
              <div className={styles.colorPickerGroup}>
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => setTheme((p) => ({ ...p, accentColor: e.target.value }))}
                  className={styles.colorPickerInput}
                />
                <input
                  type="text"
                  value={theme.accentColor}
                  onChange={(e) => setTheme((p) => ({ ...p, accentColor: e.target.value }))}
                  className={styles.colorTextInput}
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>
                Storefront Background
              </label>
              <div className={styles.colorPickerGroup}>
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme((p) => ({ ...p, backgroundColor: e.target.value }))}
                  className={styles.colorPickerInput}
                />
                <input
                  type="text"
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme((p) => ({ ...p, backgroundColor: e.target.value }))}
                  className={styles.colorTextInput}
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>
                Body Text Color
              </label>
              <div className={styles.colorPickerGroup}>
                <input
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => setTheme((p) => ({ ...p, textColor: e.target.value }))}
                  className={styles.colorPickerInput}
                />
                <input
                  type="text"
                  value={theme.textColor}
                  onChange={(e) => setTheme((p) => ({ ...p, textColor: e.target.value }))}
                  className={styles.colorTextInput}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography & Geometry */}
        <div className={styles.formSectionCard}>
          <h2 className={styles.sectionTitle}>
            Typography & Border Radius
          </h2>

          <div className={styles.grid3}>
            <div>
              <label className={styles.label}>
                Heading Serif Font
              </label>
              <select
                value={theme.headingFont}
                onChange={(e) => setTheme((p) => ({ ...p, headingFont: e.target.value }))}
                className={cn(styles.selectField, styles.fontSerif)}
              >
                {FONTS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={styles.label}>
                Body Sans Font
              </label>
              <select
                value={theme.bodyFont}
                onChange={(e) => setTheme((p) => ({ ...p, bodyFont: e.target.value }))}
                className={styles.selectField}
              >
                {FONTS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={styles.label}>
                Card & Button Radius
              </label>
              <select
                value={theme.borderRadius}
                onChange={(e) => setTheme((p) => ({ ...p, borderRadius: e.target.value }))}
                className={cn(styles.selectField, styles.fontMedium)}
              >
                <option value="0.375rem">Subtle (6px)</option>
                <option value="0.75rem">Modern Rounded (12px)</option>
                <option value="1.25rem">Cozy Pill (20px)</option>
                <option value="1.75rem">Ultra Soft (28px)</option>
              </select>
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
            Save & Publish Theme
          </button>
        </div>
      </form>
    </div>
  );
}
