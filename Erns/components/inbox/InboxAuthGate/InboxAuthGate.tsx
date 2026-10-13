"use client";

import React from "react";
import Link from "next/link";
import {
  Lock,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Compass,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { inboxTranslations } from "../translations";
import styles from "./InboxAuthGate.module.css";

interface InboxAuthGateProps {
  onEnableDemo: () => void;
}

export const InboxAuthGate: React.FC<InboxAuthGateProps> = ({ onEnableDemo }) => {
  const { isAmharic } = useLanguage();
  const t = inboxTranslations[isAmharic ? "am" : "en"].authGate;

  const featureIcons = [ShieldCheck, Calendar, Compass];

  return (
    <div className={styles.gateWrapper}>
      <div className={styles.gateCard}>
        {/* Top Hero Icon Badge */}
        <div className={styles.iconCluster}>
          <div className={styles.iconCirclePrimary}>
            <MessageSquare size={28} />
          </div>
          <div className={styles.iconBadgeLock}>
            <Lock size={14} />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>

        {/* Value Prop Feature Cards */}
        <div className={styles.featuresList}>
          {t.features.map((feature, idx) => {
            const Icon = featureIcons[idx] || ShieldCheck;
            return (
              <div key={idx} className={styles.featureItem}>
                <div className={styles.featureIconBox}>
                  <Icon size={18} />
                </div>
                <div className={styles.featureText}>
                  <h4 className={styles.featureTitle}>{feature.title}</h4>
                  <p className={styles.featureDesc}>{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Auth Actions */}
        <div className={styles.actionsGroup}>
          <Link
            href="/login?callbackUrl=/inbox"
            className={styles.primarySignInBtn}
          >
            <span>{t.signInBtn}</span>
            <ArrowRight size={17} />
          </Link>

          <div className={styles.signUpPrompt}>
            <span>{t.signUpText}</span>{" "}
            <Link
              href="/signup?callbackUrl=/inbox"
              className={styles.signUpLink}
            >
              {t.signUpBtn}
            </Link>
          </div>
        </div>

        {/* Demo Mode Option */}
        <div className={styles.demoDivider}>
          <div className={styles.demoDividerLine} />
          <span className={styles.demoDividerText}>{t.demoNote}</span>
          <div className={styles.demoDividerLine} />
        </div>

        <button
          type="button"
          className={styles.demoBtn}
          onClick={onEnableDemo}
        >
          <Sparkles size={16} />
          <span>{t.demoBtn}</span>
        </button>
      </div>
    </div>
  );
};

export default InboxAuthGate;
