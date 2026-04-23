import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DukkahName } from "./DukkahName";

const staff = [
  {
    img: "/photos/brunch-1.webp",
    imgPosition: "center top",
    name: "Chef [Name TBC]",
    role: "Executive Chef",
    bio: "Over 15 years across Johannesburg, Lagos, and London. Every plate on the menu carries a deep respect for African ingredients and a fearless approach to technique.",
    tags: ["Fine Dining", "African Cuisine", "Seasonal Menus"],
  },
  {
    img: "/photos/team-2.webp",
    imgPosition: "center 20%",
    name: "[Name TBC]",
    role: "Head Mixologist",
    bio: "Built our bar programme around African botanicals and rare local distilleries. 80+ spirits, signature cocktails, and a team who treats every drink as a craft.",
    tags: ["80+ Spirits", "Craft Cocktails", "African Botanicals"],
  },
  {
    img: "/photos/interior-9.webp",
    imgPosition: "center 22%",
    name: "[Name TBC]",
    role: "Wine Sommelier",
    bio: "Curates our 200+ label cellar with passion for South African estates and emerging African vineyards. Every pairing is a conversation, not a transaction.",
    tags: ["200+ Labels", "SA & International", "Expert Pairings"],
  },
  {
    img: "/photos/interior-10.webp",
    imgPosition: "center 22%",
    name: "[Name TBC]",
    role: "Floor Manager",
    bio: "Sets the standard for every guest interaction from the first greeting to the last goodbye. Our floor is warm because our people are.",
    tags: ["Hospitality", "Fine Dining Service", "Guest Experience"],
  },
];

const INTERVAL_MS = 4000;

export function StaffSection() {
  const [idx, setIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setIdx((next + staff.length) % staff.length);
      setTransitioning(false);
    }, 250);
  }, [transitioning]);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => go(idx + 1), INTERVAL_MS);
  }, [idx, go]);

  useEffect(() => {
    intervalRef.current = setInterval(() => setIdx((i) => (i + 1) % staff.length), INTERVAL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const prev = () => { go(idx - 1); resetInterval(); };
  const next = () => { go(idx + 1); resetInterval(); };
  const goTo = (i: number) => { go(i); resetInterval(); };

  return (
    <section className="py-20 md:py-28 px-5 bg-bg-secondary">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow mb-3">Our People</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary leading-tight">
            The Faces of <DukkahName />
          </h2>
          <p className="mt-4 text-text-secondary leading-relaxed">
            Every experience starts with a person who cares. Meet the team behind the food, the bar, and the floor.
          </p>
        </div>

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Cards track — shows 1 on mobile, 2 on md, 3 on lg */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(calc(-${idx} * (100% / 3 + 8px)))` }}
            >
              {/* Duplicate for seamless wrap */}
              {[...staff, ...staff].map((s, i) => (
                <div
                  key={i}
                  className="shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <article className="group rounded-2xl overflow-hidden bg-bg-primary border border-border shadow-warm/20 hover:-translate-y-1 transition-all">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={s.img}
                        alt={`${s.role} at Dukkah Restaurant & Bar`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ objectPosition: s.imgPosition }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-gold text-[10px] font-bold tracking-widest uppercase mb-1">{s.role}</p>
                        <h3 className="font-serif text-xl font-semibold text-white">{s.name}</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-text-secondary text-sm leading-relaxed">{s.bio}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {s.tags.map((t) => (
                          <span key={t} className="rounded-full bg-gold/10 border border-gold/25 text-gold px-2.5 py-0.5 text-[11px] font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            aria-label="Previous staff member"
            className="absolute left-0 top-1/3 -translate-x-4 z-10 h-10 w-10 rounded-full bg-bg-primary border border-border shadow-md flex items-center justify-center text-text-primary hover:border-gold hover:text-gold transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next staff member"
            className="absolute right-0 top-1/3 translate-x-4 z-10 h-10 w-10 rounded-full bg-bg-primary border border-border shadow-md flex items-center justify-center text-text-primary hover:border-gold hover:text-gold transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {staff.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to ${staff[i].role}`}
              className={`rounded-full transition-all duration-300 ${
                i === idx ? "w-6 h-2 bg-gold" : "w-2 h-2 bg-border hover:bg-gold/50"
              }`}
            />
          ))}
        </div>

        {/* Careers CTA */}
        <div className="mt-12 text-center">
          <p className="text-text-secondary mb-4">Passionate about hospitality? We'd love to hear from you.</p>
          <a
            href="mailto:careers@dukkah.co.za"
            className="inline-block border border-gold text-gold px-8 py-3 rounded-full text-sm font-semibold hover:bg-gold hover:text-bg-primary transition-colors duration-200"
          >
            View Open Positions
          </a>
        </div>
      </div>
    </section>
  );
}
