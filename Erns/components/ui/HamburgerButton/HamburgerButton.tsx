"use client";

import React from "react";
import styles from "./HamburgerButton.module.css";

export type HamburgerVariant = "navy" | "blue" | "light";
export type HamburgerSize = "sm" | "md" | "lg";

export interface HamburgerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean;
  variant?: HamburgerVariant;
  size?: HamburgerSize;
  buttonRef?: React.Ref<HTMLButtonElement>;
}

/**
 * Reusable Modern Hamburger Menu Button
 * Styled with squircle container and 3 horizontal bars matching ERNS branding.
 * 
 * Variants:
 * - 'navy': Deep navy background (#151c2b) with white bars (default)
 * - 'blue': Vibrant deep blue background (#223b62) with white bars
 * - 'light': Soft slate-blue tint (#4e7dad) with dark navy bars
 */
export const HamburgerButton = React.forwardRef<HTMLButtonElement, HamburgerButtonProps>(
  (
    {
      isOpen = false,
      variant = "navy",
      size = "md",
      className = "",
      onClick,
      "aria-label": ariaLabel,
      ...rest
    },
    ref
  ) => {
    const rootClasses = [
      styles.hamburgerBtn,
      styles[variant],
      styles[size],
      isOpen ? styles.open : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type="button"
        className={rootClasses}
        onClick={onClick}
        aria-label={ariaLabel || (isOpen ? "Close navigation menu" : "Open navigation menu")}
        aria-expanded={isOpen}
        {...rest}
      >
        <span className={styles.iconWrapper} aria-hidden="true">
          <span className={`${styles.bar} ${styles.topBar}`} />
          <span className={`${styles.bar} ${styles.middleBar}`} />
          <span className={`${styles.bar} ${styles.bottomBar}`} />
        </span>
      </button>
    );
  }
);

HamburgerButton.displayName = "HamburgerButton";
export default HamburgerButton;
