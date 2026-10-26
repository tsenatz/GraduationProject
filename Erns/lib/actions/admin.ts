"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface AdminStats {
  pendingVerifications: number;
  totalAgents: number;
  totalProperties: number;
  totalUsers: number;
  recentVerifications: AgentApplicationItem[];
  recentProperties: AdminPropertyItem[];
}

export interface AgentApplicationItem {
  id: string;
  userId: string;
  fullName: string;
  fullNameAm?: string | null;
  email: string;
  phone: string;
  brokerage?: string | null;
  experience?: string | null;
  tinNumber?: string | null;
  licenseNumber?: string | null;
  specialties: string[];
  serviceAreas: string[];
  documentUrl?: string | null;
  referenceNo?: string | null;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
  updatedAt?: string;
}

export interface AdminPropertyItem {
  id: string;
  referenceNo: string;
  title: string;
  titleAm?: string | null;
  price: number;
  listingType: string;
  status: string;
  subCity?: string | null;
  address: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  ownerName?: string | null;
  contactPhone?: string | null;
  createdAt: string;
  userId?: string | null;
}

export interface AdminUserItem {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: "USER" | "AGENT" | "ADMIN";
  emailVerified?: string | null;
  createdAt: string;
  propertyCount?: number;
}

export interface AdminAuditLogItem {
  id: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  targetLabel: string;
  details?: string;
  createdAt: string;
}

// In-memory runtime audit log store for administrative actions
declare const globalThis: {
  adminAuditLogStore?: AdminAuditLogItem[];
} & typeof global;

if (!globalThis.adminAuditLogStore) {
  globalThis.adminAuditLogStore = [];
}

function logAuditAction(log: Omit<AdminAuditLogItem, "id" | "createdAt">) {
  if (!globalThis.adminAuditLogStore) globalThis.adminAuditLogStore = [];
  globalThis.adminAuditLogStore.unshift({
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...log,
    createdAt: new Date().toISOString(),
  });
}

/**
 * Authoritative security gate for Server Actions:
 * Strictly checks that the session user exists and has role == ADMIN in the database.
 */
export async function assertAdmin() {
  const session = await auth();

  if (!session?.user?.id && !session?.user?.email) {
    throw new Error("UNAUTHORIZED: Authentication required.");
  }

  // Check if current user is in designated ADMIN_EMAILS environment variable
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const currentUserEmail = session.user.email?.toLowerCase();
  const isDesignatedAdmin = currentUserEmail && adminEmails.includes(currentUserEmail);

  let user = await db.user.findFirst({
    where: {
      OR: [
        session.user.id ? { id: session.user.id } : undefined,
        session.user.email ? { email: session.user.email } : undefined,
      ].filter(Boolean) as any,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  if (user && isDesignatedAdmin && user.role !== "ADMIN") {
    user = await db.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  if (!user || user.role !== "ADMIN") {
    throw new Error("FORBIDDEN: Administrative privileges required.");
  }

  return user;
}

/**
 * Fetch real overview statistics from PostgreSQL for the Admin Command Center.
 */
export async function getAdminDashboardStatsAction(): Promise<{
  success: boolean;
  data?: AdminStats;
  error?: string;
}> {
  try {
    await assertAdmin();

    const [pendingCount, totalAgents, totalProperties, totalUsers, liveApplications, liveProperties] =
      await Promise.all([
        db.agentProfile.count({ where: { verificationStatus: "PENDING" } }),
        db.user.count({ where: { role: "AGENT" } }),
        db.property.count(),
        db.user.count(),
        db.agentProfile.findMany({
          where: { verificationStatus: "PENDING" },
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { email: true, name: true } } },
        }),
        db.property.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
        }),
      ]);

    const formattedApps: AgentApplicationItem[] = liveApplications.map((app) => ({
      id: app.id,
      userId: app.userId,
      fullName: app.fullName || app.user?.name || "Agent Applicant",
      fullNameAm: app.fullNameAm,
      email: app.professionalEmail || app.user?.email || "",
      phone: app.professionalPhone || "",
      brokerage: app.brokerage,
      experience: app.experience,
      tinNumber: app.tinNumber,
      licenseNumber: app.licenseNumber,
      specialties: app.specialties || [],
      serviceAreas: app.serviceAreas || [],
      documentUrl: app.documentUrl,
      referenceNo: app.referenceNo,
      verificationStatus: app.verificationStatus as "PENDING" | "VERIFIED" | "REJECTED",
      createdAt: app.createdAt.toISOString(),
    }));

    const formattedProps: AdminPropertyItem[] = liveProperties.map((p) => ({
      id: p.id,
      referenceNo: p.referenceNo,
      title: p.title,
      titleAm: p.titleAm,
      price: p.price,
      listingType: p.listingType,
      status: p.status,
      subCity: p.subCity,
      address: p.address,
      bedrooms: p.beds,
      bathrooms: p.baths,
      images: p.images,
      ownerName: p.ownerName,
      contactPhone: p.contactPhone,
      createdAt: p.createdAt.toISOString(),
      userId: p.userId,
    }));

    return {
      success: true,
      data: {
        pendingVerifications: pendingCount,
        totalAgents,
        totalProperties,
        totalUsers,
        recentVerifications: formattedApps,
        recentProperties: formattedProps,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load dashboard metrics" };
  }
}

/**
 * Fetch real agent verification applications directly from db.agentProfile.
 */
export async function getAdminAgentApplicationsAction(filters: {
  status?: string;
  search?: string;
}): Promise<{
  success: boolean;
  applications: AgentApplicationItem[];
  total: number;
  pendingCount: number;
  error?: string;
}> {
  try {
    await assertAdmin();

    const whereClause: any = {};
    if (filters.status && filters.status !== "ALL") {
      whereClause.verificationStatus = filters.status;
    }
    if (filters.search) {
      whereClause.OR = [
        { fullName: { contains: filters.search, mode: "insensitive" } },
        { professionalEmail: { contains: filters.search, mode: "insensitive" } },
        { tinNumber: { contains: filters.search, mode: "insensitive" } },
        { brokerage: { contains: filters.search, mode: "insensitive" } },
        { referenceNo: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [profiles, total, pendingCount] = await Promise.all([
      db.agentProfile.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true, name: true } } },
      }),
      db.agentProfile.count({ where: whereClause }),
      db.agentProfile.count({ where: { verificationStatus: "PENDING" } }),
    ]);

    const apps: AgentApplicationItem[] = profiles.map((p) => ({
      id: p.id,
      userId: p.userId,
      fullName: p.fullName || p.user?.name || "Applicant",
      fullNameAm: p.fullNameAm,
      email: p.professionalEmail || p.user?.email || "",
      phone: p.professionalPhone || "",
      brokerage: p.brokerage,
      experience: p.experience,
      tinNumber: p.tinNumber,
      licenseNumber: p.licenseNumber,
      specialties: p.specialties || [],
      serviceAreas: p.serviceAreas || [],
      documentUrl: p.documentUrl,
      referenceNo: p.referenceNo,
      verificationStatus: p.verificationStatus as "PENDING" | "VERIFIED" | "REJECTED",
      createdAt: p.createdAt.toISOString(),
    }));

    return { success: true, applications: apps, total, pendingCount };
  } catch (err: any) {
    return { success: false, applications: [], total: 0, pendingCount: 0, error: err?.message };
  }
}

/**
 * Approve an Agent in the real database:
 * 1. db.agentProfile.update(verificationStatus = VERIFIED)
 * 2. db.user.update(role = AGENT)
 * 3. Log the audit action
 */
export async function approveAgentAction(profileId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const admin = await assertAdmin();

    const profile = await db.agentProfile.findUnique({
      where: { id: profileId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!profile) {
      return { success: false, error: "Agent application record not found." };
    }

    await db.$transaction(async (tx) => {
      await tx.agentProfile.update({
        where: { id: profileId },
        data: { verificationStatus: "VERIFIED" },
      });

      if (profile.userId) {
        await tx.user.update({
          where: { id: profile.userId },
          data: { role: "AGENT" },
        });
      }
    });

    logAuditAction({
      adminName: admin.name || admin.email,
      action: "AGENT_VERIFY_APPROVED",
      targetType: "AgentProfile",
      targetId: profileId,
      targetLabel: `${profile.fullName || profile.user?.name || "Agent"} (${profile.referenceNo || profileId})`,
      details: "Approved professional agent credentials and promoted account to AGENT role.",
    });

    revalidatePath("/admin");
    revalidatePath("/admin/verifications");
    revalidatePath("/admin/users");
    revalidatePath("/agents");
    revalidatePath("/sell/agent");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to approve agent application" };
  }
}

/**
 * Reject an Agent's application with a mandatory reason in the real database.
 */
export async function rejectAgentAction(
  profileId: string,
  reason: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const admin = await assertAdmin();

    const profile = await db.agentProfile.findUnique({
      where: { id: profileId },
      select: { fullName: true, referenceNo: true },
    });

    if (!profile) {
      return { success: false, error: "Agent application record not found." };
    }

    await db.agentProfile.update({
      where: { id: profileId },
      data: { verificationStatus: "REJECTED" },
    });

    logAuditAction({
      adminName: admin.name || admin.email,
      action: "AGENT_VERIFY_REJECTED",
      targetType: "AgentProfile",
      targetId: profileId,
      targetLabel: `${profile.fullName || "Applicant"} (${profile.referenceNo || profileId})`,
      details: `Rejection Reason: ${reason}`,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/verifications");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to reject agent application" };
  }
}

/**
 * Fetch real properties from db.property (same data as public marketplace).
 */
export async function getAdminPropertiesAction(filters: {
  status?: string;
  listingType?: string;
  subCity?: string;
  search?: string;
}): Promise<{
  success: boolean;
  properties: AdminPropertyItem[];
  total: number;
  error?: string;
}> {
  try {
    await assertAdmin();

    const where: any = {};
    if (filters.status && filters.status !== "ALL") where.status = filters.status;
    if (filters.listingType && filters.listingType !== "ALL") where.listingType = filters.listingType;
    if (filters.subCity && filters.subCity !== "ALL") where.subCity = filters.subCity;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { address: { contains: filters.search, mode: "insensitive" } },
        { referenceNo: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [props, total] = await Promise.all([
      db.property.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      db.property.count({ where }),
    ]);

    const formatted: AdminPropertyItem[] = props.map((p) => ({
      id: p.id,
      referenceNo: p.referenceNo,
      title: p.title,
      titleAm: p.titleAm,
      price: p.price,
      listingType: p.listingType,
      status: p.status,
      subCity: p.subCity,
      address: p.address,
      bedrooms: p.beds,
      bathrooms: p.baths,
      images: p.images,
      ownerName: p.ownerName,
      contactPhone: p.contactPhone,
      createdAt: p.createdAt.toISOString(),
      userId: p.userId,
    }));

    return { success: true, properties: formatted, total };
  } catch (err: any) {
    return { success: false, properties: [], total: 0, error: err?.message };
  }
}

/**
 * Update property status directly in db.property.
 */
export async function updateAdminPropertyStatusAction(
  propertyId: string,
  newStatus: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await assertAdmin();

    const updated = await db.property.update({
      where: { id: propertyId },
      data: { status: newStatus },
    });

    logAuditAction({
      adminName: admin.name || admin.email,
      action: "PROPERTY_STATUS_UPDATE",
      targetType: "Property",
      targetId: propertyId,
      targetLabel: `${updated.title} (${updated.referenceNo})`,
      details: `Status set to ${newStatus}`,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/properties");
    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath(`/property/${propertyId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update property status" };
  }
}

/**
 * Delete a property permanently from db.property.
 */
export async function deleteAdminPropertyAction(
  propertyId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await assertAdmin();

    const deleted = await db.property.delete({
      where: { id: propertyId },
    });

    logAuditAction({
      adminName: admin.name || admin.email,
      action: "PROPERTY_DELISTED",
      targetType: "Property",
      targetId: propertyId,
      targetLabel: `${deleted.title} (${deleted.referenceNo})`,
      details: "Property delisted and deleted by admin.",
    });

    revalidatePath("/admin");
    revalidatePath("/admin/properties");
    revalidatePath("/");
    revalidatePath("/search");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete property" };
  }
}

/**
 * Fetch real registered accounts from db.user.
 */
export async function getAdminUsersAction(filters: {
  role?: string;
  search?: string;
}): Promise<{
  success: boolean;
  users: AdminUserItem[];
  total: number;
  error?: string;
}> {
  try {
    await assertAdmin();

    const where: any = {};
    if (filters.role && filters.role !== "ALL") where.role = filters.role;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { properties: true } } },
      }),
      db.user.count({ where }),
    ]);

    const formatted: AdminUserItem[] = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      role: u.role as "USER" | "AGENT" | "ADMIN",
      emailVerified: u.emailVerified?.toISOString() || null,
      createdAt: u.createdAt.toISOString(),
      propertyCount: u._count.properties,
    }));

    return { success: true, users: formatted, total };
  } catch (err: any) {
    return { success: false, users: [], total: 0, error: err?.message };
  }
}

/**
 * Update real user role in db.user.
 */
export async function updateUserRoleAction(
  userId: string,
  newRole: "USER" | "AGENT" | "ADMIN"
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await assertAdmin();

    const updated = await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    logAuditAction({
      adminName: admin.name || admin.email,
      action: "USER_ROLE_CHANGED",
      targetType: "User",
      targetId: userId,
      targetLabel: `${updated.name || updated.email}`,
      details: `Role updated to ${newRole}`,
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update user role" };
  }
}

/**
 * Fetch runtime compliance audit logs.
 */
export async function getAdminAuditLogsAction(): Promise<{
  success: boolean;
  logs: AdminAuditLogItem[];
  error?: string;
}> {
  try {
    await assertAdmin();
    return { success: true, logs: globalThis.adminAuditLogStore || [] };
  } catch (err: any) {
    return { success: false, logs: [], error: err?.message };
  }
}
