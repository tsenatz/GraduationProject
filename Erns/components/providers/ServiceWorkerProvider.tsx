"use client";

import React, { useEffect } from "react";

export function ServiceWorkerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("ERNS Service Worker registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("Service worker registration error:", err);
        });
    }
  }, []);

  return <>{children}</>;
}

export default ServiceWorkerProvider;
