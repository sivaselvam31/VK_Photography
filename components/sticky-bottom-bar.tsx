"use client";

import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function StickyBottomBar() {
  const whatsappLink =
    "https://wa.me/1234567890?text=Hello!%20I%27m%20interested%20in%20your%20photography%20services.";

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.8, duration: 0.4, type: "spring", stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 py-3"
    >
      <div className="flex gap-3">
        <Button
          asChild
          variant="outline"
          className="flex-1 rounded-full gap-2"
        >
          <Link href="#gallery">
            <ImageIcon size={18} />
            View Gallery
          </Link>
        </Button>
        <Button
          asChild
          className="flex-1 rounded-full gap-2 bg-[#25D366] hover:bg-[#22c55e] text-primary-foreground"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={18} />
            WhatsApp
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
