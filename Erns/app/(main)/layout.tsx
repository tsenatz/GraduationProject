import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-container">
      <Navbar />
      <div className="body-container">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}
