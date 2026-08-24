"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Save, Loader2, Layout } from "lucide-react";
import { toast } from "sonner";
import { saveHomeSections, type HomeSectionConfig } from "@/lib/actions/home-sections";
import styles from "./pages.module.css";
import { cn } from "@/lib/utils";

export function SectionBuilder({ initialSections }: { initialSections: HomeSectionConfig[] }) {
  const router = useRouter();
  const [sections, setSections] = useState<HomeSectionConfig[]>(initialSections);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, active: !sec.active } : sec))
    );
    setDirty(true);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    setSections((prev) => {
      const next = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;

      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return [...next].map((sec, i) => ({ ...sec, order: i }));
    });
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveHomeSections(
        sections.map((sec, i) => ({ id: sec.id, active: sec.active, order: i }))
      );
      toast.success("Homepage layout published live!");
      setDirty(false);
      router.refresh();
    } catch {
      toast.error("Failed to save layout");
    } finally {
      setSaving(false);
    }
  };

  const hiddenCount = sections.filter((s) => !s.active).length;

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.headerTitle}>
          Homepage CMS &amp; Layout Builder
        </h1>
        <p className={styles.headerSubtitle}>
          Rearrange, toggle visibility, and publish your homepage sections — changes go live instantly
        </p>
      </div>

      <div className={styles.builderCard}>
        <h2 className={styles.cardTitle}>
          Homepage Section Sequence
          {hiddenCount > 0 && (
            <span className={styles.hiddenNote}> · {hiddenCount} hidden</span>
          )}
        </h2>

        <div className={styles.sectionList}>
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={cn(styles.sectionItem, section.active ? styles.sectionActive : styles.sectionInactive)}
            >
              <div className={styles.sectionInfo}>
                <div className={styles.orderControls}>
                  <button
                    onClick={() => moveSection(index, "up")}
                    disabled={index === 0}
                    className={styles.orderBtn}
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveSection(index, "down")}
                    disabled={index === sections.length - 1}
                    className={styles.orderBtn}
                  >
                    ▼
                  </button>
                </div>
                <div className={styles.sectionRank}>
                  {index + 1}
                </div>
                <div>
                  <h3 className={styles.sectionName}>{section.name}</h3>
                  <span className={styles.sectionType}>
                    TYPE: {section.key.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection(section.id)}
                  className={cn(styles.toggleBtn, section.active ? styles.toggleBtnActive : styles.toggleBtnInactive)}
                >
                  {section.active ? (
                    <>
                      <Eye className={styles.btnIcon} /> Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className={styles.btnIcon} /> Hidden
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footerActions}>
          <button
            onClick={handleSave}
            disabled={saving || sections.length === 0}
            className={cn(styles.saveBtn, dirty && styles.saveBtnDirty)}
          >
            {saving ? (
              <>
                <Loader2 className={styles.saveIcon} /> Publishing...
              </>
            ) : (
              <>
                <Save className={styles.saveIcon} /> Publish Layout Order
              </>
            )}
          </button>
          {!dirty && sections.length > 0 && (
            <span className={styles.savedNote}>
              <Layout className={styles.btnIcon} /> Live layout in sync
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
