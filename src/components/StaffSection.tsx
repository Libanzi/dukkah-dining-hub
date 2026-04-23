import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { DukkahName } from "./DukkahName";

const slides = [
  {
    img: "/photos/brunch-1.webp",
    imgPosition: "center top",
    service: "Kitchen Excellence",
    role: "Executive Chef & Kitchen Team",
    headline: "Every plate is a story told with fire and precision.",
    description:
      "Our kitchen is led by a chef with over 15 years across Johannesburg, Lagos, and London. From the oxtail croquettes to the Cape Malay spring rolls, every dish is built on deep respect for African ingredients and obsessive technique.",
    stats: ["15+ Years Experience", "African Cuisine", "Seasonal Menus"],
    review: {
      quote: "Honestly the most beautiful plating I've ever seen. The Cape Malay spring rolls — wow.",
      name: "Sarah W.",
    },
  },
  {
    img: "/photos/team-2.webp",
    imgPosition: "center 20%",
    service: "Bar Craft",
    role: "Head Mixologist & Bar Team",
    headline: "80+ spirits. Zero shortcuts. Pure African inspiration.",
    description:
      "Our bar programme is built around African botanicals, local distilleries, and a team who treats every cocktail as a craft. From the signature Durban Sling to our curated whisky selection, the bar sets the tone for the entire evening.",
    stats: ["80+ Spirits", "African Botanicals", "Craft Cocktails"],
    review: {
      quote: "Incredible atmosphere, attentive staff, and cocktails I still dream about three months later.",
      name: "Priya N.",
    },
  },
  {
    img: "/photos/interior-8.webp",
    imgPosition: "center",
    service: "Floor Hospitality",
    role: "Front of House Team",
    headline: "From the welcome drink to the last goodbye.",
    description:
      "Our floor team is trained to anticipate — not react. Every guest is greeted by name, every dietary need is remembered, and every table receives the same level of attention whether it is a Tuesday lunch or a Saturday celebration.",
    stats: ["Attentive", "Knowledgeable", "Always Warm"],
    review: {
      quote: "From the welcome drink to the dessert, every moment was considered. World-class.",
      name: "Mandla S.",
    },
  },
  {
    img: "/photos/bar-6.webp",
    imgPosition: "center",
    service: "Wine Programme",
    role: "Sommelier & Wine Team",
    headline: "Every bottle has a story. Ours know them all.",
    description:
      "Our wine list is curated across South African estates, European classics, and emerging African labels. Our sommelier guides every pairing with knowledge and passion — whether you are celebrating or simply exploring.",
    stats: ["200+ Labels", "SA & International", "Expert Pairings"],
    review: {
      quote: "The wine list is sensational and our sommelier knew every story behind every bottle.",
      name: "Rohan P.",
    },
  },
  {
    img: "/photos/interior-11.webp",
    imgPosition: "center 30%",
    service: "Private Dining",
    role: "Events & Private Dining Team",
    headline: "Your milestone deserves its own room.",
    description:
      "From intimate birthday dinners to full venue buyouts for 80 guests, our private dining team handles every detail — custom menus, floral arrangements, AV setup, and a dedicated floor team assigned exclusively to your event.",
    stats: ["10–80 Guests", "Custom Menus", "Full AV & Décor"],
    review: {
      quote: "Hosted my 40th here. Chef's private dining menu was exceptional. Every guest raved about it.",
      name: "Zanele D.",
    },
  },
];

const INTERVAL_MS = 6000;

export function StaffSection() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const go = useCallback(
    (next: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrent((next + slides.length) % slides.length);
        setTransitioning(false);
      }, 300);
    },
    [transitioning]
  );

  useEffect(() => {
    const t = setInterval(() => go(current + 1), INTERVAL_MS);
    return () => clearInterval(t);
  }, [current, go]);

  const s = slides[current];

  return (
    <section className="relative overflow-hidden" style={{ minHeight: "85vh" }}>
      {/* Background image */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <img
          src={s.img}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{ objectPosition: s.imgPosition }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col justify-center h-full min-h-[85vh] px-5 py-20"
      >
        <div className="mx-auto max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — service info */}
          <div
            className="transition-all duration-500"
            style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? "translateY(12px)" : "translateY(0)" }}
          >
            <p className="eyebrow mb-4 text-gold">{s.service}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white leading-tight mb-2">
              {s.headline}
            </h2>
            <p className="text-gold/80 font-semibold text-sm mb-6">{s.role}</p>
            <p className="text-white/75 leading-relaxed max-w-lg mb-8">{s.description}</p>

            <div className="flex flex-wrap gap-2 mb-10">
              {s.stats.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-gold/40 text-gold/90 px-3 py-1 text-xs font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Review */}
            <div className="border-l-2 border-gold pl-5">
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                ))}
              </div>
              <p className="font-display italic text-white/85 leading-relaxed text-sm">
                "{s.review.quote}"
              </p>
              <p className="mt-2 text-xs font-semibold text-gold">{s.review.name} · Google Reviews</p>
            </div>
          </div>

          {/* Right — slide counter & nav */}
          <div className="hidden lg:flex flex-col items-end justify-between h-full py-4">
            <p className="text-white/40 text-xs tracking-widest uppercase">
              The <DukkahName /> Team
            </p>
            <div className="flex flex-col items-end gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-2 h-8 bg-gold"
                      : "w-2 h-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <p className="font-serif text-white/25 text-6xl font-semibold select-none">
              {String(current + 1).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-8 left-0 right-0 px-5">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            {/* Mobile dots */}
            <div className="flex gap-2 lg:hidden">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? "w-6 h-2 bg-gold" : "w-2 h-2 bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <div className="flex gap-3 ml-auto">
              <button
                onClick={() => go(current - 1)}
                aria-label="Previous"
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(current + 1)}
                aria-label="Next"
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
