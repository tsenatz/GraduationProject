"use client";

import React, { useState } from "react";
import { X, FileText, Building2, User, Calendar, ShieldCheck, DollarSign } from "lucide-react";
import { createLeaseAgreementAction } from "@/lib/actions/rentals";
import styles from "./AddRentalPropertyModal/AddRentalPropertyModal.module.css";

interface CreateLeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeaseCreated: () => void;
}

const UTILITY_OPTIONS = [
  "Standby Generator Fuel Contribution",
  "Water Reservoir Tank Service",
  "24/7 Compound Security",
  "Dedicated Basement Parking",
  "Common Area Cleaning & Maintenance",
  "EEU Electric Meter Dedicated",
];

const RULE_OPTIONS = [
  "Residential occupancy only (max 4 persons)",
  "Rent payable strictly in advance within first 5 days",
  "Quiet hours observed 10:00 PM – 7:00 AM",
  "Subletting or commercial use strictly prohibited",
  "60 days written notice required before lease termination",
];

export function CreateLeaseModal({
  isOpen,
  onClose,
  onLeaseCreated,
}: CreateLeaseModalProps) {
  const [propertyTitle, setPropertyTitle] = useState("Luxury 2-Bedroom Furnished Apartment in Bole Atlas");
  const [unitName, setUnitName] = useState("Unit 201");
  const [tenantName, setTenantName] = useState("");
  const [tenantPhone, setTenantPhone] = useState("+251 9");
  const [tenantEmail, setTenantEmail] = useState("");
  const [monthlyRentETB, setMonthlyRentETB] = useState<number>(55000);
  const [depositETB, setDepositETB] = useState<number>(110000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  
  // Default end date 1 year from now
  const defaultEndDate = new Date();
  defaultEndDate.setFullYear(defaultEndDate.getFullYear() + 1);
  const [endDate, setEndDate] = useState(defaultEndDate.toISOString().split("T")[0]);

  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([
    "Standby Generator Fuel Contribution",
    "Water Reservoir Tank Service",
    "24/7 Compound Security",
  ]);

  const [selectedRules, setSelectedRules] = useState<string[]>([
    "Residential occupancy only (max 4 persons)",
    "Rent payable strictly in advance within first 5 days",
    "Subletting or commercial use strictly prohibited",
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleUtility = (u: string) => {
    setSelectedUtilities((prev) =>
      prev.includes(u) ? prev.filter((item) => item !== u) : [...prev, u]
    );
  };

  const toggleRule = (r: string) => {
    setSelectedRules((prev) =>
      prev.includes(r) ? prev.filter((item) => item !== r) : [...prev, r]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim()) {
      setError("Please provide the tenant's full name.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await createLeaseAgreementAction({
        propertyId: "rental-101",
        propertyTitle,
        unitName,
        tenantName: tenantName.trim(),
        tenantPhone: tenantPhone.trim(),
        tenantEmail: tenantEmail.trim() || undefined,
        monthlyRentETB: Number(monthlyRentETB),
        depositETB: Number(depositETB),
        startDate,
        endDate,
        utilitiesIncluded: selectedUtilities,
        rules: selectedRules,
      });

      if (res.success) {
        onLeaseCreated();
        onClose();
      } else {
        setError(res.error || "Failed to create lease agreement");
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
        style={{ maxWidth: "680px", padding: "2.25rem", maxHeight: "90vh", overflowY: "auto", backgroundColor: "#FFFFFF", borderRadius: "18px" }}
      >
        <div className={styles.modalHeader} style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "rgba(10, 25, 49, 0.08)",
                color: "#0A1931",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={22} />
            </div>
            <div>
              <h2 className={styles.modalTitle} style={{ fontSize: "1.4rem" }}>
                Create Lease Agreement
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#64748B", margin: 0 }}>
                Standardized Ethiopian residential lease terms, deposit, and utility provisions
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Property & Unit */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Property
              </label>
              <input
                type="text"
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
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
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Unit / Door #
              </label>
              <input
                type="text"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                required
                placeholder="e.g. Unit 4B"
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

          {/* Tenant Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Tenant Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dawit Haile"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
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
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Tenant Phone
              </label>
              <input
                type="text"
                value={tenantPhone}
                onChange={(e) => setTenantPhone(e.target.value)}
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
          </div>

          {/* Financials: Rent & Deposit */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Monthly Rent (ETB)
              </label>
              <input
                type="number"
                value={monthlyRentETB}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMonthlyRentETB(val);
                  setDepositETB(val * 2);
                }}
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
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Security Deposit (ETB)
              </label>
              <input
                type="number"
                value={depositETB}
                onChange={(e) => setDepositETB(Number(e.target.value))}
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
          </div>

          {/* Term Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Lease Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
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
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Lease End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
          </div>

          {/* Utilities Provisions */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
              Included Building Services & Utilities
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
              {UTILITY_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.82rem",
                    color: "#334155",
                    cursor: "pointer",
                    padding: "0.3rem 0",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedUtilities.includes(opt)}
                    onChange={() => toggleUtility(opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
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
                backgroundColor: "#0A1931",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {isSubmitting ? "Creating..." : "Generate Lease Agreement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
