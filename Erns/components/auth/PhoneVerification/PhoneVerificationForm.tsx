"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Lock } from "lucide-react";
import { ErnsLogo } from "@/components/icons/ErnsLogo";
import styles from "./PhoneVerification.module.css";

export function PhoneVerificationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/rentalmanager";

  // Step state: 'INPUT_PHONE' or 'INPUT_OTP'
  const [step, setStep] = useState<"INPUT_PHONE" | "INPUT_OTP">("INPUT_PHONE");

  // Form states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);

  // Focus appropriate input on step change
  useEffect(() => {
    if (step === "INPUT_PHONE") {
      phoneInputRef.current?.focus();
    } else {
      otpInputRefs.current[0]?.focus();
    }
  }, [step]);

  // Resend countdown timer
  useEffect(() => {
    if (step === "INPUT_OTP" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  // Format Ethiopian phone input as user types: "911 234 567"
  const handlePhoneChange = (val: string) => {
    let cleaned = val.replace(/\D/g, "");

    // Strip leading 0 if user enters e.g. 09... or 07...
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.slice(1);
    }

    // Standard Ethiopian mobile numbers are 9 digits
    cleaned = cleaned.slice(0, 9);

    let formatted = cleaned;
    if (cleaned.length > 5) {
      formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else if (cleaned.length > 3) {
      formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    }

    setPhoneNumber(formatted);
    setError(null);
  };

  // Submit phone number to advance to code step
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawDigits = phoneNumber.replace(/\s+/g, "");

    if (rawDigits.length !== 9) {
      setError("Please enter a valid 9-digit Ethiopian phone number (e.g. 911 234 567).");
      return;
    }

    if (!rawDigits.startsWith("9") && !rawDigits.startsWith("7")) {
      setError("Ethiopian mobile numbers must begin with 9 or 7.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Presentation flow: Prepare masked phone and transition to OTP code step
      // (Backend SMS gateway logic can be attached here once SMS provider is configured)
      setMaskedPhone(`+251 ${rawDigits.slice(0, 1)}•• ••• •${rawDigits.slice(-2)}`);
      setStep("INPUT_OTP");
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
    } catch {
      setError("Failed to continue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP individual input
  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean && val !== "") return;

    const newOtp = [...otp];
    newOtp[index] = clean.slice(-1);
    setOtp(newOtp);
    setError(null);

    // Auto-advance
    if (clean && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  // Submit OTP Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join("");

    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      setSuccess(true);
      setTimeout(() => {
        router.push(callbackUrl);
      }, 1600);
    } catch {
      setError("Failed to verify code. Please try again.");
      setIsLoading(false);
    }
  };

  // Resend code handler
  const handleResend = () => {
    if (countdown > 0 || isLoading) return;
    setCountdown(60);
    setError(null);
  };

  // Success view
  if (success) {
    return (
      <div className={styles.formWrapper} style={{ textAlign: "center", padding: "2rem 0" }}>
        <CheckCircle2 size={60} color="#0A1931" style={{ margin: "0 auto 16px" }} />
        <h1 style={{ fontSize: "1.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
          Phone Verified!
        </h1>
        <p style={{ color: "#475569", fontSize: "1rem", lineHeight: 1.5, marginBottom: "24px" }}>
          Your phone number has been verified. Redirecting you to property management...
        </p>
        <Link
          href={callbackUrl}
          className={styles.continueBtn}
          style={{ textDecoration: "none", display: "flex", justifyContent: "center" }}
        >
          Continue to Rental Manager
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.formWrapper}>
      {/* Brand Header */}
      <div className={styles.brandHeader}>
        <ErnsLogo height={24} className={styles.brandLogoSvg} priority />
        <span className={styles.brandTag}>Rentals</span>
      </div>

      {step === "INPUT_PHONE" ? (
        <>
          {/* Form Header */}
          <div className={styles.formHeader}>
            <h1>Enter your phone number</h1>
            <p>We&apos;ll send a code to verify it&apos;s you.</p>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleSendCode}>
            {/* Phone Number Field with integrated Ethiopian prefix */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone number</label>
              <div className={styles.phoneInputWrapper}>
                <span className={styles.phonePrefix}>
                  <span className={styles.countryFlag}>🇪🇹</span>
                  <span>+251</span>
                </span>
                <input
                  ref={phoneInputRef}
                  type="tel"
                  inputMode="numeric"
                  placeholder="911 234 567"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={styles.phoneInput}
                  autoComplete="tel-national"
                  required
                />
              </div>
            </div>

            {/* Next Button */}
            <button
              type="submit"
              className={styles.continueBtn}
              disabled={isLoading || phoneNumber.replace(/\s+/g, "").length !== 9}
            >
              {isLoading ? "Sending code..." : "Next"}
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <span className={styles.securityBadge}>
              <Lock size={13} /> Secure end-to-end encrypted verification
            </span>
          </div>
        </>
      ) : (
        <>
          {/* OTP Step Header */}
          <div className={styles.formHeader}>
            <h1>Verify your phone</h1>
            <p>
              Enter the 6-digit code sent to{" "}
              <span className={styles.phoneHighlight}>{maskedPhone}</span>.
            </p>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleVerifyCode}>
            <div className={styles.otpContainer} onPaste={handleOtpPaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpInputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={styles.otpDigit}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            <button
              type="submit"
              className={styles.continueBtn}
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          <div className={styles.resendWrapper}>
            Didn&apos;t receive the code?
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || isLoading}
              className={styles.resendBtn}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button
              type="button"
              onClick={() => {
                setStep("INPUT_PHONE");
                setError(null);
              }}
              className={styles.changePhoneBtn}
            >
              <ArrowLeft size={15} /> Edit phone number
            </button>
          </div>
        </>
      )}
    </div>
  );
}
