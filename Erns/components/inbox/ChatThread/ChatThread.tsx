"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Phone,
  ShieldCheck,
  Check,
  CheckCheck,
  Calendar,
  FileText,
  Download,
  Archive,
  Trash2,
  Star,
  Clock,
} from "lucide-react";
import { Conversation, Message } from "../types";
import { PropertySnapshot } from "../PropertySnapshot/PropertySnapshot";
import { MessageComposer } from "../MessageComposer/MessageComposer";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { inboxTranslations } from "../translations";
import styles from "./ChatThread.module.css";

interface ChatThreadProps {
  conversation: Conversation;
  isTyping?: boolean;
  onBackToList: () => void;
  onSendMessage: (text: string) => void;
  onOpenTourModal: () => void;
  onAttachFile: (file: { name: string; size: string; url: string }) => void;
  onToggleArchive: (convId: string) => void;
  onDeleteConversation: (convId: string) => void;
  onToggleStar: (convId: string) => void;
  onConfirmTour?: (convId: string, messageId: string) => void;
}

export const ChatThread: React.FC<ChatThreadProps> = ({
  conversation,
  isTyping,
  onBackToList,
  onSendMessage,
  onOpenTourModal,
  onAttachFile,
  onToggleArchive,
  onDeleteConversation,
  onToggleStar,
  onConfirmTour,
}) => {
  const { isAmharic } = useLanguage();
  const t = inboxTranslations[isAmharic ? "am" : "en"].chatThread;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const participant = conversation.participant;
  const displayName =
    isAmharic && participant.nameAm ? participant.nameAm : participant.name;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages, isTyping]);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const getParticipantBadge = () => {
    if (participant.role === "agent") return t.verifiedAgentBadge;
    if (participant.role === "owner") return t.verifiedOwnerBadge;
    if (participant.role === "buyer") return t.verifiedBuyerBadge;
    if (participant.role === "renter") return t.verifiedApplicantBadge;
    return t.verifiedAgentBadge;
  };

  const isSellerOrLandlord =
    conversation.userPerspective === "seller" ||
    conversation.userPerspective === "landlord";

  return (
    <div className={styles.threadContainer}>
      {/* Thread Header */}
      <div className={styles.threadHeader}>
        <div className={styles.leftInfo}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={onBackToList}
            aria-label={t.backToListBtn}
          >
            <ChevronLeft size={20} />
          </button>

          <div className={styles.avatarWrapper}>
            <Image
              src={participant.avatar}
              alt={displayName}
              width={44}
              height={44}
              className={styles.avatar}
            />
            <span className={styles.onlineBadge} />
          </div>

          <div className={styles.nameBlock}>
            <div className={styles.nameRow}>
              <h3 className={styles.name}>{displayName}</h3>
              {participant.isVerified && (
                <span className={styles.verifiedBadge}>
                  <ShieldCheck size={13} />
                  <span>{getParticipantBadge()}</span>
                </span>
              )}
            </div>
            <div className={styles.subText}>
              <span>{participant.company || "ERNS Real Estate Network"}</span>
              {participant.responseRate && (
                <>
                  <span className={styles.dot}>•</span>
                  <span className={styles.rate}>{participant.responseRate}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className={styles.headerActions}>
          {participant.phone && (
            <a
              href={`tel:${participant.phone}`}
              className={styles.callBtn}
              title={`${t.callDirect}: ${participant.phone}`}
            >
              <Phone size={14} />
              <span>{t.callDirect}</span>
            </a>
          )}

          <button
            type="button"
            className={`${styles.iconBtn} ${
              conversation.isStarred ? styles.starred : ""
            }`}
            onClick={() => onToggleStar(conversation.id)}
            title="Star conversation"
          >
            <Star
              size={16}
              fill={conversation.isStarred ? "#f59e0b" : "none"}
            />
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onToggleArchive(conversation.id)}
            title={conversation.isArchived ? "Unarchive" : "Archive"}
          >
            <Archive size={16} />
          </button>

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.danger}`}
            onClick={() => onDeleteConversation(conversation.id)}
            title="Delete conversation"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Pinned Property Snapshot Banner */}
      <PropertySnapshot property={conversation.property} />

      {/* Messages Scroll Area */}
      <div className={styles.messagesArea}>
        <div className={styles.dateBadge}>
          <span>{inboxTranslations[isAmharic ? "am" : "en"].time.today}</span>
        </div>

        {conversation.messages.map((msg) => {
          const isCurrentUser = msg.senderId === "current-user";
          const isTourPending =
            msg.type === "tour_request" && msg.metadata?.tourStatus === "pending";

          return (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${
                isCurrentUser ? styles.rowOutgoing : styles.rowIncoming
              }`}
            >
              {!isCurrentUser && (
                <div className={styles.msgAvatarWrapper}>
                  <Image
                    src={participant.avatar}
                    alt={displayName}
                    width={28}
                    height={28}
                    className={styles.msgAvatar}
                  />
                </div>
              )}

              <div
                className={`${styles.bubble} ${
                  isCurrentUser ? styles.bubbleOutgoing : styles.bubbleIncoming
                }`}
              >
                {/* Special Tour Request Message Card */}
                {msg.type === "tour_request" && (
                  <div className={styles.tourCard}>
                    <div className={styles.tourCardHeader}>
                      <Calendar size={18} className={styles.tourCardIcon} />
                      <h4>{t.tourCard.title}</h4>
                    </div>
                    <div className={styles.tourDetails}>
                      <div>
                        <span className={styles.tourLabel}>
                          {t.tourCard.dateLabel}:{" "}
                        </span>
                        <strong>
                          {msg.metadata?.tourDate || "Upcoming Date"}
                        </strong>
                      </div>
                      <div>
                        <span className={styles.tourLabel}>
                          {t.tourCard.timeLabel}:{" "}
                        </span>
                        <strong>{msg.metadata?.tourTime || "Morning"}</strong>
                      </div>
                    </div>

                    {msg.metadata?.tourStatus === "confirmed" ? (
                      <div className={styles.tourStatusBadge}>
                        <ShieldCheck size={14} />
                        <span>{t.tourCard.statusConfirmed}</span>
                      </div>
                    ) : (
                      <div className={styles.tourPendingBadge}>
                        <Clock size={14} />
                        <span>{t.tourCard.statusPending}</span>
                      </div>
                    )}

                    {/* If current user is the Seller/Landlord and tour is pending, show confirmation actions */}
                    {isSellerOrLandlord && isTourPending && (
                      <div className={styles.tourActionBtns}>
                        <button
                          type="button"
                          className={styles.confirmTourBtn}
                          onClick={() => onConfirmTour?.(conversation.id, msg.id)}
                        >
                          {t.tourCard.confirmBtn}
                        </button>
                        <button
                          type="button"
                          className={styles.rescheduleTourBtn}
                          onClick={onOpenTourModal}
                        >
                          {t.tourCard.rescheduleBtn}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Special Attachment Card */}
                {msg.type === "attachment" && (
                  <div className={styles.attachmentCard}>
                    <div className={styles.fileIconWrapper}>
                      <FileText size={22} />
                    </div>
                    <div className={styles.fileMeta}>
                      <span className={styles.fileName}>
                        {msg.metadata?.fileName || "Document.pdf"}
                      </span>
                      <span className={styles.fileSize}>
                        {msg.metadata?.fileSize || "1.5 MB"}
                      </span>
                    </div>
                    <a
                      href={msg.metadata?.fileUrl || "#"}
                      download
                      className={styles.fileDownloadBtn}
                      title={t.attachmentCard.downloadBtn}
                    >
                      <Download size={14} />
                    </a>
                  </div>
                )}

                {/* Main Text Content */}
                <p className={styles.textContent}>{msg.content}</p>

                {/* Timestamp & Status */}
                <div className={styles.bubbleFooter}>
                  <span className={styles.timestamp}>
                    {formatTime(msg.timestamp)}
                  </span>
                  {isCurrentUser && (
                    <span className={styles.readStatus}>
                      {msg.isRead ? (
                        <CheckCheck size={14} className={styles.readCheck} />
                      ) : (
                        <Check size={14} className={styles.sentCheck} />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Typing Indicator */}
        {isTyping && (
          <div className={`${styles.messageRow} ${styles.rowIncoming}`}>
            <div className={styles.msgAvatarWrapper}>
              <Image
                src={participant.avatar}
                alt={displayName}
                width={28}
                height={28}
                className={styles.msgAvatar}
              />
            </div>
            <div
              className={`${styles.bubble} ${styles.bubbleIncoming} ${styles.typingBubble}`}
            >
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer Area */}
      <MessageComposer
        userPerspective={conversation.userPerspective}
        onSendMessage={onSendMessage}
        onOpenTourModal={onOpenTourModal}
        onAttachFile={onAttachFile}
      />
    </div>
  );
};

export default ChatThread;
