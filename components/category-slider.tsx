"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: "wedding",
    title: "Wedding",
    description: "Timeless moments",
    image: "/images/gallery/wedding-1.jpg",
  },
  {
    id: "fashion",
    title: "Fashion",
    description: "Editorial style",
    image: "/images/gallery/fashion-1.jpg",
  },
  {
    id: "events",
    title: "Events",
    description: "Celebration stories",
    image: "/images/gallery/events-1.jpg",
  },
];

export function CategorySlider() {
  return (
    <section className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-light text-foreground">
          Explore Categories
        </h2>
        <p className="text-muted-foreground mt-2">
          Discover our photography styles
        </p>
      </motion.div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex-shrink-0"
          >
            <Link
              href={`#gallery?category=${category.id}`}
              className="group block relative w-[280px] h-[360px] rounded-2xl overflow-hidden"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-medium text-primary-foreground">
                  {category.title}
                </h3>
                <p className="text-sm text-primary-foreground/80 mt-1">
                  {category.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
