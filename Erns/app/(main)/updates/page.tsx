import { Suspense } from "react";
import type { Metadata } from "next";
import { UpdatesView } from "@/components/updates";

export const metadata: Metadata = {
  title: "Saved Searches & Property Updates | ERNS Real Estate",
  description:
    "Track your saved property searches, receive instant alerts for new Addis Ababa listings, and stay notified on price drops across Bole, CMC, Sarbet, and Kazanchis.",
};

export default function UpdatesPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
      <UpdatesView />
    </Suspense>
  );
}
