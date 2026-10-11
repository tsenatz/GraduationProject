"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FsboHero,
  FsboListingBuilder,
  FsboHowItWorks,
  FsboWhyErns,
  FsboLegalChecklist,
  FsboProsCons,
  FsboFAQ,
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

  const handleLocationSelect = (subCity: string, address: string) => {
    if (subCity) setSelectedSubCity(subCity);
    if (address) setSelectedAddress(address);
  };

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
      <FsboHero onLocationSelect={handleLocationSelect} />
      <FsboListingBuilder
        initialSubCity={selectedSubCity}
        initialAddress={selectedAddress}
      />
      <FsboHowItWorks />
      <FsboWhyErns />
      <FsboLegalChecklist />
      <FsboProsCons />
      <FsboFAQ />
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
