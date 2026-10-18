"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Check,
  X,
  Phone,
  Mail,
  MessageSquare,
  Building2,
  Calendar,
  Briefcase,
  DollarSign,
  UserCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  getLandlordRentalApplicationsAction,
  updateRentalApplicationStatusAction,
  RentalApplicationRecord,
} from "@/lib/actions/rentals";
import { VerifyTenantModal } from "./VerifyTenantModal";
import styles from "./RentalManagerDashboard.module.css";

interface ApplicationsDashboardViewProps {
  userName?: string;
}

export function ApplicationsDashboardView({
  userName = "Landlord",
}: ApplicationsDashboardViewProps) {
  const [applications, setApplications] = useState<RentalApplicationRecord[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    declined: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PENDING" | "APPROVED" | "DECLINED"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [verifyingApp, setVerifyingApp] = useState<RentalApplicationRecord | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifiedAppIds, setVerifiedAppIds] = useState<string[]>(["app-202"]);


  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await getLandlordRentalApplicationsAction();
      if (res.success && res.applications) {
        setApplications(res.applications);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to load rental applications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = (appId: string, newStatus: "PENDING" | "APPROVED" | "DECLINED") => {
    startTransition(async () => {
      try {
        const res = await updateRentalApplicationStatusAction(appId, newStatus);
        if (res.success) {
          setApplications((prev) =>
            prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
          );
          setToastMessage(
            newStatus === "APPROVED"
              ? "Application approved! You can now message the tenant to finalize the lease."
              : newStatus === "DECLINED"
              ? "Application declined."
              : "Application set to pending review."
          );
          setTimeout(() => setToastMessage(null), 4000);
          loadData();
        }
      } catch (err) {
        console.error("Failed to update status:", err);
      }
    });
  };

  const filteredApps = useMemo(() => {
    return applications.filter((a) => {
      if (filterStatus !== "ALL" && a.status !== filterStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = a.applicantName.toLowerCase().includes(q);
        const matchesProp = a.propertyTitle.toLowerCase().includes(q);
        const matchesPhone = a.applicantPhone.toLowerCase().includes(q);
        const matchesEmail = a.applicantEmail.toLowerCase().includes(q);
        const matchesJob = a.employment.toLowerCase().includes(q);
        if (!matchesName && !matchesProp && !matchesPhone && !matchesEmail && !matchesJob) {
          return false;
        }
      }
      return true;
    });
  }, [applications, filterStatus, searchQuery]);

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
            Tenant Applications & Leads
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#64748B", margin: 0 }}>
            Review prospective tenant applications, income verification, and lease inquiries.
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
            <Users size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Applicants</span>
            <span className={styles.statValue}>{stats.total}</span>
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
            <span className={styles.statLabel}>Pending Review</span>
            <span className={styles.statValue} style={{ color: "#D97706" }}>
              {stats.pending}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIconBox}
            style={{ backgroundColor: "rgba(5, 150, 105, 0.12)", color: "#059669" }}
          >
            <UserCheck size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Approved</span>
            <span className={styles.statValue} style={{ color: "#059669" }}>
              {stats.approved}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIconBox}
            style={{ backgroundColor: "rgba(148, 163, 184, 0.15)", color: "#64748B" }}
          >
            <XCircle size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Declined</span>
            <span className={styles.statValue} style={{ color: "#64748B" }}>
              {stats.declined}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Toolbar */}
      <div className={styles.toolbarRow}>
        <div className={styles.filterTabs}>
          {(["ALL", "PENDING", "APPROVED", "DECLINED"] as const).map((status) => (
            <button
              key={status}
              type="button"
              className={`${styles.filterTabBtn} ${filterStatus === status ? styles.filterTabBtnActive : ""}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === "ALL" && `All (${stats.total})`}
              {status === "PENDING" && `Pending (${stats.pending})`}
              {status === "APPROVED" && `Approved (${stats.approved})`}
              {status === "DECLINED" && `Declined (${stats.declined})`}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search applicant name, property, or job..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Applications Grid */}
      <div className={styles.applicationsGrid}>
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => {
            const isPendingState = app.status === "PENDING";
            const isApproved = app.status === "APPROVED";
            const isDeclined = app.status === "DECLINED";

            const avatarInitial = app.applicantName.charAt(0).toUpperCase();

            return (
              <div key={app.id} className={styles.applicationCard}>
                <div className={styles.applicantTop}>
                  <div className={styles.applicantAvatar}>{avatarInitial}</div>
                  <div className={styles.applicantMeta}>
                    <div className={styles.applicantName}>{app.applicantName}</div>
                    <div className={styles.applicantAppliedFor}>
                      Applied for: <strong>{app.unitName || app.propertyTitle}</strong>
                    </div>
                  </div>
                  <span
                    className={`${styles.pillStatus} ${
                      isApproved
                        ? styles.pillPaid
                        : isPendingState
                        ? styles.pillPending
                        : styles.pillOverdue
                    }`}
                  >
                    {app.status === "PENDING" ? "Under Review" : app.status}
                  </span>
                </div>

                <div className={styles.applicantInfoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Monthly Income</span>
                    <span className={styles.infoVal}>
                      {app.monthlyIncomeETB.toLocaleString()} ETB
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Target Move-In</span>
                    <span className={styles.infoVal}>{app.desiredMoveIn}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Occupants</span>
                    <span className={styles.infoVal}>{app.householdSize} person(s)</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Employment</span>
                    <span className={styles.infoVal}>{app.employment}</span>
                  </div>
                </div>

                {app.message && (
                  <div className={styles.applicantMessage}>
                    &ldquo;{app.message}&rdquo;
                  </div>
                )}

                <div className={styles.applicantCardFooter}>
                  {/* Row 1: Direct Contact Channels & Verification Screening */}
                  <div className={styles.applicantActionsRow}>
                    <div className={styles.contactDirectBtns}>
                      <a
                        href={`tel:${app.applicantPhone}`}
                        className={styles.iconCircleBtn}
                        title={`Call ${app.applicantPhone}`}
                      >
                        <Phone size={16} />
                      </a>
                      <a
                        href={`mailto:${app.applicantEmail}`}
                        className={styles.iconCircleBtn}
                        title={`Email ${app.applicantEmail}`}
                      >
                        <Mail size={16} />
                      </a>
                      <Link
                        href={`/rentalmanager/messages?recipient=${encodeURIComponent(app.applicantName)}`}
                        className={styles.iconCircleBtn}
                        title="Open chat in Rental Manager Messages"
                      >
                        <MessageSquare size={16} />
                      </Link>
                    </div>

                    {/* Tenant Verification Screening Button */}
                    <button
                      type="button"
                      className={`${styles.verifyBtn} ${
                        verifiedAppIds.includes(app.id) ? styles.verifyBtnActive : ""
                      }`}
                      onClick={() => {
                        setVerifyingApp(app);
                        setIsVerifyModalOpen(true);
                      }}
                      title="Screen tenant ID and guarantor details"
                    >
                      <ShieldCheck
                        size={14}
                        color={verifiedAppIds.includes(app.id) ? "#059669" : "#4A7FA7"}
                      />
                      <span>
                        {verifiedAppIds.includes(app.id) ? "Verified (ዋስ)" : "Verify (ዋስ)"}
                      </span>
                    </button>
                  </div>

                  {/* Row 2: Status Decision & Action Buttons */}
                  <div className={styles.applicantDecisionRow}>
                    {isPendingState && (
                      <>
                        <button
                          type="button"
                          className={styles.declineBtn}
                          onClick={() => handleUpdateStatus(app.id, "DECLINED")}
                          disabled={isPending}
                        >
                          <X size={15} />
                          <span>Decline</span>
                        </button>
                        <button
                          type="button"
                          className={styles.approveBtn}
                          onClick={() => handleUpdateStatus(app.id, "APPROVED")}
                          disabled={isPending}
                        >
                          <Check size={15} />
                          <span>Approve</span>
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <button
                        type="button"
                        className={styles.secondaryActionBtn}
                        onClick={() => handleUpdateStatus(app.id, "PENDING")}
                        disabled={isPending}
                        title="Revert application to Under Review"
                      >
                        <RefreshCw size={13} />
                        <span>Reset Status</span>
                      </button>
                    )}

                    {isDeclined && (
                      <button
                        type="button"
                        className={styles.secondaryActionBtn}
                        onClick={() => handleUpdateStatus(app.id, "PENDING")}
                        disabled={isPending}
                        title="Re-open review for this application"
                      >
                        <RefreshCw size={13} />
                        <span>Reconsider</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "4rem 2rem",
              background: "#F8FAFC",
              borderRadius: "16px",
              color: "#64748B",
            }}
          >
            <Users size={36} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0A1931", marginBottom: "0.4rem" }}>
              No applications match this filter
            </h3>
            <p style={{ fontSize: "0.9rem", margin: 0 }}>
              Prospective tenants applying to your rental listings will show up here.
            </p>
          </div>
        )}
      </div>

      {/* Verify Tenant Modal */}
      <VerifyTenantModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        application={verifyingApp}
        onVerified={(id) => {
          setVerifiedAppIds((prev) => [...prev, id]);
          setToastMessage("Tenant documents and guarantor (ዋስ) verified successfully!");
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />
    </div>
  );
}
