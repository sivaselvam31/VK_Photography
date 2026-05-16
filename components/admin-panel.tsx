"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Loader2, ImageUp, CheckCircle2 } from "lucide-react";
import { upload } from "@vercel/blob/client";
import imageCompression from "browser-image-compression";
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
  const [categoryMessage, setCategoryMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [imageMessage, setImageMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<number | null>(null);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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

  // â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const showCategoryMessage = (type: "success" | "error", text: string) => {
    setCategoryMessage({ type, text });
    window.setTimeout(() => setCategoryMessage(null), 3200);
  };

  const showImageMessage = (type: "success" | "error", text: string) => {
    setImageMessage({ type, text });
    window.setTimeout(() => setImageMessage(null), 3200);
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
      showCategoryMessage("error", "Failed to load data from database.");
      showImageMessage("error", "Failed to load data from database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // â”€â”€â”€ Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const handleAddCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = categoryForm.title.trim();
    if (!title) {
      showCategoryMessage("error", "Please provide a category title.");
      return;
    }

    const id = normalizeId(categoryForm.id || title);
    if (!id) {
      showCategoryMessage("error", "Category ID must contain letters or numbers.");
      return;
    }
    if (categories.some((c) => c.id === id)) {
      showCategoryMessage("error", "A category with that ID already exists.");
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
        showCategoryMessage("error", err.error ?? "Failed to add category.");
        return;
      }

      const newCat: Category = await res.json();
      setCategories((prev) => [...prev, newCat]);
      setCategoryForm(initialCategory);
      showCategoryMessage("success", "Category added successfully.");
    } catch {
      showCategoryMessage("error", "Network error. Please try again.");
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
      showImageMessage("error", "Please complete image source, alt text, and category.");
      return;
    }
    if (!categories.some((c) => c.id === category)) {
      showImageMessage("error", "Please select a valid category.");
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
        showImageMessage("error", err.error ?? "Failed to add image.");
        return;
      }

      const newImg: GalleryImage = await res.json();
      setImages((prev) => [...prev, newImg]);
      setImageForm(initialImage);
      showImageMessage("success", "Image added to the gallery.");
    } catch {
      showImageMessage("error", "Network error. Please try again.");
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
          showCategoryMessage("success", "Category removed and related images cleaned up.");
        } catch {
          showCategoryMessage("error", "Failed to remove category.");
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
          showImageMessage("success", "Image removed.");
        } catch {
          showImageMessage("error", "Failed to remove image.");
        } finally {
          setSaving(false);
        }
      },
    });
    setIsConfirmOpen(true);
  };

  // â”€â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-foreground">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage gallery categories and images for the portfolio.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground gap-3">
          <Loader2 size={20} className="animate-spin" /> Loading data from
          database...
        </div>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
            {/* â”€â”€ Add Category â”€â”€ */}
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Add New Category
              </h2>
              {categoryMessage ? (
                <div
                  className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
                    categoryMessage.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}>
                  {categoryMessage.text}
                </div>
              ) : null}
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

            {/* â”€â”€ Add Image â”€â”€ */}
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Add Gallery Image
              </h2>
              {imageMessage ? (
                <div
                  className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
                    imageMessage.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}>
                  {imageMessage.text}
                </div>
              ) : null}
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
                    accept="image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setSelectedFileSize(file.size);
                      setFileSizeError(null);

                      // Validate file size before upload
                      if (file.size > MAX_FILE_SIZE) {
                        setFileSizeError(
                          `File size (${formatFileSize(file.size)}) exceeds 50MB limit`
                        );
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                        return;
                      }

                      setUploading(true);
                      setUploadProgress(0);
                      setUploadedFileName(null);
                      try {
                        // Compress image if needed
                        let fileToUpload = file;
                        const options = {
                          maxSizeMB: 5, // Compress if larger than 5MB
                          maxWidthOrHeight: 2560, // Max dimension
                          useWebWorker: true,
                          fileType: "image/webp", // Convert to WebP for better compression
                          initialQuality: 0.8,
                        };

                        if (file.size > 5 * 1024 * 1024) {
                          try {
                            fileToUpload = await imageCompression(file, options);
                          } catch (compressionErr) {
                            console.warn("Compression failed, using original file", compressionErr);
                            // Fall back to original file if compression fails
                          }
                        }

                        // Generate unique filename
                        const ext = fileToUpload.type === "image/webp" 
                          ? "webp" 
                          : fileToUpload.name.split(".").pop()?.toLowerCase() || "jpg";
                        const filename = `gallery-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

                        // Upload directly to Blob
                        const blob = await upload(filename, fileToUpload, {
                          access: "public",
                          handleUploadUrl: "/api/upload",
                          onUploadProgress: (event) => {
                            setUploadProgress(Math.round(event.percentage));
                          },
                        });

                        setImageForm((prev) => ({ ...prev, src: blob.url }));
                        setUploadedFileName(file.name);
                        setUploadProgress(0);
                        showImageMessage("success", "File uploaded successfully!");
                      } catch (err) {
                        const errorMsg = err instanceof Error ? err.message : "Upload failed. Please try again.";
                        showImageMessage("error", errorMsg);
                      } finally {
                        setUploading(false);
                        setUploadProgress(0);
                        setSelectedFileSize(null);
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
                    className={`inline-flex items-center justify-center rounded-full gap-2 px-4 py-2 border-2 border-border transition ${
                      uploading
                        ? "bg-secondary/50 text-muted-foreground cursor-wait"
                        : "bg-secondary text-foreground hover:bg-secondary/90 cursor-pointer hover:border-accent"
                    }`}
                    title="Click to upload image"
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        {uploadProgress > 0 && <span className="text-sm">{uploadProgress}%</span>}
                      </>
                    ) : (
                      <ImageUp size={15} /> 
                    )} 
                    {!uploading && "Choose local file"}
                  </label>
                  {uploadedFileName && !uploading && !fileSizeError && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <CheckCircle2 size={14} /> {uploadedFileName}
                    </span>
                  )}
                  {selectedFileSize && !uploading && !fileSizeError && (
                    <span className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                      {formatFileSize(selectedFileSize)}
                    </span>
                  )}
                </div>

                {fileSizeError && (
                  <div className="rounded-2xl bg-red-50 border border-red-200 p-3">
                    <p className="text-sm font-medium text-red-800">
                      {fileSizeError}
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Maximum file size allowed is 50MB
                    </p>
                  </div>
                )}

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

          {/* â”€â”€ Tables â”€â”€ */}
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
