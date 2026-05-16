// ─── Gallery Types ────────────────────────────────────────────────────────

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
