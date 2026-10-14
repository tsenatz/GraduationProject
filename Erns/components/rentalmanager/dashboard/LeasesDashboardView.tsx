"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Check,
  X,
  Phone,
  Printer,
  Calendar,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import {
  getLandlordLeasesAction,
  terminateLeaseAction,
  LeaseRecord,
} from "@/lib/actions/rentals";
import { CreateLeaseModal } from "./CreateLeaseModal";
import styles from "./RentalManagerDashboard.module.css";

interface LeasesDashboardViewProps {
  userName?: string;
}

export function LeasesDashboardView({
  userName = "Landlord",
}: LeasesDashboardViewProps) {
  const [leases, setLeases] = useState<LeaseRecord[]>([]);
  const [stats, setStats] = useState({
    totalActive: 0,
    expiringSoon: 0,
    expired: 0,
    monthlyContractedETB: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "ACTIVE" | "EXPIRING_SOON" | "TERMINATED"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingLease, setViewingLease] = useState<LeaseRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await getLandlordLeasesAction();
      if (res.success && res.leases) {
        setLeases(res.leases);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to load leases:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLeaseCreated = () => {
    setToastMessage("Lease agreement created and registered successfully!");
    loadData();
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTerminate = async (leaseId: string) => {
    if (!window.confirm("Are you sure you want to terminate this lease agreement?")) {
      return;
    }
    try {
      const res = await terminateLeaseAction(leaseId);
      if (res.success) {
        setToastMessage("Lease status updated to Terminated.");
        loadData();
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error("Failed to terminate lease:", err);
    }
  };

  const filteredLeases = useMemo(() => {
    return leases.filter((l) => {
      if (filterStatus !== "ALL" && l.status !== filterStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTenant = l.tenantName.toLowerCase().includes(q);
        const matchesProp = l.propertyTitle.toLowerCase().includes(q);
        const matchesUnit = l.unitName.toLowerCase().includes(q);
        const matchesNum = l.leaseNumber.toLowerCase().includes(q);
        if (!matchesTenant && !matchesProp && !matchesUnit && !matchesNum) {
          return false;
        }
      }
      return true;
    });
  }, [leases, filterStatus, searchQuery]);

  return (
    <div className={styles.mainContent}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toastBanner}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            className={styles.toastCloseBtn}
            onClick={() => setToastMessage(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className={styles.pageHeaderRow}>
        <div>
          <h1 className={styles.pageTitle} style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            Leases & Digital Agreements
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#64748B", margin: 0 }}>
            Standard residential contracts, security deposits, utility clauses, and expiration renewal tracking.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={loadData}
            className={styles.actionBtnOutline}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1rem" }}
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            className={styles.addPropertyHeaderBtn}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={18} />
            <span>New Lease Agreement</span>
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className={styles.statsRibbon}>
        <div className={styles.statCard}>
          <div
            className={styles.statIconBox}
            style={{ backgroundColor: "rgba(10, 25, 49, 0.08)", color: "#0A1931" }}
          >
            <FileText size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Active Leases</span>
            <span className={styles.statValue}>{stats.totalActive}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIconBox}
            style={{ backgroundColor: "rgba(217, 119, 6, 0.12)", color: "#D97706" }}
          >
            <AlertTriangle size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Expiring (≤60 Days)</span>
            <span className={styles.statValue} style={{ color: "#D97706" }}>
              {stats.expiringSoon}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIconBox}
            style={{ backgroundColor: "rgba(5, 150, 105, 0.12)", color: "#059669" }}
          >
            <CheckCircle2 size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Contracted Rent</span>
            <span className={styles.statValue} style={{ color: "#059669" }}>
              {stats.monthlyContractedETB.toLocaleString()}{" "}
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>ETB/mo</span>
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIconBox}
            style={{ backgroundColor: "rgba(148, 163, 184, 0.15)", color: "#64748B" }}
          >
            <Clock size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Terminated / Past</span>
            <span className={styles.statValue} style={{ color: "#64748B" }}>
              {stats.expired}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Toolbar */}
      <div className={styles.toolbarRow}>
        <div className={styles.filterTabs}>
          {(["ALL", "ACTIVE", "EXPIRING_SOON", "TERMINATED"] as const).map((status) => (
            <button
              key={status}
              type="button"
              className={`${styles.filterTabBtn} ${filterStatus === status ? styles.filterTabBtnActive : ""}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === "ALL" && `All (${leases.length})`}
              {status === "ACTIVE" && "Active"}
              {status === "EXPIRING_SOON" && `Expiring Soon (${stats.expiringSoon})`}
              {status === "TERMINATED" && "Terminated / Past"}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search lease #, tenant, unit, or property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Leases Table */}
      <div className={styles.ledgerContainer}>
        <div className={styles.tableResponsive}>
          <table className={styles.ledgerTable}>
            <thead>
              <tr>
                <th>Lease ID</th>
                <th>Property & Unit</th>
                <th>Tenant & Contact</th>
                <th>Rent & Deposit</th>
                <th>Lease Term</th>
                <th>Status</th>
                <th>Utilities & Rules</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeases.length > 0 ? (
                filteredLeases.map((lease) => {
                  const isActive = lease.status === "ACTIVE";
                  const isExpiring = lease.status === "EXPIRING_SOON";

                  return (
                    <tr key={lease.id}>
                      <td>
                        <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0A1931" }}>
                          {lease.leaseNumber}
                        </span>
                        <div style={{ fontSize: "0.72rem", color: "#64748B" }}>
                          Signed {lease.signedDate}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#0A1931" }}>{lease.unitName}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748B" }}>
                          {lease.propertyTitle}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#0A1931" }}>{lease.tenantName}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748B" }}>{lease.tenantPhone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: "#0A1931" }}>
                          {lease.monthlyRentETB.toLocaleString()} ETB
                          <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "#64748B" }}>
                            /mo
                          </span>
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#64748B" }}>
                          Deposit: {lease.depositETB.toLocaleString()} ETB
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1E293B" }}>
                          {lease.startDate} &rarr; {lease.endDate}
                        </div>
                        {isExpiring && (
                          <div style={{ fontSize: "0.72rem", color: "#D97706", fontWeight: 700 }}>
                            Renewal window open
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          className={`${styles.pillStatus} ${
                            isActive
                              ? styles.pillPaid
                              : isExpiring
                              ? styles.pillPending
                              : styles.pillOverdue
                          }`}
                        >
                          {lease.status === "EXPIRING_SOON" ? "Expiring Soon" : lease.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", maxWidth: "220px" }}>
                          {lease.utilitiesIncluded.slice(0, 2).map((u) => (
                            <span
                              key={u}
                              style={{
                                fontSize: "0.7rem",
                                backgroundColor: "#F1F5F9",
                                color: "#475569",
                                padding: "0.15rem 0.4rem",
                                borderRadius: "4px",
                              }}
                            >
                              {u}
                            </span>
                          ))}
                          {lease.utilitiesIncluded.length > 2 && (
                            <span style={{ fontSize: "0.7rem", color: "#64748B" }}>
                              +{lease.utilitiesIncluded.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <button
                            type="button"
                            className={styles.actionBtnOutline}
                            style={{ padding: "0.4rem 0.65rem", fontSize: "0.78rem" }}
                            onClick={() => setViewingLease(lease)}
                          >
                            View Agreement
                          </button>
                          {lease.status !== "TERMINATED" && (
                            <button
                              type="button"
                              className={styles.actionBtnOutline}
                              style={{
                                padding: "0.4rem 0.65rem",
                                fontSize: "0.78rem",
                                color: "#DC2626",
                                borderColor: "rgba(220, 38, 38, 0.2)",
                              }}
                              onClick={() => handleTerminate(lease.id)}
                            >
                              Terminate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>
                    No lease agreements match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Lease Modal */}
      <CreateLeaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onLeaseCreated={handleLeaseCreated}
      />

      {/* View Agreement Details Modal */}
      {viewingLease && (
        <div
          className={styles.modalOverlay}
          onClick={() => setViewingLease(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "600px", padding: "2.25rem" }}
          >
            <div className={styles.modalHeader} style={{ marginBottom: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                  Residential Lease Agreement
                </span>
                <h2 className={styles.modalTitle} style={{ fontSize: "1.35rem" }}>
                  {viewingLease.leaseNumber}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingLease(null)}
                className={styles.closeBtn}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem" }}>
              <div style={{ background: "#F8FAFC", padding: "1rem", borderRadius: "10px" }}>
                <div><strong>Property:</strong> {viewingLease.propertyTitle} ({viewingLease.unitName})</div>
                <div><strong>Tenant:</strong> {viewingLease.tenantName} ({viewingLease.tenantPhone})</div>
                <div><strong>Duration:</strong> {viewingLease.startDate} to {viewingLease.endDate}</div>
                <div><strong>Monthly Rent:</strong> {viewingLease.monthlyRentETB.toLocaleString()} ETB</div>
                <div><strong>Security Deposit:</strong> {viewingLease.depositETB.toLocaleString()} ETB</div>
              </div>

              <div>
                <strong style={{ display: "block", marginBottom: "0.3rem" }}>Included Services & Utilities:</strong>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#334155" }}>
                  {viewingLease.utilitiesIncluded.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong style={{ display: "block", marginBottom: "0.3rem" }}>Lease Rules & Clauses:</strong>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#334155" }}>
                  {viewingLease.rules.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  className={styles.actionBtnOutline}
                  onClick={() => window.print()}
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <Printer size={16} />
                  <span>Print Lease Copy</span>
                </button>
                <button
                  type="button"
                  className={styles.actionBtnSmall}
                  onClick={() => setViewingLease(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
