"use client";

import React from "react";
import { ServiceCard } from "@/components/home/ServiceCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { serviceTranslations } from "./translations";
import styles from "./Services.module.css";

export function Services() {
  const { language } = useLanguage();
  const t = serviceTranslations[language] || serviceTranslations.en;

  const serviceItems = [
    {
      imageSrc: "/buy-home-professional.jpg",
      imageAlt: t.buy.title,
      title: t.buy.title,
      description: t.buy.description,
      buttonLabel: t.buy.buttonLabel,
      href: "/agents",
    },
    {
      imageSrc: "/rent-home-professional.jpg",
      imageAlt: t.rent.title,
      title: t.rent.title,
      description: t.rent.description,
      buttonLabel: t.rent.buttonLabel,
      href: "/search?status=FOR_RENT",
    },
    {
      imageSrc: "/sell-home-professional.jpg",
      imageAlt: t.sell.title,
      title: t.sell.title,
      description: t.sell.description,
      buttonLabel: t.sell.buttonLabel,
      href: "/sell",
    },
  ];

  return (
    <section className={styles.container}>
      <div className={styles.cardsWrapper}>
        {serviceItems.map((item) => (
          <ServiceCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
