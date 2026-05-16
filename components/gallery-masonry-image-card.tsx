"use client";

import { motion } from "framer-motion";
import type { GalleryImage } from "@/lib/gallery-data";

type Props = {
  image: GalleryImage;
  index: number;
};

export function GalleryMasonryImageCard({ image, index }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="mb-4 md:mb-6 relative group overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 bg-muted/20 min-h-250px"
    >
      <img
        src={image.src}
        alt={image.alt || "Gallery image"}
        loading="lazy"
        className="
    w-full
    h-auto
    min-h-250px
    max-h-900px
    object-cover
    rounded-2xl
    transition-transform
    duration-700
    ease-out
    group-hover:scale-[1.02]
  "
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
    </motion.div>
  );
}

