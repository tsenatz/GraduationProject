import Image from "next/image";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick?: () => void;
}

/**
 * A single service offering card used on the home page (Buy / Sell / Rent).
 */
export function ServiceCard({
  imageSrc,
  imageAlt,
  title,
  description,
  buttonLabel,
  onButtonClick,
}: ServiceCardProps) {
  return (
    <div className={styles.card}>
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
        <button className={styles.cardButton} onClick={onButtonClick}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
