"use client";

import { Suspense } from "react";
import Image from "next/image";
import { PhoneVerificationForm } from "./PhoneVerificationForm";
import styles from "./PhoneVerification.module.css";

export function PhoneVerificationPanel() {
  return (
    <div className={styles.container}>
      {/* LEFT FORM PANEL */}
      <section className={styles.formSide}>
        <Suspense fallback={<div style={{ padding: "40px" }}>Loading verification...</div>}>
          <PhoneVerificationForm />
        </Suspense>
      </section>

      {/* RIGHT HERO PANEL */}
      <aside className={styles.heroSide}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>
            It&apos;s easier than ever
            <br />
            to be a landlord
          </h2>
          <p className={styles.heroSubtitle}>
            Save time with our property management tools that help you get what
            you need — signed leases and rent payments.
          </p>
          <div className={styles.illustrationCard}>
            <Image
              src="/landlord-house.png"
              alt="Architectural House Illustration"
              width={520}
              height={520}
              priority
              className={styles.illustrationImage}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
