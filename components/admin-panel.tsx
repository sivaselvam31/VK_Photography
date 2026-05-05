"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Loader2, ImageUp, CheckCircle2 } from "lucide-react";
import { Category, GalleryImage } from "@/lib/gallery-data";
import { CategoriesTable } from "@/components/categories-table";
import { ImagesTable } from "@/components/images-table";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

const initialCategory: Category = { id: "", title: "" };
const initialImage: GalleryImage = { src: "", alt: "", category: "" };

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const showStatus = (message: string) => {
    setStatus(message);
    window.setTimeout(() => setStatus(null), 3200);
  };

  async function loadData() {
    setLoading(true);
    try {
      const [catRes, imgRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/images"),
      ]);
      const [cats, imgs] = await Promise.all([catRes.json(), imgRes.json()]);
      setCategories(cats);
      setImages(imgs);
    } catch {
      showStatus("Failed to load data from database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleAddCategory = async (event: React.FormEvent<HTMLFormElement>) => {
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
    if (categories.some((c) => c.id === id)) {
      showStatus("A category with that ID already exists.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title }),
      });

      if (!res.ok) {
        const err = await res.json();
        showStatus(err.error ?? "Failed to add category.");
        return;
      }

      const newCat: Category = await res.json();
      setCategories((prev) => [...prev, newCat]);
      setCategoryForm(initialCategory);
      showStatus("Category added successfully.");
    } catch {
      showStatus("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const src = imageForm.src.trim();
    const alt = imageForm.alt.trim();
    const category = imageForm.category;

    if (!src || !alt || !category) {
      showStatus("Please complete image source, alt text, and category.");
      return;
    }
    if (!categories.some((c) => c.id === category)) {
      showStatus("Please select a valid category.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src, alt, category }),
      });

      if (!res.ok) {
        const err = await res.json();
        showStatus(err.error ?? "Failed to add image.");
        return;
      }

      const newImg: GalleryImage = await res.json();
      setImages((prev) => [...prev, newImg]);
      setImageForm(initialImage);
      showStatus("Image added to the gallery.");
    } catch {
      showStatus("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveCategory = (id: string) => {
    const category = categories.find((c) => c.id === id);
    setConfirmConfig({
      title: "Delete Category?",
      description: `Are you sure you want to delete "${category?.title || id}"? This will also remove all images associated with this category. This action cannot be undone.`,
      onConfirm: async () => {
        setSaving(true);
        setIsConfirmOpen(false);
        try {
          await fetch(`/api/categories?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
          });
          setCategories((prev) => prev.filter((c) => c.id !== id));
          setImages((prev) => prev.filter((img) => img.category !== id));
          showStatus("Category removed and related images cleaned up.");
        } catch {
          showStatus("Failed to remove category.");
        } finally {
          setSaving(false);
        }
      },
    });
    setIsConfirmOpen(true);
  };

  const handleRemoveImage = (image: GalleryImage) => {
    if (!image._id) return;
    setConfirmConfig({
      title: "Delete Image?",
      description: `Are you sure you want to remove this image from the gallery? This action cannot be undone.`,
      onConfirm: async () => {
        setSaving(true);
        setIsConfirmOpen(false);
        try {
          await fetch(`/api/images?_id=${encodeURIComponent(image._id!)}`, {
            method: "DELETE",
          });
          setImages((prev) => prev.filter((img) => img._id !== image._id));
          showStatus("Image removed.");
        } catch {
          showStatus("Failed to remove image.");
        } finally {
          setSaving(false);
        }
      },
    });
    setIsConfirmOpen(true);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-foreground">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage gallery categories and images for the portfolio.
        </p>
      </div>

      {status ? (
        <div className="mb-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-700">
          {status}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground gap-3">
          <Loader2 size={20} className="animate-spin" /> Loading data from
          database…
        </div>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
            {/* ── Add Category ── */}
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Add New Category
              </h2>
              <form className="space-y-4" onSubmit={handleAddCategory}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-foreground">
                    Category title
                    <input
                      value={categoryForm.title}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          title: e.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-accent"
                      placeholder="Wedding"
                    />
                  </label>
                  <label className="block text-sm font-medium text-foreground">
                    Optional category ID
                    <input
                      value={categoryForm.id}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, id: e.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-accent"
                      placeholder="wedding"
                    />
                  </label>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      <Plus size={16} className="mr-2" />
                    )}
                    Add category
                  </button>
                </div>
              </form>
            </section>

            {/* ── Add Image ── */}
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Add Gallery Image
              </h2>
              <form className="space-y-4" onSubmit={handleAddImage}>
                <label className="block text-sm font-medium text-foreground">
                  Image source path or URL
                  <input
                    value={imageForm.src}
                    onChange={(e) =>
                      setImageForm({ ...imageForm, src: e.target.value })
                    }
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-accent"
                    placeholder="/images/gallery/new-image.jpg"
                  />
                </label>

                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setUploading(true);
                      setUploadedFileName(null);
                      try {
                        const formData = new FormData();
                        formData.append("file", file);

                        const res = await fetch("/api/upload", {
                          method: "POST",
                          body: formData,
                        });

                        if (!res.ok) {
                          const err = await res.json();
                          showStatus(err.error ?? "Upload failed.");
                          return;
                        }

                        const { src } = await res.json();
                        setImageForm((prev) => ({ ...prev, src }));
                        setUploadedFileName(file.name);
                      } catch {
                        showStatus("Upload failed. Please try again.");
                      } finally {
                        setUploading(false);
                        // Reset input so the same file can be re-selected
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`inline-flex items-center gap-2 justify-center rounded-2xl border border-border px-4 py-2 text-sm font-medium transition ${
                      uploading
                        ? "bg-secondary/50 text-muted-foreground cursor-wait"
                        : "bg-secondary text-foreground hover:bg-secondary/90 cursor-pointer"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />{" "}
                        Uploading…
                      </>
                    ) : (
                      <>
                        <ImageUp size={15} /> Choose local file
                      </>
                    )}
                  </label>
                  {uploadedFileName && !uploading && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <CheckCircle2 size={14} /> {uploadedFileName}
                    </span>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-foreground">
                    Alt text
                    <input
                      value={imageForm.alt}
                      onChange={(e) =>
                        setImageForm({ ...imageForm, alt: e.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-accent"
                      placeholder="Couple portrait"
                    />
                  </label>
                  <label className="block text-sm font-medium text-foreground">
                    Category
                    <select
                      value={imageForm.category}
                      onChange={(e) =>
                        setImageForm({ ...imageForm, category: e.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-accent"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      <Plus size={16} className="mr-2" />
                    )}
                    Add image
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* ── Tables ── */}
          <div className="mt-10 flex flex-col gap-6">
            <CategoriesTable
              categories={categories}
              saving={saving}
              onRemove={handleRemoveCategory}
            />
            <ImagesTable
              images={images}
              saving={saving}
              onRemove={handleRemoveImage}
            />
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        isLoading={saving}
      />
    </div>
  );
}
