"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  Check,
  RefreshCw,
  ArrowRight,
  Filter,
} from "lucide-react";
import {
  getLandlordAlertsAction,
  markAlertAsReadAction,
  markAllAlertsAsReadAction,
  LandlordAlertRecord,
} from "@/lib/actions/rentals";
import styles from "./RentalManagerDashboard.module.css";

interface AlertsDashboardViewProps {
  userName?: string;
}

export function AlertsDashboardView({
  userName = "Landlord",
}: AlertsDashboardViewProps) {
  const [alerts, setAlerts] = useState<LandlordAlertRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filterType, setFilterType] = useState<
    "ALL" | "UNREAD" | "RENT" | "APPLICATIONS"
  >("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await getLandlordAlertsAction();
      if (res.success && res.alerts) {
        setAlerts(res.alerts);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to load landlord alerts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAlertAsReadAction(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark alert as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAlertsAsReadAction();
      setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (filterType === "UNREAD" && a.isRead) return false;
      if (
        filterType === "RENT" &&
        a.type !== "RENT_DUE" &&
        a.type !== "RENT_OVERDUE"
      )
        return false;
      if (filterType === "APPLICATIONS" && a.type !== "NEW_APPLICATION")
        return false;
      return true;
    });
  }, [alerts, filterType]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <AlertTriangle size={20} color="#DC2626" />;
      case "warning":
        return <Clock size={20} color="#D97706" />;
      case "success":
        return <CheckCircle2 size={20} color="#059669" />;
      case "info":
      default:
        return <Info size={20} color="#4A7FA7" />;
    }
  };

  return (
    <div className={styles.mainContent}>
      {/* Page Header */}
      <div className={styles.pageHeaderRow}>
        <div>
          <h1 className={styles.pageTitle} style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            Alerts & Activity Feed
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#64748B", margin: 0 }}>
            Real-time notifications on overdue rent, tenant leads, lease renewals, and payment receipts.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={loadData}
            className={styles.actionBtnOutline}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1rem" }}
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className={styles.actionBtnSmall}
              style={{ padding: "0.6rem 1.1rem" }}
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className={styles.statsRibbon}>
        <div className={styles.statCard}>
          <div
            className={styles.statIconBox}
            style={{ backgroundColor: "rgba(10, 25, 49, 0.08)", color: "#0A1931" }}
          >
            <Bell size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Alerts</span>
            <span className={styles.statValue}>{alerts.length}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIconBox}
            style={{ backgroundColor: "rgba(220, 38, 38, 0.12)", color: "#DC2626" }}
          >
            <AlertTriangle size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Unread Notices</span>
            <span className={styles.statValue} style={{ color: "#DC2626" }}>
              {unreadCount}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIconBox}
            style={{ backgroundColor: "rgba(217, 119, 6, 0.12)", color: "#D97706" }}
          >
            <Clock size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Action Required</span>
            <span className={styles.statValue} style={{ color: "#D97706" }}>
              {alerts.filter((a) => a.severity === "error" || a.severity === "warning").length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.toolbarRow} style={{ marginBottom: "1.5rem" }}>
        <div className={styles.filterTabs}>
          {(["ALL", "UNREAD", "RENT", "APPLICATIONS"] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={`${styles.filterTabBtn} ${filterType === type ? styles.filterTabBtnActive : ""}`}
              onClick={() => setFilterType(type)}
            >
              {type === "ALL" && `All (${alerts.length})`}
              {type === "UNREAD" && `Unread (${unreadCount})`}
              {type === "RENT" && "Rent & Payments"}
              {type === "APPLICATIONS" && "Applications"}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                backgroundColor: alert.isRead ? "#FFFFFF" : "#F8FAFC",
                border: `1.5px solid ${alert.isRead ? "rgba(15, 23, 42, 0.08)" : "rgba(74, 127, 167, 0.35)"}`,
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1.25rem",
                boxShadow: alert.isRead ? "none" : "0 4px 14px rgba(10, 25, 49, 0.04)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flex: 1 }}>
                <div style={{ marginTop: "2px" }}>{getSeverityIcon(alert.severity)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem" }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1rem",
                        fontWeight: 800,
                        color: "#0A1931",
                      }}
                    >
                      {alert.title}
                    </h3>
                    {!alert.isRead && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          backgroundColor: "rgba(220, 38, 38, 0.1)",
                          color: "#DC2626",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                        }}
                      >
                        New
                      </span>
                    )}
                  </div>
                  <p style={{ margin: "0 0 0.5rem", fontSize: "0.9rem", color: "#475569", lineHeight: 1.5 }}>
                    {alert.message}
                  </p>
                  <span style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600 }}>
                    {alert.timestamp}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                {alert.actionUrl && (
                  <Link
                    href={alert.actionUrl}
                    className={styles.actionBtnSmall}
                    style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
                  >
                    <span>{alert.actionLabel || "View"}</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
                {!alert.isRead && (
                  <button
                    type="button"
                    className={styles.actionBtnOutline}
                    style={{ fontSize: "0.8rem", padding: "0.45rem 0.75rem" }}
                    onClick={() => handleMarkAsRead(alert.id)}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "#F8FAFC",
              borderRadius: "16px",
              color: "#64748B",
            }}
          >
            <Bell size={36} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0A1931", marginBottom: "0.4rem" }}>
              No alerts in this view
            </h3>
            <p style={{ fontSize: "0.9rem", margin: 0 }}>
              All current rent notices, tenant applications, and lease updates will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
