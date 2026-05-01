"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import {
  Category,
  GalleryImage,
  defaultCategories,
  defaultGalleryImages,
  getStoredCategories,
  getStoredImages,
  resetStoredData,
  saveStoredCategories,
  saveStoredImages,
} from "@/lib/gallery-data";

const initialCategory: Category = {
  id: "",
  title: "",
};

const initialImage: GalleryImage = {
  src: "",
  alt: "",
  category: "",
};

function normalizeId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function AdminPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categoryForm, setCategoryForm] = useState<Category>(initialCategory);
  const [imageForm, setImageForm] = useState<GalleryImage>(initialImage);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setCategories(getStoredCategories());
    setImages(getStoredImages());
  }, []);

  const showStatus = (message: string) => {
    setStatus(message);
    window.setTimeout(() => setStatus(null), 3200);
  };

  const saveCategories = (nextCategories: Category[]) => {
    setCategories(nextCategories);
    saveStoredCategories(nextCategories);
  };

  const saveImages = (nextImages: GalleryImage[]) => {
    setImages(nextImages);
    saveStoredImages(nextImages);
  };

  const handleAddCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = categoryForm.title.trim();

    if (!title) {
      showStatus("Please provide a category title.");
      return;
    }

    const id = normalizeId(categoryForm.id || title);
    if (!id) {
      showStatus("Category ID must contain letters or numbers.");
      return;
    }

    if (categories.some((category) => category.id === id)) {
      showStatus("A category with that ID already exists.");
      return;
    }

    const nextCategory = {
      id,
      title,
    };

    saveCategories([...categories, nextCategory]);
    setCategoryForm(initialCategory);
    showStatus("Category added successfully.");
  };

  const handleAddImage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const src = imageForm.src.trim();
    const alt = imageForm.alt.trim();
    const category = imageForm.category;

    if (!src || !alt || !category) {
      showStatus("Please complete image source, alt text, and category.");
      return;
    }

    if (!categories.some((item) => item.id === category)) {
      showStatus("Please select a valid category for the image.");
      return;
    }

    saveImages([...images, { src, alt, category }]);
    setImageForm(initialImage);
    showStatus("Image added to the gallery.");
  };

  const handleRemoveCategory = (id: string) => {
    const nextCategories = categories.filter((category) => category.id !== id);
    const nextImages = images.filter((image) => image.category !== id);
    saveCategories(nextCategories);
    saveImages(nextImages);
    showStatus("Category removed and related images cleaned up.");
  };

  const handleRemoveImage = (index: number) => {
    const nextImages = images.filter((_, itemIndex) => itemIndex !== index);
    saveImages(nextImages);
    showStatus("Image removed.");
  };

  const handleReset = () => {
    resetStoredData();
    setCategories(defaultCategories);
    setImages(defaultGalleryImages);
    setCategoryForm(initialCategory);
    setImageForm(initialImage);
    showStatus("Admin data reset to defaults.");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage gallery categories and images for the portfolio.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary/90"
        >
          <RefreshCw size={16} /> Reset to defaults
        </button>
      </div>

      {status ? (
        <div className="mb-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-700">
          {status}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Add New Category</h2>
          <form className="space-y-4" onSubmit={handleAddCategory}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-foreground">
                Category title
                <input
                  value={categoryForm.title}
                  onChange={(event) => setCategoryForm({ ...categoryForm, title: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-accent"
                  placeholder="Wedding"
                />
              </label>
              <label className="block text-sm font-medium text-foreground">
                Optional category ID
                <input
                  value={categoryForm.id}
                  onChange={(event) => setCategoryForm({ ...categoryForm, id: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-accent"
                  placeholder="wedding"
                />
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              <Plus size={16} className="mr-2" /> Add category
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Add Gallery Image</h2>
          <form className="space-y-4" onSubmit={handleAddImage}>
            <label className="block text-sm font-medium text-foreground">
              Image source path or URL
              <input
                value={imageForm.src}
                onChange={(event) => setImageForm({ ...imageForm, src: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-accent"
                placeholder="/images/gallery/new-image.jpg"
              />
            </label>

            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setImageForm({ ...imageForm, src: e.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center justify-center rounded-2xl border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary/90 cursor-pointer"
              >
                Choose local file
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-foreground">
                Alt text
                <input
                  value={imageForm.alt}
                  onChange={(event) => setImageForm({ ...imageForm, alt: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-accent"
                  placeholder="Couple portrait"
                />
              </label>
              <label className="block text-sm font-medium text-foreground">
                Category
                <select
                  value={imageForm.category}
                  onChange={(event) => setImageForm({ ...imageForm, category: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              <Plus size={16} className="mr-2" /> Add image
            </button>
          </form>
        </section>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-foreground">Categories</h2>
            <span className="text-sm text-muted-foreground">{categories.length} total</span>
          </div>

          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="rounded-3xl border border-border bg-background/60 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{category.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">ID: {category.id}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-destructive px-3 py-2 text-sm font-medium text-background transition hover:bg-destructive/90"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-foreground">Gallery Images</h2>
            <span className="text-sm text-muted-foreground">{images.length} total</span>
          </div>

          <div className="space-y-3">
            {images.map((image, index) => (
              <div key={`${image.src}-${index}`} className="rounded-3xl border border-border bg-background/60 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{image.alt}</p>
                    <p className="text-sm text-muted-foreground">Category: {image.category}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{image.src}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-destructive px-3 py-2 text-sm font-medium text-background transition hover:bg-destructive/90"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
