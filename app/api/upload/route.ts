import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

// 50MB in bytes
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Supported image file extensions
const ALLOWED_EXTENSIONS = [
  "jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff", "ico",
  "psd", "ai", "eps", "psd", "psb"
];

function isValidImageFile(filename: string, mimeType: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase() || "";
  return ALLOWED_EXTENSIONS.includes(extension) || mimeType.startsWith("image/");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    // const alt = formData.get("alt") as string;
    // const category = formData.get("category") as string;

    if (!file) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    if (!isValidImageFile(file.name, file.type)) {
      return NextResponse.json(
        { error: "Only image files allowed (JPG, PNG, GIF, WebP, SVG, PSD, etc.)" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size must be less than 50MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB` },
        { status: 400 },
      );
    }

    const filename = `${Date.now()}-${file.name}`;

    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json(
      {
        src: blob.url,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[UPLOAD ERROR]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
