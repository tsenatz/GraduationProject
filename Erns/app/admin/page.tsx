import React from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Users,
  UserCheck,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { getAdminDashboardStatsAction } from "@/lib/actions/admin";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const result = await getAdminDashboardStatsAction();
  const stats = result.data || {
    pendingVerifications: 3,
    totalAgents: 4,
    totalProperties: 12,
    totalUsers: 28,
    recentVerifications: [],
    recentProperties: [],
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* ================= KPI STATS CARDS ================= */}
      <section className={styles.kpiGrid} aria-label="Key Performance Indicators">
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapper} style={{ color: "#b45309", backgroundColor: "#fffbeb" }}>
            <Clock size={24} />
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{stats.pendingVerifications}</span>
            <span className={styles.kpiLabel}>Pending Agent Reviews</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapper} style={{ color: "#047857", backgroundColor: "#ecfdf5" }}>
            <BadgeCheck size={24} />
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{stats.totalAgents}</span>
            <span className={styles.kpiLabel}>Verified Professionals</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapper} style={{ color: "#0a1931", backgroundColor: "#f6fafd" }}>
            <Building2 size={24} />
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{stats.totalProperties}</span>
            <span className={styles.kpiLabel}>Properties Listed</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapper} style={{ color: "#1d4ed8", backgroundColor: "#eff6ff" }}>
            <Users size={24} />
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{stats.totalUsers}</span>
            <span className={styles.kpiLabel}>Total Accounts</span>
          </div>
        </div>
      </section>

      {/* ================= TWO-COLUMN DASHBOARD SPLIT ================= */}
      <div className={styles.dashboardSplit}>
        {/* Left Column: Urgent Agent Applications Queue */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Agent Verification Queue</h2>
            <Link href="/admin/verifications" className={styles.sectionLink}>
              View All ({stats.pendingVerifications}) <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {stats.recentVerifications.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#4a7fa7" }}>
                <CheckCircle2 size={32} style={{ color: "#10b981", margin: "0 auto 0.5rem" }} />
                <p>All agent verification applications are up to date.</p>
              </div>
            ) : (
              stats.recentVerifications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.85rem 1rem",
                    borderRadius: "14px",
                    border: "1px solid rgba(74, 127, 167, 0.15)",
                    backgroundColor: "#f6fafd",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div className={styles.userAvatarThumb}>
                      {app.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "#0a1931" }}>
                        {app.fullName}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#4a7fa7" }}>
                        {app.brokerage || "Independent Broker"} • {app.tinNumber || "No TIN"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span
                      className={`${styles.statusBadge} ${
                        app.verificationStatus === "PENDING"
                          ? styles.statusPending
                          : app.verificationStatus === "VERIFIED"
                          ? styles.statusVerified
                          : styles.statusRejected
                      }`}
                    >
                      <span className={styles.statusDot} />
                      {app.verificationStatus}
                    </span>
                    <Link
                      href={`/admin/verifications?inspect=${app.id}`}
                      className={styles.actionBtnInspect}
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Listings Moderation */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Properties</h2>
            <Link href="/admin/properties" className={styles.sectionLink}>
              Manage Listings <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {stats.recentProperties.map((prop) => (
              <div
                key={prop.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1rem",
                  borderRadius: "14px",
                  border: "1px solid rgba(74, 127, 167, 0.15)",
                  backgroundColor: "#ffffff",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "#0a1931",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "260px",
                    }}
                  >
                    {prop.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontSize: "0.78rem",
                      color: "#4a7fa7",
                      marginTop: "0.15rem",
                    }}
                  >
                    <MapPin size={13} />
                    <span>{prop.subCity || "Addis Ababa"}</span>
                    <span>•</span>
                    <strong style={{ color: "#0a1931" }}>
                      {prop.price.toLocaleString()} ETB
                    </strong>
                  </div>
                </div>

                <span
                  className={`${styles.statusBadge} ${
                    prop.status === "FOR_SALE" || prop.status === "FOR_RENT"
                      ? styles.statusVerified
                      : styles.statusPending
                  }`}
                >
                  <span className={styles.statusDot} />
                  {prop.listingType}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
