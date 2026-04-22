import { useState } from "react";
import { Gift } from "lucide-react";

const VALUES = [250, 500, 750, 1000, 1500];

export function GiftCards() {
  const [amount, setAmount] = useState(500);
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");

  return (
    <section id="gift-cards" className="py-20 md:py-28 px-5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow mb-3">The Gift</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">
            Give the Gift of Dukkah
          </h2>
          <p className="mt-3 text-text-muted">Digital gift cards delivered instantly to any inbox</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-bg-secondary border border-border p-6 md:p-8 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Amount</p>
              <div className="flex flex-wrap gap-2">
                {VALUES.map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(v)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      amount === v ? "bg-gold text-[var(--text-on-gold)]" : "bg-bg-primary border border-border text-text-secondary hover:border-gold"
                    }`}
                  >
                    R{v.toLocaleString()}
                  </button>
                ))}
                <input
                  type="number"
                  min={100}
                  max={5000}
                  placeholder="Custom"
                  className="w-28 rounded-full bg-bg-primary border border-border px-4 py-2 text-sm text-text-primary outline-none focus:border-gold"
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                />
              </div>
            </div>
            <label className="block">
              <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Recipient name</span>
              <input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full rounded-lg bg-bg-primary border border-border px-3 py-2.5 text-sm outline-none focus:border-gold" />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Your name</span>
              <input value={sender} onChange={(e) => setSender(e.target.value)} className="w-full rounded-lg bg-bg-primary border border-border px-3 py-2.5 text-sm outline-none focus:border-gold" />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Personal message (140 chars)</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 140))} rows={3} className="w-full rounded-lg bg-bg-primary border border-border px-3 py-2.5 text-sm outline-none focus:border-gold" />
            </label>
            <button disabled className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[var(--text-on-gold)] disabled:opacity-60 cursor-not-allowed">
              Continue to Payment (PayFast — coming soon)
            </button>
          </div>

          <div className="relative rounded-2xl p-8 md:p-10 bg-gradient-to-br from-bg-tertiary to-bg-secondary border-2 border-gold/40 shadow-elevated">
            <Gift className="h-8 w-8 text-gold mb-4" />
            <p className="font-serif text-xl text-text-secondary">DUKKAH</p>
            <p className="mt-1 text-xs text-text-muted">African Fine Dining · Florida Road</p>
            <p className="font-serif text-6xl md:text-7xl font-semibold text-gold mt-8">
              R{amount.toLocaleString()}
            </p>
            <div className="mt-8 pt-6 border-t border-gold/30 space-y-1">
              <p className="text-sm text-text-muted">To: <span className="text-text-primary font-semibold">{recipient || "—"}</span></p>
              <p className="text-sm text-text-muted">From: <span className="text-text-primary font-semibold">{sender || "—"}</span></p>
              {message && <p className="font-display italic text-text-secondary mt-3">"{message}"</p>}
            </div>
            <p className="absolute bottom-4 right-6 text-[10px] text-text-muted tracking-widest">CODE: DUK-XXXX-XXXX</p>
          </div>
        </div>
      </div>
    </section>
  );
}
