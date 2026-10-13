"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Calendar, Clock, MapPin, Send, Sparkles } from "lucide-react";
import { PropertySnapshot } from "../types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { inboxTranslations } from "../translations";
import styles from "./TourScheduleModal.module.css";

interface TourScheduleModalProps {
  isOpen: boolean;
  property: PropertySnapshot;
  onClose: () => void;
  onSubmitTour: (tourDate: string, tourTime: string, note?: string) => void;
}

export const TourScheduleModal: React.FC<TourScheduleModalProps> = ({
  isOpen,
  property,
  onClose,
  onSubmitTour,
}) => {
  const { isAmharic } = useLanguage();
  const t = inboxTranslations[isAmharic ? "am" : "en"].tourModal;

  // Preset quick dates
  const today = new Date();
  const formatDateOption = (daysOffset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysOffset);
    return {
      iso: d.toISOString().split("T")[0],
      display: d.toLocaleDateString(isAmharic ? "am-ET" : "en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    };
  };

  const quickDates = [
    formatDateOption(1),
    formatDateOption(2),
    formatDateOption(3),
    formatDateOption(5),
  ];

  const [selectedDate, setSelectedDate] = useState(quickDates[0].display);
  const [selectedTime, setSelectedTime] = useState(t.timeOptions[0]);
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitTour(selectedDate, selectedTime, note);
    onClose();
  };

  const displayTitle = (isAmharic && property.titleAm) ? property.titleAm : property.title;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <div className={styles.badge}>
              <Calendar size={14} />
              <span>ERNS Tour Coordinator</span>
            </div>
            <h3 className={styles.title}>{t.modalTitle}</h3>
            <p className={styles.subtitle}>{t.modalSubtitle}</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Compact Property Card */}
        <div className={styles.propertyCard}>
          <div className={styles.propThumbWrapper}>
            <Image
              src={property.imageUrl}
              alt={displayTitle}
              fill
              sizes="70px"
              className={styles.propThumb}
            />
          </div>
          <div className={styles.propInfo}>
            <h4 className={styles.propTitle}>{displayTitle}</h4>
            <div className={styles.propLocation}>
              <MapPin size={12} />
              <span>{property.subCity}, Addis Ababa</span>
            </div>
            <span className={styles.propPrice}>
              ETB {new Intl.NumberFormat("en-US").format(property.priceETB)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Quick Date Select */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Calendar size={15} />
              <span>{t.dateLabel}</span>
            </label>
            <div className={styles.datePills}>
              {quickDates.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.datePill} ${selectedDate === item.display ? styles.datePillActive : ""}`}
                  onClick={() => setSelectedDate(item.display)}
                >
                  {item.display}
                </button>
              ))}
            </div>
          </div>

          {/* Time Window Select */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Clock size={15} />
              <span>{t.timeLabel}</span>
            </label>
            <div className={styles.timeGrid}>
              {t.timeOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.timePill} ${selectedTime === opt ? styles.timePillActive : ""}`}
                  onClick={() => setSelectedTime(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span>{t.noteLabel}</span>
            </label>
            <textarea
              className={styles.textarea}
              rows={2}
              placeholder={t.notePlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              {t.cancelBtn}
            </button>
            <button type="submit" className={styles.submitBtn}>
              <Send size={15} />
              <span>{t.submitBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourScheduleModal;
