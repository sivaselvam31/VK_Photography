// ─── Types ────────────────────────────────────────────────────────────────────

export type Category = {
  id: string;
  title: string;
};

export type GalleryImage = {
  _id?: string;     // MongoDB ObjectId as string (present after fetch, absent before insert)
  src: string;
  alt: string;
  category: string;
};

// ─── Default / Seed Data ──────────────────────────────────────────────────────
// These are only used by the seed API route to pre-populate MongoDB.
// The app itself always reads from the database via the API routes.

export const defaultCategories: Category[] = [
  { id: "wedding", title: "Wedding" },
  { id: "fashion", title: "Fashion" },
  { id: "events", title: "Events" },
];

export const defaultGalleryImages: GalleryImage[] = [
  { src: "/images/gallery/wedding-1.jpg", category: "wedding", alt: "Wedding ceremony" },
  { src: "/images/gallery/fashion-1.jpg", category: "fashion", alt: "Fashion editorial" },
  { src: "/images/gallery/events-1.jpg", category: "events", alt: "Corporate event" },
  { src: "/images/gallery/wedding-2.jpg", category: "wedding", alt: "Wedding dance" },
  { src: "/images/gallery/fashion-2.jpg", category: "fashion", alt: "Fashion portrait" },
  { src: "/images/gallery/events-2.jpg", category: "events", alt: "Celebration" },
];
