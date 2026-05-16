// ─── Component Props Types ────────────────────────────────────────────────

import type { Category, GalleryImage } from "./gallery";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  isLoading?: boolean;
}

export type CategoriesTableProps = {
  categories: Category[];
  saving: boolean;
  onRemove: (id: string) => void;
};

export type ImagesTableProps = {
  images: GalleryImage[];
  saving: boolean;
  onRemove: (image: GalleryImage) => void;
};
