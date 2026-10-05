import React from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span>Rentals. Homes.</span>
          <br />
          <span>Agents. Loans.</span>
        </h1>
        <p className={styles.subtitle}>Discover your perfect place with ERNS.</p>
        <SearchBar
          placeholder="Enter an address"
          wrapperClassName={styles.searchWrapper}
          inputClassName={styles.searchInput}
          iconClassName={styles.searchIcon}
        />
      </div>
    </div>
  );
}