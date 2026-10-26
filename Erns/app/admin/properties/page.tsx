"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
  Search,
  Building,
  MapPin,
  Trash2,
  X,
  Bed,
  Bath,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import {
  getAdminPropertiesAction,
  updateAdminPropertyStatusAction,
  deleteAdminPropertyAction,
  type AdminPropertyItem,
} from "@/lib/actions/admin";
import styles from "../admin.module.css";

const SUB_CITIES = [
  "ALL",
  "Bole",
  "Kirkos",
  "Yeka",
  "Nifas Silk-Lafto",
  "Lideta",
  "Arada",
  "Gullele",
  "Addis Ketema",
  "Akaki Kality",
  "Kolfe Keranio",
];

export default function AdminPropertiesPage() {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [selectedSubCity, setSelectedSubCity] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<AdminPropertyItem[]>([]);
  const [selectedProp, setSelectedProp] = useState<AdminPropertyItem | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadProperties = async () => {
    const res = await getAdminPropertiesAction({
      listingType: activeTab === "ALL" ? undefined : activeTab,
      subCity: selectedSubCity === "ALL" ? undefined : selectedSubCity,
      search: searchQuery,
    });
    if (res.success) {
      setProperties(res.properties);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [activeTab, selectedSubCity, searchQuery]);

  const handleStatusChange = (prop: AdminPropertyItem, newStatus: string) => {
    startTransition(async () => {
      const res = await updateAdminPropertyStatusAction(prop.id, newStatus);
      if (res.success) {
        setActionMessage({
          type: "success",
          text: `Listing ${prop.referenceNo} updated to ${newStatus}.`,
        });
        if (selectedProp?.id === prop.id) {
          setSelectedProp({ ...selectedProp, status: newStatus });
        }
        loadProperties();
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to update property status." });
      }
    });
  };

  const handleDelete = (prop: AdminPropertyItem) => {
    if (!confirm(`Are you sure you want to remove listing "${prop.title}" (${prop.referenceNo})?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteAdminPropertyAction(prop.id);
      if (res.success) {
        setActionMessage({
          type: "success",
          text: `Listing ${prop.referenceNo} has been removed from marketplace.`,
        });
        setSelectedProp(null);
        loadProperties();
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to delist property." });
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Alert Banner */}
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

      {/* ================= TABS & FILTER BAR ================= */}
      <div className={styles.filterBar}>
        <div className={styles.tabsList}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "ALL" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("ALL")}
          >
            All Listings
            <span className={styles.tabBadge}>{properties.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "SALE" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("SALE")}
          >
            For Sale
          </button>

          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "RENT" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("RENT")}
          >
            For Rent
          </button>
        </div>

        <div className={styles.filterActions}>
          <select
            value={selectedSubCity}
            onChange={(e) => setSelectedSubCity(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter by Sub-City"
          >
            {SUB_CITIES.map((sc) => (
              <option key={sc} value={sc}>
                {sc === "ALL" ? "All Sub-Cities" : sc}
              </option>
            ))}
          </select>

          <div className={styles.searchBox} style={{ width: "220px" }}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search title, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* ================= TABLE LISTING ================= */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeaderRow}>
          <span>Reference</span>
          <span>Property Title</span>
          <span>Location</span>
          <span>Price (ETB)</span>
          <span>Status</span>
          <span style={{ textAlign: "right" }}>Actions</span>
        </div>

        {properties.length === 0 ? (
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
            <Building size={36} style={{ margin: "0 auto 0.75rem", color: "#4a7fa7" }} />
            <h3 style={{ fontSize: "1.1rem", color: "#0a1931", marginBottom: "0.25rem" }}>
              No properties found
            </h3>
            <p style={{ fontSize: "0.85rem" }}>Try adjusting the sub-city or search filter.</p>
          </div>
        ) : (
          properties.map((prop) => (
            <div
              key={prop.id}
              className={styles.cardRow}
              onClick={() => setSelectedProp(prop)}
            >
              <div className={styles.rowId}>{prop.referenceNo}</div>

              <div className={styles.nameCluster}>
                <div
                  style={{
                    position: "relative",
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    backgroundColor: "#e8f1f8",
                    flexShrink: 0,
                  }}
                >
                  {prop.images[0] ? (
                    <Image
                      src={prop.images[0]}
                      alt={prop.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Building size={20} style={{ margin: "11px", color: "#4a7fa7" }} />
                  )}
                </div>
                <div className={styles.userNameDetails}>
                  <span className={styles.rowPrimaryText}>{prop.title}</span>
                  <span className={styles.rowSecondaryText}>
                    {prop.bedrooms} Bed • {prop.bathrooms} Bath • {prop.listingType}
                  </span>
                </div>
              </div>

              <div className={styles.rowDetails}>
                <span className={styles.rowPrimaryText}>{prop.subCity || "Addis Ababa"}</span>
                <span className={styles.rowSecondaryText}>{prop.address}</span>
              </div>

              <div style={{ fontWeight: 700, color: "#0a1931", fontSize: "0.95rem" }}>
                {prop.price.toLocaleString()} ETB
              </div>

              <div>
                <span
                  className={`${styles.statusBadge} ${
                    prop.status === "FOR_SALE" || prop.status === "FOR_RENT"
                      ? styles.statusVerified
                      : prop.status === "PENDING"
                      ? styles.statusPending
                      : styles.statusInfo
                  }`}
                >
                  <span className={styles.statusDot} />
                  {prop.status}
                </span>
              </div>

              <div className={styles.rowActions} onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className={styles.actionBtnInspect}
                  onClick={() => setSelectedProp(prop)}
                >
                  Inspect
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(prop)}
                  disabled={isPending}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#dc2626",
                    cursor: "pointer",
                    padding: "0.4rem",
                    borderRadius: "6px",
                  }}
                  title="Delist property"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= PAGINATION BAR ================= */}
      <div className={styles.paginationRow}>
        <span className={styles.paginationText}>
          Showing 1 to {properties.length} of {properties.length} properties
        </span>
        <div className={styles.paginationControls}>
          <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
        </div>
      </div>

      {/* ================= PROPERTY INSPECTION MODAL ================= */}
      {selectedProp && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedProp(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleCluster}>
                <h3 className={styles.modalTitle}>{selectedProp.title}</h3>
                <span className={styles.modalSubtitle}>
                  {selectedProp.referenceNo} • {selectedProp.address}
                </span>
              </div>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => setSelectedProp(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Image Preview */}
              {selectedProp.images.length > 0 && (
                <div style={{ position: "relative", width: "100%", height: "220px", borderRadius: "14px", overflow: "hidden" }}>
                  <Image
                    src={selectedProp.images[0]}
                    alt={selectedProp.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}

              <div className={styles.modalGrid}>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Listing Price</span>
                  <span className={styles.modalFieldValue}>
                    {selectedProp.price.toLocaleString()} ETB
                  </span>
                </div>

                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Listing Type</span>
                  <span className={styles.modalFieldValue}>{selectedProp.listingType}</span>
                </div>

                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Sub-City</span>
                  <span className={styles.modalFieldValue}>{selectedProp.subCity || "Addis Ababa"}</span>
                </div>

                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Bedrooms / Bathrooms</span>
                  <span className={styles.modalFieldValue}>
                    {selectedProp.bedrooms} Beds • {selectedProp.bathrooms} Baths
                  </span>
                </div>

                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Owner / Contact</span>
                  <span className={styles.modalFieldValue}>
                    {selectedProp.ownerName || "Private Owner"}
                  </span>
                </div>

                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Contact Phone</span>
                  <span className={styles.modalFieldValue}>
                    {selectedProp.contactPhone || "Not specified"}
                  </span>
                </div>
              </div>

              {/* Status Manager Control */}
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "14px",
                  backgroundColor: "#f6fafd",
                  border: "1px solid rgba(74, 127, 167, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0a1931" }}>
                    Moderation Status
                  </span>
                  <p style={{ fontSize: "0.78rem", color: "#4a7fa7" }}>
                    Current status on the public marketplace.
                  </p>
                </div>

                <select
                  value={selectedProp.status}
                  onChange={(e) => handleStatusChange(selectedProp, e.target.value)}
                  className={styles.filterSelect}
                  disabled={isPending}
                >
                  <option value="FOR_SALE">FOR_SALE (Active)</option>
                  <option value="FOR_RENT">FOR_RENT (Active)</option>
                  <option value="PENDING">PENDING (Review)</option>
                  <option value="SOLD">SOLD (Archived)</option>
                </select>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setSelectedProp(null)}
              >
                Close
              </button>

              <button
                type="button"
                className={styles.btnReject}
                onClick={() => handleDelete(selectedProp)}
                disabled={isPending}
              >
                Delist & Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
