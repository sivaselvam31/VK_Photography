"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LightboxProps {
  image: string | null;
  onClose: () => void;
}

export function Lightbox({ image, onClose }: LightboxProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (image) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [image, onClose]);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] bg-foreground/95 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button
            className="absolute top-4 right-4 p-2 text-background hover:text-background/80 transition-colors"
            onClick={onClose}
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl aspect-[4/3] md:aspect-[16/10]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image}
              alt="Gallery image"
              className="h-full w-full object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
