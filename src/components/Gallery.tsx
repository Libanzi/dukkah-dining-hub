import { useState } from "react";
import { X } from "lucide-react";

const images = [
  { src: "https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg?auto=compress&cs=tinysrgb&w=800", cat: "Interiors" },
  { src: "https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=800", cat: "Cocktails" },
  { src: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800", cat: "Food" },
  { src: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800", cat: "Events" },
  { src: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800", cat: "Interiors" },
  { src: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=800", cat: "Cocktails" },
  { src: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=800", cat: "Food" },
  { src: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800", cat: "Events" },
  { src: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800", cat: "Food" },
  { src: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=800", cat: "Cocktails" },
  { src: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800", cat: "Interiors" },
  { src: "https://images.pexels.com/photos/3296434/pexels-photo-3296434.jpeg?auto=compress&cs=tinysrgb&w=800", cat: "Food" },
];

const cats = ["All", "Food", "Cocktails", "Events", "Interiors"];

export function Gallery() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<number | null>(null);

  const filtered = filter === "All" ? images : images.filter((i) => i.cat === filter);

  return (
    <section id="gallery" className="py-20 md:py-28 px-5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="eyebrow mb-3">Behind the Scenes</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">Inside Dukkah</h2>
        </div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                filter === c ? "bg-gold text-[var(--text-on-gold)]" : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {filtered.map((img, i) => (
            <button
              key={i}
              onClick={() => setOpen(i)}
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <img src={img.src} alt={`${img.cat} at Dukkah Restaurant & Bar`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-terracotta/0 group-hover:bg-terracotta/30 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {open !== null && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-fade-in" onClick={() => setOpen(null)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setOpen(null)} aria-label="Close">
            <X className="h-7 w-7" />
          </button>
          <img src={filtered[open].src} alt="" className="max-h-[90vh] max-w-[90vw] rounded-xl" />
        </div>
      )}
    </section>
  );
}
