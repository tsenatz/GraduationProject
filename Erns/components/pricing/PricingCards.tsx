"use client";

import React, { useState } from "react";
import { Check, Sparkles, Shield, Loader2, Info } from "lucide-react";
import styles from "./PricingCards.module.css";
import { selectPlanMockAction } from "@/lib/actions/tier";

export interface PricingCardsProps {
  currentTier?: "FREE" | "STANDARD" | "PREMIUM";
  currentCredits?: number;
  isUnlimited?: boolean;
  onPlanSelected?: (tier: "FREE" | "STANDARD" | "PREMIUM") => void;
  isModal?: boolean;
}

export function PricingCards({
  currentTier = "FREE",
  currentCredits = 0,
  isUnlimited = false,
  onPlanSelected,
  isModal = false,
}: PricingCardsProps) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSelectPlan = async (tier: "FREE" | "STANDARD" | "PREMIUM") => {
    try {
      setLoadingTier(tier);
      setMessage(null);
      const res = await selectPlanMockAction(tier);
      if (res.success) {
        setMessage(res.message);
        if (onPlanSelected) {
          onPlanSelected(tier);
        }
      } else {
        setMessage(res.message || "Could not select plan.");
      }
    } catch {
      setMessage("An unexpected error occurred.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className={isModal ? styles.modalContainer : styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Pricing plans</h2>
        <p className={styles.subtitle}>
          Choose the right plan for your needs. Connect directly with verified property owners in Addis Ababa.
        </p>
        {message && (
          <div className={styles.testingNotice} style={{ background: "#ecfdf5", color: "#065f46", marginTop: 16 }}>
            <Sparkles size={16} />
            <span>{message}</span>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {/* Tier 1: Starter / Free */}
        <div className={styles.card}>
          <div className={`${styles.topBox} ${styles.topBoxDefault}`}>
            <div className={styles.badgeRow}>
              <span className={`${styles.badge} ${styles.badgeDefault}`}>Starter</span>
              {currentTier === "FREE" && !isUnlimited && (
                <span className={styles.activePlanPill}>Current Plan</span>
              )}
            </div>

            <div className={styles.priceWrapper}>
              <span className={styles.priceValue}>0 ETB</span>
              <span className={styles.priceUnit}>/ forever</span>
            </div>

            <p className={styles.cardDescription}>Perfect for casual browsing & discovering homes</p>

            <button
              className={`${styles.actionButton} ${
                currentTier === "FREE" && !isUnlimited ? styles.actionButtonActive : ""
              }`}
              onClick={() => handleSelectPlan("FREE")}
              disabled={loadingTier !== null || (currentTier === "FREE" && !isUnlimited)}
            >
              {loadingTier === "FREE" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : currentTier === "FREE" && !isUnlimited ? (
                "Current Plan"
              ) : (
                "Switch to Free"
              )}
            </button>
          </div>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIcon} />
              <span>Full access to browse all properties</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIcon} />
              <span>HD photos & interactive Addis Ababa map</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIcon} />
              <span>Filter by sub-city, price & specs</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIcon} />
              <span>Save favorites & compare properties</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIcon} />
              <span style={{ color: "#64748b" }}>Owner contacts masked (upgrade to reveal)</span>
            </div>
          </div>
        </div>

        {/* Tier 2: Seeker Pack (Professional / Middle Featured Card) */}
        <div className={styles.card} style={{ borderColor: "rgba(99, 102, 241, 0.3)" }}>
          <div className={`${styles.topBox} ${styles.topBoxFeatured}`}>
            <div className={styles.badgeRow}>
              <span className={`${styles.badge} ${styles.badgeFeatured}`}>
                <Sparkles size={12} color="#4f46e5" />
                Seeker Pack
              </span>
              {currentCredits > 0 && (
                <span className={styles.activePlanPill}>{currentCredits} Credits Left</span>
              )}
            </div>

            <div className={styles.priceWrapper}>
              <span className={styles.priceValue}>290 ETB</span>
              <span className={styles.priceUnit}>/ 10 Contacts</span>
            </div>

            <p className={styles.cardDescription}>Perfect for active renters & home seekers</p>

            <button
              className={styles.actionButton}
              onClick={() => handleSelectPlan("STANDARD")}
              disabled={loadingTier !== null}
            >
              {loadingTier === "STANDARD" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Get 10 Contacts"
              )}
            </button>
          </div>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIconHighlight} />
              <span><strong>10 Verified Owner Unlocks</strong></span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIconHighlight} />
              <span>Unlocked contacts <strong>never expire</strong></span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIconHighlight} />
              <span>Direct phone call, SMS & Telegram access</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIconHighlight} />
              <span>Verified seller contact guarantee</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIconHighlight} />
              <span>Priority tour & inquiry routing</span>
            </div>
          </div>
        </div>

        {/* Tier 3: VIP Unlimited (Enterprise) */}
        <div className={styles.card}>
          <div className={`${styles.topBox} ${styles.topBoxDefault}`}>
            <div className={styles.badgeRow}>
              <span className={`${styles.badge} ${styles.badgeDefault}`}>
                <Shield size={12} />
                VIP Unlimited
              </span>
              {isUnlimited && (
                <span className={styles.activePlanPill}>Pass Active</span>
              )}
            </div>

            <div className={styles.priceWrapper}>
              <span className={styles.priceValue}>890 ETB</span>
              <span className={styles.priceUnit}>/ 30 days</span>
            </div>

            <p className={styles.cardDescription}>For serious buyers, expats & investors</p>

            <button
              className={`${styles.actionButton} ${
                isUnlimited ? styles.actionButtonActive : ""
              }`}
              onClick={() => handleSelectPlan("PREMIUM")}
              disabled={loadingTier !== null || isUnlimited}
            >
              {loadingTier === "PREMIUM" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isUnlimited ? (
                "Unlimited Active"
              ) : (
                "Get Unlimited Pass"
              )}
            </button>
          </div>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIcon} />
              <span><strong>Unlimited Owner & Agent Unlocks</strong></span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIcon} />
              <span>Full 30-day all-inclusive VIP pass</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIcon} />
              <span>Direct owner negotiation channel</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIcon} />
              <span>Schedule instant private property tours</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} strokeWidth={2.5} className={styles.checkIcon} />
              <span>Priority ERNS concierge support</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.testingNotice}>
        <Info size={15} />
        <span>
          <strong>Testing Mode:</strong> Clicking "Get 10 Contacts" or "Get Unlimited Pass" instantly activates the plan so you can test unlocking properties.
        </span>
      </div>
    </div>
  );
}
