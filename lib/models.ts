import { ObjectId } from "mongodb";

// ─── Collection Names ─────────────────────────────────────────────────────────

export const COLLECTIONS = {
  categories: "categories",
  images: "images",
} as const;

export const DB_NAME = "vk_photography";

// ─── Document Types ───────────────────────────────────────────────────────────

export type CategoryDocument = {
  _id?: ObjectId;
  id: string;       // slug-style id, e.g. "wedding"
  title: string;    // display name, e.g. "Wedding"
};

export type ImageDocument = {
  _id?: ObjectId;
  src: string;      // URL or base64 data URI
  alt: string;
  category: string; // matches CategoryDocument.id
};
