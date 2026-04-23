import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navigation />
      <main className="pt-[72px]">
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
