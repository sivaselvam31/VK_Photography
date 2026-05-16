"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import { type Category, type GalleryImage } from "@/lib/gallery-data";
import { GalleryCategoryTabs } from "@/components/gallery-category-tabs";
import { GalleryMasonryImageCard } from "@/components/gallery-masonry-image-card";
import { GallerySkeletonGrid } from "@/components/gallery-skeleton-grid";

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  500: 1,
};

export function GalleryGrid() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, imgRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/images"),
        ]);
        const [cats, imgs]: [Category[], GalleryImage[]] = await Promise.all([
          catRes.json(),
          imgRes.json(),
        ]);
        setCategories(cats);
        setGalleryImages(imgs);
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const allCategories = ["all", ...categories.map((c) => c.id)];

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-light text-foreground tracking-tight">
          Featured Work
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          A glimpse into our portfolio
        </p>
      </motion.div>

      <GalleryCategoryTabs
        categories={allCategories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="w-full mx-auto px-0">
        {isLoading ? (
          <GallerySkeletonGrid breakpointColumns={breakpointColumnsObj} />
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-4 md:-ml-6"
            columnClassName="pl-4 md:pl-6 bg-clip-padding"
          >
            {filteredImages.map((image, index) => (
              <GalleryMasonryImageCard
                key={image._id ?? `${image.src}-${index}`}
                image={image}
                index={index}
              />
            ))}
          </Masonry>
        )}
      </div>
    </section>
  );
}
