import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { COLLECTIONS, DB_NAME, ImageDocument } from "@/lib/models";

async function getCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<ImageDocument>(COLLECTIONS.images);
}

// GET /api/images - return all images (optionally ?category=wedding)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const col = await getCollection();
    const filter = category ? { category } : {};
    const images = await col
      .find(filter, { projection: { _id: 1, src: 1, alt: 1, category: 1 } })
      .toArray();

    // Serialize _id to string so it can be used as a key / delete handle
    const serialized = images.map((img) => ({
      _id: img._id?.toString(),
      src: img.src,
      alt: img.alt,
      category: img.category,
    }));

    return NextResponse.json(serialized);
  } catch (err) {
    console.error("[GET /api/images]", err);
    return NextResponse.json({ error: "Failed to fetch images." }, { status: 500 });
  }
}

// POST /api/images - insert a new image { src, alt, category }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { src, alt, category } = body as { src: string; alt: string; category: string };

    if (!src || !alt || !category) {
      return NextResponse.json({ error: "src, alt, and category are required." }, { status: 400 });
    }

    const col = await getCollection();
    const result = await col.insertOne({ src, alt, category });

    return NextResponse.json(
      { _id: result.insertedId.toString(), src, alt, category },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/images]", err);
    return NextResponse.json({ error: "Failed to create image." }, { status: 500 });
  }
}

// DELETE /api/images?_id=<objectId> - remove a single image
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("_id");

    if (!id) {
      return NextResponse.json({ error: "_id query param is required." }, { status: 400 });
    }

    const col = await getCollection();
    await col.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("[DELETE /api/images]", err);
    return NextResponse.json({ error: "Failed to delete image." }, { status: 500 });
  }
}
