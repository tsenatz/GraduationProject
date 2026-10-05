
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RentalManagerPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <>
            <div>Rental Manager</div>

        </>

    );
}