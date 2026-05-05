"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="py-16 px-4 bg-foreground text-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-semibold tracking-tight mb-4">
              VK Photography
            </h3>
            <p className="text-background/70 text-sm leading-relaxed">
              Capturing life&apos;s most beautiful moments with elegance and
              artistry. Based in New York, available worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link
                href="#home"
                className="text-sm text-background/70 hover:text-background transition-colors"
              >
                Home
              </Link>
              <Link
                href="#gallery"
                className="text-sm text-background/70 hover:text-background transition-colors"
              >
                Gallery
              </Link>
              <Link
                href="#about"
                className="text-sm text-background/70 hover:text-background transition-colors"
              >
                About
              </Link>
              <Link
                href="#services"
                className="text-sm text-background/70 hover:text-background transition-colors"
              >
                Services
              </Link>
            </div>
          </div>

          {/* Contact */}
          { /* 
          <div>
            <h4 className="font-medium mb-4">Get in Touch</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@lumiere.photo"
                className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
              >
                <Mail size={16} />
                hello@lumiere.photo
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
              >
                <Instagram size={16} />
                @lumiere.photo
              </a>
            </div>
          </div>
           */}

          {/* Location */}

          <div>
            <h4 className="font-medium mb-4">Location</h4>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-background/70">NO. 148/11, Pudupalyam Street,</p>
              <p className="text-sm text-background/70">Pillaiyarpalayam, Kanchipuram.</p>
              <p className="text-sm text-background/70">ph : +91 8883330874</p>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-background/20 text-center">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} VK Photography. All rights
            reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
