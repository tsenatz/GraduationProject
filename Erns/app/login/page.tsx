"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

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

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      } else {
        window.location.href = callbackUrl;
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthTabs activeTab="login" />

      <div className={styles.formWrapper}>
        <div className={styles.formHeader}>
          <h2>Welcome Back to ERNS!</h2>
          <p>Sign in your account</p>
        </div>

        {error && (
          <div
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "#fef2f2",
              color: "#b91c1c",
              borderRadius: "8px",
              fontSize: "0.875rem",
              marginBottom: "1rem",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            id="email"
            label="Your Email"
            type="email"
            placeholder="info.madhu786@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            required
          />

          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            className={styles.passwordInput}
            required
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

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
          >
            {isLoading ? "Signing in..." : "Login"}
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
  );
}

export default function LoginPage() {
  return (
    <AuthPageLayout
      imagePanelSlot={
        <AuthImagePanel imageSrc="/signin.png" carouselItems={CAROUSEL_ITEMS} />
      }
      formSectionSlot={
        <Suspense fallback={<div style={{ padding: "2rem" }}>Loading...</div>}>
          <LoginForm />
        </Suspense>
      }
    />
  );
}
