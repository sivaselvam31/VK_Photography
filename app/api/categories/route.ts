import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { COLLECTIONS, DB_NAME, CategoryDocument } from "@/lib/models";

async function getCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<CategoryDocument>(COLLECTIONS.categories);
}

// GET /api/categories — return all categories
export async function GET() {
  try {
    const col = await getCollection();
    const categories = await col.find({}, { projection: { _id: 0 } }).toArray();
    return NextResponse.json(categories);
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json({ error: "Failed to fetch categories." }, { status: 500 });
  }
}

// POST /api/categories — insert a new category { id, title }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title } = body as { id: string; title: string };

    if (!id || !title) {
      return NextResponse.json({ error: "id and title are required." }, { status: 400 });
    }

    const col = await getCollection();

    // Prevent duplicate IDs
    const existing = await col.findOne({ id });
    if (existing) {
      return NextResponse.json({ error: "A category with that ID already exists." }, { status: 409 });
    }

    await col.insertOne({ id, title });
    return NextResponse.json({ id, title }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/categories]", err);
    return NextResponse.json({ error: "Failed to create category." }, { status: 500 });
  }
}

// DELETE /api/categories?id=wedding — remove category + cascade images
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id query param is required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(COLLECTIONS.categories).deleteOne({ id });
    const { deletedCount } = await db.collection(COLLECTIONS.images).deleteMany({ category: id });

    return NextResponse.json({ deleted: true, imagesRemoved: deletedCount });
  } catch (err) {
    console.error("[DELETE /api/categories]", err);
    return NextResponse.json({ error: "Failed to delete category." }, { status: 500 });
  }
}
