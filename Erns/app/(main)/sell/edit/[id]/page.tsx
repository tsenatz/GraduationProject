"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Loader2, ArrowLeft, AlertCircle, Lock } from "lucide-react";
import { FsboListingBuilder } from "@/components/sell/fsbo";
import { getPropertyForEditAction } from "@/lib/actions/listings";

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export default function EditListingPage({ params }: EditListingPageProps) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;

  const { status } = useSession();
  const [property, setProperty] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      setLoading(false);
      setError("AUTH_REQUIRED");
      return;
    }

    if (status === "authenticated" && propertyId) {
      loadProperty();
    }
  }, [status, propertyId]);

  const loadProperty = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPropertyForEditAction(propertyId);
      if (res.success && res.property) {
        setProperty(res.property);
      } else {
        if (res.error === "UNAUTHORIZED") {
          setError("You do not have permission to edit this listing.");
        } else if (res.error === "NOT_FOUND") {
          setError("Property listing not found.");
        } else if (res.error === "AUTH_REQUIRED") {
          setError("AUTH_REQUIRED");
        } else {
          setError(res.error || "Failed to load listing.");
        }
      }
    } catch (err) {
      console.error("Error loading property for edit:", err);
      setError("An unexpected error occurred while loading this listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--bg-color, #f6fafd)",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "80px",
      }}
    >
      {/* Top Breadcrumb Nav */}
      <div
        style={{
          maxWidth: "1280px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 20px 0",
        }}
      >
        <Link
          href="/sell/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--color-primary)",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          <ArrowLeft size={18} />
          <span>Back to Seller Dashboard</span>
        </Link>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "100px 20px",
            gap: "16px",
            color: "var(--color-accent)",
          }}
        >
          <Loader2 size={36} className="animate-spin" />
          <p style={{ fontWeight: 600 }}>Loading listing details...</p>
        </div>
      ) : error === "AUTH_REQUIRED" ? (
        <div
          style={{
            maxWidth: "500px",
            margin: "60px auto",
            padding: "40px 24px",
            background: "var(--color-surface)",
            borderRadius: "20px",
            border: "1px solid var(--border-color)",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#eff6ff",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Lock size={30} />
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "8px" }}>
            Sign In Required
          </h2>
          <p style={{ color: "var(--color-accent)", marginBottom: "24px", fontSize: "0.95rem" }}>
            Please sign in to your ERNS account to edit your properties.
          </p>
          <Link
            href={`/login?callbackUrl=/sell/edit/${propertyId}`}
            style={{
              display: "inline-block",
              background: "var(--color-primary)",
              color: "white",
              padding: "12px 28px",
              borderRadius: "10px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </div>
      ) : error ? (
        <div
          style={{
            maxWidth: "560px",
            margin: "60px auto",
            padding: "40px 24px",
            background: "var(--color-surface)",
            borderRadius: "20px",
            border: "1px solid #fee2e2",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#fff5f5",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <AlertCircle size={30} />
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "8px", color: "#b91c1c" }}>
            Unable to Edit Listing
          </h2>
          <p style={{ color: "var(--color-accent)", marginBottom: "24px", fontSize: "0.95rem" }}>
            {error}
          </p>
          <Link
            href="/sell/dashboard"
            style={{
              display: "inline-block",
              background: "var(--color-primary)",
              color: "white",
              padding: "12px 28px",
              borderRadius: "10px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Go to Seller Dashboard
          </Link>
        </div>
      ) : property ? (
        <FsboListingBuilder
          mode="edit"
          propertyId={property.id}
          initialData={property}
        />
      ) : null}
    </main>
  );
}
