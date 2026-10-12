"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Star } from "lucide-react";
import { Conversation } from "../types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { inboxTranslations } from "../translations";
import styles from "./ConversationItem.module.css";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleStar: (id: string, e: React.MouseEvent) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  onToggleStar,
}) => {
  const { isAmharic } = useLanguage();
  const t = inboxTranslations[isAmharic ? "am" : "en"];

  const participant = conversation.participant;
  const property = conversation.property;
  const lastMsg = conversation.messages[conversation.messages.length - 1];

  const displayName =
    isAmharic && participant.nameAm ? participant.nameAm : participant.name;
  const displayPropTitle =
    isAmharic && property.titleAm ? property.titleAm : property.title;

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();

      if (isToday) {
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return d.toLocaleDateString(isAmharic ? "am-ET" : "en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getRoleLabel = () => {
    if (participant.role === "agent") return isAmharic ? "ወኪል" : "Agent";
    if (participant.role === "buyer") return isAmharic ? "ገዢ" : "Buyer";
    if (participant.role === "renter") return isAmharic ? "ተከራይ" : "Tenant";
    return isAmharic ? "ባለቤት" : "Owner";
  };

  const getCatBadgeClass = () => {
    switch (conversation.category) {
      case "buy":
        return styles.catBadgeBuy;
      case "rent":
        return styles.catBadgeRent;
      case "sell":
        return styles.catBadgeSell;
      case "landlord":
        return styles.catBadgeLandlord;
      default:
        return styles.catBadgeBuy;
    }
  };

  const getCatBadgeText = () => {
    return t.categoryBadges[conversation.category] || conversation.category;
  };

  const getFormattedPrice = () => {
    const formatted = new Intl.NumberFormat("en-US").format(property.priceETB);
    if (property.listingType === "rent") {
      return `ETB ${formatted}${isAmharic ? "/ወር" : "/mo"}`;
    }
    return `ETB ${formatted}`;
  };

  const getSnippet = () => {
    if (!lastMsg) return "";
    const prefix =
      lastMsg.senderId === "current-user" ? t.conversationList.youPrefix : "";
    if (lastMsg.type === "tour_request") {
      return `${prefix}🗓️ Tour Requested (${lastMsg.metadata?.tourDate || ""})`;
    }
    if (lastMsg.type === "attachment") {
      return `${prefix}📎 ${lastMsg.metadata?.fileName || "Document attached"}`;
    }
    return `${prefix}${lastMsg.content}`;
  };

  return (
    <div
      className={`${styles.itemCard} ${isSelected ? styles.itemCardSelected : ""} ${
        conversation.unreadCount > 0 ? styles.itemCardUnread : ""
      }`}
      onClick={() => onSelect(conversation.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(conversation.id);
        }
      }}
    >
      {/* Participant Avatar */}
      <div className={styles.avatarWrapper}>
        <Image
          src={participant.avatar}
          alt={displayName}
          width={46}
          height={46}
          className={styles.avatar}
        />
        {participant.isVerified && (
          <span className={styles.verifiedIcon} title="Verified">
            <ShieldCheck size={11} />
          </span>
        )}
      </div>

      {/* Main Conversation Details */}
      <div className={styles.contentCol}>
        <div className={styles.topRow}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{displayName}</span>
            <span className={styles.roleBadge}>{getRoleLabel()}</span>
            <span className={`${styles.catBadge} ${getCatBadgeClass()}`}>
              {getCatBadgeText()}
            </span>
          </div>

          <div className={styles.rightMeta}>
            <span className={styles.time}>
              {formatTimestamp(conversation.lastMessageAt)}
            </span>
            <button
              type="button"
              className={`${styles.starBtn} ${
                conversation.isStarred ? styles.starred : ""
              }`}
              onClick={(e) => onToggleStar(conversation.id, e)}
              title={
                conversation.isStarred
                  ? t.conversationList.unstar
                  : t.conversationList.star
              }
            >
              <Star
                size={14}
                fill={conversation.isStarred ? "#f59e0b" : "none"}
              />
            </button>
          </div>
        </div>

        {/* Property Reference Chip */}
        <div className={styles.propertyChip}>
          <div className={styles.propThumbMini}>
            <Image
              src={property.imageUrl}
              alt={displayPropTitle}
              fill
              sizes="22px"
              className={styles.propThumbImg}
            />
          </div>
          <span className={styles.propTitleText}>{displayPropTitle}</span>
          <span className={styles.propPriceText}>{getFormattedPrice()}</span>
        </div>

        {/* Last Message Snippet */}
        <div className={styles.bottomRow}>
          <p className={styles.snippet}>{getSnippet()}</p>
          {conversation.unreadCount > 0 && (
            <span className={styles.unreadBadge}>{conversation.unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
