"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";

export function WhatsAppFloatingButton() {
  const whatsappLink =
    "https://wa.me/1234567890?text=Hello!%20I%27m%20interested%20in%20your%20photography%20services.";

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.3, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 md:bottom-6 right-4 z-50 w-14 h-14 bg-[#25D366] text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={26} />
    </motion.a>
  );
}
