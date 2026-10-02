import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERNS - Ethio Rents And Sales",
  description: "Buy, Rent, Sell, Get Mortgage, Find an Agent, and Manage Rentals with ERNS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <Navbar />
          <div className="body-container">
            <Sidebar />
            <main className="main-content">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
