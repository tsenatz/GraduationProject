"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface AccessDeniedProps {
  userEmail?: string | null;
  userRole?: string | null;
}

export default function AccessDenied({ userEmail, userRole = "USER" }: AccessDeniedProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f6fafd",
        padding: "1.5rem",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "2.5rem 2rem",
          boxShadow: "0 10px 30px rgba(10, 25, 49, 0.08)",
          border: "1px solid rgba(74, 127, 167, 0.2)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #fecaca",
          }}
        >
          <ShieldAlert size={32} />
        </div>

        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#0a1931",
              marginBottom: "0.5rem",
              letterSpacing: "-0.5px",
            }}
          >
            Administrator Clearance Required
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#4a7fa7",
              lineHeight: 1.5,
            }}
          >
            The ERNS Admin Portal is restricted to verified administrators. Your current account does not have sufficient administrative privileges.
          </p>
        </div>

        {userEmail && (
          <div
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              backgroundColor: "#f6fafd",
              border: "1px solid rgba(74, 127, 167, 0.15)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.85rem",
              boxSizing: "border-box",
            }}
          >
            <span style={{ color: "#4a7fa7" }}>Signed in as:</span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 600, color: "#0a1931" }}>{userEmail}</div>
              <div style={{ fontSize: "0.75rem", color: "#4a7fa7" }}>Role: {userRole}</div>
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.65rem",
            width: "100%",
            marginTop: "0.5rem",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "0.8rem",
              borderRadius: "12px",
              backgroundColor: "#0a1931",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "background-color 0.15s ease",
              boxSizing: "border-box",
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to ERNS Marketplace</span>
          </Link>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login?callbackUrl=/admin" })}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "0.8rem",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              color: "#0a1931",
              fontSize: "0.9rem",
              fontWeight: 600,
              border: "1px solid rgba(74, 127, 167, 0.3)",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
              boxSizing: "border-box",
            }}
          >
            <LogOut size={16} />
            <span>Switch to Admin Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
