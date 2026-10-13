import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  buttonLabel: string;
  href?: string;
  onButtonClick?: () => void;
}

/**
 * A single service offering card used on the home page (Buy / Rent / Sell).
 */
export function ServiceCard({
  imageSrc,
  imageAlt,
  title,
  description,
  buttonLabel,
  href,
  onButtonClick,
}: ServiceCardProps) {
  const CardInner = (
    <>
      <Image
        className={styles.cardImage}
        src={imageSrc}
        alt={imageAlt}
        width={280}
        height={200}
      />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
        <span className={styles.cardButton}>{buttonLabel}</span>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${styles.card} ${styles.cardLink}`}>
        {CardInner}
      </Link>
    );
  }

  return (
    <div className={styles.card} onClick={onButtonClick}>
      {CardInner}
    </div>
  );
}
