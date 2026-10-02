import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "../components/Footer";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <div className="app-container">
          <Navbar />
          <div className="body-container">
            <Sidebar />
            <main className="main-content">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
