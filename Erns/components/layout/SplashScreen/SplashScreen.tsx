"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Home } from "lucide-react";
import styles from "./SplashScreen.module.css";

const STORAGE_KEY = "erns_splash_seen";
const DISPLAY_DURATION_MS = 1350; // total intro animation run time
const FADE_OUT_DURATION_MS = 500; // time for exit transition

export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // sessionStorage unavailable (e.g. private mode restrictions)
    }

    const timer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, FADE_OUT_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMounted(true);

    try {
      const alreadySeen = sessionStorage.getItem(STORAGE_KEY);
      if (alreadySeen === "true") {
        return; // Don't show again in the same browser session
      }
    } catch {
      // Ignore sessionStorage check errors
    }

    // First time in this session: activate splash screen
    setVisible(true);
    document.body.style.overflow = "hidden";

    // Start progress bar animation after mount
    const progressTimer = setTimeout(() => {
      setProgress(true);
    }, 100);

    // Auto dismiss after display duration
    const exitTimer = setTimeout(() => {
      dismiss();
    }, DISPLAY_DURATION_MS);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(exitTimer);
      document.body.style.overflow = "";
    };
  }, [dismiss]);

  // Clean exit: remove from DOM once completed or if already seen
  if (!mounted || !visible) {
    return null;
  }

  return (
    <div
      className={`${styles.splashContainer} ${exiting ? styles.isExiting : ""}`}
      onClick={dismiss}
      role="status"
      aria-live="polite"
      aria-label="ERNS opening animation"
    >
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.contentCard}>
        {/* Glowing Badge Emblem */}
        <div className={styles.iconBadge} aria-hidden="true">
          <Home size={38} strokeWidth={2.2} className={styles.homeIcon} />
        </div>

        {/* Shimmering Brand Title */}
        <h1 className={styles.brandTitle}>ERNS</h1>

        {/* Tagline */}
        <p className={styles.tagline}>
          Ethio Rents <span className={styles.taglineSeparator}>•</span> Sales
        </p>

        {/* Hairline Progress Indicator */}
        <div className={styles.progressTrack} aria-hidden="true">
          <div
            className={`${styles.progressBar} ${progress ? styles.progressFull : ""}`}
          />
        </div>
      </div>

      <span className={styles.skipHint}>Click anywhere to skip</span>
    </div>
  );
}
