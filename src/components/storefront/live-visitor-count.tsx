"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./live-visitor-count.module.css";

export function LiveVisitorCount() {
  const [visitors, setVisitors] = useState(23);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize with a random number between 15 and 45
    setVisitors(Math.floor(Math.random() * 30) + 15);

    // Fluctuate the number randomly every 5 to 15 seconds
    const interval = setInterval(() => {
      setVisitors((prev) => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        let newValue = prev + change;
        if (newValue < 10) newValue = 10;
        if (newValue > 60) newValue = 60;
        return newValue;
      });
    }, Math.random() * 10000 + 5000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 1 }}
        className={styles.container}
      >
        <div className={styles.pulsingDot} />
        <span className={styles.text}>
          <span className={styles.number}>{visitors}</span> people are viewing this site
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
