import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { GalleryGrid } from "@/components/gallery-grid";
import { AboutSection } from "@/components/about-section";
import { ServiceCards } from "@/components/service-cards";
import { Footer } from "@/components/footer";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";
import { StickyBottomBar } from "@/components/sticky-bottom-bar";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <GalleryGrid />
      <AboutSection />
      <ServiceCards />
      <Footer />
      <WhatsAppFloatingButton />
      <StickyBottomBar />
    </main>
  );
}
