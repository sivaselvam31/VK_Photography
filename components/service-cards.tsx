"use client";

import { motion } from "framer-motion";
import { Camera, Sparkles, PartyPopper, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Camera,
    title: "Wedding Photography",
    description:
      "Cinematic coverage of your special day, from preparation to celebration. Capturing every emotional moment with elegance and artistry.",
  },
  {
    icon: Sparkles,
    title: "Fashion & Editorial",
    description:
      "High-end fashion shoots and editorial photography for brands, magazines, and portfolios. Creative direction and styling available.",
  },
  {
    icon: PartyPopper,
    title: "Events & Celebrations",
    description:
      "Corporate events, galas, birthdays, and special occasions. Professional documentation that tells the story of your event.",
  },
];

export function ServiceCards() {
  const whatsappLink =
    "https://wa.me/1234567890?text=Hello!%20I%27m%20interested%20in%20your%20photography%20services.";

  return (
    <section id="services" className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl md:text-3xl font-light text-foreground">
          Services
        </h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Professional photography services tailored to your needs
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
              <service.icon size={24} />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-3">
              {service.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-center mt-12"
      >
        <Button
          asChild
          size="lg"
          className="rounded-full px-8 gap-2"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} />
            Get in Touch
          </a>
        </Button>
      </motion.div>
    </section>
  );
}
