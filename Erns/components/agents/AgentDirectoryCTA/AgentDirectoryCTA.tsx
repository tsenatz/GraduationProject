"use client";

import React from "react";
import Link from "next/link";
import { UserPlus, Home } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { agentTranslations } from "../translations";
import styles from "./AgentDirectoryCTA.module.css";

export const AgentDirectoryCTA: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = agentTranslations[isAmharic ? "am" : "en"].cta;

  return (
    <section className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.container}>
        <h2 className={styles.title}>{t.title}</h2>
        <p className={styles.desc}>{t.desc}</p>

        <div className={styles.actions}>
          <Link href="/sell/agent/apply" className={styles.joinBtn}>
            <UserPlus size={18} />
            <span>{t.btnJoin}</span>
          </Link>

          <Link href="/sell/list" className={styles.fsboBtn}>
            <Home size={18} />
            <span>{t.btnListMyself}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AgentDirectoryCTA;
