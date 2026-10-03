"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import styles from "./SignInButton.module.css";

interface SignInButtonProps {
  href?: string;
  className?: string;
  onClick?: () => void;
}

export default function SignInButton({
  href = "/login",
  className = "",
  onClick,
}: SignInButtonProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${styles.signInBtn} ${isActive ? styles.active : ""} ${className}`}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      <LogIn className={styles.icon} aria-hidden="true" />
      <span className={styles.label}>Sign in</span>
    </Link>
  );
}
