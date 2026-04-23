import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/Navigation";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ExperienceCards } from "@/components/ExperienceCards";
import { AboutSection } from "@/components/AboutSection";
import { Reservations } from "@/components/Reservations";
import { OrderOnline } from "@/components/OrderOnline";
import { EventsSection } from "@/components/EventsSection";
import { GiftCards } from "@/components/GiftCards";
import { Testimonials } from "@/components/Testimonials";
import { StaffSection } from "@/components/StaffSection";
import { PrivateDining } from "@/components/PrivateDining";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { ChatbotWidget } from "@/components/ChatbotWidget";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navigation />
      <main>
        <HeroCarousel />
        <ExperienceCards />
        <AboutSection />
        <OrderOnline />
        <Reservations />
        <EventsSection />
        <GiftCards />
        <Testimonials />
        <StaffSection />
        <PrivateDining />
        <CTASection />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
