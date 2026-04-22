import { Truck, Store, ShoppingBag, ArrowRight } from "lucide-react";

export function OrderOnline() {
  return (
    <section id="order" className="py-20 md:py-28 px-5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow mb-3">Delivery & Collection</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">
            Order From Dukkah
          </h2>
          <p className="mt-3 text-text-muted">Enjoy Dukkah at home — within 10km of Florida Road.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <button className="group flex items-center gap-4 rounded-2xl bg-bg-secondary border border-border p-6 text-left hover:border-gold transition-all hover:-translate-y-1">
            <div className="h-14 w-14 rounded-full bg-gold/15 flex items-center justify-center text-gold">
              <Truck className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl font-semibold">Delivery</h3>
              <p className="text-sm text-text-muted">Within 10km of Florida Road · 45–60 min</p>
            </div>
            <ArrowRight className="h-5 w-5 text-text-muted group-hover:text-gold transition-colors" />
          </button>
          <button className="group flex items-center gap-4 rounded-2xl bg-bg-secondary border border-border p-6 text-left hover:border-gold transition-all hover:-translate-y-1">
            <div className="h-14 w-14 rounded-full bg-gold/15 flex items-center justify-center text-gold">
              <Store className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl font-semibold">Collection</h3>
              <p className="text-sm text-text-muted">Ready in 30–45 min from 59 Florida Road</p>
            </div>
            <ArrowRight className="h-5 w-5 text-text-muted group-hover:text-gold transition-colors" />
          </button>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-border p-10 text-center">
          <ShoppingBag className="h-10 w-10 text-gold mx-auto mb-3" />
          <h3 className="font-serif text-2xl font-semibold mb-2">Online ordering coming soon</h3>
          <p className="text-text-muted max-w-md mx-auto">
            We're finalising our PayFast checkout and live order tracker. In the meantime, please call
            <span className="text-gold font-semibold"> 031 XXX XXXX</span> to place an order.
          </p>
        </div>
      </div>
    </section>
  );
}
