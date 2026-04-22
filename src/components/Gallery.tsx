import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Img = { src: string; cat: "Food" | "Cocktails" | "Events" | "Interiors" | "Wine" };

const images: Img[] = [
  // Interiors
  { src: "/photos/interior-1.webp", cat: "Interiors" },
  { src: "/photos/interior-2.webp", cat: "Interiors" },
  { src: "/photos/interior-3.webp", cat: "Interiors" },
  { src: "/photos/interior-4.webp", cat: "Interiors" },
  { src: "/photos/interior-5.webp", cat: "Interiors" },
  { src: "/photos/interior-6.webp", cat: "Interiors" },
  { src: "/photos/interior-7.webp", cat: "Interiors" },
  { src: "/photos/interior-8.webp", cat: "Interiors" },
  { src: "/photos/interior-9.webp", cat: "Interiors" },
  { src: "/photos/interior-10.webp", cat: "Interiors" },
  { src: "/photos/interior-11.webp", cat: "Interiors" },
  { src: "/photos/interior-12.webp", cat: "Interiors" },
  // Food
  { src: "/photos/food-1.webp", cat: "Food" },
  { src: "/photos/food-2.webp", cat: "Food" },
  { src: "/photos/food-3.webp", cat: "Food" },
  { src: "/photos/food-4.webp", cat: "Food" },
  { src: "/photos/food-5.webp", cat: "Food" },
  { src: "/photos/food-6.webp", cat: "Food" },
  { src: "/photos/food-7.webp", cat: "Food" },
  { src: "/photos/food-8.webp", cat: "Food" },
  { src: "/photos/food-9.webp", cat: "Food" },
  { src: "/photos/food-10.webp", cat: "Food" },
  { src: "/photos/food-11.webp", cat: "Food" },
  { src: "/photos/food-12.webp", cat: "Food" },
  { src: "/photos/brunch-1.webp", cat: "Food" },
  { src: "/photos/brunch-2.webp", cat: "Food" },
  { src: "/photos/brunch-3.webp", cat: "Food" },
  { src: "/photos/brunch-6.webp", cat: "Food" },
  { src: "/photos/brunch-7.webp", cat: "Food" },
  // Cocktails
  { src: "/photos/bar-1.webp", cat: "Cocktails" },
  { src: "/photos/bar-2.webp", cat: "Cocktails" },
  { src: "/photos/bar-3.webp", cat: "Cocktails" },
  { src: "/photos/bar-4.webp", cat: "Cocktails" },
  { src: "/photos/bar-5.webp", cat: "Cocktails" },
  { src: "/photos/bar-6.webp", cat: "Cocktails" },
  { src: "/photos/bar-7.webp", cat: "Cocktails" },
  { src: "/photos/bar-8.webp", cat: "Cocktails" },
  { src: "/photos/bar-9.webp", cat: "Cocktails" },
  // Wine
  { src: "/photos/wine-1.webp", cat: "Wine" },
  { src: "/photos/wine-2.webp", cat: "Wine" },
  { src: "/photos/wine-3.webp", cat: "Wine" },
  { src: "/photos/wine-4.webp", cat: "Wine" },
  // Events
  { src: "/photos/event-1.webp", cat: "Events" },
  { src: "/photos/exterior-1.webp", cat: "Events" },
  { src: "/photos/exterior-2.webp", cat: "Events" },
];

const cats = ["All", "Food", "Cocktails", "Wine", "Interiors", "Events"] as const;

export function Gallery() {
  const [filter, setFilter] = useState<(typeof cats)[number]>("All");
  const [open, setOpen] = useState<number | null>(null);

  const filtered = filter === "All" ? images : images.filter((i) => i.cat === filter);

  const goto = (n: number) => {
    if (open === null) return;
    setOpen((n + filtered.length) % filtered.length);
  };

  return (
    <section id="gallery" className="py-20 md:py-28 px-5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="eyebrow mb-3">Behind the Scenes</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">Inside Dukkah</h2>
          <p className="mt-3 text-text-muted">Real moments from our restaurant on Florida Road.</p>
        </div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                filter === c
                  ? "bg-gold text-[var(--text-on-gold)]"
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filtered.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setOpen(i)}
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <img
                src={img.src}
                alt={`${img.cat} at Dukkah Restaurant & Bar — Florida Road, Durban`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-terracotta/0 group-hover:bg-terracotta/30 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setOpen(null)}
        >
          <button
            className="absolute top-4 right-4 text-white h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
            onClick={() => setOpen(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              goto(open - 1);
            }}
            aria-label="Previous"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              goto(open + 1);
            }}
            aria-label="Next"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
          <img
            src={filtered[open].src}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
