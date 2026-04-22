import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Calendar } from "lucide-react";
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
  is_active: boolean;
  image_url: string | null;
  max_tickets: number | null;
  tickets_sold: number;
}

export function EventsAdmin() {
  const [rows, setRows] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    setRows((data as Event[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    load();
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    await supabase.from("events").update({ is_active: !is_active }).eq("id", id);
    load();
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const is_free = fd.get("is_free") === "on";
    const payload = {
      name: String(fd.get("name") || "").trim(),
      description: String(fd.get("description") || "").trim() || null,
      event_date: String(fd.get("event_date") || ""),
      start_time: String(fd.get("start_time") || ""),
      end_time: String(fd.get("end_time") || "") || null,
      ticket_price: is_free ? 0 : Number(fd.get("ticket_price") || 0),
      is_free,
      is_active: true,
      image_url: String(fd.get("image_url") || "").trim() || null,
      max_tickets: fd.get("max_tickets") ? Number(fd.get("max_tickets")) : null,
    };
    const { error } = await supabase.from("events").insert(payload);
    if (!error) {
      setShowForm(false);
      load();
    } else {
      alert(error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Events</h2>
          <p className="text-sm text-text-muted">{rows.length} events</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)]"
        >
          <Plus className="h-3.5 w-3.5" /> {showForm ? "Cancel" : "New event"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 rounded-xl bg-bg-secondary border border-border p-5 grid gap-3 sm:grid-cols-2">
          <input name="name" required placeholder="Event name *" className={input} />
          <input name="image_url" placeholder="Image URL (e.g. /photos/event-1.webp)" className={input} />
          <input name="event_date" type="date" required className={input} />
          <div className="grid grid-cols-2 gap-3">
            <input name="start_time" required placeholder="Start (e.g. 19:00) *" className={input} />
            <input name="end_time" placeholder="End (optional)" className={input} />
          </div>
          <input name="ticket_price" type="number" min="0" step="0.01" placeholder="Ticket price (R)" className={input} />
          <input name="max_tickets" type="number" min="0" placeholder="Max tickets (optional)" className={input} />
          <textarea name="description" rows={3} placeholder="Description" className={`${input} sm:col-span-2`} />
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" name="is_free" /> Free event
          </label>
          <button className="sm:col-span-2 rounded-full bg-gold py-2.5 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)]">
            Create event
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
      ) : rows.length === 0 ? (
        <p className="text-center text-text-muted py-16">No events yet.</p>
      ) : (
        <div className="grid gap-3">
          {rows.map((ev) => (
            <article key={ev.id} className="rounded-xl bg-bg-secondary border border-border p-4 flex items-center gap-4">
              <div className="h-14 w-14 rounded-lg bg-bg-tertiary flex items-center justify-center shrink-0">
                <Calendar className="h-6 w-6 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{ev.name}</h3>
                <p className="text-xs text-text-muted">
                  {new Date(ev.event_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })} • {ev.start_time}
                  {ev.is_free ? " • Free" : ` • R${ev.ticket_price}`}
                </p>
              </div>
              <button
                onClick={() => toggleActive(ev.id, ev.is_active)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  ev.is_active ? "border-emerald-500/40 text-emerald-500" : "border-border text-text-muted"
                }`}
              >
                {ev.is_active ? "Active" : "Hidden"}
              </button>
              <button
                onClick={() => remove(ev.id)}
                className="text-text-muted hover:text-terracotta"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const input = "rounded-lg bg-bg-primary border border-border px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";
