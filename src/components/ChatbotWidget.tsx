import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, ExternalLink, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DukkahLogo } from "./DukkahLogo";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

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
}
type NodeId =
  | "main"
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
  | "menu.intro"
  | "hours"
  | "events"
  | "delivery"
  | "enquiry.intro"
  | "enquiry.name"
  | "enquiry.email"
  | "enquiry.message"
  | "enquiry.confirm"
  | "enquiry.done";

interface BookingDraft {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  party_size?: string;
}

const WA_NUMBER = "27000000000"; // replace with real number
const IDLE_RESET_MS = 3 * 60 * 1000; // back to main menu after 3 min inactivity

/* -------------------------------------------------------------------------- */
/*  Validation helpers                                                        */
/* -------------------------------------------------------------------------- */

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v));
const isTime = (v: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);

/* -------------------------------------------------------------------------- */
/*  Widget                                                                    */
/* -------------------------------------------------------------------------- */

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [node, setNode] = useState<NodeId>("main");
  const [draft, setDraft] = useState<BookingDraft>({});
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------- helpers ---------- */
  const push = (m: Omit<ChatMessage, "id">) =>
    setMessages((prev) => [...prev, { ...m, id: crypto.randomUUID() }]);

  const botSay = (text: string, options?: Option[]) =>
    push({ sender: "bot", text, options });

  const userSay = (text: string) => push({ sender: "user", text });

  const resetIdle = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (node !== "main") {
        botSay("Still there? I'll bring you back to the main menu.");
        goTo("main");
      }
    }, IDLE_RESET_MS);
  };

  const goTo = (n: NodeId, extra?: Partial<BookingDraft>) => {
    if (extra) setDraft((d) => ({ ...d, ...extra }));
    setNode(n);
  };

  /* ---------- node renderer ---------- */
  const enterNode = (n: NodeId, currentDraft: BookingDraft) => {
    switch (n) {
      case "main":
        setDraft({});
        botSay("Hi, I'm the Dukkah Concierge. What can I help you with today?", [
          { label: "🍽️ Book a table", next: "book.intro" },
          { label: "📋 Today's menu", next: "menu.intro" },
          { label: "🕒 Opening hours", next: "hours" },
          { label: "🎷 Events this week", next: "events" },
          { label: "🛵 Delivery", next: "delivery" },
          { label: "✉️ Send an enquiry", next: "enquiry.intro" },
        ]);
        break;

      /* ---- BOOKING ---- */
      case "book.intro":
        botSay("Lovely. Would you like me to book on your behalf, or send you to the booking page?", [
          { label: "🤖 Bot — book for me", next: "book.assist.name" },
          { label: "📝 Take me to the form", next: "book.redirect" },
          { label: "↩ Back", next: "main" },
        ]);
        break;
      case "book.redirect":
        botSay("Opening the reservation form for you now…");
        setTimeout(() => {
          document.getElementById("reservations")?.scrollIntoView({ behavior: "smooth" });
          goTo("main");
        }, 600);
        break;
      case "book.assist.name":
        botSay("Great — what name should the booking be under?");
        break;
      case "book.assist.email":
        botSay("Thanks. What's the best email for the confirmation?");
        break;
      case "book.assist.phone":
        botSay("And a contact phone number? (Type 'skip' to leave blank.)");
        break;
      case "book.assist.date":
        botSay("Which date would you like? Use format YYYY-MM-DD (e.g. 2026-05-12).");
        break;
      case "book.assist.time":
        botSay("What time? Use 24-hour HH:MM (we serve 12:00–22:00, until 23:00 Fri/Sat).");
        break;
      case "book.assist.party":
        botSay("How many guests?", [
          { label: "1–2", next: "book.assist.confirm" },
          { label: "3–4", next: "book.assist.confirm" },
          { label: "5–6", next: "book.assist.confirm" },
          { label: "7–10", next: "book.assist.confirm" },
        ]);
        break;
      case "book.assist.confirm":
        botSay(
          `Please confirm:\n\n• ${currentDraft.name}\n• ${currentDraft.email}\n• ${currentDraft.phone || "no phone"}\n• ${currentDraft.date} at ${currentDraft.time}\n• Party of ${currentDraft.party_size}`,
          [
            { label: "✅ Confirm & book", next: "book.done" },
            { label: "↩ Start over", next: "book.intro" },
          ],
        );
        break;
      case "book.done":
        submitBooking(currentDraft);
        break;

      /* ---- INFO ---- */
      case "menu.intro":
        botSay("Our menu blends Cape Malay spice, smoky braai and African seafood. Highlights:\n\n• Slow-braised lamb shank\n• Dukkah-crusted kingklip\n• Mushroom & spinach bunny chow (v)\n• 80+ cocktails", [
          { label: "📖 Open full menu", next: "main", hint: "menu" },
          { label: "🍽️ Book a table", next: "book.intro" },
          { label: "↩ Main menu", next: "main" },
        ]);
        break;
      case "hours":
        botSay("We're open:\n• Tue–Thu  12:00–22:00\n• Fri–Sat  12:00–23:00\n• Sun       12:00–21:00\n• Mon       Closed", [
          { label: "🍽️ Book a table", next: "book.intro" },
          { label: "↩ Main menu", next: "main" },
        ]);
        break;
      case "events":
        botSay("This week at Dukkah:\n• Fri — Live Jazz, 20:00\n• Sat — Afrobeat Night, 20:00\n• Sun — Brunch Jazz, 11:00–15:00", [
          { label: "🎟️ See & book events", next: "main", hint: "events" },
          { label: "↩ Main menu", next: "main" },
        ]);
        break;
      case "delivery":
        botSay("We deliver within 10 km of 59 Florida Road. Order online and we'll calculate fees from your live location.", [
          { label: "🛵 Order now", next: "main", hint: "order" },
          { label: "↩ Main menu", next: "main" },
        ]);
        break;

      /* ---- ENQUIRY ---- */
      case "enquiry.intro":
        botSay("Sure — would you like me to send your enquiry to our admin team? They usually reply within a business day.", [
          { label: "✅ Yes, send to admin", next: "enquiry.name" },
          { label: "↩ Back", next: "main" },
        ]);
        break;
      case "enquiry.name":
        botSay("What's your name?");
        break;
      case "enquiry.email":
        botSay("And your email?");
        break;
      case "enquiry.message":
        botSay("In a sentence or two, how can we help?");
        break;
      case "enquiry.confirm":
        botSay(
          `Ready to send:\n\n• ${currentDraft.name}\n• ${currentDraft.email}\n• "${(currentDraft as any).message}"`,
          [
            { label: "📤 Send to admin", next: "enquiry.done" },
            { label: "↩ Cancel", next: "main" },
          ],
        );
        break;
      case "enquiry.done":
        submitEnquiry(currentDraft);
        break;
    }
  };

  /* ---------- DB writes ---------- */
  const submitBooking = async (d: BookingDraft) => {
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
      botSay("Sorry — I couldn't save that booking. Please try the reservation form below or call 031 XXX XXXX.", [
        { label: "📝 Open form", next: "book.redirect" },
        { label: "↩ Main menu", next: "main" },
      ]);
      return;
    }
    botSay(
      `🎉 Booked! A confirmation will be sent to ${d.email}. Opening your bookings now…`,
      [{ label: "↩ Main menu", next: "main" }],
    );
    setTimeout(() => {
      window.location.href = "/account#reservations";
    }, 1800);
  };

  const submitEnquiry = async (d: BookingDraft & { message?: string }) => {
    setBusy(true);
    const { error } = await supabase.from("private_dining_enquiries").insert({
      name: d.name!,
      email: d.email!,
      message: d.message || "(no message)",
      event_type: "General enquiry (via bot)",
    });
    setBusy(false);
    if (error) {
      botSay("Sorry — I couldn't send that. Please email admin@dukkah.co.za directly.", [
        { label: "↩ Main menu", next: "main" },
      ]);
      return;
    }
    botSay(`✅ Sent! Our admin team will reply to ${d.email} shortly. Returning to main menu…`);
    setTimeout(() => goTo("main"), 2200);
  };

  /* ---------- option click ---------- */
  const onOption = (opt: Option) => {
    userSay(opt.label);
    resetIdle();
    // hint = scroll-to-section instead of in-bot flow
    if (opt.hint) {
      const id = opt.hint;
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 200);
    }
    setNode(opt.next);
  };

  /* ---------- text input handler (for booking & enquiry steps) ---------- */
  const handleTextInput = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    userSay(value);
    setInput("");
    resetIdle();

    switch (node) {
      case "book.assist.name":
        if (value.length < 2) return botSay("Please share your full name.");
        setDraft((d) => ({ ...d, name: value }));
        return setNode("book.assist.email");
      case "book.assist.email":
        if (!isEmail(value)) return botSay("Hmm, that doesn't look like a valid email — try again.");
        setDraft((d) => ({ ...d, email: value }));
        return setNode("book.assist.phone");
      case "book.assist.phone":
        setDraft((d) => ({ ...d, phone: value.toLowerCase() === "skip" ? "" : value }));
        return setNode("book.assist.date");
      case "book.assist.date":
        if (!isDate(value)) return botSay("Please use format YYYY-MM-DD, e.g. 2026-05-12.");
        setDraft((d) => ({ ...d, date: value }));
        return setNode("book.assist.time");
      case "book.assist.time":
        if (!isTime(value)) return botSay("Please use HH:MM in 24-hour format, e.g. 19:30.");
        setDraft((d) => ({ ...d, time: value }));
        return setNode("book.assist.party");

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
        setDraft((d) => ({ ...d, message: value } as any));
        return setNode("enquiry.confirm");

      default:
        botSay("I'm a menu-driven concierge — please tap one of the options above. Or hit Back to return to the main menu.", [
          { label: "↩ Main menu", next: "main" },
        ]);
    }
  };

  /* ---------- effects ---------- */
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

  useEffect(() => () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
  }, []);

  /* ---------- whether to show the text input ---------- */
  const expectsText =
    node.startsWith("book.assist.") &&
    !["book.assist.party", "book.assist.confirm"].includes(node);
  const expectsEnquiryText = ["enquiry.name", "enquiry.email", "enquiry.message"].includes(node);
  const showInput = expectsText || expectsEnquiryText;

  /* ---------- render ---------- */
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
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[380px] sm:h-[600px] flex flex-col bg-bg-secondary sm:rounded-2xl border border-gold/40 shadow-elevated overflow-hidden animate-scale-in">
          <header className="flex items-center justify-between px-4 py-3 bg-bg-primary border-b border-border">
            <div className="flex items-center gap-2">
              {node !== "main" && (
                <button
                  onClick={() => goTo("main")}
                  aria-label="Back to main menu"
                  className="text-text-muted hover:text-gold mr-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <DukkahLogo height={20} className="text-gold" showTagline={false} />
              <span className="text-xs text-text-muted">· Concierge</span>
              <span className="ml-1 h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-text-muted hover:text-text-primary">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="space-y-2">
                <div className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.sender === "user"
                        ? "bg-gold text-[var(--text-on-gold)]"
                        : "bg-bg-tertiary text-text-primary"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
                {m.options && m === messages[messages.length - 1] && (
                  <div className="flex flex-wrap gap-2">
                    {m.options.map((o) => (
                      <button
                        key={o.label}
                        onClick={() => onOption(o)}
                        className="rounded-full border border-gold/40 px-3 py-1.5 text-xs text-gold hover:bg-gold hover:text-[var(--text-on-gold)] transition-all"
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
                <div className="bg-bg-tertiary rounded-2xl px-3.5 py-2 text-sm text-text-muted">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-pulse" />
                    <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-pulse [animation-delay:.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-pulse [animation-delay:.4s]" />
                  </span>
                </div>
              </div>
            )}

            {messages.length > 10 && (
              <a
                href={`https://wa.me/${WA_NUMBER}?text=Hi+Dukkah%2C+I+have+a+question`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-4 py-2 text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Chat on WhatsApp
              </a>
            )}
          </div>

          {showInput && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTextInput(input);
              }}
              className="flex items-center gap-2 p-3 border-t border-border bg-bg-primary"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer…"
                className="flex-1 rounded-full bg-bg-secondary border border-border px-4 py-2 text-sm outline-none focus:border-gold"
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                className="h-9 w-9 rounded-full bg-gold text-[var(--text-on-gold)] flex items-center justify-center disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}

          {!showInput && node !== "main" && (
            <div className="p-3 border-t border-border bg-bg-primary text-center">
              <button
                onClick={() => goTo("main")}
                className="text-xs text-text-muted hover:text-gold"
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
