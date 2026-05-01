"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbox } from "./lightbox";
import { getStoredCategories, getStoredImages, type GalleryImage } from "@/lib/gallery-data";

export function GalleryGrid() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const storedCategories = getStoredCategories();
    const storedImages = getStoredImages();

    setCategories(["all", ...storedCategories.map((category) => category.id)]);
    setGalleryImages(storedImages);
  }, []);

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl md:text-3xl font-light text-foreground">
          Featured Work
        </h2>
        <p className="text-muted-foreground mt-2">
          A glimpse into our portfolio
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-8 -mx-4 px-4 justify-start md:justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category
                ? "bg-foreground text-background"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto"
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image, index) => (
            <motion.div
              key={`${image.src}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`relative cursor-pointer group overflow-hidden rounded-xl ${
                index === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
              }`}
              onClick={() => setLightboxImage(image.src)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  );
}
