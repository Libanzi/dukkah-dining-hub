import { useRef, useState } from "react";
import {
  X, Minus, Plus, ShoppingBag, Trash2, Truck, Store,
  ArrowRight, Check, ArrowLeft, MapPin, Loader2, AlertCircle,
} from "lucide-react";
import { useCart } from "./CartContext";
import { useServerFn } from "@tanstack/react-start";
import { placeOrder } from "@/server/orders";

type Step = "cart" | "checkout";

/* ---- reverse-geocode using OpenStreetMap Nominatim (no API key required) ---- */
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en", "User-Agent": "DukkahDiningHub/1.0" },
  });
  if (!res.ok) throw new Error("Geocoding request failed");
  const data = await res.json();
  const a = data.address || {};
  const parts = [
    a.house_number ? `${a.house_number} ${a.road || ""}`.trim() : (a.road || ""),
    a.suburb || a.neighbourhood || a.city_district || "",
    a.city || a.town || a.village || "",
    a.postcode || "",
  ].filter(Boolean);
  return parts.join(", ");
}

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, count, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [type, setType] = useState<"delivery" | "collection">("delivery");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ order_number: string; total: number; eta: string } | null>(null);

  /* geolocation state */
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);

  const placeOrderFn = useServerFn(placeOrder);

  const deliveryFee = type === "delivery" ? (subtotal >= 400 ? 0 : 45) : 0;
  const total = subtotal + deliveryFee;

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      if (success) {
        setSuccess(null);
        setStep("cart");
      }
    }, 300);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const address = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          if (addressRef.current) {
            addressRef.current.value = address;
            // trigger React's synthetic change event so the form value is picked up
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLTextAreaElement.prototype, "value",
            )?.set;
            nativeInputValueSetter?.call(addressRef.current, address);
            addressRef.current.dispatchEvent(new Event("input", { bubbles: true }));
          }
        } catch {
          setLocationError("Could not determine your address. Please type it in manually.");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("Location access denied. Please type your address manually.");
        } else {
          setLocationError("Could not get your location. Please type your address manually.");
        }
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) {
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
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            qty: i.qty,
            category: i.category,
          })),
        },
      });
      setSuccess({ order_number: res.order_number, total: res.total, eta: res.eta });
      clear();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not submit your order.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={close}
        />
      )}
      <aside
        className={`fixed top-0 right-0 z-[71] h-full w-full sm:w-[440px] bg-bg-primary border-l border-border shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            {step === "checkout" && !success && (
              <button
                onClick={() => setStep("cart")}
                className="h-9 w-9 -ml-2 rounded-full hover:bg-bg-secondary flex items-center justify-center"
                aria-label="Back to basket"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <ShoppingBag className="h-5 w-5 text-gold" />
            <h3 className="font-serif text-xl font-semibold">
              {success ? "Order received" : step === "cart" ? "Your Order" : "Checkout"}
            </h3>
            {!success && step === "cart" && (
              <span className="text-sm text-text-muted">({count})</span>
            )}
          </div>
          <button
            onClick={close}
            className="h-9 w-9 rounded-full hover:bg-bg-secondary flex items-center justify-center"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* SUCCESS */}
        {success ? (
          <div className="flex-1 overflow-y-auto px-5 py-8 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-gold/20 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-gold" />
            </div>
            <h4 className="font-serif text-2xl font-semibold mb-2">Thank you!</h4>
            <p className="text-text-muted mb-4">
              Confirmation{" "}
              <span className="font-bold text-gold">{success.order_number}</span>
              <br />
              Estimated time:{" "}
              <span className="font-semibold text-text-primary">{success.eta}</span>
            </p>
            <p className="text-sm text-text-muted">
              Total{" "}
              <span className="font-semibold text-text-primary">
                R{Number(success.total).toLocaleString()}
              </span>
              <br />
              Our team will call to confirm payment.
            </p>
            <button
              onClick={() => {
                setSuccess(null);
                setStep("cart");
                setOpen(false);
              }}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)]"
            >
              Done
            </button>
          </div>
        ) : step === "cart" ? (
          /* CART STEP */
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-text-muted">
                  <ShoppingBag className="h-12 w-12 mb-3 opacity-40" />
                  <p className="font-semibold text-text-primary">Your basket is empty</p>
                  <p className="text-sm mt-1">Add dishes from the menu to get started.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((i) => (
                    <li
                      key={i.id}
                      className="flex gap-3 rounded-xl bg-bg-secondary border border-border p-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-text-primary truncate">{i.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{i.category}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => setQty(i.id, i.qty - 1)}
                            className="h-7 w-7 rounded-full bg-bg-primary border border-border hover:border-gold flex items-center justify-center"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="font-semibold w-6 text-center text-sm">{i.qty}</span>
                          <button
                            onClick={() => setQty(i.id, i.qty + 1)}
                            className="h-7 w-7 rounded-full bg-bg-primary border border-border hover:border-gold flex items-center justify-center"
                            aria-label="Increase"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => remove(i.id)}
                            className="ml-auto text-text-muted hover:text-terracotta"
                            aria-label="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gold whitespace-nowrap">
                          R{(i.price * i.qty).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-border px-5 py-4 space-y-3 bg-bg-secondary">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-semibold text-text-primary">R{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-text-muted">Delivery fee calculated at checkout.</p>
                <button
                  onClick={() => setStep("checkout")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] transition-colors"
                >
                  Checkout <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={clear}
                  className="block w-full text-center text-xs text-text-muted hover:text-terracotta"
                >
                  Clear basket
                </button>
              </footer>
            )}
          </>
        ) : (
          /* CHECKOUT STEP */
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Order type */}
              <div>
                <p className="text-xs font-bold tracking-widest text-text-muted mb-2 uppercase">
                  How would you like it?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <TypeChip
                    icon={<Truck className="h-4 w-4" />}
                    title="Delivery"
                    sub="45–60 min"
                    active={type === "delivery"}
                    onClick={() => setType("delivery")}
                  />
                  <TypeChip
                    icon={<Store className="h-4 w-4" />}
                    title="Collection"
                    sub="30–45 min"
                    active={type === "collection"}
                    onClick={() => setType("collection")}
                  />
                </div>
                {type === "delivery" && (
                  <p className="text-[11px] text-text-muted mt-2">
                    Within 10 km of Florida Road · Free over R400
                  </p>
                )}
              </div>

              {/* Customer fields */}
              <div className="space-y-3">
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
                  placeholder="Phone (for updates)"
                  className={inputCls}
                  maxLength={40}
                />

                {type === "delivery" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Delivery address *
                      </label>
                      <button
                        type="button"
                        onClick={detectLocation}
                        disabled={locating}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 px-3 py-1 text-[11px] font-semibold text-gold hover:bg-gold hover:text-[var(--text-on-gold)] disabled:opacity-50 transition-all"
                      >
                        {locating ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <MapPin className="h-3 w-3" />
                        )}
                        {locating ? "Detecting…" : "Use my location"}
                      </button>
                    </div>
                    <textarea
                      ref={addressRef}
                      name="address"
                      required
                      rows={2}
                      placeholder="Street address, suburb (within 10 km of Florida Road) *"
                      className={inputCls}
                      maxLength={400}
                    />
                    {locationError && (
                      <div className="flex items-start gap-2 rounded-lg bg-terracotta/10 border border-terracotta/30 px-3 py-2 text-xs text-terracotta">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        {locationError}
                      </div>
                    )}
                  </div>
                )}

                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Special instructions (optional)"
                  className={inputCls}
                  maxLength={500}
                />
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-bg-secondary border border-border p-3 space-y-1.5 text-sm">
                <Row label="Subtotal" value={`R${subtotal.toLocaleString()}`} />
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

              {error && <p className="text-sm text-terracotta">{error}</p>}
            </div>

            <footer className="border-t border-border px-5 py-4 bg-bg-secondary">
              <button
                type="submit"
                disabled={submitting || items.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] disabled:opacity-60"
              >
                {submitting ? (
                  "Placing order…"
                ) : (
                  <>
                    Place Order · R{total.toLocaleString()}{" "}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <p className="mt-2 text-[11px] text-text-muted text-center">
                Secure online payment (PayFast) coming soon — for now we'll call you to confirm.
              </p>
            </footer>
          </form>
        )}
      </aside>
    </>
  );
}

function TypeChip({
  icon, title, sub, active, onClick,
}: { icon: React.ReactNode; title: string; sub: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
        active
          ? "border-gold bg-bg-primary shadow-warm"
          : "border-border bg-bg-primary/60 hover:border-gold/50"
      }`}
    >
      <div
        className={`h-9 w-9 rounded-full flex items-center justify-center ${
          active ? "bg-gold text-[var(--text-on-gold)]" : "bg-gold/15 text-gold"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-[11px] text-text-muted">{sub}</p>
      </div>
    </button>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className={`flex justify-between ${
        bold ? "text-base pt-1.5 border-t border-border mt-1" : "text-text-muted"
      }`}
    >
      <span>{label}</span>
      <span className={bold ? "font-bold text-gold" : "font-semibold text-text-primary"}>
        {value}
      </span>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg bg-bg-secondary border border-border px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20 placeholder:text-text-muted";

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      className="relative h-9 w-9 rounded-full border border-gold/40 hover:border-gold flex items-center justify-center transition-colors"
      aria-label={`Cart (${count} items)`}
    >
      <ShoppingBag className="h-4 w-4 text-gold" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-gold text-[10px] font-bold text-[var(--text-on-gold)] flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}
