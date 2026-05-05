import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { COLLECTIONS, DB_NAME } from "@/lib/models";
import { defaultCategories, defaultGalleryImages } from "@/lib/gallery-data";

// POST /api/seed — seeds the DB with defaults only when both collections are empty
export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const catCount = await db.collection(COLLECTIONS.categories).countDocuments();
    const imgCount = await db.collection(COLLECTIONS.images).countDocuments();

    if (catCount > 0 || imgCount > 0) {
      return NextResponse.json({
        seeded: false,
        message: "Database already has data. Clear it first or use Reset from admin panel.",
      });
    }

    await db.collection(COLLECTIONS.categories).insertMany(defaultCategories);
    await db.collection(COLLECTIONS.images).insertMany(defaultGalleryImages);

    return NextResponse.json({
      seeded: true,
      categories: defaultCategories.length,
      images: defaultGalleryImages.length,
    });
  } catch (err) {
    console.error("[POST /api/seed]", err);
    return NextResponse.json({ error: "Failed to seed database." }, { status: 500 });
  }
}

// DELETE /api/seed — wipes everything and re-seeds with defaults (used by Reset button)
export async function DELETE() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(COLLECTIONS.categories).deleteMany({});
    await db.collection(COLLECTIONS.images).deleteMany({});

    await db.collection(COLLECTIONS.categories).insertMany(defaultCategories);
    await db.collection(COLLECTIONS.images).insertMany(defaultGalleryImages);

    return NextResponse.json({
      reset: true,
      categories: defaultCategories.length,
      images: defaultGalleryImages.length,
    });
  } catch (err) {
    console.error("[DELETE /api/seed]", err);
    return NextResponse.json({ error: "Failed to reset database." }, { status: 500 });
  }
}
