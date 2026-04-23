import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, ExternalLink, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DukkahLogo } from "./DukkahLogo";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type Sender = "bot" | "user";
interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  options?: Option[];
}
interface Option {
  label: string;
  next: NodeId;
  hint?: string;
  value?: string;
}

type NodeId =
  /* root */
  | "main"
  /* booking flow */
  | "book.intro"
  | "book.assist.name"
  | "book.assist.email"
  | "book.assist.phone"
  | "book.assist.date"
  | "book.assist.time"
  | "book.assist.party"
  | "book.assist.confirm"
  | "book.done"
  | "book.redirect"
  /* ticket booking flow */
  | "tickets.intro"
  | "tickets.name"
  | "tickets.email"
  | "tickets.phone"
  | "tickets.count"
  | "tickets.confirm"
  | "tickets.done"
  /* info */
  | "menu.intro"
  | "hours"
  | "events"
  | "delivery"
  /* enquiry flow */
  | "enquiry.intro"
  | "enquiry.name"
  | "enquiry.email"
  | "enquiry.message"
  | "enquiry.admin.ask"
  | "enquiry.confirm"
  | "enquiry.done"
  /* private dining */
  | "private.intro";

interface Draft {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  party_size?: string;
  message?: string;
  ticket_count?: string;
  event_name?: string;
}

const WA_NUMBER = "27000000000";
const IDLE_RESET_MS = 3 * 60 * 1000;
const AUTO_MAIN_MS = 5 * 60 * 1000;

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isDate = (v: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  !isNaN(Date.parse(v)) &&
  new Date(v) >= new Date(new Date().setHours(0, 0, 0, 0));
const isTime = (v: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);

/* ------------------------------------------------------------------ */
/*  Widget                                                              */
/* ------------------------------------------------------------------ */

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [node, setNode] = useState<NodeId>("main");
  const [draft, setDraft] = useState<Draft>({});
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoMainTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- message helpers ---- */
  const push = (m: Omit<ChatMessage, "id">) =>
    setMessages((prev) => [...prev, { ...m, id: crypto.randomUUID() }]);

  const botSay = (text: string, options?: Option[]) =>
    push({ sender: "bot", text, options });

  const userSay = (text: string) => push({ sender: "user", text });

  /* ---- timer helpers ---- */
  const clearTimers = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (autoMainTimer.current) clearTimeout(autoMainTimer.current);
  };

  const resetIdle = () => {
    clearTimers();
    idleTimer.current = setTimeout(() => {
      if (node !== "main") {
        botSay("Still there? Taking you back to the main menu.", [
          { label: "↩ Back to menu", next: "main" },
        ]);
      }
    }, IDLE_RESET_MS);
    autoMainTimer.current = setTimeout(() => {
      setNode("main");
      setDraft({});
    }, AUTO_MAIN_MS);
  };

  const goTo = (n: NodeId, extra?: Partial<Draft>) => {
    if (extra) setDraft((d) => ({ ...d, ...extra }));
    setNode(n);
  };

  /* ---- node renderer ---- */
  const enterNode = (n: NodeId, currentDraft: Draft) => {
    switch (n) {
      /* ---- MAIN MENU ---- */
      case "main":
        setDraft({});
        botSay(
          "Hi! I'm the Concierge. What would you like to do today?",
          [
            { label: "🍽️  Book a table", next: "book.intro" },
            { label: "🎟️  Book event tickets", next: "tickets.intro" },
            { label: "🏛️  Private dining booking", next: "private.intro" },
            { label: "📋  Today's menu", next: "menu.intro" },
            { label: "🕒  Opening hours", next: "hours" },
            { label: "🎷  Events this week", next: "events" },
            { label: "🛵  Delivery & ordering", next: "delivery" },
            { label: "✉️  Send an enquiry", next: "enquiry.intro" },
          ],
        );
        break;

      /* ---- BOOKING FLOW ---- */
      case "book.intro":
        botSay("Great — how would you like to book?", [
          { label: "🤖  Bot books for me", next: "book.assist.name" },
          { label: "📝  Take me to the form", next: "book.redirect" },
          { label: "↩  Back", next: "main" },
        ]);
        break;

      case "book.redirect":
        botSay("Opening the reservation form now…");
        setTimeout(() => {
          document.getElementById("reservations")?.scrollIntoView({ behavior: "smooth" });
          goTo("main");
        }, 600);
        break;

      case "book.assist.name":
        botSay("What name should the booking be under?");
        break;

      case "book.assist.email":
        botSay("Thanks! What email should we send the confirmation to?");
        break;

      case "book.assist.phone":
        botSay("Contact number? (Type 'skip' to leave blank)");
        break;

      case "book.assist.date":
        botSay("Which date? Format: YYYY-MM-DD  (e.g. 2026-05-12)");
        break;

      case "book.assist.time":
        botSay("What time? 24-hour HH:MM  (kitchen: 12:00–22:00, Fri/Sat until 23:00)");
        break;

      case "book.assist.party":
        botSay("How many guests?", [
          { label: "1–2", next: "book.assist.confirm", value: "1–2" },
          { label: "3–4", next: "book.assist.confirm", value: "3–4" },
          { label: "5–6", next: "book.assist.confirm", value: "5–6" },
          { label: "7–10", next: "book.assist.confirm", value: "7–10" },
        ]);
        break;

      case "book.assist.confirm":
        botSay(
          `Here's your booking summary:\n\n👤  ${currentDraft.name}\n📧  ${currentDraft.email}\n📞  ${currentDraft.phone || "—"}\n📅  ${currentDraft.date} at ${currentDraft.time}\n👥  Party of ${currentDraft.party_size}`,
          [
            { label: "✅  Confirm & book", next: "book.done" },
            { label: "✏️  Start over", next: "book.intro" },
          ],
        );
        break;

      case "book.done":
        submitBooking(currentDraft);
        break;

      /* ---- TICKET BOOKING FLOW ---- */
      case "tickets.intro":
        botSay(
          "This week at Dukkah:\n\n🎷  Friday Live Jazz — 20:00  ·  R150/person\n🎵  Saturday Afrobeat Night — 20:00  ·  R120/person\n🥂  Sunday Brunch Jazz — 11:00  ·  Free with booking",
          [
            { label: "🎷  Friday Jazz", next: "tickets.name", value: "Friday Live Jazz (R150)" },
            { label: "🎵  Saturday Afrobeat", next: "tickets.name", value: "Saturday Afrobeat Night (R120)" },
            { label: "🥂  Sunday Brunch", next: "tickets.name", value: "Sunday Brunch Jazz (Free)" },
            { label: "🗓️  See all events", next: "events" },
            { label: "↩  Back", next: "main" },
          ],
        );
        break;

      case "tickets.name":
        botSay("What name should the tickets be issued to?");
        break;

      case "tickets.email":
        botSay("Great! What email should we send the tickets to?");
        break;

      case "tickets.phone":
        botSay("Contact number? (Type 'skip' to leave blank)");
        break;

      case "tickets.count":
        botSay("How many tickets?", [
          { label: "1", next: "tickets.confirm", value: "1" },
          { label: "2", next: "tickets.confirm", value: "2" },
          { label: "3", next: "tickets.confirm", value: "3" },
          { label: "4", next: "tickets.confirm", value: "4" },
          { label: "5+", next: "tickets.confirm", value: "5+" },
        ]);
        break;

      case "tickets.confirm":
        botSay(
          `Ticket summary:\n\n🎟️  ${currentDraft.event_name}\n👤  ${currentDraft.name}\n📧  ${currentDraft.email}\n📞  ${currentDraft.phone || "—"}\n🔢  ${currentDraft.ticket_count} ticket(s)`,
          [
            { label: "✅  Confirm & book", next: "tickets.done" },
            { label: "✏️  Start over", next: "tickets.intro" },
          ],
        );
        break;

      case "tickets.done":
        submitTickets(currentDraft);
        break;

      /* ---- INFO ---- */
      case "menu.intro":
        botSay(
          "Chef's current highlights:\n\n• Slow-braised lamb shank with pap\n• Dukkah-crusted kingklip\n• Mushroom & spinach bunny chow (v)\n• 80+ cocktails & South African wines",
          [
            { label: "📖  Open full menu", next: "main", hint: "menu" },
            { label: "🍽️  Book a table", next: "book.intro" },
            { label: "↩  Main menu", next: "main" },
          ],
        );
        break;

      case "hours":
        botSay(
          "We're open:\n\n📅  Tuesday – Thursday  |  12:00 – 22:00\n📅  Friday – Saturday   |  12:00 – 23:00\n📅  Sunday              |  12:00 – 21:00\n❌  Monday              |  Closed",
          [
            { label: "🍽️  Book a table", next: "book.intro" },
            { label: "↩  Main menu", next: "main" },
          ],
        );
        break;

      case "events":
        botSay(
          "Coming up at Dukkah:\n\n🎷  Fri — Live Jazz, 20:00  ·  R150\n🎵  Sat — Afrobeat Night, 20:00  ·  R120\n🥂  Sun — Brunch Jazz, 11:00  ·  Free",
          [
            { label: "🎟️  Book tickets", next: "tickets.intro" },
            { label: "📅  See all events", next: "main", hint: "events" },
            { label: "↩  Main menu", next: "main" },
          ],
        );
        break;

      case "delivery":
        botSay(
          "We deliver within 10 km of 59 Florida Road, Morningside.\n\n🛵  Delivery fee: R45 (free over R400)\n⏱️  ETA: 45–60 min\n📦  Collection: 30–45 min",
          [
            { label: "🛵  Order now", next: "main", hint: "order" },
            { label: "↩  Main menu", next: "main" },
          ],
        );
        break;

      /* ---- PRIVATE DINING ---- */
      case "private.intro":
        botSay(
          "🏛️ Private Dining at Dukkah\n\nWe have three exclusive rooms:\n\n• The Spice Room — 10–20 guests · From R450/person\n• The Gallery Room — 20–45 guests · From R395/person\n• Full Venue Buyout — up to 80 guests · From R500/person\n\n📅 Booking terms:\n✅ 7+ days ahead — 10% early discount\n🔸 Less than 3 days — +20% short notice fee\n🔴 Less than 24 hours — +50% emergency fee\n\n💳 A 50% deposit is required at booking.",
          [
            { label: "📅  Book online now", next: "main", hint: "private-dining" },
            { label: "↩  Main menu", next: "main" },
          ],
        );
        // Redirect to private dining section
        setTimeout(() => {
          document.getElementById("private-dining")?.scrollIntoView({ behavior: "smooth" });
        }, 800);
        break;

      /* ---- ENQUIRY FLOW ---- */
      case "enquiry.intro":
        botSay("What is your enquiry about?", [
          { label: "🍽️  Reservation query", next: "enquiry.name" },
          { label: "🎉  Private event / function", next: "enquiry.name" },
          { label: "🍜  Menu or dietary needs", next: "enquiry.name" },
          { label: "💼  Business / media / other", next: "enquiry.name" },
          { label: "↩  Back", next: "main" },
        ]);
        break;

      case "enquiry.name":
        botSay("What's your name?");
        break;

      case "enquiry.email":
        botSay("And your email address? We'll CC you on the reply.");
        break;

      case "enquiry.message":
        botSay("In a sentence or two — how can we help?");
        break;

      case "enquiry.admin.ask":
        botSay(
          "This sounds like something our admin team should see directly. Would you like me to send it to them right now?",
          [
            { label: "📤  Yes, send to admin", next: "enquiry.confirm" },
            { label: "❌  No thanks", next: "main" },
          ],
        );
        break;

      case "enquiry.confirm":
        botSay(
          `Ready to send:\n\n👤  ${currentDraft.name}\n📧  ${currentDraft.email}\n💬  "${currentDraft.message}"`,
          [
            { label: "📤  Send now", next: "enquiry.done" },
            { label: "↩  Cancel", next: "main" },
          ],
        );
        break;

      case "enquiry.done":
        submitEnquiry(currentDraft);
        break;
    }
  };

  /* ---- DB submissions ---- */
  const submitBooking = async (d: Draft) => {
    setBusy(true);
    const { error } = await supabase.from("reservations").insert({
      name: d.name!,
      email: d.email!,
      phone: d.phone || null,
      date: d.date!,
      time: d.time!,
      party_size: d.party_size!,
      seating_preference: "No preference",
      special_requests: "Booked via concierge bot",
    });
    setBusy(false);
    if (error) {
      botSay(
        "Sorry — I couldn't save that booking. Please use the reservation form below or call 031 XXX XXXX.",
        [
          { label: "📝  Open form", next: "book.redirect" },
          { label: "↩  Main menu", next: "main" },
        ],
      );
      return;
    }
    botSay(
      `🎉  Booked!\n\nA confirmation has been sent to ${d.email}.\n\nOpening your booking history now…`,
      [{ label: "↩  Main menu", next: "main" }],
    );
    setTimeout(() => {
      window.location.href = "/account#reservations";
    }, 2500);
  };

  const submitTickets = async (d: Draft) => {
    setBusy(true);
    const count = parseInt(d.ticket_count || "1", 10);
    const { error } = await supabase.from("ticket_bookings").insert({
      event_name: d.event_name ?? "",
      customer_name: d.name!,
      customer_email: d.email!,
      customer_phone: d.phone || null,
      ticket_count: count,
      ticket_price_each: 0,
      total: 0,
      booking_ref: `TB-${Date.now().toString(36).toUpperCase()}`,
      status: "pending",
      payment_status: "unpaid",
    });
    setBusy(false);
    if (error) {
      botSay(
        "Couldn't save that ticket booking. Please visit the Events section or contact us directly.",
        [
          { label: "🗓️  See events", next: "main", hint: "events" },
          { label: "↩  Main menu", next: "main" },
        ],
      );
      return;
    }
    botSay(
      `🎟️  Tickets reserved!\n\nEvent: ${d.event_name}\nName: ${d.name}\nTickets: ${d.ticket_count}\n\nA confirmation has been sent to ${d.email}. Our team will contact you to confirm payment.\n\nBack to menu in a moment…`,
      [{ label: "↩  Main menu", next: "main" }],
    );
    setTimeout(() => goTo("main"), 5000);
  };

  const submitEnquiry = async (d: Draft) => {
    setBusy(true);
    const { error } = await supabase.from("private_dining_enquiries").insert({
      name: d.name!,
      email: d.email!,
      message: d.message || "(no message)",
      event_type: "General enquiry (via bot)",
    });
    setBusy(false);
    if (error) {
      botSay(
        "Sorry — couldn't send that. Please email admin@dukkah.co.za directly.",
        [{ label: "↩  Main menu", next: "main" }],
      );
      return;
    }
    botSay(
      `✅  Sent to admin!\n\nYour enquiry has been forwarded and a copy sent to ${d.email}. Our team typically replies within 1 business day.\n\nIs there anything else I can help with?`,
      [
        { label: "🍽️  Book a table", next: "book.intro" },
        { label: "↩  Main menu", next: "main" },
      ],
    );
    setTimeout(() => goTo("main"), 8000);
  };

  /* ---- option click ---- */
  const onOption = (opt: Option) => {
    userSay(opt.label.replace(/^\S+\s+/, ""));
    resetIdle();

    if (opt.hint) {
      setTimeout(
        () => document.getElementById(opt.hint!)?.scrollIntoView({ behavior: "smooth" }),
        200,
      );
    }

    // carry option value into draft before switching node
    if (opt.value) {
      if (opt.next === "book.assist.confirm") {
        setDraft((d) => ({ ...d, party_size: opt.value }));
      } else if (opt.next === "tickets.name") {
        setDraft((d) => ({ ...d, event_name: opt.value }));
      } else if (opt.next === "tickets.confirm") {
        setDraft((d) => ({ ...d, ticket_count: opt.value }));
      }
    }

    setNode(opt.next);
  };

  /* ---- text input handler ---- */
  const handleTextInput = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    userSay(value);
    setInput("");
    resetIdle();

    switch (node) {
      /* booking */
      case "book.assist.name":
        if (value.length < 2) return botSay("Please share your full name.");
        setDraft((d) => ({ ...d, name: value }));
        return setNode("book.assist.email");
      case "book.assist.email":
        if (!isEmail(value)) return botSay("That doesn't look like a valid email — try again.");
        setDraft((d) => ({ ...d, email: value }));
        return setNode("book.assist.phone");
      case "book.assist.phone":
        setDraft((d) => ({ ...d, phone: value.toLowerCase() === "skip" ? "" : value }));
        return setNode("book.assist.date");
      case "book.assist.date":
        if (!isDate(value)) return botSay("Please use YYYY-MM-DD and a future date, e.g. 2026-05-12.");
        setDraft((d) => ({ ...d, date: value }));
        return setNode("book.assist.time");
      case "book.assist.time":
        if (!isTime(value)) return botSay("Please use HH:MM (24-hour), e.g. 19:30.");
        setDraft((d) => ({ ...d, time: value }));
        return setNode("book.assist.party");

      /* ticket booking */
      case "tickets.name":
        if (value.length < 2) return botSay("Please share your full name.");
        setDraft((d) => ({ ...d, name: value }));
        return setNode("tickets.email");
      case "tickets.email":
        if (!isEmail(value)) return botSay("That doesn't look like a valid email — try again.");
        setDraft((d) => ({ ...d, email: value }));
        return setNode("tickets.phone");
      case "tickets.phone":
        setDraft((d) => ({ ...d, phone: value.toLowerCase() === "skip" ? "" : value }));
        return setNode("tickets.count");

      /* enquiry */
      case "enquiry.name":
        if (value.length < 2) return botSay("Please share your name.");
        setDraft((d) => ({ ...d, name: value }));
        return setNode("enquiry.email");
      case "enquiry.email":
        if (!isEmail(value)) return botSay("That email doesn't look right — try again.");
        setDraft((d) => ({ ...d, email: value }));
        return setNode("enquiry.message");
      case "enquiry.message":
        if (value.length < 5) return botSay("Just a sentence or two — what would you like us to know?");
        setDraft((d) => ({ ...d, message: value }));
        return setNode("enquiry.admin.ask");

      default:
        botSay("Please tap one of the options above, or hit ↩ to return to the main menu.", [
          { label: "↩  Main menu", next: "main" },
        ]);
    }
  };

  /* ---- effects ---- */
  useEffect(() => {
    if (open && messages.length === 0) {
      enterNode("main", {});
      resetIdle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) enterNode(node, draft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(
    () => () => {
      clearTimers();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /* ---- input visibility ---- */
  const textInputNodes: NodeId[] = [
    "book.assist.name",
    "book.assist.email",
    "book.assist.phone",
    "book.assist.date",
    "book.assist.time",
    "tickets.name",
    "tickets.email",
    "tickets.phone",
    "enquiry.name",
    "enquiry.email",
    "enquiry.message",
  ];
  const showInput = textInputNodes.includes(node);

  /* ---- placeholder text ---- */
  const inputPlaceholder: Partial<Record<NodeId, string>> = {
    "book.assist.name": "Your full name…",
    "book.assist.email": "your@email.com…",
    "book.assist.phone": "Phone or type 'skip'…",
    "book.assist.date": "YYYY-MM-DD e.g. 2026-05-12",
    "book.assist.time": "HH:MM e.g. 19:30",
    "tickets.name": "Your full name…",
    "tickets.email": "your@email.com…",
    "tickets.phone": "Phone or type 'skip'…",
    "enquiry.name": "Your name…",
    "enquiry.email": "your@email.com…",
    "enquiry.message": "How can we help?",
  };

  /* ---- render ---- */
  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gold text-[var(--text-on-gold)] shadow-elevated flex items-center justify-center hover:scale-110 transition-transform animate-pulse-soft"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[400px] sm:h-[620px] flex flex-col bg-bg-secondary sm:rounded-2xl border border-gold/40 shadow-elevated overflow-hidden animate-scale-in">
          {/* header */}
          <header className="flex items-center justify-between px-4 py-3 bg-bg-primary border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              {node !== "main" && (
                <button
                  onClick={() => goTo("main")}
                  aria-label="Back to main menu"
                  className="text-text-muted hover:text-gold mr-1 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <DukkahLogo height={20} className="text-gold" showTagline={false} />
              <span className="text-xs text-text-muted">· Concierge</span>
              <span className="ml-1 h-2 w-2 rounded-full bg-emerald-500" title="Online" />
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, mi) => (
              <div key={m.id} className="space-y-2">
                <div className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.sender === "user"
                        ? "bg-gold text-[var(--text-on-gold)] rounded-br-sm"
                        : "bg-bg-primary text-text-primary border border-border rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>

                {/* Only show options on the last message that has them */}
                {m.options && mi === messages.length - 1 && (
                  <div className="flex flex-wrap gap-1.5 pl-1">
                    {m.options.map((o) => (
                      <button
                        key={o.label}
                        onClick={() => onOption(o)}
                        className="rounded-full border border-gold/50 px-3 py-1.5 text-xs font-medium text-gold hover:bg-gold hover:text-[var(--text-on-gold)] transition-all active:scale-95"
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {busy && (
              <div className="flex justify-start">
                <div className="bg-bg-primary border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm">
                  <span className="inline-flex gap-1.5 items-center text-text-muted text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                    <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse [animation-delay:.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse [animation-delay:.4s]" />
                  </span>
                </div>
              </div>
            )}

            {messages.length > 10 && (
              <a
                href={`https://wa.me/${WA_NUMBER}?text=Hi+Dukkah%2C+I+have+a+question`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-4 py-2 text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Continue on WhatsApp
              </a>
            )}
          </div>

          {/* text input */}
          {showInput && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTextInput(input);
              }}
              className="flex items-center gap-2 p-3 border-t border-border bg-bg-primary shrink-0"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputPlaceholder[node] ?? "Type your answer…"}
                className="flex-1 rounded-full bg-bg-secondary border border-border px-4 py-2 text-sm outline-none focus:border-gold transition-colors"
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                className="h-9 w-9 rounded-full bg-gold text-[var(--text-on-gold)] flex items-center justify-center disabled:opacity-50 transition-opacity"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* back to menu footer (when not on main and not in text-input mode) */}
          {!showInput && node !== "main" && (
            <div className="p-3 border-t border-border bg-bg-primary shrink-0 text-center">
              <button
                onClick={() => goTo("main")}
                className="text-xs text-text-muted hover:text-gold transition-colors"
              >
                ↩ Back to main menu
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
