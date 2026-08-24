"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import styles from "./announcement-bar.module.css";

interface AnnouncementBarProps {
  settings: {
    announcementText?: string | null;
    announcementBg?: string | null;
    announcementTextColor?: string | null;
    announcementActive: boolean;
  };
}

export function AnnouncementBar({ settings }: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);

  if (!settings.announcementActive || !settings.announcementText || !visible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={styles.container}
        style={{
          backgroundColor: settings.announcementBg || "#E11D48",
          color: settings.announcementTextColor || "#ffffff",
        }}
      >
        <div className={styles.content}>
          <span className={styles.text}>{settings.announcementText}</span>
          <button
            onClick={() => setVisible(false)}
            className={styles.closeBtn}
            aria-label="Dismiss announcement"
          >
            <X className={styles.closeIcon} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
