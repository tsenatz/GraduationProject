"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import styles from "./AuthImagePanel.module.css";

export interface CarouselItem {
  title: string;
  desc: React.ReactNode;
}

interface AuthImagePanelProps {
  imageSrc: string;
  imageAlt?: string;
  carouselItems: CarouselItem[];
}

/**
 * Left panel used on auth pages (login / signup).
 * Renders a full-bleed background image with an animated text carousel.
 */
export function AuthImagePanel({
  imageSrc,
  imageAlt = "Property background",
  carouselItems,
}: AuthImagePanelProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  return (
    <>
      <div className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.imageOverlay} />

      <Link href="/" className={styles.logoArea}>
        <div className={styles.logoIcon}>
          <Home size={20} strokeWidth={2.5} />
        </div>
        <span className={styles.logoText}>ERNS</span>
      </Link>

      <div className={styles.imageContent}>
        <div className={styles.textContent} key={currentSlide}>
          <h2>{carouselItems[currentSlide].title}</h2>
          <p>{carouselItems[currentSlide].desc}</p>
        </div>
        <div className={styles.dots}>
          {carouselItems.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${currentSlide === index ? styles.active : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
