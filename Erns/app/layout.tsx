import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { FavoritesProvider } from "@/components/providers/FavoritesProvider";
import { ServiceWorkerProvider } from "@/components/providers/ServiceWorkerProvider";
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
        <AuthProvider>
          <LanguageProvider>
            <FavoritesProvider>
              <ServiceWorkerProvider>{children}</ServiceWorkerProvider>
            </FavoritesProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
