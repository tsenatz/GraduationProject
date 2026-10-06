"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Send } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { agentTranslations } from "../translations";
import { Agent } from "../types";
import styles from "./AgentContactModal.module.css";

interface AgentContactModalProps {
  agent: Agent | null;
  onClose: () => void;
}

export const AgentContactModal: React.FC<AgentContactModalProps> = ({
  agent,
  onClose,
}) => {
  const { isAmharic } = useLanguage();
  const t = agentTranslations[isAmharic ? "am" : "en"].modal;

  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userSubCity, setUserSubCity] = useState("Bole");
  const [userMessage, setUserMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  if (!agent) return null;

  const displayName = isAmharic ? agent.nameAm : agent.name;
  const displayAgency = isAmharic ? agent.agencyAm : agent.agency;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <img src={agent.photoUrl} alt={displayName} className={styles.avatar} />
            <div>
              <h3 className={styles.modalTitle}>
                {t.title.replace("{name}", displayName)}
              </h3>
              <p className={styles.modalSubtitle}>
                {t.subtitle.replace("{agency}", displayAgency)}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {isSent ? (
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={36} />
            </div>
            <h4 className={styles.successTitle}>{t.successTitle}</h4>
            <p className={styles.successDesc}>
              {t.successDesc.replace("{name}", displayName)}
            </p>
            <button
              type="button"
              className={styles.submitBtn}
              onClick={onClose}
              style={{ width: "160px" }}
            >
              {t.btnClose}
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t.nameLabel}</label>
              <input
                type="text"
                className={styles.input}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                placeholder="e.g. Almaz Bekele"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t.phoneLabel}</label>
              <input
                type="tel"
                className={styles.input}
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                required
                placeholder="911234567"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t.emailLabel}</label>
              <input
                type="email"
                className={styles.input}
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t.propertyLocationLabel}</label>
              <input
                type="text"
                className={styles.input}
                value={userSubCity}
                onChange={(e) => setUserSubCity(e.target.value)}
                placeholder="e.g. Bole, CMC, Kazanchis"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t.messageLabel}</label>
              <textarea
                className={styles.textarea}
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={t.messagePlaceholder}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <Send size={16} style={{ display: "inline", marginRight: "8px" }} />
              {t.btnSend}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AgentContactModal;
