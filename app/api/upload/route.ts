import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const runtime = "nodejs";

// 50MB in bytes
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Allowed image file extensions (common web-friendly formats)
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"];

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

function isValidImageFile(filename: string, mimeType: string): boolean {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  return (
    ALLOWED_EXTENSIONS.includes(extension) ||
    ALLOWED_MIME_TYPES.includes(mimeType)
  );
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (
        pathname: string
      ): Promise<{ addRandomSuffix: true }> => {
        // Validate file extension and name
        if (!isValidImageFile(pathname, "")) {
          throw new Error(
            "Only JPG, JPEG, PNG, WebP, and AVIF image files are allowed"
          );
        }

        return {
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[UPLOAD ERROR]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Upload failed. Please try again.",
      },
      { status: 400 }
    );
  }
}
