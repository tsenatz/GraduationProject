"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Conversation, InboxFolder, Message } from "./types";
import { INITIAL_CONVERSATIONS } from "./mockConversations";
import { InboxHeader } from "./InboxHeader/InboxHeader";
import { ConversationList } from "./ConversationList/ConversationList";
import { ChatThread } from "./ChatThread/ChatThread";
import { InboxEmptyState } from "./InboxEmptyState/InboxEmptyState";
import { TourScheduleModal } from "./TourScheduleModal/TourScheduleModal";
import styles from "./InboxView.module.css";

const STORAGE_KEY = "erns_inbox_conversations_v1";

export const InboxView: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState<InboxFolder>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // 1. Initial Load: Read from LocalStorage or seed with realistic data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConversations(parsed);
          setSelectedId(parsed[0].id);
          return;
        }
      }
    } catch {
      // Ignore read errors
    }
    setConversations(INITIAL_CONVERSATIONS);
    setSelectedId(INITIAL_CONVERSATIONS[0].id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
    } catch {
      // Ignore write errors
    }
  }, []);

  // Save to LocalStorage whenever conversations state changes
  const updateConversations = (updater: (prev: Conversation[]) => Conversation[]) => {
    setConversations((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore write errors
      }
      return next;
    });
  };

  // 2. Folder Counts
  const folderCounts = useMemo(() => {
    const nonArchived = conversations.filter((c) => !c.isArchived);
    return {
      all: nonArchived.length,
      unread: nonArchived.filter((c) => c.unreadCount > 0).length,
      tours: nonArchived.filter((c) => c.inquiryType === "tour").length,
      my_listings: nonArchived.filter((c) => c.participant.role === "buyer").length,
      archived: conversations.filter((c) => c.isArchived).length,
    };
  }, [conversations]);

  // 3. Filtered Conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      // Folder filter
      if (activeFolder === "archived") {
        if (!conv.isArchived) return false;
      } else {
        if (conv.isArchived) return false;
        if (activeFolder === "unread" && conv.unreadCount === 0) return false;
        if (activeFolder === "tours" && conv.inquiryType !== "tour") return false;
        if (activeFolder === "my_listings" && conv.participant.role !== "buyer") return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = conv.participant.name.toLowerCase().includes(q);
        const matchProp = conv.property.title.toLowerCase().includes(q) ||
          conv.property.subCity.toLowerCase().includes(q);
        const matchMsg = conv.messages.some((m) => m.content.toLowerCase().includes(q));
        if (!matchName && !matchProp && !matchMsg) return false;
      }

      return true;
    });
  }, [conversations, activeFolder, searchQuery]);

  // 4. Currently Selected Conversation
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedId) || null;
  }, [conversations, selectedId]);

  // 5. Handlers
  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    setShowMobileChat(true);

    // Mark as read immediately
    updateConversations((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            unreadCount: 0,
            messages: c.messages.map((m) => ({ ...m, isRead: true })),
          };
        }
        return c;
      })
    );
  };

  const handleSendMessage = (text: string) => {
    if (!selectedId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: "current-user",
      senderName: "You",
      senderRole: "buyer",
      content: text,
      timestamp: new Date().toISOString(),
      isRead: true,
      type: "text",
    };

    updateConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            messages: [...c.messages, newMessage],
            lastMessageAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    // Realistic auto-reply simulation from agent/owner
    simulateAgentReply(selectedId, text);
  };

  const simulateAgentReply = (convId: string, userText: string) => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      const target = conversations.find((c) => c.id === convId);
      const isAgent = target?.participant.role === "agent";

      let replyContent = isAgent
        ? "Thank you for reaching out! I have received your message and will coordinate the details directly with the property records."
        : "Selam! Thank you for your inquiry. The property is currently available for viewing and I am happy to answer any questions.";

      if (userText.toLowerCase().includes("tour") || userText.toLowerCase().includes("visit")) {
        replyContent = "I would be happy to host a tour for you. Let me know what time works best for you and I will have the premises prepared.";
      } else if (userText.toLowerCase().includes("price") || userText.toLowerCase().includes("negotiable")) {
        replyContent = "The owner is open to reasonable negotiations for qualified buyers utilizing registered Ethiopian bank accounts or escrow.";
      } else if (userText.toLowerCase().includes("libre") || userText.toLowerCase().includes("carta")) {
        replyContent = "The digital Carta/Libre has been cleared by the land bureau and is available for legal inspection upon request.";
      }

      const agentMessage: Message = {
        id: `msg-reply-${Date.now()}`,
        senderId: target?.participant.id || "agent-reply",
        senderName: target?.participant.name || "Agent",
        senderRole: target?.participant.role || "agent",
        content: replyContent,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "text",
      };

      updateConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            return {
              ...c,
              messages: [...c.messages, agentMessage],
              lastMessageAt: new Date().toISOString(),
            };
          }
          return c;
        })
      );
    }, 1800);
  };

  const handleTourSubmit = (tourDate: string, tourTime: string, note?: string) => {
    if (!selectedId) return;

    const tourMessage: Message = {
      id: `msg-tour-${Date.now()}`,
      senderId: "current-user",
      senderName: "You",
      senderRole: "buyer",
      content: note ? `Tour Request: ${note}` : `Requested an in-person property tour for ${tourDate} at ${tourTime}.`,
      timestamp: new Date().toISOString(),
      isRead: true,
      type: "tour_request",
      metadata: {
        tourDate,
        tourTime,
        tourStatus: "confirmed",
      },
    };

    updateConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            inquiryType: "tour",
            messages: [...c.messages, tourMessage],
            lastMessageAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  const handleAttachFile = (file: { name: string; size: string; url: string }) => {
    if (!selectedId) return;

    const attachMessage: Message = {
      id: `msg-file-${Date.now()}`,
      senderId: "current-user",
      senderName: "You",
      senderRole: "buyer",
      content: `Shared document: ${file.name}`,
      timestamp: new Date().toISOString(),
      isRead: true,
      type: "attachment",
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileUrl: file.url,
      },
    };

    updateConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            messages: [...c.messages, attachMessage],
            lastMessageAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  const handleToggleStar = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    updateConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isStarred: !c.isStarred } : c))
    );
  };

  const handleToggleArchive = (id: string) => {
    updateConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isArchived: !c.isArchived } : c))
    );
  };

  const handleDeleteConversation = (id: string) => {
    if (typeof window !== "undefined" && !window.confirm("Delete this conversation thread?")) {
      return;
    }
    updateConversations((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setShowMobileChat(false);
    }
  };

  return (
    <div className={styles.inboxLayout}>
      <InboxHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFolder={activeFolder}
        onFolderChange={setActiveFolder}
        folderCounts={folderCounts}
      />

      <div className={styles.dualPaneContainer}>
        {/* Left Pane: Conversations List */}
        <aside
          className={`${styles.leftPane} ${
            showMobileChat ? styles.leftPaneHiddenMobile : ""
          }`}
          aria-label="Conversation list"
        >
          <ConversationList
            conversations={filteredConversations}
            selectedId={selectedId}
            onSelect={handleSelectConversation}
            onToggleStar={handleToggleStar}
            hasSearchQuery={!!searchQuery.trim()}
          />
        </aside>

        {/* Right Pane: Active Thread or Empty State */}
        <main
          className={`${styles.rightPane} ${
            !showMobileChat ? styles.rightPaneHiddenMobile : ""
          }`}
          aria-label="Active conversation"
        >
          {activeConversation ? (
            <ChatThread
              conversation={activeConversation}
              isTyping={isTyping}
              onBackToList={() => setShowMobileChat(false)}
              onSendMessage={handleSendMessage}
              onOpenTourModal={() => setIsTourModalOpen(true)}
              onAttachFile={handleAttachFile}
              onToggleArchive={handleToggleArchive}
              onDeleteConversation={handleDeleteConversation}
              onToggleStar={handleToggleStar}
            />
          ) : (
            <InboxEmptyState />
          )}
        </main>
      </div>

      {/* Tour Scheduling Modal */}
      {activeConversation && (
        <TourScheduleModal
          isOpen={isTourModalOpen}
          property={activeConversation.property}
          onClose={() => setIsTourModalOpen(false)}
          onSubmitTour={handleTourSubmit}
        />
      )}
    </div>
  );
};

export default InboxView;
