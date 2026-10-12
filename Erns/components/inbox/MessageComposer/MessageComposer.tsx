"use client";

import React, { useState, useRef } from "react";
import { Send, Calendar, Paperclip, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { inboxTranslations } from "../translations";
import styles from "./MessageComposer.module.css";

interface MessageComposerProps {
  onSendMessage: (text: string) => void;
  onOpenTourModal: () => void;
  onAttachFile: (file: { name: string; size: string; url: string }) => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  onOpenTourModal,
  onAttachFile,
}) => {
  const { isAmharic } = useLanguage();
  const t = inboxTranslations[isAmharic ? "am" : "en"].chatThread;

  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      onAttachFile({
        name: file.name,
        size: `${sizeMb} MB`,
        url: URL.createObjectURL(file),
      });
      e.target.value = "";
    }
  };

  return (
    <div className={styles.composerWrapper}>
      {/* Zillow-Style Quick Prompts Pills */}
      <div className={styles.quickPromptsBar}>
        <div className={styles.promptsHeader}>
          <Sparkles size={13} className={styles.promptsIcon} />
          <span>{t.quickPromptsTitle}</span>
        </div>
        <div className={styles.promptsList}>
          {t.quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.promptPill}
              onClick={() => handlePromptClick(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Composer Input Area */}
      <div className={styles.inputBox}>
        <textarea
          className={styles.textarea}
          rows={2}
          placeholder={t.typeMessagePlaceholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className={styles.actionsBar}>
          <div className={styles.leftTools}>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={onOpenTourModal}
              title={t.scheduleTourBtn}
            >
              <Calendar size={17} />
              <span>{t.scheduleTourBtn}</span>
            </button>

            <button
              type="button"
              className={styles.toolBtnIconOnly}
              onClick={() => fileInputRef.current?.click()}
              title={t.attachFileBtn}
            >
              <Paperclip size={17} />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          <button
            type="button"
            className={`${styles.sendBtn} ${text.trim() ? styles.sendBtnActive : ""}`}
            onClick={handleSend}
            disabled={!text.trim()}
            aria-label={t.sendBtn}
          >
            <Send size={16} />
            <span>{t.sendBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
