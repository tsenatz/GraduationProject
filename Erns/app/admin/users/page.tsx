"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Search,
  Users,
  Shield,
  User,
  Briefcase,
  Calendar,
  X,
  CheckCircle2,
} from "lucide-react";
import {
  getAdminUsersAction,
  updateUserRoleAction,
  type AdminUserItem,
} from "@/lib/actions/admin";
import styles from "../admin.module.css";

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadUsers = async () => {
    const res = await getAdminUsersAction({
      role: activeTab === "ALL" ? undefined : activeTab,
      search: searchQuery,
    });
    if (res.success) {
      setUsers(res.users);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [activeTab, searchQuery]);

  const handleRoleChange = (targetUser: AdminUserItem, newRole: "USER" | "AGENT" | "ADMIN") => {
    if (targetUser.role === newRole) return;
    if (
      !confirm(
        `Are you sure you want to change the role of "${targetUser.name || targetUser.email}" from ${targetUser.role} to ${newRole}?`
      )
    ) {
      return;
    }

    startTransition(async () => {
      const res = await updateUserRoleAction(targetUser.id, newRole);
      if (res.success) {
        setActionMessage({
          type: "success",
          text: `User "${targetUser.name || targetUser.email}" is now assigned the role of ${newRole}.`,
        });
        loadUsers();
      } else {
        setActionMessage({ type: "error", text: res.error || "Failed to update user role." });
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
            All Accounts
            <span className={styles.tabBadge}>{users.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "USER" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("USER")}
          >
            Consumers (USER)
          </button>

          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "AGENT" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("AGENT")}
          >
            Agents (AGENT)
          </button>

          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "ADMIN" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("ADMIN")}
          >
            Admins (ADMIN)
          </button>
        </div>

        <div className={styles.filterActions}>
          <div className={styles.searchBox} style={{ width: "220px" }}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search user, email..."
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
          <span>User ID</span>
          <span>Account</span>
          <span>Joined Date</span>
          <span>Properties</span>
          <span>Role</span>
          <span style={{ textAlign: "right" }}>Assign Role</span>
        </div>

        {users.length === 0 ? (
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
            <Users size={36} style={{ margin: "0 auto 0.75rem", color: "#4a7fa7" }} />
            <h3 style={{ fontSize: "1.1rem", color: "#0a1931", marginBottom: "0.25rem" }}>
              No accounts found
            </h3>
            <p style={{ fontSize: "0.85rem" }}>Try adjusting your search query.</p>
          </div>
        ) : (
          users.map((u) => (
            <div key={u.id} className={styles.cardRow}>
              <div className={styles.rowId}>#{u.id.slice(0, 8)}</div>

              <div className={styles.nameCluster}>
                <div className={styles.userAvatarThumb}>
                  {(u.name || u.email).charAt(0).toUpperCase()}
                </div>
                <div className={styles.userNameDetails}>
                  <span className={styles.rowPrimaryText}>{u.name || "ERNS Member"}</span>
                  <span className={styles.rowSecondaryText}>{u.email}</span>
                </div>
              </div>

              <div className={styles.rowDate}>
                {new Date(u.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>

              <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0a1931" }}>
                {u.propertyCount !== undefined ? u.propertyCount : 0} listings
              </div>

              <div>
                <span
                  className={`${styles.statusBadge} ${
                    u.role === "ADMIN"
                      ? styles.statusPending
                      : u.role === "AGENT"
                      ? styles.statusVerified
                      : styles.statusInfo
                  }`}
                >
                  <span className={styles.statusDot} />
                  {u.role}
                </span>
              </div>

              <div className={styles.rowActions} onClick={(e) => e.stopPropagation()}>
                <select
                  value={u.role}
                  onChange={(e) =>
                    handleRoleChange(u, e.target.value as "USER" | "AGENT" | "ADMIN")
                  }
                  disabled={isPending}
                  className={styles.filterSelect}
                  style={{ fontSize: "0.78rem", padding: "0.35rem 0.65rem" }}
                  aria-label={`Change role for ${u.name || u.email}`}
                >
                  <option value="USER">USER</option>
                  <option value="AGENT">AGENT</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= PAGINATION BAR ================= */}
      <div className={styles.paginationRow}>
        <span className={styles.paginationText}>
          Showing 1 to {users.length} of {users.length} accounts
        </span>
        <div className={styles.paginationControls}>
          <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
        </div>
      </div>
    </div>
  );
}
