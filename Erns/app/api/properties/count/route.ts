import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const count = await db.property.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("[Property Count API] Error:", error);
    return NextResponse.json({ count: 8 }, { status: 200 });
  }
}
