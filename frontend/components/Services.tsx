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
          <h3 className={styles.cardTitle}>Buy a house</h3>
          <p className={styles.cardDescription}>
            Find your place with an immersive photo experience and the most listings, including things you won't find anywhere else.
          </p>
          <button className={styles.cardButton}>Search houses</button>
        </div>

        {/* Sell a home */}
        <div className={styles.card}>
          <img
            className={styles.cardImage}
            src="/sell-house.jpg"
            alt="Sell a house illustration"
          />
          <h3 className={styles.cardTitle}>Sell a house</h3>
          <p className={styles.cardDescription}>
            No matter what path you take to sell your house, we can help you navigate a successful sale.
          </p>
          <button className={styles.cardButton}>See your options</button>
        </div>

        {/* Rent a home */}
        <div className={styles.card}>
          <img
            className={styles.cardImage}
            src="/rent-house.jpg"
            alt="Rent a house illustration"
          />
          <h3 className={styles.cardTitle}>Rent a house</h3>
          <p className={styles.cardDescription}>
            We're creating a seamless online experience – from shopping on the largest rental network, to applying, to paying rent.
          </p>
          <button className={styles.cardButton}>Find rentals</button>
        </div>
      </div>
    </section>
  );
}
