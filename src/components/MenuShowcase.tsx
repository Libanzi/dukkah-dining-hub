import { useState } from "react";
import { MENU } from "@/data/menu";

const dietIcon = {
  vegetarian: "🌿",
  "gluten-free": "GF",
  spicy: "🌶",
  fish: "🐟",
};

export function MenuShowcase() {
  const [tab, setTab] = useState(MENU[0].id);
  const current = MENU.find((t) => t.id === tab) || MENU[0];

  return (
    <section id="menu" className="py-20 md:py-28 px-5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="eyebrow mb-3">The Menu</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">
            What's on the Menu Tonight
          </h2>
        </div>

        <div className="overflow-x-auto -mx-5 px-5 mb-8">
          <div className="flex gap-2 min-w-max border-b border-border pb-0">
            {MENU.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors ${
                  tab === t.id ? "text-gold" : "text-text-muted hover:text-text-primary"
                }`}
              >
                {t.label}
                {tab === t.id && (
                  <span className="absolute -bottom-px left-2 right-2 h-[2px] bg-gold" />
                )}
              </button>
            ))}
          </div>
        </div>

        {current.banner && (
          <div className="mb-6 rounded-xl bg-terracotta/15 border border-terracotta/30 px-5 py-4 text-center">
            <p className="text-sm font-semibold text-terracotta">{current.banner}</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" key={tab}>
          {current.items.map((item) => (
            <article
              key={item.name}
              className="group flex flex-col overflow-hidden rounded-2xl bg-bg-secondary border border-border transition-all hover:-translate-y-1 hover:shadow-warm"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {item.img && (
                  <img
                    src={item.img}
                    alt={`${item.name} at Dukkah Restaurant & Bar`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-bg-primary/90 px-3 py-1 text-[10px] font-bold tracking-widest text-gold">
                  {item.category}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="font-serif text-lg font-semibold text-text-primary leading-tight">
                    {item.name}
                  </h3>
                  <p className="font-semibold text-gold whitespace-nowrap">{item.price}</p>
                </div>
                <p className="text-sm text-text-muted leading-relaxed flex-1">{item.desc}</p>
                {item.diet && (
                  <div className="mt-3 flex gap-2 text-xs">
                    {item.diet.map((d) => (
                      <span key={d} className="inline-flex items-center rounded-full bg-bg-tertiary px-2 py-0.5 text-text-secondary">
                        {dietIcon[d]} {d}
                      </span>
                    ))}
                  </div>
                )}
                <a
                  href="#order"
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-gold/60 px-4 py-2 text-xs font-semibold text-gold transition-all hover:bg-gold hover:text-[var(--text-on-gold)]"
                >
                  Add to Order
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
