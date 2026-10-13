"use client";

import React from "react";
import Link from "next/link";
import {
  MessageSquareOff,
  Search,
  ShoppingBag,
  Key,
  Tag,
  Building2,
} from "lucide-react";
import { Conversation, MainPerspective, SubFolder } from "../types";
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
  activePerspective?: MainPerspective;
  activeFolder?: SubFolder;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  onToggleStar,
  hasSearchQuery,
  activePerspective = "buying_renting",
  activeFolder = "all",
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

  // When viewing "All" without search, group conversations by character section
  const shouldGroup = activeFolder === "all" && !hasSearchQuery;

  if (shouldGroup) {
    const isBuyPerspective = activePerspective === "buying_renting";
    const saleCategory = isBuyPerspective ? "buy" : "sell";
    const rentCategory = isBuyPerspective ? "rent" : "landlord";

    const saleConvs = conversations.filter((c) => c.category === saleCategory);
    const rentConvs = conversations.filter((c) => c.category === rentCategory);
    const otherConvs = conversations.filter(
      (c) => c.category !== saleCategory && c.category !== rentCategory
    );

    const saleTitle =
      t.sections[isBuyPerspective ? "buying_sale" : "selling_sale"];
    const rentTitle =
      t.sections[isBuyPerspective ? "buying_rent" : "selling_rent"];

    const SaleIcon = isBuyPerspective ? ShoppingBag : Tag;
    const RentIcon = isBuyPerspective ? Key : Building2;

    return (
      <div className={styles.listContainer}>
        {/* Sale Section */}
        {saleConvs.length > 0 && (
          <div className={styles.sectionGroup}>
            <div className={styles.sectionDivider}>
              <div className={styles.sectionDividerHeader}>
                <div className={styles.sectionTitleGroup}>
                  <SaleIcon size={13} className={styles.sectionIcon} />
                  <span className={styles.sectionTitle}>{saleTitle}</span>
                </div>
                <span className={styles.sectionBadge}>{saleConvs.length}</span>
              </div>
            </div>
            {saleConvs.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedId === conv.id}
                onSelect={onSelect}
                onToggleStar={onToggleStar}
              />
            ))}
          </div>
        )}

        {/* Rent Section */}
        {rentConvs.length > 0 && (
          <div className={styles.sectionGroup}>
            <div className={styles.sectionDivider}>
              <div className={styles.sectionDividerHeader}>
                <div className={styles.sectionTitleGroup}>
                  <RentIcon size={13} className={styles.sectionIcon} />
                  <span className={styles.sectionTitle}>{rentTitle}</span>
                </div>
                <span className={styles.sectionBadge}>{rentConvs.length}</span>
              </div>
            </div>
            {rentConvs.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedId === conv.id}
                onSelect={onSelect}
                onToggleStar={onToggleStar}
              />
            ))}
          </div>
        )}

        {/* Other / Direct Section if any */}
        {otherConvs.length > 0 && (
          <div className={styles.sectionGroup}>
            <div className={styles.sectionDivider}>
              <div className={styles.sectionDividerHeader}>
                <span className={styles.sectionTitle}>{t.sections.other}</span>
                <span className={styles.sectionBadge}>{otherConvs.length}</span>
              </div>
            </div>
            {otherConvs.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedId === conv.id}
                onSelect={onSelect}
                onToggleStar={onToggleStar}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Filtered folder or active search query: render flat list
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
