import webpush from "web-push";
import db from "@/lib/db";
import { auth } from "@/lib/auth";

// Configure VAPID details for Web Push API
const vapidPublicKey =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BIjhmwENobsQmYSuY54Z9NU4dF8JpZh3ExgZK6KAYN2wULER75lY8upQdJQCrx6SAJ44ENJmDw3lDyZlMmtQae0";
const vapidPrivateKey =
  process.env.VAPID_PRIVATE_KEY || "pssIEniG-_Utzid9hy0SF8jaIw_Z4oiKCz91ZalxOQk";
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:support@erns.et";

try {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
} catch (err) {
  console.warn("Failed to set VAPID details for web-push:", err);
}

export interface ClientPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Global server memory store fallback for local development or offline DB mode
declare const globalThis: {
  __ernsPushSubscriptions?: Map<string, ClientPushSubscription[]>;
} & typeof global;

function getPushMemoryStore(): Map<string, ClientPushSubscription[]> {
  if (!globalThis.__ernsPushSubscriptions) {
    globalThis.__ernsPushSubscriptions = new Map();
  }
  return globalThis.__ernsPushSubscriptions;
}

/**
 * 1. Save or update a Web Push subscription for the active user
 */
export async function savePushSubscriptionAction(
  subscription: ClientPushSubscription
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id && !session?.user?.email) {
      return { success: false, error: "Authentication required to enable notifications" };
    }

    const currentUserId = session.user.id || session.user.email!;
    const currentUserEmail = session.user.email || "";

    // A. Store in PostgreSQL if configured
    if (process.env.DATABASE_URL) {
      try {
        await (db as any).pushSubscription.upsert({
          where: { endpoint: subscription.endpoint },
          update: {
            userId: currentUserId,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
            updatedAt: new Date(),
          },
          create: {
            userId: currentUserId,
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
          },
        });
      } catch (dbErr) {
        console.warn("Database pushSubscription upsert skipped:", dbErr);
      }
    }

    // B. Store in memory fallback
    const store = getPushMemoryStore();
    const existing = store.get(currentUserId) || [];
    const filtered = existing.filter((s) => s.endpoint !== subscription.endpoint);
    filtered.push(subscription);
    store.set(currentUserId, filtered);

    if (currentUserEmail && currentUserEmail !== currentUserId) {
      store.set(currentUserEmail, filtered);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save push subscription:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 2. Send background Web Push notification to a recipient user
 * Triggers even if the recipient's browser tab is closed or in background.
 */
export async function sendPushNotificationToUser(
  recipientIdOrEmail: string,
  payload: {
    title: string;
    body: string;
    url?: string;
    icon?: string;
  }
): Promise<{ sentCount: number; errors: string[] }> {
  const errors: string[] = [];
  let sentCount = 0;

  try {
    let subscriptions: ClientPushSubscription[] = [];

    // Query DB if configured
    if (process.env.DATABASE_URL) {
      try {
        const dbSubs = await (db as any).pushSubscription.findMany({
          where: {
            OR: [
              { userId: recipientIdOrEmail },
              { user: { email: recipientIdOrEmail } },
            ],
          },
        });

        if (dbSubs && dbSubs.length > 0) {
          subscriptions = dbSubs.map((s: any) => ({
            endpoint: s.endpoint,
            keys: {
              p256dh: s.p256dh,
              auth: s.auth,
            },
          }));
        }
      } catch (err) {
        console.warn("Could not query DB push subscriptions:", err);
      }
    }

    // Fallback to memory store if none found
    if (subscriptions.length === 0) {
      const store = getPushMemoryStore();
      subscriptions = store.get(recipientIdOrEmail) || [];
    }

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || "/inbox",
      icon: payload.icon || "/favicon.ico",
      tag: "erns-new-message",
    });

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys.p256dh,
              auth: sub.keys.auth,
            },
          },
          notificationPayload
        );
        sentCount++;
      } catch (err: any) {
        console.warn("Failed to push to endpoint:", err.statusCode, err.message);
        errors.push(err.message);

        // If subscription is expired or uninstalled (404/410), clean it up
        if (err.statusCode === 404 || err.statusCode === 410) {
          if (process.env.DATABASE_URL) {
            try {
              await (db as any).pushSubscription.delete({
                where: { endpoint: sub.endpoint },
              });
            } catch {
              // Ignore cleanup error
            }
          }
          const store = getPushMemoryStore();
          const currentSubs = store.get(recipientIdOrEmail) || [];
          store.set(
            recipientIdOrEmail,
            currentSubs.filter((s) => s.endpoint !== sub.endpoint)
          );
        }
      }
    }
  } catch (error: any) {
    console.error("Push notification dispatch failed:", error);
    errors.push(error.message);
  }

  return { sentCount, errors };
}

/**
 * 3. Send a test background notification to the currently logged in user
 */
export async function sendTestPushNotificationAction(): Promise<{
  success: boolean;
  sentCount: number;
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id && !session?.user?.email) {
      return { success: false, sentCount: 0, error: "Sign in to test push notifications" };
    }

    const currentUserId = session.user.id || session.user.email!;
    const res = await sendPushNotificationToUser(currentUserId, {
      title: "ERNS Real Estate • Test Notification",
      body: "Background push notifications are working perfectly! You will receive alerts when messages arrive.",
      url: "/inbox",
    });

    return {
      success: res.sentCount > 0,
      sentCount: res.sentCount,
      error: res.sentCount === 0 ? "No active push subscription found on this device" : undefined,
    };
  } catch (err: any) {
    return { success: false, sentCount: 0, error: err.message };
  }
}
