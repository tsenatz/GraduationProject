"use client";

import React, { useState } from "react";
import {
  FsboHero,
  FsboListingBuilder,
  FsboHowItWorks,
  FsboProsCons,
  FsboWhyErns,
  FsboLegalChecklist,
  FsboFAQ,
  FsboCTA,
} from "@/components/sell/fsbo";

export default function ForSaleByOwnerPage() {
  const [selectedSubCity, setSelectedSubCity] = useState("Bole");
  const [selectedAddress, setSelectedAddress] = useState("");

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
      <FsboProsCons />
      <FsboWhyErns />
      <FsboLegalChecklist />
      <FsboFAQ />
      <FsboCTA />
    </main>
  );
}
