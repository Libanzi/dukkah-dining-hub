import { useMemo, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { DukkahName } from "./DukkahName";
import { MENU } from "@/data/menu";
import { useCart, priceToNumber } from "./cart/CartContext";

const ORDERABLE_TABS = ["alacarte", "brunch", "desserts", "cocktails", "coffee"];

export function OrderOnline() {
  const cart = useCart();
  const [tab, setTab] = useState(ORDERABLE_TABS[0]);

  const visibleTabs = useMemo(() => MENU.filter((t) => ORDERABLE_TABS.includes(t.id)), []);
  const current = visibleTabs.find((t) => t.id === tab) || visibleTabs[0];

  return (
    <section id="order" className="py-20 md:py-28 px-5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="eyebrow mb-3">Our Menu · Delivery & Collection</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">
            Order From <DukkahName />
          </h2>
          <p className="mt-3 text-text-muted">
            Add items to your basket — choose delivery or collection at checkout.
          </p>
        </div>

        <div className="rounded-2xl bg-bg-primary border border-border p-5 md:p-6">
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5 border-b border-border">
            {visibleTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  tab === t.id
                    ? "bg-gold text-[var(--text-on-gold)]"
                    : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {current.items.map((item) => {
              const price = priceToNumber(item.price);
              if (price === 0) return null;
              const id = `${current.id}::${item.name}`;
              const inCart = cart.items.find((i) => i.id === id);
              return (
                <div
                  key={item.name}
                  className="flex gap-3 rounded-xl bg-bg-secondary border border-border p-3 hover:border-gold/50 transition-colors"
                >
                  {item.img && (
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-text-primary leading-snug">{item.name}</p>
                    <p className="text-xs text-text-muted line-clamp-2 mt-0.5">{item.desc}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold text-gold text-sm">R{price}</span>
                      {inCart ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => cart.setQty(id, inCart.qty - 1)}
                            className="h-7 w-7 rounded-full bg-bg-primary border border-border hover:border-gold flex items-center justify-center"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-semibold w-5 text-center">{inCart.qty}</span>
                          <button
                            onClick={() => cart.setQty(id, inCart.qty + 1)}
                            className="h-7 w-7 rounded-full bg-bg-primary border border-border hover:border-gold flex items-center justify-center"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            cart.add({ id, name: item.name, price, category: current.label })
                          }
                          className="inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)]"
                        >
                          <Plus className="h-3 w-3" /> Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
