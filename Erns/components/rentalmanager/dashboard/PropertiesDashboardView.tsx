"use client";

import { Plus, Megaphone, Building2, ShieldCheck, FileText, MessageSquare, CreditCard } from "lucide-react";
import styles from "./RentalManagerDashboard.module.css";

interface PropertiesDashboardViewProps {
  userName?: string;
  onAddProperty?: () => void;
}

export function PropertiesDashboardView({
  userName = "Tsenat",
  onAddProperty,
}: PropertiesDashboardViewProps) {
  // Extract first name if full name provided e.g. "Tsenat Zeru" -> "Tsenat"
  const firstName = userName ? userName.split(" ")[0] : "Tsenat";

  return (
    <div className={styles.mainContent}>
      {/* Top Title Row */}
      <div className={styles.pageHeaderRow}>
        <h1 className={styles.pageTitle}>Properties</h1>
      </div>

      {/* Hero Property Section Card */}
      <div className={styles.heroCard}>
        {/* Left Column: Greeting & Call to action */}
        <div className={styles.leftHeroCol}>
          {/* Custom Real Estate Vector Illustration Box */}
          <div className={styles.heroGraphic}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "16px",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.75rem",
                  boxShadow: "0 8px 20px rgba(10, 25, 49, 0.08)",
                }}
              >
                <Building2 size={38} color="#0A1931" />
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#4A7FA7" }}>
                ERNS Rental Manager
              </span>
            </div>
          </div>

          <h2 className={styles.greetingTitle}>
            Hi, {firstName}! Ready to add your property?
          </h2>

          <p className={styles.greetingSubtitle}>
            Providing some basic information is the first step
          </p>

          <p className={styles.greetingDesc}>
            Once you find a renter for your listing, you can screen them, sign the lease, and collect rent — entirely on ERNS Rental Manager
          </p>

          <button
            type="button"
            onClick={onAddProperty}
            className={styles.primaryAddBtn}
          >
            Add a property
          </button>
        </div>

        {/* Right Column: All-in-one Solution Card */}
        <div className={styles.solutionBox}>
          <div className={styles.solutionHeader}>
            <Megaphone size={22} color="#0A1931" />
          </div>

          <h3 className={styles.solutionTitle}>
            Our all-in-one solution saves time
          </h3>

          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <span className={styles.bulletDot}>•</span>
              <span>List your property for rent</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.bulletDot}>•</span>
              <span>Receive applications</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.bulletDot}>•</span>
              <span>Screen tenants</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.bulletDot}>•</span>
              <span>Message renters</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.bulletDot}>•</span>
              <span>Create and sign leases</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.bulletDot}>•</span>
              <span>Receive rent payments</span>
            </li>
          </ul>

          <button type="button" className={styles.learnMoreLink}>
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}
