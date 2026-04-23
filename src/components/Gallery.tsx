import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { DukkahName } from "./DukkahName";

type Cat = "All" | "The Space" | "Food" | "The Bar" | "Wine" | "Brunch & Sushi" | "Events" | "Our People";

type Img = { src: string; cat: Exclude<Cat, "All"> };

const images: Img[] = [
  // The Space — exteriors & interiors
  { src: "/photos/new-ext-night.jpeg",      cat: "The Space" },
  { src: "/photos/new-ext-sunset.jpeg",     cat: "The Space" },
  { src: "/photos/new-ext-day.jpeg",        cat: "The Space" },
  { src: "/photos/new-int-dining-1.jpeg",   cat: "The Space" },
  { src: "/photos/new-int-dining-3.jpeg",   cat: "The Space" },
  { src: "/photos/new-int-dining-4.jpeg",   cat: "The Space" },
  { src: "/photos/new-int-mural.jpeg",      cat: "The Space" },
  { src: "/photos/new-int-arch.jpeg",       cat: "The Space" },
  { src: "/photos/new-int-bar-lounge.jpeg", cat: "The Space" },
  { src: "/photos/new-int-mosaic.jpeg",     cat: "The Space" },
  { src: "/photos/new-int-art.jpeg",        cat: "The Space" },
  { src: "/photos/new-int-lounge.jpeg",     cat: "The Space" },
  { src: "/photos/new-int-dining-2.jpeg",   cat: "The Space" },
  { src: "/photos/new-int-terrace.jpeg",    cat: "The Space" },
  { src: "/photos/new-int-bar-wide.jpeg",   cat: "The Space" },
  { src: "/photos/new-int-service.jpeg",    cat: "The Space" },

  // Food
  { src: "/photos/new-food-beef-2.jpeg",    cat: "Food" },
  { src: "/photos/new-food-beef-1.jpeg",    cat: "Food" },
  { src: "/photos/new-food-prawns-2.jpeg",  cat: "Food" },
  { src: "/photos/new-food-prawns-1.jpeg",  cat: "Food" },
  { src: "/photos/new-food-croquettes.jpeg",cat: "Food" },
  { src: "/photos/new-food-sauce.jpeg",     cat: "Food" },
  { src: "/photos/new-food-spread.jpeg",    cat: "Food" },
  { src: "/photos/new-food-fishcake.jpeg",  cat: "Food" },
  { src: "/photos/new-food-dessert-1.jpeg", cat: "Food" },
  { src: "/photos/new-food-dessert-2.jpeg", cat: "Food" },
  { src: "/photos/new-food-dessert-3.jpeg", cat: "Food" },
  { src: "/photos/new-food-3.jpeg",         cat: "Food" },
  { src: "/photos/new-food-4.jpeg",         cat: "Food" },
  { src: "/photos/new-food-6.jpeg",         cat: "Food" },
  { src: "/photos/new-food-7.jpeg",         cat: "Food" },
  { src: "/photos/new-food-8.jpeg",         cat: "Food" },
  { src: "/photos/new-food-9.jpeg",         cat: "Food" },
  { src: "/photos/new-food-10.jpeg",        cat: "Food" },
  { src: "/photos/new-food-11.jpeg",        cat: "Food" },
  { src: "/photos/new-food-12.jpeg",        cat: "Food" },
  { src: "/photos/new-food-13.jpeg",        cat: "Food" },
  { src: "/photos/new-food-14.jpeg",        cat: "Food" },

  // The Bar — cocktails & bar shots
  { src: "/photos/new-cocktail-red.jpeg",    cat: "The Bar" },
  { src: "/photos/new-cocktail-orange.jpeg", cat: "The Bar" },
  { src: "/photos/new-cocktail-amber.jpeg",  cat: "The Bar" },
  { src: "/photos/new-cocktail-green.jpeg",  cat: "The Bar" },
  { src: "/photos/new-cocktail-blue.jpeg",   cat: "The Bar" },
  { src: "/photos/new-cocktail-dark.jpeg",   cat: "The Bar" },
  { src: "/photos/new-cocktail-top.jpeg",    cat: "The Bar" },
  { src: "/photos/new-bar-front.jpeg",       cat: "The Bar" },
  { src: "/photos/new-bar-wine-wall.jpeg",   cat: "The Bar" },
  { src: "/photos/new-bar-wine-rack.jpeg",   cat: "The Bar" },
  { src: "/photos/new-bar-champagne.jpeg",   cat: "The Bar" },

  // Wine
  { src: "/photos/new-wine-service.jpeg",    cat: "Wine" },
  { src: "/photos/new-champagne-wall.jpeg",  cat: "Wine" },
  { src: "/photos/new-wine-1.png",           cat: "Wine" },
  { src: "/photos/new-wine-2.png",           cat: "Wine" },
  { src: "/photos/new-wine-3.png",           cat: "Wine" },

  // Brunch & Sushi
  { src: "/photos/new-food-brunch-1.jpeg",  cat: "Brunch & Sushi" },
  { src: "/photos/new-food-brunch-2.jpeg",  cat: "Brunch & Sushi" },
  { src: "/photos/new-food-benedict.jpeg",  cat: "Brunch & Sushi" },
  { src: "/photos/new-sushi-4.jpeg",        cat: "Brunch & Sushi" },
  { src: "/photos/new-sushi-1.jpeg",        cat: "Brunch & Sushi" },
  { src: "/photos/new-sushi-2.jpeg",        cat: "Brunch & Sushi" },
  { src: "/photos/new-sushi-3.jpeg",        cat: "Brunch & Sushi" },

  // Events & Private Dining
  { src: "/photos/new-event-dining.jpeg",   cat: "Events" },
  { src: "/photos/new-event-setting.jpeg",  cat: "Events" },
  { src: "/photos/new-int-private-1.png",   cat: "Events" },
  { src: "/photos/new-int-private-2.jpeg",  cat: "Events" },

  // Our People
  { src: "/photos/team-4.jpeg",  cat: "Our People" },
  { src: "/photos/team-5.png",   cat: "Our People" },
  { src: "/photos/team-6.png",   cat: "Our People" },
  { src: "/photos/team-7.png",   cat: "Our People" },
  { src: "/photos/brunch-1.webp",cat: "Our People" },
];

const cats: Cat[] = ["All", "The Space", "Food", "The Bar", "Wine", "Brunch & Sushi", "Events", "Our People"];

export function Gallery() {
  const [filter, setFilter] = useState<Cat>("All");
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
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">Inside <DukkahName /></h2>
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
            onClick={(e) => { e.stopPropagation(); goto(open - 1); }}
            aria-label="Previous"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); goto(open + 1); }}
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
