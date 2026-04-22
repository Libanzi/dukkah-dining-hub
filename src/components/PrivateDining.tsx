import { useState } from "react";
import { Users, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const rooms = [
  {
    name: "The Spice Room",
    capacity: "10–20 guests",
    img: "/photos/interior-3.webp",
    features: ["Dedicated server", "AV screen", "Custom menu", "Air-conditioned"],
    price: "From R450 / person",
  },
  {
    name: "The Gallery Room",
    capacity: "20–45 guests",
    img: "/photos/interior-7.webp",
    features: ["Private bar", "PA system", "Custom décor options", "Dedicated entrance"],
    price: "From R395 / person",
  },
  {
    name: "Full Venue Buyout",
    capacity: "Up to 80 guests",
    img: "/photos/interior-11.webp",
    features: ["Entire restaurant", "Full bar", "Live band setup", "Custom menu"],
    price: "On application",
  },
];

export function PrivateDining() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const { error: dbErr } = await supabase.from("private_dining_enquiries").insert({
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim() || null,
      event_date: String(fd.get("date") || "") || null,
      guest_count: Number(fd.get("guests") || 0) || null,
      event_type: String(fd.get("type") || "") || null,
      budget_range: String(fd.get("budget") || "") || null,
      message: String(fd.get("message") || "").trim() || null,
    });
    if (dbErr) {
      setError("Could not send your enquiry. Please try again.");
      setSubmitting(false);
      return;
    }
    setDone(true);
    setSubmitting(false);
  };

  return (
    <section id="private-dining" className="py-20 md:py-28 px-5 bg-bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow mb-3">Private Dining</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">
            Your Table. Your Event.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {rooms.map((r) => (
            <article key={r.name} className="rounded-2xl overflow-hidden bg-bg-primary border border-border hover:-translate-y-1 transition-all">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={r.img} alt={`${r.name} at Dukkah Restaurant & Bar`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl font-semibold mb-1">{r.name}</h3>
                <p className="flex items-center gap-1.5 text-sm text-gold font-semibold mb-4">
                  <Users className="h-4 w-4" /> {r.capacity}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {r.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                      <Check className="h-4 w-4 text-gold shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-semibold text-text-primary border-t border-border pt-3">{r.price}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="rounded-2xl bg-bg-primary border border-border p-6 md:p-10 max-w-3xl mx-auto">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-center mb-6">Enquire About a Private Event</h3>
          {done ? (
            <div className="text-center py-6 animate-fade-up">
              <Check className="h-12 w-12 text-gold mx-auto mb-3" />
              <p className="font-serif text-xl">Enquiry sent — we'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
              <input name="name" required placeholder="Full name *" className={inputCls} />
              <input name="email" type="email" required placeholder="Email *" className={inputCls} />
              <input name="phone" type="tel" placeholder="Phone" className={inputCls} />
              <input name="date" type="date" placeholder="Event date" className={inputCls} />
              <input name="guests" type="number" min={10} placeholder="Estimated guests" className={inputCls} />
              <select name="type" className={inputCls} defaultValue="">
                <option value="" disabled>Event type</option>
                <option>Birthday</option>
                <option>Corporate</option>
                <option>Wedding</option>
                <option>Other</option>
              </select>
              <select name="budget" className={`${inputCls} sm:col-span-2`} defaultValue="">
                <option value="" disabled>Budget range (optional)</option>
                <option>Under R10,000</option>
                <option>R10,000 – R25,000</option>
                <option>R25,000 – R50,000</option>
                <option>R50,000+</option>
              </select>
              <textarea name="message" rows={3} placeholder="Tell us about your event…" className={`${inputCls} sm:col-span-2`} />
              {error && <p className="sm:col-span-2 text-sm text-terracotta">{error}</p>}
              <button type="submit" disabled={submitting} className="sm:col-span-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] disabled:opacity-60">
                {submitting ? "Sending…" : "Send Enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const inputCls = "w-full rounded-lg bg-bg-secondary border border-border px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";
