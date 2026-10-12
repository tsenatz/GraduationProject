export type SenderRole = "buyer" | "agent" | "owner" | "system";

export type MessageType = "text" | "tour_request" | "offer" | "attachment";

export interface MessageMetadata {
  tourDate?: string;
  tourTime?: string;
  tourStatus?: "pending" | "confirmed" | "declined";
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  offerAmount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: SenderRole;
  content: string;
  timestamp: string; // ISO string
  isRead: boolean;
  type?: MessageType;
  metadata?: MessageMetadata;
}

export interface Participant {
  id: string;
  name: string;
  nameAm?: string;
  role: "agent" | "owner" | "buyer";
  avatar: string;
  isVerified: boolean;
  phone?: string;
  email?: string;
  company?: string;
  rating?: number;
  responseRate?: string;
}

export interface PropertySnapshot {
  id: string;
  title: string;
  titleAm?: string;
  priceETB: number;
  listingType: "sale" | "rent";
  subCity: string;
  specificArea?: string;
  bedrooms: number;
  bathrooms: number;
  areaSqM: number;
  propertyType: string;
  imageUrl: string;
  referenceNo?: string;
}

export type InquiryType = "general" | "tour" | "offer" | "libre_verification";

export interface Conversation {
  id: string;
  participant: Participant;
  property: PropertySnapshot;
  messages: Message[];
  unreadCount: number;
  lastMessageAt: string;
  isArchived: boolean;
  isStarred: boolean;
  inquiryType: InquiryType;
}

export type InboxFolder = "all" | "unread" | "tours" | "my_listings" | "archived";
