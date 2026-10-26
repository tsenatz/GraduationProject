"use client";

import React, { useState, useEffect } from "react";
import {
  ScrollText,
  ShieldCheck,
  Building,
  UserCheck,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { getAdminAuditLogsAction, type AdminAuditLogItem } from "@/lib/actions/admin";
import styles from "../admin.module.css";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLogItem[]>([]);

  useEffect(() => {
    getAdminAuditLogsAction().then((res) => {
      if (res.success && res.logs) {
        setLogs(res.logs);
      }
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Information Header */}
      <div
        style={{
          padding: "1rem 1.25rem",
          backgroundColor: "#f6fafd",
          borderRadius: "14px",
          border: "1px solid rgba(74, 127, 167, 0.18)",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
        }}
      >
        <ShieldCheck size={24} style={{ color: "#0a1931", flexShrink: 0 }} />
        <div>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0a1931" }}>
            Immutable Compliance Audit Trail
          </h4>
          <p style={{ fontSize: "0.82rem", color: "#4a7fa7" }}>
            Every approval, status alteration, role reassignment, and property delisting is recorded permanently for legal compliance and accountability.
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className={styles.tableContainer}>
        <div
          className={styles.tableHeaderRow}
          style={{ gridTemplateColumns: "140px 180px 2fr 1.5fr 160px" }}
        >
          <span>Log ID</span>
          <span>Action</span>
          <span>Target Item</span>
          <span>Compliance Details</span>
          <span style={{ textAlign: "right" }}>Timestamp</span>
        </div>

        {logs.length === 0 ? (
          <div
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              backgroundColor: "#f6fafd",
              borderRadius: "16px",
              border: "1px solid rgba(74, 127, 167, 0.15)",
              color: "#4a7fa7",
            }}
          >
            <ScrollText size={36} style={{ margin: "0 auto 0.75rem", color: "#4a7fa7" }} />
            <h3 style={{ fontSize: "1.1rem", color: "#0a1931", marginBottom: "0.25rem" }}>
              No audit logs recorded yet
            </h3>
            <p style={{ fontSize: "0.85rem" }}>
              Administrative operations will appear here automatically.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={styles.cardRow}
              style={{ gridTemplateColumns: "140px 180px 2fr 1.5fr 160px" }}
            >
              <div className={styles.rowId}>#{log.id.slice(0, 10)}</div>

              <div>
                <span
                  className={`${styles.statusBadge} ${
                    log.action.includes("APPROVED")
                      ? styles.statusVerified
                      : log.action.includes("REJECTED") || log.action.includes("DELISTED")
                      ? styles.statusRejected
                      : styles.statusInfo
                  }`}
                >
                  <span className={styles.statusDot} />
                  {log.action}
                </span>
              </div>

              <div className={styles.rowDetails}>
                <span className={styles.rowPrimaryText}>{log.targetLabel}</span>
                <span className={styles.rowSecondaryText}>
                  Type: {log.targetType} • Admin: {log.adminName}
                </span>
              </div>

              <div style={{ fontSize: "0.85rem", color: "#4a7fa7" }}>
                {log.details || "Administrative update executed"}
              </div>

              <div style={{ fontSize: "0.82rem", color: "#4a7fa7", textAlign: "right" }}>
                {new Date(log.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Bar */}
      <div className={styles.paginationRow}>
        <span className={styles.paginationText}>
          Showing {logs.length} of {logs.length} audit records
        </span>
        <div className={styles.paginationControls}>
          <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
        </div>
      </div>
    </div>
  );
}
