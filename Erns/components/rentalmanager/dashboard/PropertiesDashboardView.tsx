"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import {
  Plus,
  Megaphone,
  Building2,
  Search,
  CheckCircle2,
  Users,
  Wallet,
  Home,
  RefreshCw,
} from "lucide-react";
import {
  getLandlordRentalPropertiesAction,
  updateRentalStatusAction,
  deleteRentalPropertyAction,
  RentalPropertyRecord,
} from "@/lib/actions/rentals";
import { AddRentalPropertyModal } from "./AddRentalPropertyModal/AddRentalPropertyModal";
import { RentalPropertyCard } from "./RentalPropertyCard/RentalPropertyCard";
import styles from "./RentalManagerDashboard.module.css";

interface PropertiesDashboardViewProps {
  userName?: string;
  onAddProperty?: () => void;
}

export function PropertiesDashboardView({
  userName = "Tsenat",
}: PropertiesDashboardViewProps) {
  const firstName = userName ? userName.split(" ")[0] : "Tsenat";

  const [properties, setProperties] = useState<RentalPropertyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "FOR_RENT" | "RENTED" | "OFF_MARKET">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Load properties on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await getLandlordRentalPropertiesAction();
        if (isMounted && res.success && res.properties) {
          setProperties(res.properties);
        }
      } catch (err) {
        console.error("Failed to load rental properties:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      const matchesStatus = filterStatus === "ALL" || prop.status === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        prop.title.toLowerCase().includes(q) ||
        prop.address.toLowerCase().includes(q) ||
        prop.subCity.toLowerCase().includes(q) ||
        prop.propertyType.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [properties, filterStatus, searchQuery]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = properties.length;
    const forRent = properties.filter((p) => p.status === "FOR_RENT").length;
    const rented = properties.filter((p) => p.status === "RENTED").length;
    const offMarket = properties.filter((p) => p.status === "OFF_MARKET").length;
    const totalRentETB = properties.reduce((acc, curr) => acc + (curr.priceETB || 0), 0);

    return { total, forRent, rented, offMarket, totalRentETB };
  }, [properties]);

  // Handlers
  const handleStatusChange = (
    propertyId: string,
    newStatus: "FOR_RENT" | "RENTED" | "OFF_MARKET"
  ) => {
    // Optimistic update
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
    );

    startTransition(async () => {
      await updateRentalStatusAction(propertyId, newStatus);
    });
  };

  const handleDelete = (propertyId: string) => {
    if (!window.confirm("Are you sure you want to delete this rental property?")) {
      return;
    }

    setProperties((prev) => prev.filter((p) => p.id !== propertyId));

    startTransition(async () => {
      await deleteRentalPropertyAction(propertyId);
    });
  };

  const handlePropertyAdded = (newProp: RentalPropertyRecord) => {
    setProperties((prev) => [newProp, ...prev]);
    setIsAddModalOpen(false);
  };

  return (
    <div className={styles.mainContent}>
      {/* If properties exist or loading is complete */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748B" }}>
          <RefreshCw className="animate-spin" size={32} style={{ margin: "0 auto 1rem" }} />
          <p style={{ fontWeight: 600 }}>Loading rental properties...</p>
        </div>
      ) : properties.length === 0 ? (
        /* Empty / Zero properties state: Show Original Welcome Hero */
        <>
          <div className={styles.pageHeaderRow}>
            <h1 className={styles.pageTitle}>Properties</h1>
          </div>

          <div className={styles.heroCard}>
            {/* Left Column: Greeting & Call to action */}
            <div className={styles.leftHeroCol}>
              <div className={styles.heroGraphic}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "16px",
                      backgroundColor: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 0.75rem",
                      boxShadow: "0 8px 20px rgba(10, 25, 49, 0.08)",
                    }}
                  >
                    <Building2 size={38} color="#0A1931" />
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#4A7FA7" }}>
                    ERNS Rental Manager
                  </span>
                </div>
              </div>

              <h2 className={styles.greetingTitle}>
                Hi, {firstName}! Ready to add your property?
              </h2>

              <p className={styles.greetingSubtitle}>
                Providing some basic information is the first step
              </p>

              <p className={styles.greetingDesc}>
                Once you find a renter for your listing, you can screen them, sign the lease, and collect rent — entirely on ERNS Rental Manager
              </p>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className={styles.primaryAddBtn}
              >
                Add a property
              </button>
            </div>

            {/* Right Column: All-in-one Solution Card */}
            <div className={styles.solutionBox}>
              <div className={styles.solutionHeader}>
                <Megaphone size={22} color="#0A1931" />
              </div>

              <h3 className={styles.solutionTitle}>
                Our all-in-one solution saves time
              </h3>

              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.bulletDot}>•</span>
                  <span>List your property for rent</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.bulletDot}>•</span>
                  <span>Receive applications</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.bulletDot}>•</span>
                  <span>Screen tenants</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.bulletDot}>•</span>
                  <span>Message renters</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.bulletDot}>•</span>
                  <span>Create and sign leases</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.bulletDot}>•</span>
                  <span>Receive rent payments</span>
                </li>
              </ul>

              <button type="button" className={styles.learnMoreLink}>
                Learn more
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Populated Properties Dashboard View */
        <>
          {/* Header Row */}
          <div className={styles.propertiesHeader}>
            <div className={styles.propertiesTitleGroup}>
              <h1 className={styles.pageTitle} style={{ margin: 0 }}>Properties</h1>
              <span className={styles.propertyCountBadge}>
                {properties.length} {properties.length === 1 ? "unit" : "units"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className={styles.addPropertyHeaderBtn}
            >
              <Plus size={18} />
              <span>Add a property</span>
            </button>
          </div>

          {/* Quick Stats Ribbon */}
          <div className={styles.statsRibbon}>
            <div className={styles.statCard}>
              <div
                className={styles.statIconBox}
                style={{ backgroundColor: "rgba(10, 25, 49, 0.08)", color: "#0A1931" }}
              >
                <Home size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Total Units</span>
                <span className={styles.statValue}>{stats.total}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div
                className={styles.statIconBox}
                style={{ backgroundColor: "rgba(22, 163, 74, 0.12)", color: "#16A34A" }}
              >
                <CheckCircle2 size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Listed For Rent</span>
                <span className={styles.statValue}>{stats.forRent}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div
                className={styles.statIconBox}
                style={{ backgroundColor: "rgba(74, 127, 167, 0.15)", color: "#4A7FA7" }}
              >
                <Users size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Occupied / Leased</span>
                <span className={styles.statValue}>{stats.rented}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div
                className={styles.statIconBox}
                style={{ backgroundColor: "rgba(217, 119, 6, 0.12)", color: "#D97706" }}
              >
                <Wallet size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Est. Monthly Rent</span>
                <span className={styles.statValue}>
                  {new Intl.NumberFormat("en-US").format(stats.totalRentETB)} ETB
                </span>
              </div>
            </div>
          </div>

          {/* Toolbar: Filters & Search */}
          <div className={styles.toolbarRow}>
            <div className={styles.filterTabs}>
              <button
                type="button"
                onClick={() => setFilterStatus("ALL")}
                className={`${styles.filterTabBtn} ${
                  filterStatus === "ALL" ? styles.filterTabBtnActive : ""
                }`}
              >
                All ({properties.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("FOR_RENT")}
                className={`${styles.filterTabBtn} ${
                  filterStatus === "FOR_RENT" ? styles.filterTabBtnActive : ""
                }`}
              >
                Listed ({stats.forRent})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("RENTED")}
                className={`${styles.filterTabBtn} ${
                  filterStatus === "RENTED" ? styles.filterTabBtnActive : ""
                }`}
              >
                Occupied ({stats.rented})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("OFF_MARKET")}
                className={`${styles.filterTabBtn} ${
                  filterStatus === "OFF_MARKET" ? styles.filterTabBtnActive : ""
                }`}
              >
                Off-Market ({stats.offMarket})
              </button>
            </div>

            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by title, sub-city, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className={styles.propertiesGrid}>
              {filteredProperties.map((prop) => (
                <RentalPropertyCard
                  key={prop.id}
                  property={prop}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyFilterState}>
              <Building2 size={40} color="#94A3B8" />
              <h3 className={styles.emptyFilterTitle}>No matching properties found</h3>
              <p className={styles.emptyFilterDesc}>
                Try adjusting your search terms or filter tab to view other listings.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilterStatus("ALL");
                  setSearchQuery("");
                }}
                className={styles.clearFilterBtn}
              >
                Reset Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Rental Property Modal */}
      <AddRentalPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPropertyAdded={handlePropertyAdded}
      />
    </div>
  );
}
