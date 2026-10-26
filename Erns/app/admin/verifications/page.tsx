"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
  Search,
  Check,
  X,
  FileText,
  Phone,
  Mail,
  Building,
  Briefcase,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  getAdminAgentApplicationsAction,
  approveAgentAction,
  rejectAgentAction,
  type AgentApplicationItem,
} from "@/lib/actions/admin";
import styles from "../admin.module.css";

export default function AgentVerificationsPage() {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<AgentApplicationItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [selectedApp, setSelectedApp] = useState<AgentApplicationItem | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadApplications = async () => {
    const res = await getAdminAgentApplicationsAction({
      status: activeTab,
      search: searchQuery,
    });
    if (res.success) {
      setApplications(res.applications);
      setPendingCount(res.pendingCount);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [activeTab, searchQuery]);

  const handleApprove = (app: AgentApplicationItem) => {
    startTransition(async () => {
      const res = await approveAgentAction(app.id);
      if (res.success) {
        setActionMessage({
          type: "success",
          text: `Successfully verified and granted AGENT role to ${app.fullName}.`,
        });
        setSelectedApp(null);
        loadApplications();
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to approve agent." });
      }
    });
  };

  const handleReject = () => {
    if (!selectedApp) return;
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejecting the application.");
      return;
    }

    startTransition(async () => {
      const res = await rejectAgentAction(selectedApp.id, rejectionReason);
      if (res.success) {
        setActionMessage({
          type: "success",
          text: `Application for ${selectedApp.fullName} has been rejected.`,
        });
        setRejectModalOpen(false);
        setSelectedApp(null);
        setRejectionReason("");
        loadApplications();
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to reject agent." });
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          style={{
            padding: "0.85rem 1.25rem",
            borderRadius: "12px",
            marginBottom: "1.25rem",
            fontSize: "0.88rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: actionMessage.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: actionMessage.type === "success" ? "#047857" : "#b91c1c",
            border: `1px solid ${actionMessage.type === "success" ? "#10b981" : "#ef4444"}`,
          }}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ================= TABS & FILTER BAR (Image Inspo) ================= */}
      <div className={styles.filterBar}>
        <div className={styles.tabsList}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "ALL" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("ALL")}
          >
            All Applications
            <span className={styles.tabBadge}>{applications.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "PENDING" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("PENDING")}
          >
            Pending Review
            {pendingCount > 0 && <span className={styles.tabBadge}>{pendingCount}</span>}
          </button>

          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "VERIFIED" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("VERIFIED")}
          >
            Verified Agents
          </button>

          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "REJECTED" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("REJECTED")}
          >
            Rejected
          </button>
        </div>

        <div className={styles.filterActions}>
          <div className={styles.searchBox} style={{ width: "220px" }}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, TIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* ================= TABLE LISTING (Image Inspo) ================= */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeaderRow}>
          <span>Reference</span>
          <span>Applicant</span>
          <span>Agency / TIN</span>
          <span>Date</span>
          <span>Status</span>
          <span style={{ textAlign: "right" }}>Actions</span>
        </div>

        {applications.length === 0 ? (
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
            <AlertCircle size={36} style={{ margin: "0 auto 0.75rem", color: "#4a7fa7" }} />
            <h3 style={{ fontSize: "1.1rem", color: "#0a1931", marginBottom: "0.25rem" }}>
              No applications match criteria
            </h3>
            <p style={{ fontSize: "0.85rem" }}>
              Try switching tabs or adjusting your search keywords.
            </p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className={styles.cardRow}
              onClick={() => setSelectedApp(app)}
            >
              <div className={styles.rowId}>
                {app.referenceNo || `#${app.id.slice(0, 8)}`}
              </div>

              <div className={styles.nameCluster}>
                <div className={styles.userAvatarThumb}>
                  {app.fullName.charAt(0).toUpperCase()}
                </div>
                <div className={styles.userNameDetails}>
                  <span className={styles.rowPrimaryText}>{app.fullName}</span>
                  <span className={styles.rowSecondaryText}>{app.email}</span>
                </div>
              </div>

              <div className={styles.rowDetails}>
                <span className={styles.rowPrimaryText}>
                  {app.brokerage || "Independent"}
                </span>
                <span className={styles.rowSecondaryText}>
                  {app.tinNumber || "TIN Pending"}
                </span>
              </div>

              <div className={styles.rowDate}>
                {new Date(app.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>

              <div>
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
              </div>

              <div className={styles.rowActions} onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className={styles.actionBtnInspect}
                  onClick={() => setSelectedApp(app)}
                  title="View full credentials"
                >
                  Inspect
                </button>

                {app.verificationStatus === "PENDING" && (
                  <button
                    type="button"
                    className={styles.actionBtnApprove}
                    disabled={isPending}
                    onClick={() => handleApprove(app)}
                    title="Quick Approve"
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= PAGINATION BAR ================= */}
      <div className={styles.paginationRow}>
        <span className={styles.paginationText}>
          Showing 1 to {applications.length} of {applications.length} entries
        </span>
        <div className={styles.paginationControls}>
          <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
        </div>
      </div>

      {/* ================= INSPECTION MODAL ================= */}
      {selectedApp && !rejectModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedApp(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleCluster}>
                <h3 className={styles.modalTitle}>{selectedApp.fullName}</h3>
                <span className={styles.modalSubtitle}>
                  {selectedApp.referenceNo || selectedApp.id} • {selectedApp.brokerage || "Independent"}
                </span>
              </div>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => setSelectedApp(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Status Banner */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "14px",
                  backgroundColor:
                    selectedApp.verificationStatus === "PENDING"
                      ? "#fffbeb"
                      : selectedApp.verificationStatus === "VERIFIED"
                      ? "#ecfdf5"
                      : "#fef2f2",
                }}
              >
                <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                  Application Status: {selectedApp.verificationStatus}
                </span>
                <span style={{ fontSize: "0.8rem", color: "#4a7fa7" }}>
                  Submitted on {new Date(selectedApp.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Grid of Verified Credentials */}
              <div className={styles.modalGrid}>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Taxpayer ID (TIN)</span>
                  <span className={styles.modalFieldValue}>{selectedApp.tinNumber || "Not provided"}</span>
                </div>

                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Commercial License</span>
                  <span className={styles.modalFieldValue}>{selectedApp.licenseNumber || "Standard Real Estate"}</span>
                </div>

                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Phone Number</span>
                  <span className={styles.modalFieldValue}>{selectedApp.phone || "No phone"}</span>
                </div>

                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Professional Email</span>
                  <span className={styles.modalFieldValue}>{selectedApp.email}</span>
                </div>

                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Experience</span>
                  <span className={styles.modalFieldValue}>{selectedApp.experience || "Not specified"}</span>
                </div>

                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Sub-Cities Covered</span>
                  <span className={styles.modalFieldValue}>
                    {selectedApp.serviceAreas?.join(", ") || "Addis Ababa General"}
                  </span>
                </div>
              </div>

              {/* Uploaded Verification Document */}
              <div className={styles.docPreviewBox}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0a1931" }}>
                    Uploaded Commercial License / TIN Certificate
                  </span>
                  {selectedApp.documentUrl && (
                    <a
                      href={selectedApp.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.8rem",
                        color: "#4a7fa7",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Open Full Size <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                {selectedApp.documentUrl ? (
                  <div style={{ position: "relative", width: "100%", height: "200px" }}>
                    <Image
                      src={selectedApp.documentUrl}
                      alt="Verification Document"
                      fill
                      className={styles.docImage}
                    />
                  </div>
                ) : (
                  <div style={{ padding: "1.5rem", textAlign: "center", color: "#4a7fa7", fontSize: "0.85rem" }}>
                    No digital document was attached with this application.
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setSelectedApp(null)}
              >
                Close
              </button>

              {selectedApp.verificationStatus !== "REJECTED" && (
                <button
                  type="button"
                  className={styles.btnReject}
                  onClick={() => setRejectModalOpen(true)}
                  disabled={isPending}
                >
                  Reject Application
                </button>
              )}

              {selectedApp.verificationStatus !== "VERIFIED" && (
                <button
                  type="button"
                  className={styles.btnApprove}
                  onClick={() => handleApprove(selectedApp)}
                  disabled={isPending}
                >
                  Approve & Grant AGENT Role
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= REJECTION REASON MODAL ================= */}
      {rejectModalOpen && selectedApp && (
        <div className={styles.modalBackdrop} onClick={() => setRejectModalOpen(false)}>
          <div className={styles.modalCard} style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleCluster}>
                <h3 className={styles.modalTitle}>Reject Application</h3>
                <span className={styles.modalSubtitle}>{selectedApp.fullName}</span>
              </div>
              <button type="button" className={styles.iconButton} onClick={() => setRejectModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ fontSize: "0.88rem", color: "#4a7fa7" }}>
                Please provide an official compliance rejection reason. This will be recorded in the audit trail:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                placeholder="e.g. Expired business license, invalid TIN number, or missing documentation..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(74, 127, 167, 0.3)",
                  fontSize: "0.88rem",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.btnSecondary} onClick={() => setRejectModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className={styles.btnReject} onClick={handleReject} disabled={isPending}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
