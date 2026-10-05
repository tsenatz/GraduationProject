"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { AuthImagePanel } from "@/components/auth/AuthImagePanel";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { FormInput } from "@/components/auth/FormInput";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";

import styles from "./login.module.css";

const CAROUSEL_ITEMS = [
  {
    title: "Find your sweet home",
    desc: (
      <>
        Schedule visit in just a few clicks<br />
        visits in just a few clicks
      </>
    ),
  },
  {
    title: "Discover prime locations",
    desc: (
      <>
        Explore properties in the best neighborhoods<br />
        for a vibrant lifestyle.
      </>
    ),
  },
  {
    title: "Your dream investment",
    desc: (
      <>
        Secure the best deals in real estate<br />
        with our expert guidance.
      </>
    ),
  },
];

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <AuthPageLayout
      imagePanelSlot={
        <AuthImagePanel imageSrc="/signin.png" carouselItems={CAROUSEL_ITEMS} />
      }
      formSectionSlot={
        <>
          <AuthTabs activeTab="login" />

          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <h2>Welcome Back to ERNS!</h2>
              <p>Sign in your account</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <FormInput
                id="email"
                label="Your Email"
                type="email"
                placeholder="info.madhu786@gmail.com"
              />

              <FormInput
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                className={styles.passwordInput}
              />

              <div className={styles.formOptions}>
                <div
                  className={styles.rememberMe}
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  <div className={`${styles.checkbox} ${rememberMe ? styles.checked : ""}`}>
                    {rememberMe && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span>Remember Me</span>
                </div>
                <Link href="/forgot-password" className={styles.forgotPassword}>
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className={styles.loginBtn}>
                Login
              </button>
            </form>

            <div className={styles.divider}>
              <span>Instant Login</span>
            </div>

            <SocialLoginButtons />

            <div className={styles.registerText}>
              Don&apos;t have any account?
              <Link href="/signup" className={styles.registerLink}>
                Register
              </Link>
            </div>
          </div>
        </>
      }
    />
  );
}
