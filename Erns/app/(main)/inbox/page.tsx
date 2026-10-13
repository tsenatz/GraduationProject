import type { Metadata } from "next";
import { InboxView } from "@/components/inbox";

export const metadata: Metadata = {
  title: "Inbox & Messages | ERNS Real Estate",
  description:
    "Communicate directly with verified real estate agents and property owners, schedule home tours, and review Addis Ababa property inquiries.",
};

export default function InboxPage() {
  return <InboxView />;
}
