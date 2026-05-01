"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Lightbox } from "./lightbox";

const galleryImages = [
  { src: "/images/gallery/wedding-1.jpg", category: "wedding", alt: "Wedding ceremony" },
  { src: "/images/gallery/fashion-1.jpg", category: "fashion", alt: "Fashion editorial" },
  { src: "/images/gallery/events-1.jpg", category: "events", alt: "Corporate event" },
  { src: "/images/gallery/wedding-2.jpg", category: "wedding", alt: "Wedding dance" },
  { src: "/images/gallery/fashion-2.jpg", category: "fashion", alt: "Fashion portrait" },
  { src: "/images/gallery/events-2.jpg", category: "events", alt: "Celebration" },
];

const categories = ["all", "wedding", "fashion", "events"];

export function GalleryGrid() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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
              key={image.src}
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
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <Lightbox
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </section>
  );
}
