"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FsboListingBuilder,
  FsboHowItWorks,
  FsboCTA,
} from "@/components/sell/fsbo";

function ForSaleByOwnerContent() {
  const searchParams = useSearchParams();
  const urlSubCity = searchParams.get("subCity") || "Bole";
  const urlAddress = searchParams.get("address") || "";

  const [selectedSubCity, setSelectedSubCity] = useState(urlSubCity);
  const [selectedAddress, setSelectedAddress] = useState(urlAddress);

  useEffect(() => {
    if (searchParams.get("subCity")) {
      setSelectedSubCity(searchParams.get("subCity")!);
    }
    if (searchParams.get("address")) {
      setSelectedAddress(searchParams.get("address")!);
    }
  }, [searchParams]);

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--bg-color, #f6fafd)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FsboListingBuilder
        initialSubCity={selectedSubCity}
        initialAddress={selectedAddress}
      />
      <FsboHowItWorks />
      <FsboCTA />
    </main>
  );
}

export default function ForSaleByOwnerPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <ForSaleByOwnerContent />
    </Suspense>
  );
}
