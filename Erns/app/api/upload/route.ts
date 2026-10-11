import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { auth } from "@/lib/auth";

// Validate binary file signature (magic bytes) to ensure file is authentically an image
function isValidImageSignature(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;

  // JPEG signature: 0xFF, 0xD8, 0xFF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG signature: 0x89, 0x50, 0x4E, 0x47 (89 'P' 'N' 'G')
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return true;
  }

  // GIF signature: 'G' 'I' 'F' '8'
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return true;
  }

  // WEBP signature: 'R' 'I' 'F' 'F' ... 'W' 'E' 'B' 'P'
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true;
  }

  return false;
}

export async function POST(request: Request) {
  try {
    // 1. Authentication Gate: Require verified session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to upload photos." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // 2. MIME type whitelist
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Allowed formats: JPG, PNG, WebP." },
        { status: 400 }
      );
    }

    // 3. Strict size limit (8MB max per property image)
    const MAX_SIZE = 8 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds 8MB size limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Magic bytes security check: prevent malicious executable masking
    if (!isValidImageSignature(buffer)) {
      return NextResponse.json(
        { success: false, error: "Corrupt or invalid image file signature detected." },
        { status: 400 }
      );
    }

    // 5. Filename sanitization: generate unguessable cryptographically random filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
    const uniqueId = crypto.randomBytes(12).toString("hex");
    const filename = `prop-${Date.now()}-${uniqueId}.${safeExt}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, filename);

    // Write file securely
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error("Secure upload error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during upload" },
      { status: 500 }
    );
  }
}
