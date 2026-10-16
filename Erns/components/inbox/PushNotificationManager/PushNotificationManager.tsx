"use client";

import React, { useState, useEffect } from "react";
import { Bell, BellRing, Check, Send, Volume2 } from "lucide-react";
import {
  savePushSubscriptionAction,
  sendTestPushNotificationAction,
} from "@/lib/actions/inbox";
import { useLanguage } from "@/components/providers/LanguageProvider";
import styles from "./PushNotificationManager.module.css";

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BIjhmwENobsQmYSuY54Z9NU4dF8JpZh3ExgZK6KAYN2wULER75lY8upQdJQCrx6SAJ44ENJmDw3lDyZlMmtQae0";

/**
 * Utility to synthesize a clean, gentle audio chime using Web Audio API
 * No external mp3 network download needed!
 */
export function playNotificationSound() {
  try {
    if (typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // First note: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second note: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.1);
    gain2.gain.setValueAtTime(0.15, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.5);
  } catch {
    // Ignore audio permission or playback errors
  }
}

function urlBase64ToBufferSource(base64String: string): BufferSource {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return buffer;
}

export const PushNotificationManager: React.FC = () => {
  const { isAmharic } = useLanguage();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Check if already subscribed in service worker
      navigator.serviceWorker.ready
        .then((reg) => reg.pushManager.getSubscription())
        .then((sub) => {
          if (sub) {
            setIsSubscribed(true);
          }
        })
        .catch(() => {
          // Ignore
        });
    }
  }, []);

  const handleEnablePush = async () => {
    if (!isSupported) return;
    setIsLoading(true);

    try {
      // 1. Request notification permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setIsLoading(false);
        return;
      }

      // 2. Register Service Worker if not registered yet
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // 3. Subscribe to push manager with VAPID applicationServerKey
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        const convertedVapidKey = urlBase64ToBufferSource(VAPID_PUBLIC_KEY);
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      }

      // 4. Save subscription to server
      const p256dh = sub.getKey("p256dh");
      const auth = sub.getKey("auth");

      if (p256dh && auth) {
        const subJson = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(p256dh)))),
            auth: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(auth)))),
          },
        };

        await savePushSubscriptionAction(subJson);
      }

      setIsSubscribed(true);
      playNotificationSound();
    } catch (err) {
      console.error("Failed to enable Web Push notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestNotification = async () => {
    setIsTesting(true);
    playNotificationSound();

    try {
      await sendTestPushNotificationAction();
    } catch (err) {
      console.warn("Test push error:", err);
    } finally {
      setIsTesting(false);
    }
  };

  if (!isSupported || isDismissed) {
    return null;
  }

  return (
    <div className={styles.bannerContainer} role="region" aria-label="Push notifications banner">
      <div className={styles.leftInfo}>
        <div
          className={`${styles.iconCircle} ${
            isSubscribed ? styles.iconCircleActive : ""
          }`}
        >
          {isSubscribed ? <BellRing size={18} /> : <Bell size={18} />}
        </div>
        <div className={styles.textGroup}>
          <div className={styles.titleRow}>
            <span className={styles.title}>
              {isAmharic ? "የቀጥታ የበስተጀርባ ማሳወቂያዎች" : "Background Push Notifications"}
            </span>
            {isSubscribed && (
              <span className={styles.statusPill}>
                <Check size={11} />
                <span>{isAmharic ? "ነቅቷል" : "Active"}</span>
              </span>
            )}
          </div>
          <p className={styles.desc}>
            {isSubscribed
              ? isAmharic
                ? "የድር ጣቢያው ዝግ ቢሆንም አዳዲስ መልዕክቶች እና የጉብኝት ጥያቄዎች ሲደርሱዎ ማስጠንቀቂያ ይደርስዎታል።"
                : "Receive alerts for new inquiries and tour requests even when your browser is closed."
              : isAmharic
              ? "የድር መስኮትዎ ቢዘጋም ፈጣን መልዕክት ለመቀበል ማሳወቂያዎችን ያንቁ።"
              : "Enable browser push alerts to stay notified when buyers or sellers reply, even when offline."}
          </p>
        </div>
      </div>

      <div className={styles.actionsGroup}>
        {isSubscribed ? (
          <button
            type="button"
            className={styles.testBtn}
            onClick={handleSendTestNotification}
            disabled={isTesting}
            title={isAmharic ? "የሙከራ ማሳወቂያ ላክ" : "Send Test Background Notification"}
          >
            <Send size={13} />
            <span>
              {isTesting
                ? isAmharic
                  ? "በመላክ ላይ..."
                  : "Sending..."
                : isAmharic
                ? "ማሳወቂያ ሞክር"
                : "Send Test Alert"}
            </span>
          </button>
        ) : (
          <button
            type="button"
            className={styles.enableBtn}
            onClick={handleEnablePush}
            disabled={isLoading || permission === "denied"}
          >
            <Bell size={14} />
            <span>
              {isLoading
                ? isAmharic
                  ? "በማገናኘት ላይ..."
                  : "Enabling..."
                : permission === "denied"
                ? isAmharic
                  ? "በአሳሽ ታግዷል"
                  : "Blocked in Browser"
                : isAmharic
                ? "ማሳወቂያዎችን አንቃ"
                : "Enable Alerts"}
            </span>
          </button>
        )}

        <button
          type="button"
          className={styles.dismissBtn}
          onClick={() => setIsDismissed(true)}
          title={isAmharic ? "ዝጋ" : "Dismiss"}
          aria-label="Dismiss banner"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PushNotificationManager;
