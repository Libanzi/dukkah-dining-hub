import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, MapPin, HelpCircle } from "lucide-react";

type TourMode = "user" | "admin";

interface TourStep {
  title: string;
  description: string;
  img: string;
  anchor?: string;
  adminTab?: string;
}

const USER_STEPS: TourStep[] = [
  {
    title: "Welcome to Dukkah",
    description: "Durban's premier African fine dining destination on Florida Road — now with a fully digital experience. Browse menus, reserve tables, order online, and book events all in one place.",
    img: "/photos/exterior-1.webp",
    anchor: "#home",
  },
  {
    title: "Reserve a Table",
    description: "Book your table instantly — choose your date, time, and party size. Receive an instant confirmation with a QR code. No more phone tag.",
    img: "/photos/interior-8.webp",
    anchor: "#reservations",
  },
  {
    title: "Order Online",
    description: "Full menu available for delivery and collection. Add items to your basket, choose À La Carte, Brunch, Desserts, Cocktails, or Coffee. Checkout in under 60 seconds.",
    img: "/photos/food-7.webp",
    anchor: "#order",
  },
  {
    title: "Sunday Brunch Jazz",
    description: "Every Sunday from 11:00–15:00. Live jazz, sushi bar, brunch dishes, and bottomless options. Reserve your Brunch spot directly through the site.",
    img: "/photos/brunch-2.webp",
    anchor: "#order",
  },
  {
    title: "Craft Cocktail Bar",
    description: "80+ spirits, African-inspired signature cocktails, and curated wine pairings. Explore the full bar menu and pre-order your welcome drinks.",
    img: "/photos/bar-1.webp",
    anchor: "#order",
  },
  {
    title: "Live Events & Tickets",
    description: "Friday jazz sessions, Saturday Afrobeat nights, wine tastings, and themed dinners. Browse upcoming events and buy tickets directly — no third-party fees.",
    img: "/photos/event-1.webp",
    anchor: "#events",
  },
  {
    title: "Private Dining",
    description: "Exclusive dining rooms for 10–80 guests. Set menus, AV equipment, dedicated service staff. Submit an enquiry and receive a detailed proposal within 24 hours.",
    img: "/photos/interior-11.webp",
    anchor: "#private-dining",
  },
  {
    title: "Gift Cards",
    description: "The perfect gift — load any amount and send instantly by email. Redeemable for dining, drinks, or events. Managed and tracked from your account.",
    img: "/photos/wine-1.webp",
    anchor: "#gift-cards",
  },
  {
    title: "Photo Gallery",
    description: "A curated window into Dukkah — real moments from the restaurant, bar, kitchen, and events. Filter by category and click any photo to expand.",
    img: "/photos/interior-4.webp",
    anchor: "#gallery",
  },
  {
    title: "Your Account",
    description: "Sign in to view past orders, upcoming reservations, gift card balances, and event tickets — all in one dashboard. Seamless across every visit.",
    img: "/photos/interior-1.webp",
    anchor: "/account",
  },
];

const ADMIN_STEPS: TourStep[] = [
  {
    title: "Admin Dashboard",
    description: "A single command centre for the entire Dukkah operation. Reservations, online orders, event tickets, and customer enquiries — all managed in real time from one screen.",
    img: "/photos/interior-13.webp",
    adminTab: "reservations",
  },
  {
    title: "Reservations Management",
    description: "See every upcoming booking — date, time, party size, and special requests. Confirm, reschedule, or cancel with one click. Automated SMS & email confirmations sent to guests.",
    img: "/photos/interior-6.webp",
    adminTab: "reservations",
  },
  {
    title: "Online Orders",
    description: "View incoming delivery and collection orders in real time. Mark orders as received, in-kitchen, or ready. Full order history and daily revenue summary.",
    img: "/photos/food-1.webp",
    adminTab: "orders",
  },
  {
    title: "Events & Tickets",
    description: "Create and manage events — set capacity, ticket tiers, and pricing. Track sales and check guests in with QR scanning on the night. Revenue reconciled automatically.",
    img: "/photos/event-1.webp",
    adminTab: "events",
  },
  {
    title: "Customer Enquiries",
    description: "All private dining enquiries, general contact messages, and gift card queries in one inbox. Reply directly from the dashboard — no switching between email accounts.",
    img: "/photos/interior-5.webp",
    adminTab: "enquiries",
  },
];

function scrollToAnchor(anchor?: string) {
  if (!anchor) return;
  if (anchor.startsWith("/")) {
    window.location.href = anchor;
    return;
  }
  const id = anchor.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

interface TourOverlayProps {
  onClose: () => void;
  mode: TourMode;
}

function TourOverlay({ onClose, mode }: TourOverlayProps) {
  const steps = mode === "user" ? USER_STEPS : ADMIN_STEPS;
  const [step, setStep] = useState(0);
  const current = steps[step];

  const go = useCallback(
    (dir: number) => {
      const next = step + dir;
      if (next < 0 || next >= steps.length) return;
      setStep(next);
      if (steps[next].anchor) scrollToAnchor(steps[next].anchor);
    },
    [step, steps]
  );

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/70 animate-fade-in"
      onClick={close}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-bg-primary border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-52 sm:h-64 overflow-hidden">
          <img
            src={current.img}
            alt={current.title}
            className="h-full w-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/30 to-transparent" />
          {/* Mode badge */}
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[10px] font-bold tracking-widest text-[var(--text-on-gold)]">
            <MapPin className="h-3 w-3" />
            {mode === "user" ? "WEBSITE TOUR" : "ADMIN TOUR"}
          </span>
          <button
            onClick={close}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center"
            aria-label="Close tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-2">
          <p className="text-xs text-text-muted mb-1">
            Step {step + 1} of {steps.length}
          </p>
          <h3 className="font-serif text-2xl font-semibold text-text-primary mb-2">
            {current.title}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed min-h-[3.5rem]">
            {current.description}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mt-5 mb-4">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === step ? "w-6 bg-gold" : "w-2 bg-border hover:bg-gold/50"
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => go(-1)}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() => go(1)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] transition-colors"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={close}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TourButtonProps {
  mode?: TourMode;
  label?: string;
  className?: string;
}

export function TourButton({ mode = "user", label, className }: TourButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          className ||
          "inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/10 transition-colors"
        }
        aria-label="Start website tour"
      >
        <HelpCircle className="h-4 w-4" />
        {label || "Take a Tour"}
      </button>
      {open && <TourOverlay mode={mode} onClose={() => setOpen(false)} />}
    </>
  );
}

const TOUR_SEEN_KEY = "dukkah_tour_seen";

export function TourFab({ mode = "user" }: { mode?: TourMode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(TOUR_SEEN_KEY)) {
      setOpen(true);
    }
  }, []);

  const handleClose = useCallback(() => {
    localStorage.setItem(TOUR_SEEN_KEY, "1");
    setOpen(false);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-[70] h-12 w-12 rounded-full bg-gold shadow-elevated flex items-center justify-center text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] hover:scale-110 active:scale-95 transition-all"
        aria-label="Take a site tour"
        title="Take a tour"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
      {open && <TourOverlay mode={mode} onClose={handleClose} />}
    </>
  );
}
