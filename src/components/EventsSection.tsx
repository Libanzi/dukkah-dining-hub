import { useEffect, useState } from "react";
import { Calendar, Clock, Ticket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  name: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  ticket_price: number;
  is_free: boolean;
  image_url: string | null;
}

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true })
      .limit(6)
      .then(({ data }) => {
        setEvents((data as Event[]) || []);
        setLoading(false);
      });
  }, []);

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-ZA", { weekday: "short", day: "2-digit", month: "short" }).toUpperCase();
  };

  return (
    <section id="events" className="py-20 md:py-28 px-5 bg-bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow mb-3">Live & Loud</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">
            What's On at Dukkah
          </h2>
          <p className="mt-3 text-text-muted">Live music, themed evenings, and private functions</p>
        </div>

        {loading ? (
          <p className="text-center text-text-muted">Loading events…</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e) => (
              <article key={e.id} className="group rounded-2xl overflow-hidden bg-bg-primary border border-border hover:-translate-y-1 transition-all hover:shadow-warm">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {e.image_url && (
                    <img src={e.image_url} alt={`${e.name} at Dukkah Restaurant & Bar`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  )}
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-gold px-3 py-1 text-[11px] font-bold tracking-widest text-[var(--text-on-gold)]">
                    {formatDate(e.event_date)}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl font-semibold mb-2">{e.name}</h3>
                  <p className="text-sm text-text-muted mb-4 line-clamp-3">{e.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-text-secondary">
                      <Clock className="h-4 w-4 text-gold" /> From {e.start_time}
                    </span>
                    <span className="font-semibold text-gold">
                      {e.is_free ? "Free entry" : `R${e.ticket_price}`}
                    </span>
                  </div>
                  <button className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full border border-gold/60 px-4 py-2 text-xs font-semibold text-gold hover:bg-gold hover:text-[var(--text-on-gold)] transition-all">
                    <Ticket className="h-4 w-4" /> {e.is_free ? "Reserve a Table" : "Book Tickets"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl bg-terracotta px-6 md:px-10 py-8 text-center md:text-left md:flex md:items-center md:justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white">Host a Private Event</h3>
            <p className="mt-2 text-white/90 max-w-xl">From corporate dinners to milestone birthdays — Dukkah's private dining rooms are available for exclusive hire.</p>
          </div>
          <a href="#private-dining" className="inline-flex mt-4 md:mt-0 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-terracotta hover:bg-bg-primary transition-colors">
            Enquire Now →
          </a>
        </div>
      </div>
    </section>
  );
}
