import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, ExternalLink } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { dukkahChat } from "@/server/chat";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_REPLIES = [
  "Book a table",
  "Today's menu",
  "Opening hours",
  "Events this week",
];

const WA_NUMBER = "27000000000"; // placeholder

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatFn = useServerFn(dukkahChat);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi there! I'm the Dukkah Concierge. How can I help today?",
        },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const newMsgs: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await chatFn({
        data: { message: trimmed, history: newMsgs.slice(-10) },
      });
      setMessages([...newMsgs, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...newMsgs,
        { role: "assistant", content: "Sorry, something went wrong. Please try again or contact us on WhatsApp." },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[380px] sm:h-[560px] flex flex-col bg-bg-secondary sm:rounded-2xl border border-gold/40 shadow-elevated overflow-hidden animate-scale-in">
          <header className="flex items-center justify-between px-4 py-3 bg-bg-primary border-b border-border">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-semibold text-gold">DUKKAH</span>
              <span className="text-xs text-text-muted">· Concierge</span>
              <span className="ml-2 h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-text-muted hover:text-text-primary">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gold text-[var(--text-on-gold)]"
                      : "bg-bg-tertiary text-text-primary"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
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

            {messages.length <= 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-gold/40 px-3 py-1.5 text-xs text-gold hover:bg-gold hover:text-[var(--text-on-gold)] transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.length > 6 && (
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 p-3 border-t border-border bg-bg-primary"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Dukkah anything…"
              className="flex-1 rounded-full bg-bg-secondary border border-border px-4 py-2 text-sm outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="h-9 w-9 rounded-full bg-gold text-[var(--text-on-gold)] flex items-center justify-center disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
