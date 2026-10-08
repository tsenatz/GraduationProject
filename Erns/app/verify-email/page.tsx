"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";

import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { AuthImagePanel } from "@/components/auth/AuthImagePanel";
import { verifyEmailCode, resendVerificationCode } from "@/lib/actions/auth";

import styles from "./verify-email.module.css";

const CAROUSEL_ITEMS = [
  {
    title: "Security & Verification",
    desc: (
      <>
        We protect our community by verifying each<br />
        member's contact information.
      </>
    ),
  },
];

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on load
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = cleanValue.slice(-1);
    setOtp(newOtp);
    setError(null);

    // Auto-advance to next input
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join("");

    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    if (!email) {
      setError("No email address provided. Please return to sign up.");
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      const res = await verifyEmailCode(email, fullCode);

      if (res.error) {
        setError(res.error);
        setIsVerifying(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 2000);
    } catch {
      setError("An unexpected error occurred during verification.");
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending || !email) return;

    setIsResending(true);
    setError(null);
    setResendMessage(null);

    try {
      const res = await resendVerificationCode(email);
      if (res.error) {
        setError(res.error);
      } else {
        setResendMessage("A new verification code has been sent to your email.");
        setCountdown(60);
      }
    } catch {
      setError("Failed to resend verification code.");
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className={styles.formWrapper} style={{ textAlign: "center", padding: "2rem 0" }}>
        <CheckCircle2 size={56} color="#059669" style={{ margin: "0 auto 16px" }} />
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
          Email Verified!
        </h2>
        <p style={{ color: "#475569", fontSize: "1rem", lineHeight: 1.5, marginBottom: "24px" }}>
          Your account has been successfully verified. Redirecting you to login...
        </p>
        <Link href="/login" className={styles.verifyBtn} style={{ display: "inline-block", textDecoration: "none" }}>
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formHeader}>
        <h2>Check your inbox</h2>
        <p>
          We sent a 6-digit code to <span className={styles.emailHighlight}>{email || "your email"}</span>.
          Enter the code below to verify your account.
        </p>
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

      {resendMessage && (
        <div
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: "#ecfdf5",
            color: "#047857",
            borderRadius: "8px",
            fontSize: "0.875rem",
            marginBottom: "1rem",
            border: "1px solid #a7f3d0",
          }}
        >
          {resendMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.otpInputContainer} onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={styles.otpDigit}
              autoComplete="off"
            />
          ))}
        </div>

        <button
          type="submit"
          className={styles.verifyBtn}
          disabled={isVerifying || otp.join("").length !== 6}
        >
          {isVerifying ? "Verifying Code..." : "Verify Email"}
        </button>
      </form>

      <div className={styles.resendSection}>
        Didn't receive the code?
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || isResending}
          className={styles.resendBtn}
        >
          {countdown > 0 ? `Resend in ${countdown}s` : isResending ? "Sending..." : "Resend Code"}
        </button>
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link
          href="/signup"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#64748b",
            fontSize: "0.9rem",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} /> Back to Sign Up
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthPageLayout
      imagePanelSlot={
        <AuthImagePanel imageSrc="/signup.png" carouselItems={CAROUSEL_ITEMS} />
      }
      formSectionSlot={
        <Suspense fallback={<div>Loading verification...</div>}>
          <VerifyEmailForm />
        </Suspense>
      }
    />
  );
}
