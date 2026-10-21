import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

// 10MB maximum file size limit
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Validate binary file signatures (magic bytes) to ensure authentic file types
 * Supports images (JPEG, PNG, WEBP, GIF) and documents (PDF)
 */
function verifyFileSignature(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;

  // JPEG: 0xFF, 0xD8, 0xFF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return ".jpg";
  }

  // PNG: 0x89, 0x50, 0x4E, 0x47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return ".png";
  }

  // GIF: 0x47, 0x49, 0x46, 0x38 ('G' 'I' 'F' '8')
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return ".gif";
  }

  // PDF: 0x25, 0x50, 0x44, 0x46 ('%' 'P' 'D' 'F')
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return ".pdf";
  }

  // WEBP: 'R' 'I' 'F' 'F' ... 'W' 'E' 'B' 'P'
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
    return ".webp";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    // 1. Session check: Require authenticated session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to upload files." },
        { status: 401 }
      );
    }

    const rateLimitKey = `upload:${session.user.id}`;
    const rateLimit = checkRateLimit(rateLimitKey, {
      limit: 20,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.success) {
      const retryAfterSeconds = Math.max(1, Math.ceil(rateLimit.resetMs / 1000));
      return NextResponse.json(
        {
          success: false,
          error: `Upload rate limit reached. Please wait ${retryAfterSeconds} seconds before uploading more photos.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfterSeconds.toString(),
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": retryAfterSeconds.toString(),
          },
        }
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

    // 2. File size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Binary magic bytes verification
    const verifiedExt = verifyFileSignature(buffer);
    if (!verifiedExt) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file format. Only JPG, PNG, WEBP, GIF, and PDF are permitted.",
        },
        { status: 400 }
      );
    }

    // 4. Generate collision-resistant unique filename
    const uniqueId = crypto.randomBytes(16).toString("hex");
    const safeFilename = `upload-${Date.now()}-${uniqueId}${verifiedExt}`;

    let publicUrl = "";

    // 5. Upload to Supabase Storage if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
      const mimeTypes: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".pdf": "application/pdf",
      };
      const contentType = file.type || mimeTypes[verifiedExt] || "application/octet-stream";

      const { error: uploadError } = await supabaseAdmin.storage
        .from("property-images")
        .upload(safeFilename, buffer, {
          contentType,
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase storage upload error:", uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabaseAdmin.storage
        .from("property-images")
        .getPublicUrl(safeFilename);

      publicUrl = urlData.publicUrl;
    } else {
      // Local fallback
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, safeFilename);
      await fs.writeFile(filePath, buffer);

      publicUrl = `/uploads/${safeFilename}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process upload" },
      { status: 500 }
    );
  }
}
