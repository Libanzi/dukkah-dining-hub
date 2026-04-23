import { useState, useEffect, useCallback } from "react";
import { Users, Check, ChevronLeft, ChevronRight, X, ArrowLeft, ArrowRight, Calendar, AlertCircle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { createPrivateDiningBooking } from "@/server/privateDining";

/* ------------------------------------------------------------------ */
/*  Room definitions                                                     */
/* ------------------------------------------------------------------ */
const rooms = [
  {
    name: "The Spice Room",
    capacity: 20,
    capacityLabel: "10–20 guests",
    img: "/photos/interior-13.webp",
    basePrice: 450,
    features: ["Dedicated server", "AV screen", "Custom menu", "Air-conditioned"],
  },
  {
    name: "The Gallery Room",
    capacity: 45,
    capacityLabel: "20–45 guests",
    img: "/photos/interior-7.webp",
    basePrice: 395,
    features: ["Private bar", "PA system", "Custom décor options", "Dedicated entrance"],
  },
  {
    name: "Full Venue Buyout",
    capacity: 80,
    capacityLabel: "Up to 80 guests",
    img: "/photos/interior-11.webp",
    basePrice: 500,
    features: ["Entire restaurant", "Full bar", "Live band setup", "Custom menu"],
  },
];

/* ------------------------------------------------------------------ */
/*  Pricing utilities                                                    */
/* ------------------------------------------------------------------ */
function getDaysAhead(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

function getPricingInfo(daysAhead: number) {
  if (daysAhead < 1)  return { label: "Emergency — less than 24 hours", modifier: 1.5, badge: "+50% fee", color: "text-red-500", bgColor: "bg-red-500/10 border-red-500/30" };
  if (daysAhead < 3)  return { label: "Short notice — less than 3 days", modifier: 1.2, badge: "+20% fee", color: "text-orange-500", bgColor: "bg-orange-500/10 border-orange-500/30" };
  if (daysAhead < 7)  return { label: "Standard booking", modifier: 1.0, badge: "Standard rate", color: "text-text-secondary", bgColor: "bg-bg-secondary border-border" };
  return { label: "Early booking — 1+ week in advance", modifier: 0.9, badge: "10% discount", color: "text-green-500", bgColor: "bg-green-500/10 border-green-500/30" };
}

/* ------------------------------------------------------------------ */
/*  Calendar component                                                   */
/* ------------------------------------------------------------------ */
interface DayInfo { booked: number; capacity: number }

interface CalendarPickerProps {
  selectedDate: string | null;
  onSelect: (date: string) => void;
  roomCapacity: number;
  bookedDates: Record<string, number>;
}

function CalendarPicker({ selectedDate, onSelect, roomCapacity, bookedDates }: CalendarPickerProps) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-ZA", { month: "long", year: "numeric" });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const getDayState = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const dateStr = d.toISOString().slice(0, 10);
    const isPast = d < today;
    const bookedGuests = bookedDates[dateStr] || 0;
    const remaining = roomCapacity - bookedGuests;
    const isFull = remaining <= 0;
    const isAlmostFull = !isFull && remaining < roomCapacity * 0.3;
    const isSelected = selectedDate === dateStr;
    return { dateStr, isPast, isFull, isAlmostFull, remaining, isSelected };
  };

  const blanks = Array.from({ length: firstDay });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="rounded-xl border border-border bg-bg-primary overflow-hidden">
      {/* Month nav */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-secondary">
        <button onClick={prevMonth} className="h-8 w-8 rounded-full hover:bg-bg-primary flex items-center justify-center transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-semibold text-sm">{monthLabel}</p>
        <button onClick={nextMonth} className="h-8 w-8 rounded-full hover:bg-bg-primary flex items-center justify-center transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-text-muted px-2 pt-2 pb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <div key={d}>{d}</div>)}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {blanks.map((_, i) => <div key={`b${i}`} />)}
        {days.map(day => {
          const { dateStr, isPast, isFull, isAlmostFull, remaining, isSelected } = getDayState(day);
          const disabled = isPast || isFull;
          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => !disabled && onSelect(dateStr)}
              title={isAlmostFull ? `${remaining} spot${remaining !== 1 ? "s" : ""} remaining` : undefined}
              className={`relative h-8 w-full rounded-lg text-xs font-medium transition-all
                ${isSelected ? "bg-gold text-[var(--text-on-gold)] shadow-sm" : ""}
                ${isFull ? "bg-red-500/15 text-red-400 cursor-not-allowed line-through" : ""}
                ${isAlmostFull && !isSelected ? "bg-amber-500/15 text-amber-600 border border-amber-500/40" : ""}
                ${!disabled && !isSelected && !isAlmostFull ? "hover:bg-gold/15 hover:text-gold" : ""}
                ${isPast ? "opacity-30 cursor-not-allowed" : ""}
              `}
            >
              {day}
              {isAlmostFull && !isSelected && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-3 py-2 border-t border-border text-[10px] text-text-muted">
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-gold" /> Selected</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-amber-500" /> Almost full</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-red-400" /> Fully booked</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Booking Modal                                                        */
/* ------------------------------------------------------------------ */
type ModalStep = "room" | "date" | "details" | "pricing" | "payment" | "success";

function PrivateDiningModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<ModalStep>("room");
  const [selectedRoom, setSelectedRoom] = useState<typeof rooms[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [guests, setGuests] = useState(10);
  const [bookedDates, setBookedDates] = useState<Record<string, number>>({});
  const [paymentType, setPaymentType] = useState<"deposit" | "full">("deposit");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<{
    ref: string; total_amount: number; deposit_amount: number;
    pricing_modifier: number; payfast_url: string; payfast_params: Record<string, string>;
  } | null>(null);

  const createBookingFn = useServerFn(createPrivateDiningBooking);

  // Fetch existing bookings for selected room
  useEffect(() => {
    if (!selectedRoom) return;
    supabase
      .from("private_dining_bookings")
      .select("event_date, guest_count")
      .eq("room_name", selectedRoom.name)
      .neq("status", "cancelled")
      .then(({ data }) => {
        const map: Record<string, number> = {};
        (data || []).forEach(r => {
          map[r.event_date] = (map[r.event_date] || 0) + r.guest_count;
        });
        setBookedDates(map);
      });
  }, [selectedRoom]);

  const pricingInfo = selectedDate ? getPricingInfo(getDaysAhead(selectedDate)) : null;
  const basePrice = selectedRoom?.basePrice ?? 0;
  const total = pricingInfo ? Math.round(basePrice * guests * pricingInfo.modifier * 100) / 100 : 0;
  const deposit = paymentType === "full" ? total : Math.round(total * 0.5 * 100) / 100;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-ZA", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!selectedRoom || !selectedDate) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await createBookingFn({
        data: {
          room_name: selectedRoom.name,
          room_capacity: selectedRoom.capacity,
          base_price_per_person: selectedRoom.basePrice,
          event_date: selectedDate,
          guest_count: guests,
          customer_name: String(fd.get("name") || ""),
          customer_email: String(fd.get("email") || ""),
          customer_phone: String(fd.get("phone") || "") || undefined,
          event_type: String(fd.get("event_type") || "") || undefined,
          special_requests: String(fd.get("special_requests") || "") || undefined,
          payment_type: paymentType,
        },
      });
      setBooking(res);
      setStep("payment");
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
    Object.entries(booking.payfast_params).forEach(([k, v]) => {
      const inp = document.createElement("input");
      inp.type = "hidden"; inp.name = k; inp.value = v;
      form.appendChild(inp);
    });
    document.body.appendChild(form);
    form.submit();
  };

  const stepTitles: Record<ModalStep, string> = {
    room: "Select a Room", date: "Pick a Date", details: "Your Details",
    pricing: "Pricing Summary", payment: "Payment", success: "Booking Confirmed",
  };

  const canGoBack = ["date", "details"].includes(step);
  const goBack = () => {
    if (step === "details") setStep("date");
    else if (step === "date") setStep("room");
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full sm:max-w-[560px] bg-bg-primary sm:rounded-2xl border border-border shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            {canGoBack && (
              <button onClick={goBack} className="h-9 w-9 -ml-2 rounded-full hover:bg-bg-secondary flex items-center justify-center">
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <Calendar className="h-5 w-5 text-gold" />
            <h3 className="font-serif text-xl font-semibold">{stepTitles[step]}</h3>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-full hover:bg-bg-secondary flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step progress bar */}
        {step !== "success" && step !== "payment" && (
          <div className="flex gap-1 px-5 pt-3 shrink-0">
            {(["room", "date", "details"] as const).map((s, i) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${
                ["room","date","details"].indexOf(step) >= i ? "bg-gold" : "bg-border"
              }`} />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* STEP: room */}
          {step === "room" && (
            <div className="p-5 space-y-4">
              {rooms.map(r => (
                <button key={r.name} onClick={() => { setSelectedRoom(r); setStep("date"); }}
                  className="w-full rounded-xl overflow-hidden border border-border hover:border-gold transition-colors text-left group">
                  <div className="flex gap-4 p-4">
                    <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0">
                      <img src={r.img} alt={r.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-lg font-semibold">{r.name}</p>
                      <p className="text-gold text-sm font-semibold flex items-center gap-1 mt-0.5">
                        <Users className="h-3.5 w-3.5" /> {r.capacityLabel}
                      </p>
                      <p className="text-xs text-text-muted mt-1">From R{r.basePrice} / person</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-text-muted self-center shrink-0 group-hover:text-gold transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP: date */}
          {step === "date" && selectedRoom && (
            <div className="p-5 space-y-4">
              <CalendarPicker
                selectedDate={selectedDate}
                onSelect={(d) => { setSelectedDate(d); }}
                roomCapacity={selectedRoom.capacity}
                bookedDates={bookedDates}
              />

              {selectedDate && pricingInfo && (
                <div className={`rounded-xl border p-4 ${pricingInfo.bgColor}`}>
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <p className={`text-sm font-semibold ${pricingInfo.color}`}>{pricingInfo.badge}</p>
                      <p className="text-xs text-text-muted mt-0.5">{pricingInfo.label}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Guest count */}
              {selectedDate && (
                <div>
                  <p className="text-sm font-semibold mb-3">Number of guests</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setGuests(g => Math.max(1, g - 1))}
                      className="h-10 w-10 rounded-full border border-border hover:border-gold flex items-center justify-center text-xl transition-colors">−</button>
                    <div className="flex-1 text-center">
                      <p className="font-serif text-4xl font-semibold text-gold">{guests}</p>
                      <p className="text-xs text-text-muted">guests</p>
                    </div>
                    <button onClick={() => setGuests(g => Math.min(selectedRoom.capacity, g + 1))}
                      className="h-10 w-10 rounded-full border border-border hover:border-gold flex items-center justify-center text-xl transition-colors">+</button>
                  </div>
                  <p className="text-xs text-text-muted text-center mt-2">Max {selectedRoom.capacity} guests for {selectedRoom.name}</p>
                </div>
              )}

              <button
                disabled={!selectedDate}
                onClick={() => selectedDate && setStep("details")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] disabled:opacity-40 transition-colors"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP: details */}
          {step === "details" && selectedRoom && selectedDate && pricingInfo && (
            <form onSubmit={handleDetailsSubmit} className="p-5 space-y-4">
              {/* Booking summary banner */}
              <div className="rounded-xl bg-bg-secondary border border-border p-4 text-sm space-y-1">
                <div className="flex justify-between"><span className="text-text-muted">Room</span><span className="font-semibold">{selectedRoom.name}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Date</span><span className="font-semibold">{formatDate(selectedDate)}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Guests</span><span className="font-semibold">{guests}</span></div>
                <div className={`flex justify-between pt-1 border-t border-border`}>
                  <span className="text-text-muted">Pricing</span>
                  <span className={`font-semibold text-xs ${pricingInfo.color}`}>{pricingInfo.badge}</span>
                </div>
              </div>

              <input name="name" required placeholder="Full name *" className={inputCls} />
              <input name="email" type="email" required placeholder="Email address *" className={inputCls} />
              <input name="phone" type="tel" placeholder="Phone number" className={inputCls} />
              <select name="event_type" className={inputCls} defaultValue="">
                <option value="" disabled>Event type (optional)</option>
                <option>Birthday</option>
                <option>Corporate</option>
                <option>Wedding</option>
                <option>Anniversary</option>
                <option>Other</option>
              </select>
              <textarea name="special_requests" rows={2} placeholder="Special requests or notes…" className={inputCls} />

              {/* Payment type */}
              <div>
                <p className="text-sm font-semibold mb-3">Payment option</p>
                <div className="grid grid-cols-2 gap-3">
                  {(["deposit", "full"] as const).map(t => (
                    <button key={t} type="button" onClick={() => setPaymentType(t)}
                      className={`rounded-xl border p-3 text-left transition-colors ${paymentType === t ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"}`}>
                      <p className="text-xs font-bold uppercase tracking-wider text-gold mb-1">
                        {t === "deposit" ? "50% Deposit" : "Pay in Full"}
                      </p>
                      <p className="font-serif text-lg font-semibold">
                        R{(t === "deposit" ? Math.round(total * 0.5 * 100) / 100 : total).toLocaleString()}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {t === "deposit" ? "Balance due on the day" : "Full amount now"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] disabled:opacity-60 transition-colors">
                {submitting ? "Processing…" : `Confirm & Pay R${deposit.toLocaleString()}`}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}

          {/* STEP: payment */}
          {step === "payment" && booking && (
            <div className="p-5 space-y-5">
              <div className="rounded-xl bg-bg-secondary border border-border p-4 space-y-2 text-sm">
                <div className="flex justify-between text-text-muted"><span>Booking ref</span><span className="font-bold text-gold">{booking.ref}</span></div>
                <div className="flex justify-between text-text-muted"><span>Total amount</span><span>R{booking.total_amount.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold border-t border-border pt-2">
                  <span>{booking.payment_type === "deposit" ? "Deposit due now (50%)" : "Amount due"}</span>
                  <span className="text-gold">R{booking.deposit_amount.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-sm text-text-muted">Secure payment via PayFast. You will be redirected to complete payment then returned to your booking confirmation.</p>
              <button onClick={handlePayFast}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] transition-colors">
                Pay R{booking.deposit_amount.toLocaleString()} via PayFast <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-[11px] text-text-muted text-center">50% of remaining balance due on the day. Cancellations within 48 hours forfeit the deposit.</p>
            </div>
          )}

          {/* STEP: success */}
          {step === "success" && booking && (
            <div className="px-5 py-10 text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-gold/20 flex items-center justify-center">
                <Check className="h-8 w-8 text-gold" />
              </div>
              <h4 className="font-serif text-2xl font-semibold">Booking Confirmed!</h4>
              <p className="text-text-muted">Ref: <span className="font-bold text-gold">{booking.ref}</span><br />A confirmation has been sent to your email.</p>
              <button onClick={onClose}
                className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-[var(--text-on-gold)]">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main PrivateDining section                                           */
/* ------------------------------------------------------------------ */
export function PrivateDining() {
  const [showModal, setShowModal] = useState(false);
  const [preselectedRoom, setPreselectedRoom] = useState<string | null>(null);

  const openBooking = (roomName?: string) => {
    setPreselectedRoom(roomName || null);
    setShowModal(true);
  };

  return (
    <>
      <section id="private-dining" className="py-20 md:py-28 px-5 bg-bg-secondary">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow mb-3">Private Dining</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">
              Your Table. Your Event.
            </h2>
            <p className="mt-4 text-text-secondary">
              Exclusive rooms for intimate dinners to full venue buyouts. Book directly — with live availability.
            </p>
          </div>

          {/* Pricing notice */}
          <div className="max-w-2xl mx-auto mb-10 rounded-xl border border-gold/30 bg-gold/5 p-4">
            <p className="text-sm font-semibold text-gold mb-2 flex items-center gap-2"><Info className="h-4 w-4" /> Booking Terms</p>
            <div className="grid sm:grid-cols-2 gap-2 text-xs text-text-secondary">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500 shrink-0" /> 7+ days ahead — 10% early discount</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-text-muted shrink-0" /> 3–7 days ahead — Standard rate</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-500 shrink-0" /> Less than 3 days — +20% short notice fee</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500 shrink-0" /> Less than 24 hours — +50% emergency fee</div>
            </div>
            <p className="text-xs text-text-muted mt-2 pt-2 border-t border-gold/20">A 50% deposit is required at booking. Balance is due on the day.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {rooms.map((r) => (
              <article key={r.name} className="rounded-2xl overflow-hidden bg-bg-primary border border-border hover:-translate-y-1 transition-all hover:shadow-warm group">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={r.img} alt={`${r.name} at Dukkah`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl font-semibold mb-1">{r.name}</h3>
                  <p className="flex items-center gap-1.5 text-sm text-gold font-semibold mb-4"><Users className="h-4 w-4" /> {r.capacityLabel}</p>
                  <ul className="space-y-1.5 mb-5">
                    {r.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-text-secondary"><Check className="h-4 w-4 text-gold shrink-0" /> {f}</li>
                    ))}
                  </ul>
                  <p className="text-sm font-semibold text-text-primary border-t border-border pt-3 mb-4">From R{r.basePrice} / person</p>
                  <button onClick={() => openBooking(r.name)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] transition-colors">
                    <Calendar className="h-4 w-4" /> Book This Room
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <button onClick={() => openBooking()}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] transition-all hover:scale-[1.02]">
              <Calendar className="h-5 w-5" /> Check Availability & Book
            </button>
          </div>
        </div>
      </section>

      {showModal && <PrivateDiningModal onClose={() => { setShowModal(false); setPreselectedRoom(null); }} />}
    </>
  );
}

const inputCls = "w-full rounded-lg bg-bg-secondary border border-border px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20 placeholder:text-text-muted";
