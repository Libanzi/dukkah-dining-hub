import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/Navigation";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ExperienceCards } from "@/components/ExperienceCards";
import { AboutSection } from "@/components/AboutSection";
import { MenuShowcase } from "@/components/MenuShowcase";
import { Reservations } from "@/components/Reservations";
import { OrderOnline } from "@/components/OrderOnline";
import { EventsSection } from "@/components/EventsSection";
import { GiftCards } from "@/components/GiftCards";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { MeetTheChef } from "@/components/MeetTheChef";
import { PrivateDining } from "@/components/PrivateDining";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { CartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <Navigation />
        <main>
          <HeroCarousel />
          <ExperienceCards />
          <AboutSection />
          <MenuShowcase />
          <Reservations />
          <OrderOnline />
          <EventsSection />
          <GiftCards />
          <Gallery />
          <Testimonials />
          <MeetTheChef />
          <PrivateDining />
          <CTASection />
        </main>
        <Footer />
        <ChatbotWidget />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
