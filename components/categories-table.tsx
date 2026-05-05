"use client";

import { useState } from "react";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Category } from "@/lib/gallery-data";

const PAGE_SIZE = 8;

type Props = {
  categories: Category[];
  saving: boolean;
  onRemove: (id: string) => void;
};

export function 
CategoriesTable({ categories, saving, onRemove }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(categories.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = categories.slice(start, start + PAGE_SIZE);

  return (
    <section className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Categories</h2>
        <span className="text-sm text-muted-foreground">
          {categories.length} total
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <th className="px-6 py-3 text-left font-medium">#</th>
              <th className="px-6 py-3 text-left font-medium">Title</th>
              <th className="px-6 py-3 text-left font-medium">ID (slug)</th>
              <th className="px-6 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No categories yet.
                </td>
              </tr>
            ) : (
              rows.map((cat, i) => (
                <tr
                  key={cat.id}
                  className="hover:bg-muted/20 transition-colors group"
                >
                  <td className="px-6 py-3 text-muted-foreground tabular-nums">
                    {start + i + 1}
                  </td>
                  <td className="px-6 py-3 font-medium text-foreground">
                    {cat.title}
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-muted-foreground">
                    {cat.id}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onRemove(cat.id)}
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
