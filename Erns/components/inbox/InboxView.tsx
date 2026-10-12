"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Conversation,
  MainPerspective,
  SubFolder,
  Message,
} from "./types";
import { INITIAL_CONVERSATIONS } from "./mockConversations";
import { InboxHeader } from "./InboxHeader/InboxHeader";
import { ConversationList } from "./ConversationList/ConversationList";
import { ChatThread } from "./ChatThread/ChatThread";
import { InboxEmptyState } from "./InboxEmptyState/InboxEmptyState";
import { TourScheduleModal } from "./TourScheduleModal/TourScheduleModal";
import styles from "./InboxView.module.css";

const STORAGE_KEY = "erns_inbox_conversations_v3";

export const InboxView: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activePerspective, setActivePerspective] =
    useState<MainPerspective>("buying_renting");
  const [activeFolder, setActiveFolder] = useState<SubFolder>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
  const updateConversations = (
    updater: (prev: Conversation[]) => Conversation[]
  ) => {
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

  // 2. Perspective Counts (Buying/Renting vs Selling/Hosting)
  const perspectiveCounts = useMemo(() => {
    const nonArchived = conversations.filter((c) => !c.isArchived);
    return {
      buying_renting: nonArchived.filter(
        (c) => c.userPerspective === "buyer" || c.userPerspective === "renter"
      ).length,
      selling_hosting: nonArchived.filter(
        (c) => c.userPerspective === "seller" || c.userPerspective === "landlord"
      ).length,
    };
  }, [conversations]);

  // 3. Sub-folder Counts within the Active Perspective
  const folderCounts = useMemo(() => {
    const perspectiveConvs = conversations.filter((c) => {
      if (activePerspective === "buying_renting") {
        return c.userPerspective === "buyer" || c.userPerspective === "renter";
      } else {
        return c.userPerspective === "seller" || c.userPerspective === "landlord";
      }
    });

    const nonArchived = perspectiveConvs.filter((c) => !c.isArchived);

    const isBuyPerspective = activePerspective === "buying_renting";
    const saleMatchCategory = isBuyPerspective ? "buy" : "sell";
    const rentMatchCategory = isBuyPerspective ? "rent" : "landlord";

    return {
      all: nonArchived.length,
      sale: nonArchived.filter((c) => c.category === saleMatchCategory).length,
      rent: nonArchived.filter((c) => c.category === rentMatchCategory).length,
      tours: nonArchived.filter((c) => c.inquiryType === "tour").length,
      unread: nonArchived.filter((c) => c.unreadCount > 0).length,
      archived: perspectiveConvs.filter((c) => c.isArchived).length,
    };
  }, [conversations, activePerspective]);

  // 4. Filtered Conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      // Main Perspective check
      const belongsToPerspective =
        activePerspective === "buying_renting"
          ? conv.userPerspective === "buyer" || conv.userPerspective === "renter"
          : conv.userPerspective === "seller" || conv.userPerspective === "landlord";

      if (!belongsToPerspective) return false;

      const isBuyPerspective = activePerspective === "buying_renting";
      const saleMatchCategory = isBuyPerspective ? "buy" : "sell";
      const rentMatchCategory = isBuyPerspective ? "rent" : "landlord";

      // Sub-folder filter
      if (activeFolder === "archived") {
        if (!conv.isArchived) return false;
      } else {
        if (conv.isArchived) return false;
        if (activeFolder === "sale" && conv.category !== saleMatchCategory)
          return false;
        if (activeFolder === "rent" && conv.category !== rentMatchCategory)
          return false;
        if (activeFolder === "unread" && conv.unreadCount === 0) return false;
        if (activeFolder === "tours" && conv.inquiryType !== "tour")
          return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName =
          conv.participant.name.toLowerCase().includes(q) ||
          (conv.participant.nameAm &&
            conv.participant.nameAm.toLowerCase().includes(q));
        const matchProp =
          conv.property.title.toLowerCase().includes(q) ||
          (conv.property.titleAm &&
            conv.property.titleAm.toLowerCase().includes(q)) ||
          conv.property.subCity.toLowerCase().includes(q);
        const matchMsg = conv.messages.some((m) =>
          m.content.toLowerCase().includes(q)
        );
        if (!matchName && !matchProp && !matchMsg) return false;
      }

      return true;
    });
  }, [conversations, activePerspective, activeFolder, searchQuery]);

  // Switch perspective handler
  const handlePerspectiveChange = (p: MainPerspective) => {
    setActivePerspective(p);
    setActiveFolder("all");

    // Automatically select first conversation in the newly active perspective
    const nextConvs = conversations.filter((c) => {
      if (p === "buying_renting") {
        return (
          !c.isArchived &&
          (c.userPerspective === "buyer" || c.userPerspective === "renter")
        );
      } else {
        return (
          !c.isArchived &&
          (c.userPerspective === "seller" || c.userPerspective === "landlord")
        );
      }
    });

    if (nextConvs.length > 0) {
      setSelectedId(nextConvs[0].id);
    } else {
      setSelectedId(null);
    }
  };

  // 5. Currently Selected Conversation
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedId) || null;
  }, [conversations, selectedId]);

  // 6. Handlers
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

    const currentConv = conversations.find((c) => c.id === selectedId);
    const userRole = currentConv ? currentConv.userPerspective : "buyer";

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: "current-user",
      senderName: "You",
      senderRole: userRole,
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

    // Simulated contextual reply
    simulateParticipantReply(selectedId, text);
  };

  const simulateParticipantReply = (convId: string, userText: string) => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      const target = conversations.find((c) => c.id === convId);
      if (!target) return;

      const p = target.participant;
      const perspective = target.userPerspective;

      let replyContent = "";

      if (perspective === "seller") {
        // Current user is the seller; reply is from prospective buyer
        if (
          userText.toLowerCase().includes("saturday") ||
          userText.toLowerCase().includes("tour")
        ) {
          replyContent = `Thank you so much! Saturday works perfectly for us. We will arrive at the compound on time.`;
        } else if (
          userText.toLowerCase().includes("price") ||
          userText.toLowerCase().includes("negotiable")
        ) {
          replyContent = `Understood! We are ready with bank proof of funds and appreciate your flexibility on the price.`;
        } else {
          replyContent = `Thank you for confirming! I am reviewing the listing details and will be in touch shortly.`;
        }
      } else if (perspective === "landlord") {
        // Current user is the landlord; reply is from prospective tenant
        if (
          userText.toLowerCase().includes("application") ||
          userText.toLowerCase().includes("id")
        ) {
          replyContent = `Thank you! I have uploaded my employment letter and will complete the ID verification right away.`;
        } else if (
          userText.toLowerCase().includes("deposit") ||
          userText.toLowerCase().includes("lease")
        ) {
          replyContent = `The 2-month deposit is agreeable. Could we finalize the move-in inspection for this Friday?`;
        } else {
          replyContent = `Understood! I appreciate your quick guidance on this rental apartment.`;
        }
      } else if (perspective === "renter") {
        // Current user is the renter; reply is from landlord or leasing agent
        if (
          userText.toLowerCase().includes("tour") ||
          userText.toLowerCase().includes("visit")
        ) {
          replyContent = `I would be pleased to show you the apartment. I'll arrange building security clearance for your visit.`;
        } else if (
          userText.toLowerCase().includes("deposit") ||
          userText.toLowerCase().includes("utilities")
        ) {
          replyContent = `Yes, all major utilities (water reservoir, standby generator) are covered under the management fee.`;
        } else {
          replyContent = `Thank you for your interest! Feel free to ask if you'd like to inspect the building amenities.`;
        }
      } else {
        // Default buyer perspective; reply is from agent or seller
        if (
          userText.toLowerCase().includes("libre") ||
          userText.toLowerCase().includes("carta")
        ) {
          replyContent = `The digital Carta/Libre has been cleared by the Addis Ababa Land Bureau and is available for legal verification.`;
        } else if (
          userText.toLowerCase().includes("tour") ||
          userText.toLowerCase().includes("visit")
        ) {
          replyContent = `I would be happy to host a property tour. Let me know which time window works best and I will arrange access.`;
        } else {
          replyContent = `Thank you for reaching out! I've received your inquiry and will provide full property details shortly.`;
        }
      }

      const replyMsg: Message = {
        id: `msg-reply-${Date.now()}`,
        senderId: p.id,
        senderName: p.name,
        senderRole: p.role,
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
              messages: [...c.messages, replyMsg],
              lastMessageAt: new Date().toISOString(),
            };
          }
          return c;
        })
      );
    }, 1800);
  };

  const handleTourSubmit = (
    tourDate: string,
    tourTime: string,
    note?: string
  ) => {
    if (!selectedId) return;

    const currentConv = conversations.find((c) => c.id === selectedId);
    const userRole = currentConv ? currentConv.userPerspective : "buyer";

    const tourMessage: Message = {
      id: `msg-tour-${Date.now()}`,
      senderId: "current-user",
      senderName: "You",
      senderRole: userRole,
      content: note
        ? `Tour Request: ${note}`
        : `Requested an in-person property tour for ${tourDate} at ${tourTime}.`,
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

  const handleConfirmTour = (convId: string, messageId: string) => {
    updateConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === messageId
                ? {
                    ...m,
                    metadata: {
                      ...m.metadata,
                      tourStatus: "confirmed",
                    },
                  }
                : m
            ),
          };
        }
        return c;
      })
    );

    // Add confirmation text message
    handleSendMessage(
      "I have confirmed your tour request! Looking forward to welcoming you."
    );
  };

  const handleAttachFile = (file: {
    name: string;
    size: string;
    url: string;
  }) => {
    if (!selectedId) return;

    const currentConv = conversations.find((c) => c.id === selectedId);
    const userRole = currentConv ? currentConv.userPerspective : "buyer";

    const attachMessage: Message = {
      id: `msg-file-${Date.now()}`,
      senderId: "current-user",
      senderName: "You",
      senderRole: userRole,
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
    if (
      typeof window !== "undefined" &&
      !window.confirm("Delete this conversation thread?")
    ) {
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
        activePerspective={activePerspective}
        onPerspectiveChange={handlePerspectiveChange}
        perspectiveCounts={perspectiveCounts}
        activeFolder={activeFolder}
        onFolderChange={setActiveFolder}
        folderCounts={folderCounts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
              onConfirmTour={handleConfirmTour}
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
