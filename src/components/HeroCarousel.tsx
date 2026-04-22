import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    img: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "Since 2006",
    heading: "Where Africa Comes to the Table",
    sub: "Fine dining on Florida Road, Durban",
    primary: { label: "Reserve Your Table", href: "#reservations" },
    secondary: { label: "View Our Menu", href: "#menu" },
  },
  {
    img: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "À La Carte",
    heading: "Food as Heritage",
    sub: "African ingredients, global technique",
    primary: { label: "Explore the Menu", href: "#menu" },
    secondary: { label: "Reserve a Table", href: "#reservations" },
  },
  {
    img: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "The Bar",
    heading: "Crafted for the South African Palate",
    sub: "80+ spirits and signature African-inspired cocktails",
    primary: { label: "View Cocktail Menu", href: "#menu" },
    secondary: { label: "Visit Tonight", href: "#reservations" },
  },
  {
    img: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "Live Music",
    heading: "Jazz & Afrobeat, Every Weekend",
    sub: "Friday Jazz · Saturday Afrobeat · Sunday Brunch Jazz",
    primary: { label: "See Upcoming Events", href: "#events" },
    secondary: { label: "Book a Table", href: "#reservations" },
  },
  {
    img: "https://images.pexels.com/photos/279847/pexels-photo-279847.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "Private Dining",
    heading: "Host Your Next Occasion",
    sub: "Intimate rooms for 10 to 80 guests",
    primary: { label: "Enquire", href: "#private-dining" },
    secondary: { label: "View Spaces", href: "#private-dining" },
  },
];

export function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (n: number) => setIdx((n + slides.length) % slides.length);

  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === idx ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={s.img}
            alt={`${s.heading} at Dukkah Restaurant & Bar — Florida Road, Durban`}
            className="absolute inset-0 h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 dark:from-black/90 dark:via-black/60 dark:to-black/40" />
          <div className="relative z-10 flex h-full items-center px-6 md:px-16">
            <div className="max-w-3xl text-white animate-fade-up">
              <p className="eyebrow !text-gold mb-4">{s.eyebrow}</p>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight text-white drop-shadow-lg">
                {s.heading}
              </h1>
              <p className="mt-5 max-w-xl text-lg md:text-xl text-white/90 font-light">
                {s.sub}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href={s.primary.href}
                  className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3 text-sm font-semibold text-[var(--text-on-gold)] transition-all hover:scale-[1.03] hover:bg-[var(--accent-gold-dark)]"
                >
                  {s.primary.label}
                </a>
                <a
                  href={s.secondary.href}
                  className="inline-flex items-center justify-center rounded-full border border-white/70 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  {s.secondary.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => go(idx - 1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 hidden md:inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition-opacity opacity-0 hover:opacity-100 hover:bg-black/50"
        style={{ opacity: paused ? 1 : undefined }}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => go(idx + 1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 hidden md:inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition-opacity opacity-0 hover:opacity-100 hover:bg-black/50"
        style={{ opacity: paused ? 1 : undefined }}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === idx ? "w-8 bg-gold" : "w-2 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
