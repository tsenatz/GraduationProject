"use client";

import Link from "next/link";
import { UserCheck, ArrowLeft, ShieldCheck, PhoneCall } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function FindAgentPlaceholderPage() {
  const { isAmharic } = useLanguage();

  return (
    <div
      style={{
        maxWidth: "760px",
        margin: "60px auto",
        padding: "48px 24px",
        textAlign: "center",
        backgroundColor: "var(--color-surface)",
        borderRadius: "16px",
        border: "1px solid rgba(var(--color-accent-rgb), 0.2)",
        boxShadow: "0 8px 30px rgba(10, 25, 49, 0.06)",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "16px",
          backgroundColor: "rgba(var(--color-primary-rgb), 0.08)",
          color: "var(--color-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <UserCheck size={32} />
      </div>

      <span
        style={{
          fontSize: "0.8rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--color-accent)",
        }}
      >
        {isAmharic ? "በቅርቡ" : "Coming Soon"}
      </span>

      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          color: "var(--color-primary)",
          margin: "12px 0 16px",
        }}
      >
        {isAmharic
          ? "የተረጋገጡ ወኪሎች እና ደላሎች ማውጫ"
          : "Find a Verified Agent Directory"}
      </h1>

      <p style={{ color: "#475569", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto 32px", fontSize: "1rem" }}>
        {isAmharic
          ? "በአዲስ አበባ የተረጋገጡ ወኪሎችን የማገናኘት መድረክ በማዘጋጀት ላይ እንገኛለን። በቅርቡ ወኪሎችን መምረጥ፣ የሽያጭ ታሪካቸውን መገምገም እና ቀጥተኛ ምክክር ማግኘት ይችላሉ።"
          : "We are building our accredited agent matching network in Addis Ababa. You will soon be able to browse verified agents, review transaction histories, and request direct consultations."}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          marginBottom: "36px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-primary)", fontSize: "0.92rem", fontWeight: 600 }}>
          <ShieldCheck size={18} color="var(--color-accent)" />
          <span>{isAmharic ? "የመንግስት መታወቂያ የተረጋገጠ" : "Government ID Verified"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-primary)", fontSize: "0.92rem", fontWeight: 600 }}>
          <PhoneCall size={18} color="var(--color-accent)" />
          <span>{isAmharic ? "ቀጥተኛ ስልክ እና ዋትስአፕ" : "Direct Phone & WhatsApp"}</span>
        </div>
      </div>

      <Link
        href="/sell"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 24px",
          backgroundColor: "var(--color-primary)",
          color: "#ffffff",
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "0.95rem",
          textDecoration: "none",
        }}
      >
        <ArrowLeft size={16} />
        <span>{isAmharic ? "ወደ ኋላ ተመለስ" : "Back to Selling Options"}</span>
      </Link>
    </div>
  );
}
