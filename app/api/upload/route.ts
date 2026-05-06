import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    // const alt = formData.get("alt") as string;
    // const category = formData.get("category") as string;

    if (!file) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files allowed" },
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
