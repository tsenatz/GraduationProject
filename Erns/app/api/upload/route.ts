import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// 10MB maximum file size limit
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Magic bytes signatures for secure file validation
const FILE_SIGNATURES: Record<string, { bytes: number[]; ext: string }> = {
  jpeg: { bytes: [0xff, 0xd8, 0xff], ext: ".jpg" },
  png: { bytes: [0x89, 0x50, 0x4e, 0x47], ext: ".png" },
  webp: { bytes: [0x52, 0x49, 0x46, 0x46], ext: ".webp" },
  pdf: { bytes: [0x25, 0x50, 0x44, 0x46], ext: ".pdf" },
};

function verifyFileSignature(buffer: Buffer): string | null {
  for (const [key, { bytes, ext }] of Object.entries(FILE_SIGNATURES)) {
    if (buffer.length < bytes.length) continue;
    let match = true;
    for (let i = 0; i < bytes.length; i++) {
      if (buffer[i] !== bytes[i]) {
        match = false;
        break;
      }
    }
    if (match) return ext;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    // 1. Session check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to upload documents." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. File size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Binary magic bytes verification
    const verifiedExt = verifyFileSignature(buffer);
    if (!verifiedExt) {
      return NextResponse.json(
        { error: "Invalid file format. Only PDF, PNG, JPG, or WEBP are permitted." },
        { status: 400 }
      );
    }

    // 4. Generate collision-resistant unique filename
    const uniqueId = crypto.randomBytes(16).toString("hex");
    const safeFilename = `${uniqueId}${verifiedExt}`;

    // 5. Save to public/uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, safeFilename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Failed to process document upload" },
      { status: 500 }
    );
  }
}
