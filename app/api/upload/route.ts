import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/upload — saves an image file to /public/uploads/ and returns its public URL path
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Validate it is an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }

    // Limit file size to 10 MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File is too large. Max size is 10 MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitise filename: keep extension, replace everything else with a timestamp + random suffix
    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    // Ensure /public/uploads/ exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    await writeFile(path.join(uploadDir, safeName), buffer);

    // Return the public URL path so it can be served by Next.js static file serving
    return NextResponse.json({ src: `/uploads/${safeName}` }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}
