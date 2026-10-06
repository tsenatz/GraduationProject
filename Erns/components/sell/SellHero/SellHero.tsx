"use client";

import Image from "next/image";
import { ArrowDown, Sparkles } from "lucide-react";
import { useSellLanguage } from "../LanguageContext";
import styles from "./SellHero.module.css";

export function SellHero() {
  const { t } = useSellLanguage();

  const handleScrollToOptions = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("selling-options");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.heroContainer} aria-label="Sell your home banner">
      <Image
        src="/sell-house.jpg"
        alt="Real estate in Ethiopia"
        fill
        priority
        className={styles.heroImage}
      />
      <div className={styles.heroOverlay} />

      <div className={styles.heroContent}>
        <div className={styles.badge}>
          <Sparkles size={16} aria-hidden="true" />
          <span>{t.hero.badge}</span>
        </div>

        <h1 className={styles.title}>{t.hero.title}</h1>

        <p className={styles.subtitle}>{t.hero.subtitle}</p>

        <a
          href="#selling-options"
          onClick={handleScrollToOptions}
          className={styles.ctaButton}
        >
          <span>{t.hero.seeOptions}</span>
          <ArrowDown size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
