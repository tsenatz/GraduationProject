"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Wallet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Check,
  RefreshCw,
  Receipt,
  Download,
  Filter,
  X,
  Phone,
} from "lucide-react";
import {
  getLandlordRentalPaymentsAction,
  RentPaymentRecord,
  RentPaymentsSummary,
} from "@/lib/actions/rentals";
import { RecordPaymentModal } from "./RecordPaymentModal";
import styles from "./RentalManagerDashboard.module.css";

interface PaymentsDashboardViewProps {
  userName?: string;
}

export function PaymentsDashboardView({
  userName = "Landlord",
}: PaymentsDashboardViewProps) {
  const [payments, setPayments] = useState<RentPaymentRecord[]>([]);
  const [summary, setSummary] = useState<RentPaymentsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<
    "ALL" | "PAID" | "PENDING" | "OVERDUE"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [recordingPayment, setRecordingPayment] = useState<RentPaymentRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await getLandlordRentalPaymentsAction();
      if (res.success && res.payments) {
        setPayments(res.payments);
        setSummary(res.summary || null);
      }
    } catch (err) {
      console.error("Failed to load rental payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenRecordModal = (payment: RentPaymentRecord) => {
    setRecordingPayment(payment);
    setIsModalOpen(true);
  };

  const handlePaymentRecorded = () => {
    setToastMessage("Rent payment successfully recorded and receipt logged!");
    loadData();
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (selectedStatus !== "ALL" && p.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTenant = p.tenantName.toLowerCase().includes(q);
        const matchesUnit = p.unitName.toLowerCase().includes(q);
        const matchesProp = p.propertyTitle.toLowerCase().includes(q);
        const matchesRef = p.referenceNo?.toLowerCase().includes(q) || false;
        if (!matchesTenant && !matchesUnit && !matchesProp && !matchesRef) {
          return false;
        }
      }
      return true;
    });
  }, [payments, selectedStatus, searchQuery]);

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
            Rent Payments & Collections
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#64748B", margin: 0 }}>
            Track rent collections, log Telebirr/CBE transactions, and monitor tenant balances in ETB.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className={styles.actionBtnOutline}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1rem" }}
        >
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className={styles.statsRibbon}>
        <div className={styles.statCard}>
          <div
            className={styles.statIconBox}
            style={{ backgroundColor: "rgba(10, 25, 49, 0.08)", color: "#0A1931" }}
          >
            <Wallet size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Expected Rent</span>
            <span className={styles.statValue}>
              {summary ? summary.totalExpectedETB.toLocaleString() : "0"}{" "}
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>ETB</span>
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
            <span className={styles.statLabel}>Collected</span>
            <span className={styles.statValue} style={{ color: "#059669" }}>
              {summary ? summary.totalCollectedETB.toLocaleString() : "0"}{" "}
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>ETB</span>
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
            <span className={styles.statLabel}>Pending</span>
            <span className={styles.statValue} style={{ color: "#D97706" }}>
              {summary ? summary.totalPendingETB.toLocaleString() : "0"}{" "}
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>ETB</span>
            </span>
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
            <span className={styles.statLabel}>Overdue</span>
            <span className={styles.statValue} style={{ color: "#DC2626" }}>
              {summary ? summary.totalOverdueETB.toLocaleString() : "0"}{" "}
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>ETB</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Toolbar */}
      <div className={styles.toolbarRow}>
        <div className={styles.filterTabs}>
          {(["ALL", "PAID", "PENDING", "OVERDUE"] as const).map((status) => (
            <button
              key={status}
              type="button"
              className={`${styles.filterTabBtn} ${selectedStatus === status ? styles.filterTabBtnActive : ""}`}
              onClick={() => setSelectedStatus(status)}
            >
              {status === "ALL" && "All Payments"}
              {status === "PAID" && "Paid"}
              {status === "PENDING" && "Pending"}
              {status === "OVERDUE" && "Overdue"}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search tenant, unit, or ref #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className={styles.ledgerContainer}>
        <div className={styles.tableResponsive}>
          <table className={styles.ledgerTable}>
            <thead>
              <tr>
                <th>Property & Unit</th>
                <th>Tenant & Contact</th>
                <th>Amount (ETB)</th>
                <th>Period</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => {
                  const isPaid = p.status === "PAID";
                  const isOverdue = p.status === "OVERDUE";

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "#0A1931" }}>{p.unitName}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748B" }}>{p.propertyTitle}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#0A1931" }}>{p.tenantName}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748B" }}>{p.tenantPhone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: "#0A1931", fontSize: "0.95rem" }}>
                          {p.amountETB.toLocaleString()}{" "}
                          <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>ETB</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.85rem", color: "#475569" }}>{p.periodMonth}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: isOverdue ? 700 : 500,
                            color: isOverdue ? "#DC2626" : "#475569",
                          }}
                        >
                          {p.dueDate}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.pillStatus} ${
                            isPaid
                              ? styles.pillPaid
                              : isOverdue
                              ? styles.pillOverdue
                              : styles.pillPending
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td>
                        {p.paymentMethod ? (
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#0A1931" }}>
                              {p.paymentMethod}
                            </div>
                            {p.referenceNo && (
                              <div style={{ fontSize: "0.72rem", color: "#64748B" }}>
                                {p.referenceNo}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: "#94A3B8", fontSize: "0.8rem" }}>—</span>
                        )}
                      </td>
                      <td>
                        {!isPaid ? (
                          <button
                            type="button"
                            className={styles.actionBtnSmall}
                            style={{ backgroundColor: "#059669" }}
                            onClick={() => handleOpenRecordModal(p)}
                          >
                            Record Payment
                          </button>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              fontSize: "0.82rem",
                              color: "#059669",
                              fontWeight: 700,
                            }}
                          >
                            <Check size={16} /> Paid on {p.paidDate}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>
                    No payment records match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        payment={recordingPayment}
        onPaymentRecorded={handlePaymentRecorded}
      />
    </div>
  );
}
