"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

const navLinks = [
  { href: "#home",     label: "Home" },
  { href: "#gallery",  label: "Gallery" },
  { href: "#about",    label: "About" },
  { href: "#services", label: "Services" },
  { href: "#contact",  label: "Contact" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-[32px] h-[32px]" />; // placeholder

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-1.5 rounded-xl hover:bg-foreground/8 transition-colors text-muted-foreground hover:text-foreground flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add a subtle extra shadow when the user scrolls down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /* Outer wrapper - full width, fixed, centered */
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={[
          // shape & glass
          "w-full max-w-5xl rounded-3xl md:rounded-4xl pointer-events-auto",
          "bg-background/60 backdrop-blur-xl",
          "border border-white/20",
          // depth / shadow
          scrolled
            ? "shadow-[0_8px_40px_rgba(0,0,0,0.18),0_1px_0_rgba(255,255,255,0.06)_inset]"
            : "shadow-[0_4px_24px_rgba(0,0,0,0.10),0_1px_0_rgba(255,255,255,0.06)_inset]",
          "transition-shadow duration-300",
        ].join(" ")}
      >
        <div className="px-5 py-2.5 flex items-center w-full">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <Link
              href="/"
              className="text-lg font-serif font-medium tracking-tight text-foreground shrink-0 hover:opacity-80 transition-opacity"
            >
              VK Photography
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-none items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-muted-foreground
                           hover:text-foreground hover:bg-foreground/8 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex flex-1 justify-end items-center">
            <ThemeToggle />
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 md:hidden flex-1 justify-end">
            <ThemeToggle />
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-xl hover:bg-foreground/8 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-white/10"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground
                                 hover:text-foreground hover:bg-foreground/8 transition-all"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
