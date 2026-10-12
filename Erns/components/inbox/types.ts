export type SenderRole =
  | "buyer"
  | "renter"
  | "seller"
  | "landlord"
  | "agent"
  | "owner"
  | "system";

export type MessageType = "text" | "tour_request" | "offer" | "attachment";

export type UserPerspective = "buyer" | "renter" | "seller" | "landlord";

export type ConversationCategory = "buy" | "rent" | "sell" | "landlord";

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
  role: "agent" | "owner" | "buyer" | "renter";
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
  rentPeriod?: "month" | "year";
  subCity: string;
  specificArea?: string;
  bedrooms: number;
  bathrooms: number;
  areaSqM: number;
  propertyType: string;
  imageUrl: string;
  referenceNo?: string;
  isUserListing?: boolean; // True if this is the user's own listing (Seller/Landlord mode)
  managementUrl?: string; // Optional direct link to seller/rentalmanager dashboard
}

export type InquiryType =
  | "general"
  | "tour"
  | "offer"
  | "libre_verification"
  | "rental_application";

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
  category: ConversationCategory;
  userPerspective: UserPerspective;
}

export type InboxFolder =
  | "all"
  | "buying"
  | "renting"
  | "selling"
  | "landlord"
  | "tours"
  | "unread"
  | "archived";
