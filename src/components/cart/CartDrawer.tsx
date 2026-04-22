import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "./CartContext";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, count, clear } = useCart();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 right-0 z-[71] h-full w-full sm:w-[420px] bg-bg-primary border-l border-border shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gold" />
            <h3 className="font-serif text-xl font-semibold">Your Order</h3>
            <span className="text-sm text-text-muted">({count})</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="h-9 w-9 rounded-full hover:bg-bg-secondary flex items-center justify-center"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

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
            <a
              href="#order"
              onClick={() => setOpen(false)}
              className="block w-full text-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] transition-colors"
            >
              Checkout
            </a>
            <button
              onClick={clear}
              className="block w-full text-center text-xs text-text-muted hover:text-terracotta"
            >
              Clear basket
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}

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
