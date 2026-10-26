"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface UserTierStatus {
  isAuthenticated: boolean;
  userId?: string;
  tier: "FREE" | "STANDARD" | "PREMIUM";
  contactCredits: number;
  isUnlimited: boolean;
  unlimitedExpiresAt: string | null;
  unlockedPropertyIds: string[];
}

export async function getUserTierStatusAction(): Promise<UserTierStatus> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        isAuthenticated: false,
        tier: "FREE",
        contactCredits: 0,
        isUnlimited: false,
        unlimitedExpiresAt: null,
        unlockedPropertyIds: [],
      };
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        unlockedProperties: {
          select: { propertyId: true },
        },
      },
    });

    if (!user) {
      return {
        isAuthenticated: false,
        tier: "FREE",
        contactCredits: 0,
        isUnlimited: false,
        unlimitedExpiresAt: null,
        unlockedPropertyIds: [],
      };
    }

    const isUnlimited = Boolean(
      user.tier === "PREMIUM" &&
        (!user.unlimitedExpiresAt || new Date(user.unlimitedExpiresAt) > new Date())
    );

    return {
      isAuthenticated: true,
      userId: user.id,
      tier: user.tier as "FREE" | "STANDARD" | "PREMIUM",
      contactCredits: user.contactCredits ?? 0,
      isUnlimited,
      unlimitedExpiresAt: user.unlimitedExpiresAt ? user.unlimitedExpiresAt.toISOString() : null,
      unlockedPropertyIds: user.unlockedProperties.map((p) => p.propertyId),
    };
  } catch (error) {
    console.error("Error getting user tier status:", error);
    return {
      isAuthenticated: false,
      tier: "FREE",
      contactCredits: 0,
      isUnlimited: false,
      unlimitedExpiresAt: null,
      unlockedPropertyIds: [],
    };
  }
}

export async function unlockPropertyContactAction(propertyId: string): Promise<{
  success: boolean;
  contactPhone?: string;
  remainingCredits?: number;
  isUnlimited?: boolean;
  alreadyUnlocked?: boolean;
  requireUpgrade?: boolean;
  requireSignIn?: boolean;
  error?: string;
  message?: string;
}> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        requireSignIn: true,
        error: "UNAUTHORIZED",
        message: "Please sign in to your ERNS account to unlock owner contact details.",
      };
    }

    // 1. Fetch user status
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        unlockedProperties: {
          where: { propertyId },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        requireSignIn: true,
        error: "USER_NOT_FOUND",
        message: "User account could not be found.",
      };
    }

    // 2. Resolve the real phone number
    let contactPhone = "+251911234567";
    try {
      const dbProp = await db.property.findUnique({
        where: { id: propertyId },
        select: { contactPhone: true, userId: true },
      });
      if (dbProp?.contactPhone) {
        contactPhone = dbProp.contactPhone;
      }
      // If user is owner, they can always see their own listing contact
      if (dbProp?.userId === userId) {
        return {
          success: true,
          contactPhone,
          alreadyUnlocked: true,
        };
      }
    } catch {
      // Fallback
    }

    // 3. If already unlocked in the past, return for free
    if (user.unlockedProperties.length > 0) {
      return {
        success: true,
        contactPhone,
        alreadyUnlocked: true,
        remainingCredits: user.contactCredits,
      };
    }

    // 4. If user has active Unlimited Pass (PREMIUM)
    const isUnlimited = Boolean(
      user.tier === "PREMIUM" &&
        (!user.unlimitedExpiresAt || new Date(user.unlimitedExpiresAt) > new Date())
    );

    if (isUnlimited) {
      // Record unlock so user history is tracked
      await db.propertyUnlock.create({
        data: {
          userId,
          propertyId,
        },
      });

      revalidatePath(`/property/${propertyId}`);
      return {
        success: true,
        contactPhone,
        isUnlimited: true,
        remainingCredits: user.contactCredits,
      };
    }

    // 5. If user has contact credits (STANDARD or earned credits)
    if (user.contactCredits > 0) {
      const [updatedUser] = await db.$transaction([
        db.user.update({
          where: { id: userId },
          data: {
            contactCredits: { decrement: 1 },
          },
        }),
        db.propertyUnlock.create({
          data: {
            userId,
            propertyId,
          },
        }),
      ]);

      revalidatePath(`/property/${propertyId}`);
      return {
        success: true,
        contactPhone,
        remainingCredits: updatedUser.contactCredits,
      };
    }

    // 6. User has 0 credits and is on Free Plan
    return {
      success: false,
      requireUpgrade: true,
      error: "INSUFFICIENT_CREDITS",
      message: "You have 0 contact credits left. Choose a plan to unlock verified owner contacts.",
    };
  } catch (error) {
    console.error("Error unlocking property contact:", error);
    return {
      success: false,
      error: "SERVER_ERROR",
      message: "Failed to unlock contact. Please try again.",
    };
  }
}

/**
 * Mock Plan Selection Action for Testing
 * Enables full end-to-end testing of Free, Standard (10 credits), and Premium (30 days)
 * without needing live payment gateways yet.
 */
export async function selectPlanMockAction(tier: "FREE" | "STANDARD" | "PREMIUM"): Promise<{
  success: boolean;
  tier: "FREE" | "STANDARD" | "PREMIUM";
  contactCredits: number;
  message: string;
  error?: string;
}> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        tier: "FREE",
        contactCredits: 0,
        error: "UNAUTHORIZED",
        message: "Please sign in to select a plan.",
      };
    }

    let credits = 0;
    let expiresAt: Date | null = null;

    if (tier === "STANDARD") {
      credits = 10;
    } else if (tier === "PREMIUM") {
      credits = 999;
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);
      expiresAt = expiry;
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: {
        tier,
        contactCredits: credits,
        unlimitedExpiresAt: expiresAt,
      },
    });

    revalidatePath("/pricing");
    return {
      success: true,
      tier: updated.tier as "FREE" | "STANDARD" | "PREMIUM",
      contactCredits: updated.contactCredits,
      message:
        tier === "FREE"
          ? "Switched to Free Explorer Plan."
          : tier === "STANDARD"
          ? "🎉 Standard Plan activated! 10 contact unlocks added to your account."
          : "🚀 VIP Unlimited Plan activated! You have 30 days of unlimited owner contacts.",
    };
  } catch (error) {
    console.error("Error selecting mock plan:", error);
    return {
      success: false,
      tier: "FREE",
      contactCredits: 0,
      error: "SERVER_ERROR",
      message: "Failed to update membership plan.",
    };
  }
}
