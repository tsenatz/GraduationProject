import React from 'react';
import styles from './Services.module.css';

export function Services() {
  return (
    <section className={styles.container}>
      <div className={styles.cardsWrapper}>
        {/* Buy a home */}
        <div className={styles.card}>
          <img
            className={styles.cardImage}
            src="/buy-house.jpg"
            alt="Buy a house illustration"
          />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Buy a home</h3>
            <p className={styles.cardDescription}>
              A real estate agent can provide you with a clear breakdown of costs so that you can avoid surprise expenses.
            </p>
            <button className={styles.cardButton}>Find a local agent</button>
          </div>
        </div>

        {/* Sell a home */}
        <div className={styles.card}>
          <img
            className={styles.cardImage}
            src="/sell-house.jpg"
            alt="Sell a house illustration"
          />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Sell a home</h3>
            <p className={styles.cardDescription}>
              No matter what path you take to sell your home, we can help you navigate a successful sale.
            </p>
            <button className={styles.cardButton}>See your options</button>
          </div>
        </div>

        {/* Rent a home */}
        <div className={styles.card}>
          <img
            className={styles.cardImage}
            src="/rent-house.jpg"
            alt="Rent a house illustration"
          />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Rent a home</h3>
            <p className={styles.cardDescription}>
              We're creating a seamless online experience – from shopping on the largest rental network, to applying, to paying rent.
            </p>
            <button className={styles.cardButton}>Find rentals</button>
          </div>
        </div>
      </div>
    </section>
  );
}
