"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  Conversation,
  Message,
  MessageMetadata,
  MessageType,
  Participant,
  PropertySnapshot,
  UserPerspective,
  ConversationCategory,
  InquiryType,
} from "@/components/inbox/types";
import { INITIAL_CONVERSATIONS } from "@/components/inbox/mockConversations";
import {
  sendPushNotificationToUser,
  savePushSubscriptionAction,
  sendTestPushNotificationAction,
} from "@/lib/push";

export { savePushSubscriptionAction, sendTestPushNotificationAction };

export interface InboxActionResult<T = any> {
  success: boolean;
  error?: string;
  data?: T;
  conversations?: Conversation[];
  message?: Message;
  isAuthenticated?: boolean;
}

// Global server memory store fallback for local dev / unconfigured DB environments
// Allows 2 different logged in accounts in the same dev process to exchange messages live
declare const globalThis: {
  __ernsServerConversations?: Conversation[];
} & typeof global;

function getServerStore(): Conversation[] {
  if (!globalThis.__ernsServerConversations) {
    // Deep clone initial conversations so modifications don't mutate the static import
    globalThis.__ernsServerConversations = JSON.parse(
      JSON.stringify(INITIAL_CONVERSATIONS)
    );
  }
  return globalThis.__ernsServerConversations!;
}

/**
 * Reconcile a database Conversation record into the UI Conversation model.
 */
function dbRecordToConversation(
  record: any,
  currentUserId: string,
  currentUserEmail?: string
): Conversation {
  const isBuyer =
    record.buyerId === currentUserId ||
    (currentUserEmail && record.buyer?.email === currentUserEmail);
  const otherUser = isBuyer ? record.seller : record.buyer;

  // Determine user perspective and role
  const category = (record.category as ConversationCategory) || (isBuyer ? "buy" : "sell");
  const userPerspective: UserPerspective = isBuyer
    ? category === "rent"
      ? "renter"
      : "buyer"
    : category === "landlord"
    ? "landlord"
    : "seller";

  // Participant info
  const agentProfile = otherUser?.agentProfile;
  const participantRole: Participant["role"] = agentProfile
    ? "agent"
    : isBuyer
    ? "owner"
    : "buyer";

  const participant: Participant = {
    id: otherUser?.id || "unknown",
    name: otherUser?.name || otherUser?.firstName || "ERNS Member",
    nameAm: agentProfile?.fullNameAm || undefined,
    role: participantRole,
    avatar:
      otherUser?.image ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isVerified: agentProfile?.verificationStatus === "VERIFIED" || true,
    phone: agentProfile?.professionalPhone || undefined,
    email: otherUser?.email || undefined,
    company: agentProfile?.brokerage || "ERNS Real Estate Network",
    responseRate: "15 min",
  };

  // Property snapshot
  const prop = record.property;
  const propertySnapshot: PropertySnapshot = {
    id: prop?.id || record.propertyId || "prop-default",
    title: prop?.title || record.propertyTitle || "Luxury Property in Addis Ababa",
    titleAm: prop?.titleAm || record.propertyTitleAm || undefined,
    priceETB: prop?.price || record.propertyPrice || 24500000,
    listingType:
      prop?.listingType?.toLowerCase() === "rent" ||
      record.listingType?.toLowerCase() === "rent"
        ? "rent"
        : "sale",
    subCity: prop?.subCity || record.propertySubCity || "Bole",
    specificArea: prop?.specificArea || "Atlas",
    bedrooms: prop?.beds || 3,
    bathrooms: prop?.baths ? Math.round(prop.baths) : 2,
    areaSqM: prop?.areaSqM || 160,
    propertyType: prop?.propertyType || "Apartment",
    imageUrl:
      prop?.images?.[0] ||
      record.propertyImage ||
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
    referenceNo: prop?.referenceNo || "ERNS-ADD-1049",
    isUserListing: !isBuyer,
    managementUrl: !isBuyer
      ? category === "landlord"
        ? "/rentalmanager/dashboard"
        : "/sell/dashboard"
      : undefined,
  };

  // Messages mapping
  const messages: Message[] = (record.messages || []).map((m: any) => {
    const isCurrentUser =
      m.senderId === currentUserId ||
      (currentUserEmail && m.sender?.email === currentUserEmail) ||
      m.senderId === "current-user";

    return {
      id: m.id,
      senderId: isCurrentUser ? "current-user" : m.senderId,
      senderName: isCurrentUser ? "You" : (m.senderName || participant.name),
      senderRole: (m.senderRole as any) || (isCurrentUser ? userPerspective : participantRole),
      content: m.content,
      timestamp: m.createdAt ? new Date(m.createdAt).toISOString() : (m.timestamp || new Date().toISOString()),
      isRead: isCurrentUser ? true : (m.isRead ?? true),
      type: (m.type as MessageType) || "text",
      metadata: {
        tourDate: m.tourDate || m.metadata?.tourDate || undefined,
        tourTime: m.tourTime || m.metadata?.tourTime || undefined,
        tourStatus: m.tourStatus || m.metadata?.tourStatus || undefined,
        fileName: m.fileName || m.metadata?.fileName || undefined,
        fileSize: m.fileSize || m.metadata?.fileSize || undefined,
        fileUrl: m.fileUrl || m.metadata?.fileUrl || undefined,
      },
    };
  });

  const unreadCount = messages.filter(
    (m) => m.senderId !== "current-user" && !m.isRead
  ).length;

  return {
    id: record.id,
    participant,
    property: propertySnapshot,
    messages,
    unreadCount,
    lastMessageAt: record.lastMessageAt
      ? new Date(record.lastMessageAt).toISOString()
      : new Date().toISOString(),
    isArchived: isBuyer ? !!record.isArchivedBuyer : !!record.isArchivedSeller,
    isStarred: isBuyer ? !!record.isStarredBuyer : !!record.isStarredSeller,
    inquiryType: (record.inquiryType as InquiryType) || "general",
    category,
    userPerspective,
  };
}

/**
 * 1. Fetch conversations for the currently logged in user
 * Supports both PostgreSQL database queries and safe in-memory fallback.
 */
export async function getInboxConversationsAction(): Promise<InboxActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.id && !session?.user?.email) {
      return {
        success: false,
        isAuthenticated: false,
        error: "Unauthenticated",
        conversations: [],
      };
    }

    const currentUserId = session.user.id || session.user.email!;
    const currentUserEmail = session.user.email || undefined;

    // A. Query database if DATABASE_URL is configured
    let dbConversations: any[] = [];
    if (process.env.DATABASE_URL) {
      try {
        dbConversations = await (db as any).conversation.findMany({
          where: {
            OR: [
              { buyerId: currentUserId },
              { sellerId: currentUserId },
              ...(currentUserEmail
                ? [
                    { buyer: { email: currentUserEmail } },
                    { seller: { email: currentUserEmail } },
                  ]
                : []),
            ],
          },
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
            },
            buyer: true,
            seller: {
              include: { agentProfile: true },
            },
            property: true,
          },
          orderBy: { lastMessageAt: "desc" },
        });
      } catch (err) {
        console.warn("DB read skipped or unconfigured:", err);
        dbConversations = [];
      }
    }

    // If records found in DB, return them
    if (dbConversations && dbConversations.length > 0) {
      const parsed = dbConversations.map((r) =>
        dbRecordToConversation(r, currentUserId, currentUserEmail)
      );
      return {
        success: true,
        isAuthenticated: true,
        conversations: parsed,
      };
    }

    // B. Reconcile with server memory store fallback
    const store = getServerStore();
    const parsedStore = store.map((conv) => {
      // Re-map messages so the current user's messages are tagged correctly
      const messages: Message[] = conv.messages.map((m) => {
        const isCurrentUser =
          m.senderId === currentUserId ||
          (currentUserEmail && m.senderId === currentUserEmail) ||
          m.senderId === "current-user";

        return {
          ...m,
          senderId: isCurrentUser ? "current-user" : m.senderId,
          senderName: isCurrentUser ? "You" : m.senderName,
          isRead: isCurrentUser ? true : m.isRead,
        };
      });

      const unreadCount = messages.filter(
        (m) => m.senderId !== "current-user" && !m.isRead
      ).length;

      return {
        ...conv,
        messages,
        unreadCount,
      };
    });

    return {
      success: true,
      isAuthenticated: true,
      conversations: parsedStore,
    };
  } catch (error: any) {
    console.error("Failed to fetch inbox conversations:", error);
    return {
      success: false,
      isAuthenticated: false,
      error: error.message || "Failed to load conversations",
      conversations: INITIAL_CONVERSATIONS,
    };
  }
}

/**
 * 2. Send a new message or start a conversation in the database
 */
export async function sendMessageAction(params: {
  conversationId?: string;
  recipientId?: string;
  propertyId?: string;
  content: string;
  type?: MessageType;
  metadata?: MessageMetadata;
  senderRole?: string;
}): Promise<InboxActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.id && !session?.user?.email) {
      return {
        success: false,
        isAuthenticated: false,
        error: "Please sign in to send messages.",
      };
    }

    const currentUserId = session.user.id || session.user.email!;
    const currentUserName = session.user.name || "You";
    let activeConvId = params.conversationId;

    if (!activeConvId) {
      activeConvId = `conv-${Date.now()}`;
    }

    // A. DB Persistence if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        const existingConv = await (db as any).conversation.findUnique({
          where: { id: activeConvId },
        });

        if (!existingConv && params.recipientId) {
          await (db as any).conversation.create({
            data: {
              id: activeConvId,
              buyerId: currentUserId,
              sellerId: params.recipientId,
              propertyId: params.propertyId || null,
              category: "buy",
              inquiryType: params.type === "tour_request" ? "tour" : "inquiry",
              lastMessageAt: new Date(),
            },
          });
        }

        await (db as any).message.create({
          data: {
            conversationId: activeConvId,
            senderId: currentUserId,
            senderName: currentUserName,
            senderRole: params.senderRole || "buyer",
            content: params.content,
            type: params.type || "text",
            tourDate: params.metadata?.tourDate || null,
            tourTime: params.metadata?.tourTime || null,
            tourStatus: params.metadata?.tourStatus || null,
            fileName: params.metadata?.fileName || null,
            fileSize: params.metadata?.fileSize || null,
            fileUrl: params.metadata?.fileUrl || null,
            isRead: false,
          },
        });

        await (db as any).conversation.update({
          where: { id: activeConvId },
          data: { lastMessageAt: new Date() },
        });
      } catch (err) {
        console.warn("DB message insert skipped (development/offline DB):", err);
      }
    }

    // B. Update server memory store for live multi-account synchronization
    const store = getServerStore();
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: (params.senderRole as any) || "buyer",
      content: params.content,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: params.type || "text",
      metadata: params.metadata,
    };

    let targetConv = store.find((c) => c.id === activeConvId);
    if (targetConv) {
      targetConv.messages.push(newMsg);
      targetConv.lastMessageAt = new Date().toISOString();
      if (params.type === "tour_request") {
        targetConv.inquiryType = "tour";
      }
    } else {
      // Create new conversation in memory store
      const newConv: Conversation = {
        id: activeConvId,
        participant: {
          id: params.recipientId || "recipient-user",
          name: "ERNS Member",
          role: "agent",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          isVerified: true,
          company: "ERNS Network",
          responseRate: "15 min",
        },
        property: {
          id: params.propertyId || "prop-default",
          title: "Inquired Property",
          priceETB: 20000000,
          listingType: "sale",
          subCity: "Addis Ababa",
          specificArea: "Bole",
          bedrooms: 3,
          bathrooms: 2,
          areaSqM: 150,
          propertyType: "Apartment",
          imageUrl:
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
          referenceNo: "ERNS-NEW-100",
        },
        messages: [newMsg],
        unreadCount: 0,
        lastMessageAt: new Date().toISOString(),
        isArchived: false,
        isStarred: false,
        inquiryType: params.type === "tour_request" ? "tour" : "general",
        category: "buy",
        userPerspective: "buyer",
      };
      store.unshift(newConv);
    }

    // C. Dispatch Web Push notification to recipient (even if browser window is closed)
    const recipientToNotify =
      params.recipientId ||
      targetConv?.participant.id ||
      (targetConv?.userPerspective === "buyer" ? "seller" : "buyer");

    if (recipientToNotify && recipientToNotify !== currentUserId) {
      sendPushNotificationToUser(recipientToNotify, {
        title: `${currentUserName} • ERNS Message`,
        body:
          params.type === "tour_request"
            ? `Requested an in-person tour for ${params.metadata?.tourDate || "upcoming date"}`
            : params.content.length > 90
            ? `${params.content.slice(0, 87)}...`
            : params.content,
        url: "/inbox",
      }).catch((err) => console.warn("Background push dispatch error:", err));
    }

    revalidatePath("/inbox");

    return {
      success: true,
      isAuthenticated: true,
      data: { conversationId: activeConvId },
      message: newMsg,
    };
  } catch (error: any) {
    console.error("Failed to send message:", error);
    return {
      success: false,
      error: error.message || "Failed to send message",
    };
  }
}

/**
 * 3. Schedule an in-person property tour
 */
export async function scheduleTourAction(params: {
  conversationId: string;
  tourDate: string;
  tourTime: string;
  note?: string;
}): Promise<InboxActionResult> {
  const content = params.note
    ? `Tour Request: ${params.note}`
    : `Requested an in-person property tour for ${params.tourDate} at ${params.tourTime}.`;

  return sendMessageAction({
    conversationId: params.conversationId,
    content,
    type: "tour_request",
    metadata: {
      tourDate: params.tourDate,
      tourTime: params.tourTime,
      tourStatus: "confirmed",
    },
  });
}

/**
 * 4. Confirm a tour booking
 */
export async function confirmTourAction(params: {
  conversationId: string;
  messageId: string;
}): Promise<InboxActionResult> {
  try {
    if (process.env.DATABASE_URL) {
      try {
        await (db as any).message.update({
          where: { id: params.messageId },
          data: { tourStatus: "confirmed" },
        });
      } catch (err) {
        console.warn("DB update tour status error:", err);
      }
    }

    // Update in memory store as well
    const store = getServerStore();
    const conv = store.find((c) => c.id === params.conversationId);
    if (conv) {
      const msg = conv.messages.find((m) => m.id === params.messageId);
      if (msg && msg.metadata) {
        msg.metadata.tourStatus = "confirmed";
      }
    }

    return sendMessageAction({
      conversationId: params.conversationId,
      content: "I have confirmed your tour request! Looking forward to welcoming you.",
      type: "text",
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 5. Mark messages in a conversation as read
 */
export async function markConversationAsReadAction(params: {
  conversationId: string;
}): Promise<InboxActionResult> {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id || session?.user?.email;

    if (currentUserId && process.env.DATABASE_URL) {
      try {
        await (db as any).message.updateMany({
          where: {
            conversationId: params.conversationId,
            senderId: { not: currentUserId },
            isRead: false,
          },
          data: { isRead: true },
        });
      } catch (err) {
        console.warn("DB mark read error:", err);
      }
    }

    // Update in memory store
    const store = getServerStore();
    const conv = store.find((c) => c.id === params.conversationId);
    if (conv) {
      conv.unreadCount = 0;
      conv.messages.forEach((m) => {
        if (m.senderId !== currentUserId) {
          m.isRead = true;
        }
      });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 6. Start a new conversation thread (e.g. from a property detail or agent inquiry)
 */
export async function startNewConversationAction(params: {
  recipientId: string;
  recipientName?: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyImage?: string;
  propertyPrice?: number;
  initialMessage: string;
  category?: ConversationCategory;
  inquiryType?: InquiryType;
}): Promise<InboxActionResult<{ conversationId: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.id && !session?.user?.email) {
      return {
        success: false,
        isAuthenticated: false,
        error: "Please sign in to start a conversation.",
      };
    }

    const currentUserId = session.user.id || session.user.email!;
    const newConvId = `conv-${Date.now()}`;

    if (process.env.DATABASE_URL) {
      try {
        await (db as any).conversation.create({
          data: {
            id: newConvId,
            buyerId: currentUserId,
            sellerId: params.recipientId,
            propertyId: params.propertyId || null,
            propertyTitle: params.propertyTitle || null,
            propertyImage: params.propertyImage || null,
            propertyPrice: params.propertyPrice || null,
            category: params.category || "buy",
            inquiryType: params.inquiryType || "general",
            lastMessageAt: new Date(),
          },
        });
      } catch (dbErr) {
        console.warn("DB create conversation error:", dbErr);
      }
    }

    const sendRes = await sendMessageAction({
      conversationId: newConvId,
      recipientId: params.recipientId,
      propertyId: params.propertyId,
      content: params.initialMessage,
      type: "text",
    });

    return {
      success: true,
      isAuthenticated: true,
      data: { conversationId: newConvId },
      message: sendRes.message,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to start conversation",
    };
  }
}
