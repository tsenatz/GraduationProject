"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut, LayoutDashboard } from "lucide-react";
import styles from "./SignInButton.module.css";

interface SignInButtonProps {
  href?: string;
  className?: string;
  onClick?: () => void;
}

// Preset curated colors for the avatar circle background
const AVATAR_COLORS = [
  "linear-gradient(135deg, #2563eb, #1d4ed8)",
  "linear-gradient(135deg, #7c3aed, #6d28d9)",
  "linear-gradient(135deg, #059669, #047857)",
  "linear-gradient(135deg, #d97706, #b45309)",
  "linear-gradient(135deg, #dc2626, #b91c1c)",
  "linear-gradient(135deg, #db2777, #be185d)",
];

function getAvatarBg(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function SignInButton({
  href = "/login",
  className = "",
  onClick,
}: SignInButtonProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = pathname === href;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <span className={`${styles.signInBtn} ${className}`}>
        <span className={styles.label}>...</span>
      </span>
    );
  }

  // If Logged In: Show Circular Avatar & Dropdown Bar Menu
  if (session?.user) {
    const user = session.user;
    const displayName = user.name || user.email?.split("@")[0] || "User";
    const initial = displayName.charAt(0).toUpperCase();
    const avatarBg = getAvatarBg(user.email || user.name || "user");

    return (
      <div className={styles.userContainer} ref={dropdownRef}>
        <button
          type="button"
          className={styles.avatarBtn}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle user menu"
          aria-expanded={isOpen}
        >
          {user.image && !imgError ? (
            <Image
              src={user.image}
              alt={displayName}
              width={40}
              height={40}
              className={styles.avatarImage}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={styles.avatarInitial}
              style={{ background: avatarBg }}
            >
              {initial}
            </div>
          )}
        </button>

        {isOpen && (
          <div className={styles.dropdownMenu}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{displayName}</span>
              {user.email && <span className={styles.userEmail}>{user.email}</span>}
            </div>

            <div className={styles.dropdownDivider} />

            <Link
              href="/rentalmanager"
              className={styles.dropdownItem}
              onClick={() => {
                setIsOpen(false);
                if (onClick) onClick();
              }}
            >
              <LayoutDashboard size={16} />
              <span>Rental Manager</span>
            </Link>

            <div className={styles.dropdownDivider} />

            <button
              type="button"
              className={`${styles.dropdownItem} ${styles.signOutBtn}`}
              onClick={() => {
                setIsOpen(false);
                if (onClick) onClick();
                signOut({ callbackUrl: "/" });
              }}
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // If Logged Out: Show standard Sign In button
  return (
    <Link
      href={href}
      className={`${styles.signInBtn} ${isActive ? styles.active : ""} ${className}`}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      <span className={styles.label}>Sign in</span>
    </Link>
  );
}
