import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RentalManagerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/rentalmanager");
  }

  return <>{children}</>;
}
