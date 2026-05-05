"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-secondary/50">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-3/4 rounded-2xl overflow-hidden order-2 md:order-1"
          >
            <Image
              src="/images/photographer.png"
              alt="Professional photographer"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
              About Me
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-tight text-balance">
              Capturing Moments That Last Forever
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed text-justify">
              <p>
                With over a 7 Years of experience behind the lens, I specialize in
                creating timeless visual narratives that capture the essence of
                your most precious moments.
              </p>
              <p>
                My approach blends cinematic storytelling with natural elegance,
                ensuring each photograph reflects the authentic emotion and beauty
                of the occasion.
              </p>
              <p>
                From intimate weddings to grand celebrations, I bring artistry,
                passion, and attention to detail to every project.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 flex items-center justify-center md:justify-start gap-8"
            >
              <div>
                <p className="text-3xl font-light text-foreground">100+</p>
                <p className="text-sm text-muted-foreground">Projects</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-light text-foreground">7+</p>
                <p className="text-sm text-muted-foreground">Years</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-light text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
