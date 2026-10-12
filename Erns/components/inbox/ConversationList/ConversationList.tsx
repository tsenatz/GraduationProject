"use client";

import React from "react";
import Link from "next/link";
import { MessageSquareOff, Search } from "lucide-react";
import { Conversation } from "../types";
import { ConversationItem } from "../ConversationItem/ConversationItem";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { inboxTranslations } from "../translations";
import styles from "./ConversationList.module.css";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleStar: (id: string, e: React.MouseEvent) => void;
  hasSearchQuery: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  onToggleStar,
  hasSearchQuery,
}) => {
  const { isAmharic } = useLanguage();
  const t = inboxTranslations[isAmharic ? "am" : "en"].conversationList;

  if (conversations.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIconCircle}>
          {hasSearchQuery ? <Search size={28} /> : <MessageSquareOff size={28} />}
        </div>
        <h4 className={styles.emptyTitle}>
          {hasSearchQuery ? t.emptySearch : t.emptyAll}
        </h4>
        <p className={styles.emptyDesc}>{t.emptyAllDesc}</p>
        <Link href="/search" className={styles.browseBtn}>
          {t.browseHomesBtn}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isSelected={selectedId === conv.id}
          onSelect={onSelect}
          onToggleStar={onToggleStar}
        />
      ))}
    </div>
  );
};

export default ConversationList;
