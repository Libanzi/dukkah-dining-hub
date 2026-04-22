import { useEffect, useMemo, useState } from "react";
import { Loader2, Check, X, Mail, Phone, Save, Search, Clock, FileText, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RESERVATION_NOTE_TEMPLATES } from "@/lib/admin/noteTemplates";

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

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled";
type SeatingFilter = "all" | "Indoor" | "Outdoor" | "Bar" | "Any";

export function ReservationsAdmin() {
  const [rows, setRows] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [seatingFilter, setSeatingFilter] = useState<SeatingFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<string | null>(null);
  const [openTimeline, setOpenTimeline] = useState<Record<string, boolean>>({});

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

  const insertTemplate = (id: string, current: string, snippet: string) => {
    const sep = current && !current.endsWith("\n") ? "\n" : "";
    setNoteDraft((d) => ({ ...d, [id]: `${current}${sep}${snippet}` }));
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (seatingFilter !== "all" && (r.seating_preference || "Any") !== seatingFilter) return false;
      if (dateFrom && r.date < dateFrom) return false;
      if (dateTo && r.date > dateTo) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${r.name} ${r.email} ${r.phone ?? ""} ${r.special_requests ?? ""} ${r.admin_notes ?? ""} ${r.occasion ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, filter, seatingFilter, dateFrom, dateTo, search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Reservations</h2>
          <p className="text-sm text-text-muted">
            {filtered.length} of {rows.length} bookings
          </p>
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

      {/* Filter bar */}
      <div className="mb-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 rounded-xl bg-bg-secondary border border-border p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, notes…"
            className="w-full rounded-md bg-bg-primary border border-border pl-8 pr-2 py-1.5 text-xs outline-none focus:border-gold"
          />
        </div>
        <select
          value={seatingFilter}
          onChange={(e) => setSeatingFilter(e.target.value as SeatingFilter)}
          className="rounded-md bg-bg-primary border border-border px-2 py-1.5 text-xs"
        >
          <option value="all">All seating</option>
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Bar">Bar</option>
          <option value="Any">Any</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-md bg-bg-primary border border-border px-2 py-1.5 text-xs"
          aria-label="From date"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-md bg-bg-primary border border-border px-2 py-1.5 text-xs"
          aria-label="To date"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-text-muted py-16">No reservations match your filters.</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => {
            const draft = noteDraft[r.id] ?? r.admin_notes ?? "";
            const showTimeline = openTimeline[r.id];
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
                      <div className="flex flex-wrap gap-1 mb-2">
                        {RESERVATION_NOTE_TEMPLATES.map((t) => (
                          <button
                            key={t.label}
                            type="button"
                            onClick={() => insertTemplate(r.id, draft, t.text)}
                            className="rounded-full bg-bg-tertiary hover:bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-text-secondary"
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={draft}
                        onChange={(e) => setNoteDraft((d) => ({ ...d, [r.id]: e.target.value }))}
                        placeholder="Add an internal instruction (e.g. window table held, VIP guest, allergy)…"
                        rows={2}
                        className="w-full rounded-md bg-bg-secondary border border-border px-2.5 py-1.5 text-xs outline-none focus:border-gold resize-none"
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => saveNote(r.id)}
                          disabled={savingNote === r.id || draft === (r.admin_notes ?? "")}
                          className="inline-flex items-center gap-1 rounded-full bg-gold/90 px-3 py-1 text-[11px] font-semibold text-[var(--text-on-gold)] hover:bg-gold disabled:opacity-50"
                        >
                          {savingNote === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                          Save note
                        </button>
                        <button
                          onClick={() => setOpenTimeline((o) => ({ ...o, [r.id]: !o[r.id] }))}
                          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[11px] font-semibold text-text-muted hover:border-gold hover:text-gold"
                        >
                          <Clock className="h-3 w-3" />
                          {showTimeline ? "Hide" : "Show"} timeline
                        </button>
                      </div>
                    </div>

                    {/* Timeline */}
                    {showTimeline && <ReservationTimeline reservation={r} />}
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

function ReservationTimeline({ reservation }: { reservation: Reservation }) {
  const events: { ts: string; icon: typeof Clock; label: string; detail?: string }[] = [];
  events.push({
    ts: reservation.created_at,
    icon: FileText,
    label: "Reservation created",
    detail: `${reservation.party_size} • ${new Date(reservation.date).toLocaleDateString("en-ZA")} ${reservation.time}`,
  });
  if (reservation.special_requests) {
    events.push({ ts: reservation.created_at, icon: FileText, label: "Guest request", detail: reservation.special_requests });
  }
  if (reservation.admin_notes) {
    events.push({ ts: reservation.created_at, icon: FileText, label: "Internal note added", detail: reservation.admin_notes });
  }
  if (reservation.status !== "pending") {
    events.push({
      ts: reservation.created_at,
      icon: CheckCircle2,
      label: `Status: ${reservation.status}`,
    });
  }

  return (
    <ol className="mt-3 border-l-2 border-gold/30 pl-4 space-y-2.5">
      {events.map((e, i) => {
        const Icon = e.icon;
        return (
          <li key={i} className="relative">
            <span className="absolute -left-[22px] top-0.5 h-3 w-3 rounded-full bg-gold ring-2 ring-bg-secondary" />
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-primary">
              <Icon className="h-3 w-3 text-gold" />
              {e.label}
              <span className="text-text-muted font-normal ml-auto">
                {new Date(e.ts).toLocaleString("en-ZA", { dateStyle: "short", timeStyle: "short" })}
              </span>
            </div>
            {e.detail && <p className="text-[11px] text-text-muted mt-0.5">{e.detail}</p>}
          </li>
        );
      })}
    </ol>
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
