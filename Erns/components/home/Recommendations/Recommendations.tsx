import React from "react";
import Image from "next/image";
import styles from "./Recommendations.module.css";
import { PiggyBank, MapPin } from "lucide-react";

export function Recommendations() {
  return (
    <section className={styles.container}>
      <div className={styles.textSection}>
        <h2 className={styles.title}>Recommendations underway</h2>
        <p className={styles.subtitle}>
          Search and save a few homes you like and we'll find recommendations for you.
        </p>
      </div>

      <div className={styles.graphicSection}>
        <div className={styles.cardStack}>
          {/* Badge 1 */}
          <div className={`${styles.badge} ${styles.badge1}`}>
            <div className={styles.badgeIcon}>
              <PiggyBank size={20} />
            </div>
            <div className={styles.badgeText}>
              <span className={styles.badgeTitle}>Recommended homes</span>
              <span className={styles.badgeSubtitle}>based on your monthly budget</span>
            </div>
          </div>

          {/* Badge 2 */}
          <div className={`${styles.badge} ${styles.badge2}`}>
            <div className={styles.badgeIcon}>
              <MapPin size={20} />
            </div>
            <div className={styles.badgeText}>
              <span className={styles.badgeTitle}>Recommended homes</span>
              <span className={styles.badgeSubtitle}>based on your preferred location</span>
            </div>
          </div>

          {/* Cards */}
          <div className={`${styles.card} ${styles.card1}`}></div>
          <div className={`${styles.card} ${styles.card2}`}></div>
          <div className={`${styles.card} ${styles.card3}`}>
            <Image 
              src="/recommendations.png" 
              alt="Recommendations map preview" 
              fill 
              style={{ objectFit: 'cover' }}
              className={styles.cardImage} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
