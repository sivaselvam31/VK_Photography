"use client";

import { useState } from "react";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryImage } from "@/lib/gallery-data";

const PAGE_SIZE = 8;

type Props = {
  images: GalleryImage[];
  saving: boolean;
  onRemove: (image: GalleryImage) => void;
};

export function ImagesTable({ images, saving, onRemove }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(images.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = images.slice(start, start + PAGE_SIZE);

  return (
    <section className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Gallery Images</h2>
        <span className="text-sm text-muted-foreground">
          {images.length} total
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <th className="px-6 py-3 text-left font-medium">#</th>
              <th className="px-4 py-3 text-left font-medium">Preview</th>
              <th className="px-6 py-3 text-left font-medium">Alt Text</th>
              <th className="px-6 py-3 text-left font-medium">Category</th>
              <th className="px-6 py-3 text-left font-medium">Source</th>
              <th className="px-6 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No images yet.
                </td>
              </tr>
            ) : (
              rows.map((image, i) => (
                <tr
                  key={image._id ?? `${image.src}-${i}`}
                  className="hover:bg-muted/20 transition-colors group"
                >
                  <td className="px-6 py-3 text-muted-foreground tabular-nums">
                    {start + i + 1}
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-12 w-16 rounded-lg overflow-hidden bg-muted border border-border flex-shrink-0">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3 font-medium text-foreground max-w-[180px]">
                    <span className="line-clamp-2">{image.alt}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center rounded-full bg-accent/60 px-2.5 py-0.5 text-xs font-medium text-foreground">
                      {image.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground max-w-[200px]">
                    <span className="block truncate text-xs font-mono">
                      {image.src}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onRemove(image)}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive hover:text-background disabled:opacity-40"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20">
          <span className="text-xs text-muted-foreground">
            Page {safePage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft size={13} /> Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-40"
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
