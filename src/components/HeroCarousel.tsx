import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { DukkahName } from "./DukkahName";

const slides = [
  {
    img: "/photos/hero-exterior.jpg",
    imgPosition: "center center",
    eyebrow: "Since 2006 · Florida Road, Durban",
    heading: "Where Africa Comes to the Table",
    desc: "Twenty years of fine dining — where Cape Malay spice, coastal seafood, and the depth of African ingredients meet world-class technique in a room built for memory-making.",
    stats: ["20+ Years", "Florida Road Icon", "Award-Winning"],
    review: { quote: "Consistently the best restaurant on Florida Road.", name: "Thabo M." },
    primary: { label: "Reserve Your Table", href: "#reservations" },
    secondary: { label: "Explore the Menu", href: "#order" },
  },
  {
    img: "/photos/hero-food.jpg",
    imgPosition: "center 35%",
    eyebrow: "À La Carte · Fine Dining",
    heading: "Food as Heritage",
    desc: "From oxtail croquettes to Cape Malay spring rolls — every dish carries a story. Our kitchen draws on the full breadth of African culinary tradition, executed with the precision of a fine dining kitchen.",
    stats: ["Seasonal Menus", "African Cuisine", "15+ Years Chef"],
    review: { quote: "Honestly the most beautiful plating I've ever seen. The Cape Malay spring rolls — wow.", name: "Sarah W." },
    primary: { label: "View the Menu", href: "#order" },
    secondary: { label: "Reserve a Table", href: "#reservations" },
  },
  {
    img: "/photos/hero-bar.jpg",
    imgPosition: "center 40%",
    eyebrow: "The Bar · Craft Cocktails",
    heading: "80 Spirits. Zero Shortcuts.",
    desc: "Our bar programme is rooted in African botanicals, rare local distilleries, and a head mixologist who treats every drink as a composition. From the Durban Sling to the umqombothi smash, the bar tells its own story.",
    stats: ["80+ Spirits", "African Botanicals", "Signature Cocktails"],
    review: { quote: "Cocktails I still dream about three months later.", name: "Priya N." },
    primary: { label: "View Cocktail Menu", href: "#order" },
    secondary: { label: "Book Tonight", href: "#reservations" },
  },
  {
    img: "/photos/hero-interior.jpg",
    imgPosition: "center center",
    eyebrow: "The Room · Art & Ambience",
    heading: "Warmth, Art & African Hospitality",
    desc: "An intimate dining room lit by candlelight and layered with African art — from mosaics to murals. Our floor team is trained not to serve, but to anticipate. Every table, every evening, is considered.",
    stats: ["Intimate Setting", "African Art Curation", "World-Class Service"],
    review: { quote: "From the welcome drink to the dessert, every moment was considered. World-class.", name: "Mandla S." },
    primary: { label: "Book a Table", href: "#reservations" },
    secondary: { label: "Private Dining", href: "#private-dining" },
  },
  {
    img: "/photos/hero-brunch.jpg",
    imgPosition: "center 30%",
    eyebrow: "Every Sunday · Brunch Jazz",
    heading: "Sunday Brunch Jazz",
    desc: "Live jazz, bottomless mimosas, and a brunch menu that earns the early alarm. Sunday at <DukkahName /> is Durban's best-kept open secret — a long, slow, indulgent morning that tends to stretch into evening.",
    stats: ["Live Jazz", "Bottomless Mimosas", "Every Sunday"],
    review: { quote: "Sunday Brunch Jazz is the best Sunday in Durban. Period.", name: "Naledi K." },
    primary: { label: "Reserve Sunday", href: "#reservations" },
    secondary: { label: "Brunch Menu", href: "#order" },
  },
];

const INTERVAL_MS = 7000;

export function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fading, setFading] = useState(false);

  const go = (next: number) => {
    setFading(true);
    setTimeout(() => {
      setIdx((next + slides.length) % slides.length);
      setFading(false);
    }, 400);
  };

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(idx + 1), INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused, idx]);

  const s = slides[idx];

  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image — fades per slide */}
      {slides.map((sl, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <img
            src={sl.img}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: sl.imgPosition, filter: "contrast(1.1) brightness(0.88) saturate(1.1)" }}
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left_bottom,_rgba(0,0,0,0.7)_0%,_transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />

      {/* Content */}
      <div
        className="relative z-10 flex h-full flex-col justify-end pb-24 px-6 md:px-16"
        style={{ opacity: fading ? 0 : 1, transition: "opacity 0.4s ease" }}
      >
        <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-[1fr_auto] gap-8 items-end">
          {/* Left column */}
          <div className="max-w-2xl">
            <p className="eyebrow !text-gold/90 mb-4 tracking-widest">{s.eyebrow}</p>

            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight text-white drop-shadow-lg">
              {s.heading.includes("<DukkahName />")
                ? s.heading.split("<DukkahName />").map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>{part}<DukkahName className="text-white" /></span>
                    ) : <span key={i}>{part}</span>
                  )
                : s.heading
              }
            </h1>

            <p className="mt-5 max-w-xl text-base md:text-lg text-white/80 leading-relaxed font-light">
              {s.desc}
            </p>

            {/* Stat badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {s.stats.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-gold/40 bg-black/30 text-gold/90 px-3 py-1 text-xs font-semibold backdrop-blur-sm"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={s.primary.href}
                className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3 text-sm font-semibold text-[var(--text-on-gold)] transition-all hover:scale-[1.03] hover:bg-[var(--accent-gold-dark)]"
              >
                {s.primary.label}
              </a>
              <a
                href={s.secondary.href}
                className="inline-flex items-center justify-center rounded-full border border-white/50 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                {s.secondary.label}
              </a>
            </div>

            {/* Review quote */}
            <div className="mt-8 flex items-start gap-3 max-w-md">
              <div className="flex gap-0.5 pt-0.5 shrink-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                ))}
              </div>
              <div>
                <p className="font-display italic text-white/70 text-sm leading-relaxed">
                  "{s.review.quote}"
                </p>
                <p className="mt-1 text-xs text-gold/80 font-semibold">{s.review.name} · Google Reviews</p>
              </div>
            </div>
          </div>

          {/* Right column — slide counter + nav (desktop) */}
          <div className="hidden lg:flex flex-col items-end gap-4 pb-1">
            <div className="flex flex-col gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === idx ? "h-8 w-2 bg-gold" : "h-2 w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <p className="font-serif text-white/20 text-5xl font-semibold select-none leading-none">
              {String(idx + 1).padStart(2, "0")}<span className="text-2xl">/{slides.length}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Prev/Next arrows */}
      <button
        onClick={() => go(idx - 1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 hidden md:inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 hover:text-gold transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => go(idx + 1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 hidden md:inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 hover:text-gold transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Mobile dots */}
      <div className="absolute bottom-8 left-6 z-20 flex gap-2 lg:hidden">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-gold" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
