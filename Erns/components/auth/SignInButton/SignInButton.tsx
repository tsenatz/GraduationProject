"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
      <span className={styles.label}>Sign in</span>
    </Link>
  );
}
