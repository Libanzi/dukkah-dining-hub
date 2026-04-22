import { useMemo, useState } from "react";
import { Truck, Store, ShoppingBag, Plus, Minus, ArrowRight, Check } from "lucide-react";
import { MENU } from "@/data/menu";
import { useCart, priceToNumber } from "./cart/CartContext";
import { useServerFn } from "@tanstack/react-start";
import { placeOrder } from "@/server/orders";

const ORDERABLE_TABS = ["alacarte", "brunch", "desserts", "cocktails", "coffee"];

export function OrderOnline() {
  const cart = useCart();
  const [type, setType] = useState<"delivery" | "collection">("delivery");
  const [tab, setTab] = useState(ORDERABLE_TABS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ order_number: string; total: number; eta: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const placeOrderFn = useServerFn(placeOrder);

  const visibleTabs = useMemo(() => MENU.filter((t) => ORDERABLE_TABS.includes(t.id)), []);
  const current = visibleTabs.find((t) => t.id === tab) || visibleTabs[0];

  const deliveryFee = type === "delivery" ? (cart.subtotal >= 400 ? 0 : 45) : 0;
  const total = cart.subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.items.length === 0) {
      setError("Add at least one item to your basket.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await placeOrderFn({
        data: {
          customer_name: String(fd.get("name") || ""),
          customer_email: String(fd.get("email") || ""),
          customer_phone: String(fd.get("phone") || "") || null,
          order_type: type,
          delivery_address: type === "delivery" ? String(fd.get("address") || "") : null,
          special_instructions: String(fd.get("notes") || "") || null,
          items: cart.items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            qty: i.qty,
            category: i.category,
          })),
        },
      });
      setSuccess({ order_number: res.order_number, total: res.total, eta: res.eta });
      cart.clear();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not submit your order.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <section id="order" className="py-20 md:py-28 px-5 bg-bg-secondary">
        <div className="mx-auto max-w-2xl rounded-2xl bg-bg-primary border border-border p-10 text-center shadow-elevated">
          <div className="h-16 w-16 mx-auto rounded-full bg-gold/20 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-gold" />
          </div>
          <h2 className="font-serif text-3xl font-semibold mb-2">Order received!</h2>
          <p className="text-text-muted mb-5">
            Confirmation number <span className="font-bold text-gold">{success.order_number}</span>.
            Estimated time: <span className="font-semibold text-text-primary">{success.eta}</span>.
          </p>
          <p className="text-sm text-text-muted">
            Total <span className="font-semibold text-text-primary">R{Number(success.total).toLocaleString()}</span> —
            our team will call you to confirm payment (PayFast checkout coming soon).
          </p>
          <button
            onClick={() => setSuccess(null)}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)]"
          >
            Place another order
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="py-20 md:py-28 px-5 bg-bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="eyebrow mb-3">Delivery & Collection</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">Order From Dukkah</h2>
          <p className="mt-3 text-text-muted">Within 10km of Florida Road · Live order tracking</p>
        </div>

        {/* Step 1 — Order type */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <TypeCard
            icon={<Truck className="h-5 w-5" />}
            title="Delivery"
            sub="10km radius · 45–60 min · Free over R400"
            active={type === "delivery"}
            onClick={() => setType("delivery")}
          />
          <TypeCard
            icon={<Store className="h-5 w-5" />}
            title="Collection"
            sub="Ready in 30–45 min · 59 Florida Road"
            active={type === "collection"}
            onClick={() => setType("collection")}
          />
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* Step 2 — Menu */}
          <div className="rounded-2xl bg-bg-primary border border-border p-5 md:p-6">
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 border-b border-border">
              {visibleTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    tab === t.id ? "bg-gold text-[var(--text-on-gold)]" : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
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
                        className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
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

          {/* Step 3 — Checkout */}
          <aside className="rounded-2xl bg-bg-primary border border-border p-5 md:p-6 h-fit lg:sticky lg:top-24">
            <h3 className="font-serif text-2xl font-semibold mb-1">Your Basket</h3>
            <p className="text-sm text-text-muted mb-4">
              {cart.count} {cart.count === 1 ? "item" : "items"}
            </p>

            {cart.items.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-border p-6 text-center text-text-muted text-sm">
                <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-40" />
                Add items from the menu to start your order.
              </div>
            ) : (
              <>
                <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-1">
                  {cart.items.map((i) => (
                    <li key={i.id} className="flex justify-between text-sm gap-2">
                      <span className="text-text-secondary truncate">
                        {i.qty}× {i.name}
                      </span>
                      <span className="font-semibold whitespace-nowrap">R{i.price * i.qty}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-1.5 text-sm border-t border-border pt-3 mb-4">
                  <Row label="Subtotal" value={`R${cart.subtotal.toLocaleString()}`} />
                  <Row
                    label={type === "delivery" ? "Delivery fee" : "Collection"}
                    value={
                      type === "delivery"
                        ? deliveryFee === 0
                          ? "Free"
                          : `R${deliveryFee}`
                        : "Free"
                    }
                  />
                  <Row label="Total" value={`R${total.toLocaleString()}`} bold />
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    name="name"
                    required
                    placeholder="Full name *"
                    className={inputCls}
                    maxLength={120}
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email *"
                    className={inputCls}
                    maxLength={255}
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone (for delivery updates)"
                    className={inputCls}
                    maxLength={40}
                  />
                  {type === "delivery" && (
                    <textarea
                      name="address"
                      required
                      rows={2}
                      placeholder="Delivery address (within 10km of Florida Road) *"
                      className={inputCls}
                      maxLength={400}
                    />
                  )}
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Special instructions (optional)"
                    className={inputCls}
                    maxLength={500}
                  />
                  {error && <p className="text-sm text-terracotta">{error}</p>}
                  <button
                    type="submit"
                    disabled={submitting || cart.items.length === 0}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] disabled:opacity-60"
                  >
                    {submitting ? "Placing order…" : (
                      <>
                        Place Order · R{total.toLocaleString()} <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-text-muted text-center">
                    Secure online payment (PayFast) coming soon — for now we'll call you to confirm payment.
                  </p>
                </form>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function TypeCard({
  icon,
  title,
  sub,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
        active
          ? "border-gold bg-bg-primary shadow-warm"
          : "border-border bg-bg-primary/60 hover:border-gold/50"
      }`}
    >
      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${active ? "bg-gold text-[var(--text-on-gold)]" : "bg-gold/15 text-gold"}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-serif text-xl font-semibold">{title}</h3>
        <p className="text-xs text-text-muted">{sub}</p>
      </div>
      <span
        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
          active ? "border-gold bg-gold" : "border-border"
        }`}
      >
        {active && <Check className="h-3 w-3 text-[var(--text-on-gold)]" />}
      </span>
    </button>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base pt-1.5 border-t border-border mt-1" : "text-text-muted"}`}>
      <span>{label}</span>
      <span className={bold ? "font-bold text-gold" : "font-semibold text-text-primary"}>{value}</span>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg bg-bg-secondary border border-border px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20 placeholder:text-text-muted";
