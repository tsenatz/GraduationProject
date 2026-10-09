import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Favorite Homes | ERNS Real Estate Ethiopia",
  description:
    "View, compare, and manage your saved homes and rental properties in Addis Ababa on ERNS.",
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
