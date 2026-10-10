"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  PlusCircle,
  Home,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Lock,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  getSellerPropertiesAction,
  updatePropertyStatusAction,
  deletePropertyAction,
} from "@/lib/actions/listings";
import styles from "./SellerDashboard.module.css";

export default function SellerDashboardPage() {
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "FOR_SALE" | "PENDING" | "SOLD">("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      loadProperties();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const res = await getSellerPropertiesAction();
      if (res.success && res.properties) {
        setProperties(res.properties);
      }
    } catch (err) {
      console.error("Failed to load seller properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    propertyId: string,
    newStatus: "FOR_SALE" | "PENDING" | "SOLD"
  ) => {
    setActionLoadingId(propertyId);
    try {
      // Optimistic update
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
      );
      await updatePropertyStatusAction(propertyId, newStatus);
    } catch (err) {
      console.error("Status update error:", err);
      loadProperties(); // Revert on failure
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!window.confirm("Are you sure you want to remove this property listing?")) {
      return;
    }
    setActionLoadingId(propertyId);
    try {
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      await deletePropertyAction(propertyId);
    } catch (err) {
      console.error("Delete error:", err);
      loadProperties();
    } finally {
      setActionLoadingId(null);
    }
  };

  // Stats calculation
  const totalCount = properties.length;
  const activeCount = properties.filter((p) => p.status === "FOR_SALE" || !p.status).length;
  const pendingCount = properties.filter((p) => p.status === "PENDING").length;
  const soldCount = properties.filter((p) => p.status === "SOLD").length;

  const filteredProperties = properties.filter((p) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "FOR_SALE") return p.status === "FOR_SALE" || !p.status;
    return p.status === activeFilter;
  });

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val || 0);
  };

  // If user is not authenticated
  if (status === "unauthenticated") {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.loginPromptCard}>
          <div className={styles.loginIcon}>
            <Lock size={32} />
          </div>
          <h1 className={styles.loginTitle}>Seller Dashboard Access</h1>
          <p className={styles.loginDesc}>
            Please sign in to your ERNS account to manage your listings, update prices, mark homes as sold, and respond to buyer inquiries.
          </p>
          <Link href="/login?callbackUrl=/sell/dashboard" className={styles.signInBtn}>
            <span>Sign In to Continue</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Header */}
      <header className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.headerTitle}>Seller Dashboard</h1>
          <p className={styles.headerSubtitle}>
            Welcome back, {session?.user?.name || "Homeowner"}! Manage your property listings on ERNS.
          </p>
        </div>
        <Link href="/sell/list" className={styles.primaryCtaBtn}>
          <PlusCircle size={20} />
          <span>List Another Home</span>
        </Link>
      </header>

      {/* Quick Visual Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div
            className={styles.statIconWrapper}
            style={{ background: "#eff6ff", color: "#2563eb" }}
          >
            <Layers size={24} />
          </div>
          <div>
            <div className={styles.statValue}>{totalCount}</div>
            <div className={styles.statLabel}>Total Listings</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIconWrapper}
            style={{ background: "#ecfdf5", color: "#059669" }}
          >
            <Home size={24} />
          </div>
          <div>
            <div className={styles.statValue}>{activeCount}</div>
            <div className={styles.statLabel}>Active (For Sale)</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIconWrapper}
            style={{ background: "#fffbeb", color: "#d97706" }}
          >
            <Clock size={24} />
          </div>
          <div>
            <div className={styles.statValue}>{pendingCount}</div>
            <div className={styles.statLabel}>Under Offer</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIconWrapper}
            style={{ background: "#f1f5f9", color: "#475569" }}
          >
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className={styles.statValue}>{soldCount}</div>
            <div className={styles.statLabel}>Marked Sold</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.tabsBar}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeFilter === "ALL" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveFilter("ALL")}
        >
          <span>All Properties</span>
          <span
            className={`${styles.tabCount} ${
              activeFilter === "ALL" ? "" : styles.tabCountInactive
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${
            activeFilter === "FOR_SALE" ? styles.tabBtnActive : ""
          }`}
          onClick={() => setActiveFilter("FOR_SALE")}
        >
          <span>Active</span>
          <span
            className={`${styles.tabCount} ${
              activeFilter === "FOR_SALE" ? "" : styles.tabCountInactive
            }`}
          >
            {activeCount}
          </span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeFilter === "PENDING" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveFilter("PENDING")}
        >
          <span>Pending</span>
          <span
            className={`${styles.tabCount} ${
              activeFilter === "PENDING" ? "" : styles.tabCountInactive
            }`}
          >
            {pendingCount}
          </span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeFilter === "SOLD" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveFilter("SOLD")}
        >
          <span>Sold</span>
          <span
            className={`${styles.tabCount} ${
              activeFilter === "SOLD" ? "" : styles.tabCountInactive
            }`}
          >
            {soldCount}
          </span>
        </button>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-accent)" }}>
          <p style={{ fontWeight: 600 }}>Loading your listings...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>
            <Home size={34} />
          </div>
          <h2 className={styles.emptyTitle}>
            {activeFilter === "ALL"
              ? "You haven't listed any homes yet"
              : `No ${activeFilter.toLowerCase()} properties found`}
          </h2>
          <p className={styles.emptyDesc}>
            List your Ethiopian property directly on ERNS with 0% commission. Upload photos and reach thousands of verified buyers in minutes.
          </p>
          <Link href="/sell/list" className={styles.primaryCtaBtn}>
            <PlusCircle size={20} />
            <span>List Your Home on ERNS</span>
          </Link>
        </div>
      ) : (
        <div className={styles.propertiesGrid}>
          {filteredProperties.map((property) => {
            const isSold = property.status === "SOLD";
            const isPending = property.status === "PENDING";
            const isBusy = actionLoadingId === property.id;
            const coverImage =
              property.images && property.images.length > 0
                ? property.images[0]
                : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

            return (
              <div key={property.id} className={styles.propertyCard}>
                <div className={styles.cardMedia}>
                  <img
                    src={coverImage}
                    alt={property.title || "Property"}
                    className={styles.cardImg}
                  />

                  {/* Status Pill */}
                  <span
                    className={`${styles.statusPill} ${
                      isSold
                        ? styles.statusSold
                        : isPending
                        ? styles.statusPending
                        : styles.statusForSale
                    }`}
                  >
                    {isSold ? "SOLD" : isPending ? "PENDING" : "ACTIVE"}
                  </span>

                  {property.referenceNo && (
                    <span className={styles.refTag}>{property.referenceNo}</span>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.priceRow}>
                    <div className={styles.cardPrice}>
                      {formatPrice(property.price)} ETB
                    </div>
                    {property.isNegotiable && (
                      <span className={styles.negotiableBadge}>Negotiable</span>
                    )}
                  </div>

                  <h3 className={styles.cardTitle}>{property.title}</h3>

                  <div className={styles.cardLocation}>
                    <MapPin size={15} />
                    <span>
                      {property.subCity || "Addis Ababa"}
                      {property.specificArea ? `, ${property.specificArea}` : ""}
                    </span>
                  </div>

                  <div className={styles.specsRow}>
                    <div className={styles.specItem}>
                      <Bed size={15} color="var(--color-accent)" />
                      <span>{property.beds || 1} Beds</span>
                    </div>
                    <div className={styles.specItem}>
                      <Bath size={15} color="var(--color-accent)" />
                      <span>{property.baths || 1} Baths</span>
                    </div>
                    <div className={styles.specItem}>
                      <Maximize2 size={15} color="var(--color-accent)" />
                      <span>{property.areaSqM || 100} m²</span>
                    </div>
                  </div>

                  {/* Action Toolbar */}
                  <div className={styles.cardActions}>
                    {isSold ? (
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.btnMarkActive}`}
                        disabled={isBusy}
                        onClick={() => handleStatusChange(property.id, "FOR_SALE")}
                      >
                        <CheckCircle2 size={16} />
                        <span>Reactivate</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.btnMarkSold}`}
                        disabled={isBusy}
                        onClick={() => handleStatusChange(property.id, "SOLD")}
                      >
                        <CheckCircle2 size={16} />
                        <span>Mark as Sold</span>
                      </button>
                    )}

                    <Link
                      href={`/search?query=${encodeURIComponent(property.subCity || "Addis Ababa")}`}
                      className={styles.btnView}
                      title="View in Marketplace"
                    >
                      <ExternalLink size={16} />
                    </Link>

                    <button
                      type="button"
                      className={styles.btnDelete}
                      disabled={isBusy}
                      title="Delete Listing"
                      onClick={() => handleDelete(property.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
