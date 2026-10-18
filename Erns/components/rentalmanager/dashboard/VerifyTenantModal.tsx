"use client";

import React, { useState } from "react";
import { X, ShieldCheck, UserCheck, FileCheck, Phone, Building2, Check } from "lucide-react";
import { RentalApplicationRecord } from "@/lib/actions/rentals";
import styles from "./AddRentalPropertyModal/AddRentalPropertyModal.module.css";

interface VerifyTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: RentalApplicationRecord | null;
  onVerified: (appId: string) => void;
}

export function VerifyTenantModal({
  isOpen,
  onClose,
  application,
  onVerified,
}: VerifyTenantModalProps) {
  const [idType, setIdType] = useState<"Fayda / National ID" | "Kebele ID" | "Passport">("Fayda / National ID");
  const [idNumber, setIdNumber] = useState("ET-94182901");
  const [isIdVerified, setIsIdVerified] = useState(true);

  const [guarantorName, setGuarantorName] = useState("Ato Girma Wolde");
  const [guarantorPhone, setGuarantorPhone] = useState("+251 91 234 5678");
  const [guarantorWorkplace, setGuarantorWorkplace] = useState("Commercial Bank of Ethiopia - Bole Branch");
  const [isGuarantorConfirmed, setIsGuarantorConfirmed] = useState(true);

  const [isEmploymentVerified, setIsEmploymentVerified] = useState(true);
  const [verificationNotes, setVerificationNotes] = useState("Fayda ID and employer verification completed via official letter.");

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !application) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onVerified(application.id);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "620px",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          padding: "2rem",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 60px -12px rgba(10, 25, 49, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.08)",
          color: "#0A1931",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "rgba(5, 150, 105, 0.12)",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#0A1931" }}>
                Tenant Verification & Screening
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "0.25rem 0 0" }}>
                Ethiopian National ID (Fayda / Kebele) and Guarantor (ዋስ) verification check
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              backgroundColor: "#F1F5F9",
              border: "none",
              borderRadius: "8px",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748B",
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Applicant Snapshot */}
        <div
          style={{
            backgroundColor: "#F8FAFC",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            marginBottom: "1.25rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <div>
            <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
              Applicant
            </span>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "#0A1931" }}>
              {application.applicantName}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#64748B" }}>{application.applicantPhone}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>
              Stated Monthly Income
            </span>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#059669" }}>
              {application.monthlyIncomeETB.toLocaleString()} ETB
            </div>
            <div style={{ fontSize: "0.82rem", color: "#64748B" }}>{application.employment}</div>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Section 1: ID Verification */}
          <div
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              borderRadius: "12px",
              padding: "1rem 1.15rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FileCheck size={18} color="#059669" />
                <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0A1931" }}>
                  1. Ethiopian ID Verification
                </span>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 700, color: "#059669", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isIdVerified}
                  onChange={(e) => setIsIdVerified(e.target.checked)}
                />
                <span>ID Document Verified</span>
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem" }}>
                  ID Document Type
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value as any)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(15, 23, 42, 0.15)",
                    backgroundColor: "#FFFFFF",
                    fontSize: "0.85rem",
                    color: "#0A1931",
                  }}
                >
                  <option value="Fayda / National ID">Fayda / National ID (ፋይዳ)</option>
                  <option value="Kebele ID">Kebele ID Card</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem" }}>
                  Official ID / Serial #
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. FAYDA-94182901"
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(15, 23, 42, 0.15)",
                    backgroundColor: "#FFFFFF",
                    fontSize: "0.85rem",
                    color: "#0A1931",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Guarantor (ዋስ) */}
          <div
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              borderRadius: "12px",
              padding: "1rem 1.15rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <UserCheck size={18} color="#059669" />
                <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0A1931" }}>
                  2. Guarantor (ዋስ) Verification
                </span>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 700, color: "#059669", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isGuarantorConfirmed}
                  onChange={(e) => setIsGuarantorConfirmed(e.target.checked)}
                />
                <span>Guarantor Contacted</span>
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem" }}>
                  Guarantor Full Name
                </label>
                <input
                  type="text"
                  value={guarantorName}
                  onChange={(e) => setGuarantorName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(15, 23, 42, 0.15)",
                    backgroundColor: "#FFFFFF",
                    fontSize: "0.85rem",
                    color: "#0A1931",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem" }}>
                  Guarantor Phone
                </label>
                <input
                  type="text"
                  value={guarantorPhone}
                  onChange={(e) => setGuarantorPhone(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(15, 23, 42, 0.15)",
                    backgroundColor: "#FFFFFF",
                    fontSize: "0.85rem",
                    color: "#0A1931",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem" }}>
                Guarantor Employer / Workplace
              </label>
              <input
                type="text"
                value={guarantorWorkplace}
                onChange={(e) => setGuarantorWorkplace(e.target.value)}
                placeholder="e.g. Commercial Bank of Ethiopia"
                style={{
                  width: "100%",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(15, 23, 42, 0.15)",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.85rem",
                  color: "#0A1931",
                }}
              />
            </div>
          </div>

          {/* Verification Notes */}
          <div
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              borderRadius: "12px",
              padding: "1rem 1.15rem",
            }}
          >
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>
              Screening Clearance Notes
            </label>
            <input
              type="text"
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid rgba(15, 23, 42, 0.15)",
                backgroundColor: "#FFFFFF",
                fontSize: "0.85rem",
                color: "#0A1931",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "0.7rem 1.25rem",
                borderRadius: "8px",
                border: "1px solid rgba(15, 23, 42, 0.15)",
                background: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                color: "#475569",
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
                boxShadow: "0 2px 8px rgba(5, 150, 105, 0.25)",
              }}
            >
              <Check size={18} />
              <span>{isSubmitting ? "Saving..." : "Approve & Mark Verified"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
