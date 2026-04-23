import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, Ticket, X, ArrowLeft, Check, ArrowRight, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { createTicketBooking } from "@/server/tickets";
import { DukkahName } from "./DukkahName";

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

/* ------------------------------------------------------------------ */
/*  Ticket Booking Modal                                                */
/* ------------------------------------------------------------------ */

type ModalStep = "count" | "details" | "payment" | "success";

interface TicketModalProps {
  event: Event;
  onClose: () => void;
}

function TicketBookingModal({ event, onClose }: TicketModalProps) {
  const [step, setStep] = useState<ModalStep>("count");
  const [count, setCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<{
    ref: string;
    total: number;
    payfast_url: string;
    payfast_params: Record<string, string>;
  } | null>(null);

  const createBookingFn = useServerFn(createTicketBooking);

  const subtotal = event.ticket_price * count;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-ZA", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await createBookingFn({
        data: {
          event_id: event.id,
          event_name: event.name,
          event_date: event.event_date,
          ticket_price: event.ticket_price,
          ticket_count: count,
          customer_name: String(fd.get("name") || ""),
          customer_email: String(fd.get("email") || ""),
          customer_phone: String(fd.get("phone") || "") || null,
        },
      });
      setBooking({
        ref: res.booking_ref,
        total: res.total,
        payfast_url: res.payfast_url,
        payfast_params: res.payfast_params,
      });
      if (event.is_free) {
        setStep("success");
      } else {
        setStep("payment");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayFast = () => {
    if (!booking) return;
    const form = document.createElement("form");
    form.method = "POST";
    form.action = booking.payfast_url;
    Object.entries(booking.payfast_params).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full sm:max-w-[520px] bg-bg-primary sm:rounded-2xl border border-border shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-scale-in">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            {step === "details" && (
              <button
                onClick={() => setStep("count")}
                className="h-9 w-9 -ml-2 rounded-full hover:bg-bg-secondary flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <Ticket className="h-5 w-5 text-gold" />
            <h3 className="font-serif text-xl font-semibold">
              {step === "success" ? "Booking Confirmed" : step === "payment" ? "Payment" : "Book Tickets"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-bg-secondary flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* content */}
        <div className="flex-1 overflow-y-auto">
          {/* event info banner */}
          {step !== "success" && (
            <div className="px-5 py-4 border-b border-border bg-bg-secondary">
              <p className="font-serif text-lg font-semibold">{event.name}</p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-gold" /> {formatDate(event.event_date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-gold" /> From {event.start_time}
                </span>
                <span className="font-semibold text-gold">
                  {event.is_free ? "Free entry" : `R${event.ticket_price} / person`}
                </span>
              </div>
            </div>
          )}

          {/* STEP: count */}
          {step === "count" && (
            <div className="px-5 py-6 space-y-6">
              <div>
                <p className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">
                  How many tickets?
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCount((c) => Math.max(1, c - 1))}
                    className="h-12 w-12 rounded-full border border-border hover:border-gold flex items-center justify-center text-2xl font-light transition-colors"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <p className="font-serif text-5xl font-semibold text-gold">{count}</p>
                    <p className="text-sm text-text-muted mt-1">
                      {count === 1 ? "ticket" : "tickets"}
                    </p>
                  </div>
                  <button
                    onClick={() => setCount((c) => Math.min(20, c + 1))}
                    className="h-12 w-12 rounded-full border border-border hover:border-gold flex items-center justify-center text-2xl font-light transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {!event.is_free && (
                <div className="rounded-xl bg-bg-secondary border border-border p-4">
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>
                      {count} × R{event.ticket_price}
                    </span>
                    <span className="font-semibold text-text-primary">R{subtotal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-text-muted bg-gold/10 border border-gold/25 rounded-xl px-4 py-3">
                <Users className="h-4 w-4 text-gold shrink-0" />
                <span>Groups of 10+ — please call us to arrange.</span>
              </div>

              <button
                onClick={() => setStep("details")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] transition-colors"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP: details */}
          {step === "details" && (
            <form onSubmit={handleDetailsSubmit} className="px-5 py-6 space-y-4">
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
                placeholder="Email address *"
                className={inputCls}
                maxLength={255}
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone number (optional)"
                className={inputCls}
                maxLength={40}
              />

              {!event.is_free && (
                <div className="rounded-xl bg-bg-secondary border border-border p-3 text-sm">
                  <div className="flex justify-between text-text-muted">
                    <span>{count} ticket(s) × R{event.ticket_price}</span>
                    <span className="font-bold text-gold">R{subtotal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {error && <p className="text-sm text-terracotta">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] disabled:opacity-60 transition-colors"
              >
                {submitting
                  ? "Processing…"
                  : event.is_free
                    ? "Confirm Booking"
                    : `Continue to Payment · R${subtotal.toLocaleString()}`}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}

          {/* STEP: payment */}
          {step === "payment" && booking && (
            <div className="px-5 py-6 space-y-5">
              <div className="rounded-xl bg-bg-secondary border border-border p-4 space-y-2 text-sm">
                <div className="flex justify-between text-text-muted">
                  <span>Booking ref</span>
                  <span className="font-bold text-gold">{booking.ref}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-border pt-2">
                  <span>Total</span>
                  <span className="text-gold">R{Number(booking.total).toLocaleString()}</span>
                </div>
              </div>

              <p className="text-sm text-text-muted">
                Secure payment via PayFast. You will be redirected to complete your payment, then
                returned to your booking confirmation.
              </p>

              <button
                onClick={handlePayFast}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] transition-colors"
              >
                Pay R{Number(booking.total).toLocaleString()} via PayFast
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-[11px] text-text-muted text-center">
                By proceeding, you agree to our terms. Tickets are non-refundable within 48 hours of
                the event.
              </p>
            </div>
          )}

          {/* STEP: success (free events) */}
          {step === "success" && booking && (
            <div className="px-5 py-10 text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-gold/20 flex items-center justify-center">
                <Check className="h-8 w-8 text-gold" />
              </div>
              <h4 className="font-serif text-2xl font-semibold">You're confirmed!</h4>
              <p className="text-text-muted">
                Booking ref: <span className="font-bold text-gold">{booking.ref}</span>
                <br />A confirmation has been sent to your email.
              </p>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)]"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg bg-bg-secondary border border-border px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20 placeholder:text-text-muted";

/* ------------------------------------------------------------------ */
/*  Events Section                                                      */
/* ------------------------------------------------------------------ */

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true })
      .limit(9)
      .then(({ data }) => {
        setEvents((data as Event[]) || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (events.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % events.length), 4000);
    return () => clearInterval(t);
  }, [events.length]);

  const go = (n: number) => setIdx((n + events.length) % events.length);

  const formatDate = (d: string) =>
    new Date(d)
      .toLocaleDateString("en-ZA", { weekday: "short", day: "2-digit", month: "short" })
      .toUpperCase();

  return (
    <>
      <section id="events" className="py-20 md:py-28 px-5 bg-bg-secondary">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow mb-3">Live &amp; Loud</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">
              What's On at <DukkahName />
            </h2>
            <p className="mt-3 text-text-muted">Live music, themed evenings, and private functions</p>
          </div>

          {loading ? (
            <p className="text-center text-text-muted">Loading events…</p>
          ) : events.length === 0 ? (
            <p className="text-center text-text-muted py-10">No upcoming events scheduled — check back soon.</p>
          ) : (
            <div className="relative overflow-hidden rounded-2xl shadow-elevated">
              {/* Carousel */}
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${idx * 100}%)` }}
              >
                {events.map((e) => (
                  <article key={e.id} className="w-full shrink-0">
                    <div className="relative aspect-[16/9] md:aspect-[21/9]">
                      <img
                        src={e.image_url || "/photos/event-1.webp"}
                        alt={`${e.name} at Dukkah Restaurant & Bar`}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                        <span className="mb-3 inline-flex w-fit rounded-full bg-gold px-3 py-1 text-[11px] font-bold tracking-widest text-[var(--text-on-gold)]">
                          {formatDate(e.event_date)}
                        </span>
                        <h3 className="font-serif text-2xl md:text-4xl font-semibold text-white mb-2">{e.name}</h3>
                        <p className="text-sm md:text-base text-white/75 mb-2 max-w-lg line-clamp-2">{e.description}</p>
                        <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
                          <span className="flex items-center gap-1.5 text-white/80">
                            <Clock className="h-4 w-4 text-gold" /> From {e.start_time}
                          </span>
                          <span className="font-bold text-gold text-base">
                            {e.is_free ? "Free entry" : `R${e.ticket_price} / person`}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedEvent(e)}
                          className="inline-flex w-fit items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] transition-colors"
                        >
                          <Ticket className="h-4 w-4" />
                          {e.is_free ? "Reserve My Spot" : "Book & Pay Tickets"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Arrows */}
              {events.length > 1 && (
                <>
                  <button onClick={() => go(idx - 1)} aria-label="Previous event"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/40 text-white backdrop-blur flex items-center justify-center hover:bg-black/60 transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={() => go(idx + 1)} aria-label="Next event"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/40 text-white backdrop-blur flex items-center justify-center hover:bg-black/60 transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Dots */}
              {events.length > 1 && (
                <div className="absolute bottom-4 right-6 z-10 flex gap-1.5">
                  {events.map((_, i) => (
                    <button key={i} onClick={() => go(i)} aria-label={`Event ${i + 1}`}
                      className={`rounded-full transition-all ${i === idx ? "w-5 h-2 bg-gold" : "w-2 h-2 bg-white/50"}`} />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-10 rounded-2xl bg-terracotta px-6 md:px-10 py-8 text-center md:text-left md:flex md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white">Host a Private Event</h3>
              <p className="mt-2 text-white/90 max-w-xl">
                From corporate dinners to milestone birthdays — <DukkahName className="text-white" />'s private dining rooms are available for exclusive hire.
              </p>
            </div>
            <a href="#private-dining"
              className="inline-flex mt-4 md:mt-0 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-terracotta hover:bg-bg-primary transition-colors">
              Book Private Dining →
            </a>
          </div>
        </div>
      </section>

      {selectedEvent && (
        <TicketBookingModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
}
