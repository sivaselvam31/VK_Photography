"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import { type Category, type GalleryImage } from "@/lib/gallery-data";

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  500: 2,
};

function CategoryTabs({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedCategory === category
              ? "bg-foreground text-background shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}

function MasonryImageCard({ image, index }: { image: GalleryImage; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="mb-4 md:mb-6 relative group overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 bg-muted/20"
    >
      <img
        src={image.src}
        alt={image.alt || "Gallery image"}
        loading="lazy"
        className="block w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
    </motion.div>
  );
}

function SkeletonGrid() {
  const heights = ["h-64", "h-80", "h-96", "h-72", "h-80", "h-64", "h-96", "h-72"];
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto -ml-4 md:-ml-6"
      columnClassName="pl-4 md:pl-6 bg-clip-padding"
    >
      {heights.map((h, i) => (
        <div
          key={i}
          className={`mb-4 md:mb-6 rounded-xl bg-muted/60 animate-pulse ${h}`}
        />
      ))}
    </Masonry>
  );
}

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

      <CategoryTabs
        categories={allCategories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <SkeletonGrid />
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-4 md:-ml-6"
            columnClassName="pl-4 md:pl-6 bg-clip-padding"
          >
            {filteredImages.map((image, index) => (
              <MasonryImageCard
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
