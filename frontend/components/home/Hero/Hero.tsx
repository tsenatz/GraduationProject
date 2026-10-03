import React from "react";
import styles from "./Hero.module.css";
import { Search } from "lucide-react";

export function Hero() {
    return (
        <div className={styles.heroContainer}>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                <h1 className={styles.title}><span>Rentals. Homes.</span><br /><span>Agents. Loans.</span></h1>
                <p className={styles.subtitle}>Discover your perfect place with ERNS.</p>
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Enter an address"
                    />
                    <Search size={24} className={styles.searchIcon} strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );

}