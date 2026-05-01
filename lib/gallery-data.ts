export type Category = {
  id: string;
  title: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
  category: string;
};

const STORAGE_KEYS = {
  categories: "vk_photography_categories",
  images: "vk_photography_gallery_images",
};

export const defaultCategories: Category[] = [
  {
    id: "wedding",
    title: "Wedding",
  },
  {
    id: "fashion",
    title: "Fashion",
  },
  {
    id: "events",
    title: "Events",
  },
];

export const defaultGalleryImages: GalleryImage[] = [
  { src: "/images/gallery/wedding-1.jpg", category: "wedding", alt: "Wedding ceremony" },
  { src: "/images/gallery/fashion-1.jpg", category: "fashion", alt: "Fashion editorial" },
  { src: "/images/gallery/events-1.jpg", category: "events", alt: "Corporate event" },
  { src: "/images/gallery/wedding-2.jpg", category: "wedding", alt: "Wedding dance" },
  { src: "/images/gallery/fashion-2.jpg", category: "fashion", alt: "Fashion portrait" },
  { src: "/images/gallery/events-2.jpg", category: "events", alt: "Celebration" },
];

function parseStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as T;
    }
  } catch {
    // ignore JSON parse errors and fall back to default
  }

  return fallback;
}

export function getStoredCategories(): Category[] {
  return parseStored<Category[]>(STORAGE_KEYS.categories, defaultCategories);
}

export function getStoredImages(): GalleryImage[] {
  return parseStored<GalleryImage[]>(STORAGE_KEYS.images, defaultGalleryImages);
}

export function saveStoredCategories(categories: Category[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
}

export function saveStoredImages(images: GalleryImage[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.images, JSON.stringify(images));
}

export function resetStoredData() {
  if (typeof window === "undefined") {
    return;
  }
  saveStoredCategories(defaultCategories);
  saveStoredImages(defaultGalleryImages);
}
