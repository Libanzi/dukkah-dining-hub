import { useEffect, useState } from "react";
import { Loader2, Check, X, Mail, Phone, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  time: string;
  party_size: string;
  occasion: string | null;
  seating_preference: string | null;
  special_requests: string | null;
  admin_notes: string | null;
  status: string;
  created_at: string;
}

export function ReservationsAdmin() {
  const [rows, setRows] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reservations")
      .select("*")
      .order("date", { ascending: true })
      .order("time", { ascending: true });
    setRows((data as Reservation[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("reservations").update({ status }).eq("id", id);
    load();
  };

  const saveNote = async (id: string) => {
    setSavingNote(id);
    await supabase.from("reservations").update({ admin_notes: noteDraft[id] ?? "" }).eq("id", id);
    setSavingNote(null);
    load();
  };

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Reservations</h2>
          <p className="text-sm text-text-muted">{rows.length} total bookings</p>
        </div>
        <div className="flex gap-1 rounded-full bg-bg-secondary border border-border p-1 text-xs font-semibold">
          {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full capitalize ${
                filter === s ? "bg-gold text-[var(--text-on-gold)]" : "text-text-muted hover:text-text-primary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-text-muted py-16">No reservations found.</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => {
            const draft = noteDraft[r.id] ?? r.admin_notes ?? "";
            return (
              <article key={r.id} className="rounded-xl bg-bg-secondary border border-border p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{r.name}</h3>
                      <StatusBadge status={r.status} />
                      {r.occasion && r.occasion !== "—" && (
                        <span className="text-[10px] uppercase tracking-wider rounded-full bg-bg-tertiary px-2 py-0.5 text-text-muted">
                          {r.occasion}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gold mt-1">
                      {new Date(r.date).toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" })} at {r.time} • {r.party_size}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                      <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 hover:text-gold">
                        <Mail className="h-3 w-3" /> {r.email}
                      </a>
                      {r.phone && (
                        <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1 hover:text-gold">
                          <Phone className="h-3 w-3" /> {r.phone}
                        </a>
                      )}
                      <span>Seating: {r.seating_preference || "Any"}</span>
                    </div>
                    {r.special_requests && (
                      <p className="mt-2 text-xs text-text-secondary italic">Guest: "{r.special_requests}"</p>
                    )}

                    {/* Admin notes */}
                    <div className="mt-3 rounded-lg border border-dashed border-border bg-bg-primary/60 p-3">
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gold mb-1.5">
                        Internal notes
                      </label>
                      <textarea
                        value={draft}
                        onChange={(e) => setNoteDraft((d) => ({ ...d, [r.id]: e.target.value }))}
                        placeholder="Add an internal instruction (e.g. window table held, VIP guest, allergy)…"
                        rows={2}
                        className="w-full rounded-md bg-bg-secondary border border-border px-2.5 py-1.5 text-xs outline-none focus:border-gold resize-none"
                      />
                      <button
                        onClick={() => saveNote(r.id)}
                        disabled={savingNote === r.id || draft === (r.admin_notes ?? "")}
                        className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold/90 px-3 py-1 text-[11px] font-semibold text-[var(--text-on-gold)] hover:bg-gold disabled:opacity-50"
                      >
                        {savingNote === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                        Save note
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {r.status !== "confirmed" && (
                      <button
                        onClick={() => updateStatus(r.id, "confirmed")}
                        className="inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)]"
                      >
                        <Check className="h-3.5 w-3.5" /> Confirm
                      </button>
                    )}
                    {r.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(r.id, "cancelled")}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text-muted hover:border-terracotta hover:text-terracotta"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    confirmed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    cancelled: "bg-red-500/15 text-red-500 border-red-500/30",
  };
  return (
    <span className={`text-[10px] uppercase tracking-wider rounded-full border px-2 py-0.5 font-bold ${map[status] || "bg-bg-tertiary text-text-muted"}`}>
      {status}
    </span>
  );
}
