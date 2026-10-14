"use client";

import React, { useState } from "react";
import { X, Check, Wallet, Building2, User, Calendar, Receipt } from "lucide-react";
import { RentPaymentRecord, recordRentPaymentAction } from "@/lib/actions/rentals";
import styles from "./AddRentalPropertyModal/AddRentalPropertyModal.module.css";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: RentPaymentRecord | null;
  onPaymentRecorded: () => void;
}

export function RecordPaymentModal({
  isOpen,
  onClose,
  payment,
  onPaymentRecorded,
}: RecordPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<
    "Telebirr" | "CBE Birr" | "Bank Transfer" | "Cash" | "Check"
  >("Telebirr");
  const [paidDate, setPaidDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [referenceNo, setReferenceNo] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !payment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await recordRentPaymentAction(payment.id, {
        paidDate,
        paymentMethod,
        referenceNo: referenceNo.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      if (res.success) {
        onPaymentRecorded();
        onClose();
      } else {
        setError(res.error || "Failed to record payment");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "560px", padding: "2rem" }}
      >
        <div className={styles.modalHeader} style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                backgroundColor: "rgba(5, 150, 105, 0.12)",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Wallet size={22} />
            </div>
            <div>
              <h2 className={styles.modalTitle} style={{ fontSize: "1.35rem" }}>
                Record Rent Payment
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: 0 }}>
                Log incoming rent payment and issue a receipt record
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              marginBottom: "1.25rem",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            backgroundColor: "#F8FAFC",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.85rem",
          }}
        >
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
              Property & Unit
            </span>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0A1931" }}>
              {payment.unitName}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748B" }}>{payment.propertyTitle}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
              Tenant
            </span>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0A1931" }}>
              {payment.tenantName}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748B" }}>{payment.tenantPhone}</div>
          </div>
          <div style={{ gridColumn: "span 2", paddingTop: "0.5rem", borderTop: "1px solid rgba(15, 23, 42, 0.06)" }}>
            <span style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
              Expected Amount
            </span>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#059669" }}>
              {payment.amountETB.toLocaleString()} ETB
              <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#64748B", marginLeft: "0.5rem" }}>
                for {payment.periodMonth}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Payment Method
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {(["Telebirr", "CBE Birr", "Bank Transfer", "Cash", "Check"] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    padding: "0.6rem 0.5rem",
                    borderRadius: "8px",
                    border: `1.5px solid ${paymentMethod === method ? "#0A1931" : "rgba(15, 23, 42, 0.12)"}`,
                    backgroundColor: paymentMethod === method ? "#0A1931" : "#FFFFFF",
                    color: paymentMethod === method ? "#FFFFFF" : "#0A1931",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                Date Paid
              </label>
              <input
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(15, 23, 42, 0.15)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                Transaction / Ref # (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. TB-8921829"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(15, 23, 42, 0.15)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Notes / Receipt Details (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Paid in full via Telebirr merchant QR"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid rgba(15, 23, 42, 0.15)",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "0.7rem 1.25rem",
                borderRadius: "8px",
                border: "1px solid rgba(15, 23, 42, 0.15)",
                background: "transparent",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "0.7rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#059669",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {isSubmitting ? "Recording..." : "Confirm & Mark as Paid"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
