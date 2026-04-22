import { useState } from "react";
import { Calendar, Clock, MapPin, Phone, Mail, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TIMES = ["12:00", "13:00", "14:00", "18:00", "19:00", "20:00", "20:30"];
const PARTY_SIZES = ["1–2", "3–4", "5–6", "7–10", "10+ (contact us)"];
const OCCASIONS = ["—", "Birthday", "Anniversary", "Business", "Date Night", "Other"];

export function Reservations() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim() || null,
      date: String(fd.get("date") || ""),
      time: String(fd.get("time") || ""),
      party_size: String(fd.get("party_size") || ""),
      occasion: String(fd.get("occasion") || "") || null,
      seating_preference: String(fd.get("seating") || "No preference"),
      special_requests: String(fd.get("requests") || "").trim() || null,
    };

    if (!payload.name || !payload.email || !payload.date || !payload.time) {
      setError("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    const { error: dbErr } = await supabase.from("reservations").insert(payload);
    if (dbErr) {
      setError("Could not submit your reservation. Please try again or call us.");
      setSubmitting(false);
      return;
    }
    setDone(true);
    setSubmitting(false);
  };

  return (
    <section id="reservations" className="py-20 md:py-28 px-5 bg-bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow mb-3">Book a Table</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">
            Reserve Your Table
          </h2>
          <p className="mt-3 text-text-muted">Open Tuesday to Sunday, 12:00 to 22:00</p>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8">
          <div className="rounded-2xl bg-bg-primary border border-border p-6 md:p-8 shadow-elevated">
            {done ? (
              <div className="flex flex-col items-center justify-center text-center py-12 animate-fade-up">
                <div className="h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-gold" />
                </div>
                <h3 className="font-serif text-2xl font-semibold mb-2">Booking received!</h3>
                <p className="text-text-muted max-w-sm">
                  We've recorded your request. Our team will confirm your booking by email shortly.
                </p>
                <button
                  onClick={() => setDone(false)}
                  className="mt-6 text-gold text-sm font-semibold hover:underline"
                >
                  Make another booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name *">
                  <input name="name" required className={inputCls} placeholder="Jane Doe" />
                </Field>
                <Field label="Email *">
                  <input name="email" type="email" required className={inputCls} placeholder="you@email.com" />
                </Field>
                <Field label="Phone">
                  <input name="phone" type="tel" className={inputCls} placeholder="082 123 4567" />
                </Field>
                <Field label="Party Size *">
                  <select name="party_size" required className={inputCls} defaultValue="">
                    <option value="" disabled>Select…</option>
                    {PARTY_SIZES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Date *">
                  <input name="date" type="date" required min={today} className={inputCls} />
                </Field>
                <Field label="Time *">
                  <select name="time" required className={inputCls} defaultValue="">
                    <option value="" disabled>Select…</option>
                    {TIMES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Occasion (optional)">
                  <select name="occasion" className={inputCls} defaultValue="—">
                    {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Seating">
                  <select name="seating" className={inputCls} defaultValue="No preference">
                    <option>No preference</option>
                    <option>Indoor</option>
                    <option>Outdoor</option>
                    <option>Bar</option>
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Special requests">
                    <textarea name="requests" maxLength={200} rows={3} className={inputCls} placeholder="Allergies, special occasion details…" />
                  </Field>
                </div>
                {error && <p className="sm:col-span-2 text-sm text-terracotta">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="sm:col-span-2 mt-2 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[var(--text-on-gold)] transition-all hover:bg-[var(--accent-gold-dark)] disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Confirm Reservation"}
                </button>
              </form>
            )}
          </div>

          <aside className="rounded-2xl bg-bg-primary border border-border p-6 md:p-8 space-y-5">
            <div>
              <h3 className="font-serif text-2xl font-semibold mb-3">Opening Hours</h3>
              <ul className="space-y-1.5 text-sm text-text-secondary">
                <li className="flex justify-between"><span>Monday</span><span className="text-text-muted">Closed</span></li>
                <li className="flex justify-between"><span>Tuesday – Thursday</span><span>12:00 – 22:00</span></li>
                <li className="flex justify-between"><span>Friday – Saturday</span><span>12:00 – 23:00</span></li>
                <li className="flex justify-between"><span>Sunday</span><span>12:00 – 21:00</span></li>
              </ul>
            </div>
            <div className="space-y-2 text-sm pt-4 border-t border-border">
              <p className="flex items-start gap-2"><MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" /> 59 Florida Road, Morningside, Durban</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> 031 XXX XXXX</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> reservations@dukkah.co.za</p>
            </div>
            <div className="rounded-xl overflow-hidden border border-border">
              <iframe
                title="Dukkah location"
                src="https://www.google.com/maps?q=59+Florida+Road+Durban&output=embed"
                className="w-full h-[220px]"
                loading="lazy"
              />
            </div>
            <a href="#private-dining" className="inline-flex items-center text-gold text-sm font-semibold hover:underline">
              Private dining for 10+ guests →
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg bg-bg-secondary border border-border px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20";
