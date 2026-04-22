import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, MapPin, Save, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  category?: string;
}
interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  order_type: string;
  delivery_address: string | null;
  special_instructions: string | null;
  admin_notes: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  status_updated_at: string | null;
  payment_status: string;
  created_at: string;
}

const STATUS_FLOW = ["received", "preparing", "ready", "out_for_delivery", "completed"] as const;
const ALL_STATUSES = [...STATUS_FLOW, "cancelled"] as const;

const statusColor: Record<string, string> = {
  received: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  preparing: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  ready: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  out_for_delivery: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

export function OrdersAdmin() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as unknown as Order[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    load();
  };

  const advance = async (o: Order) => {
    const idx = STATUS_FLOW.indexOf(o.status as (typeof STATUS_FLOW)[number]);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return;
    await updateStatus(o.id, STATUS_FLOW[idx + 1]);
  };

  const saveNote = async (id: string) => {
    setSavingNote(id);
    await supabase.from("orders").update({ admin_notes: noteDraft[id] ?? "" }).eq("id", id);
    setSavingNote(null);
    load();
  };

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Orders</h2>
          <p className="text-sm text-text-muted">
            {rows.length} total • R
            {rows.reduce((s, o) => s + Number(o.total), 0).toLocaleString()} revenue
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-full bg-bg-secondary border border-border px-4 py-2 text-xs font-semibold"
        >
          <option value="all">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-text-muted py-16">No orders found.</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((o) => {
            const draft = noteDraft[o.id] ?? o.admin_notes ?? "";
            const idx = STATUS_FLOW.indexOf(o.status as (typeof STATUS_FLOW)[number]);
            return (
              <article key={o.id} className="rounded-xl bg-bg-secondary border border-border p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold font-mono text-gold">{o.order_number}</h3>
                      <span className="text-[10px] uppercase tracking-wider rounded-full bg-bg-tertiary px-2 py-0.5 font-bold capitalize">
                        {o.order_type}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wider rounded-full border px-2 py-0.5 font-bold ${statusColor[o.status] ?? "bg-bg-tertiary text-text-muted"}`}>
                        {o.status.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-text-muted">
                        {new Date(o.created_at).toLocaleString("en-ZA")}
                      </span>
                    </div>

                    {/* Status timeline */}
                    {o.status !== "cancelled" && (
                      <div className="mt-3 flex items-center gap-1">
                        {STATUS_FLOW.map((s, i) => {
                          const reached = i <= idx;
                          return (
                            <div key={s} className="flex items-center gap-1 flex-1">
                              <div className={`h-1.5 flex-1 rounded-full ${reached ? "bg-gold" : "bg-bg-tertiary"}`} />
                              {i === STATUS_FLOW.length - 1 && (
                                <span className="text-[9px] uppercase tracking-wider text-text-muted ml-1 hidden sm:inline">
                                  {STATUS_FLOW[idx]?.replace(/_/g, " ") ?? "—"}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {o.status_updated_at && (
                      <p className="mt-1.5 text-[11px] text-text-muted inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Status updated {new Date(o.status_updated_at).toLocaleString("en-ZA")}
                      </p>
                    )}

                    <p className="font-semibold mt-2">{o.customer_name}</p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                      <a href={`mailto:${o.customer_email}`} className="inline-flex items-center gap-1 hover:text-gold">
                        <Mail className="h-3 w-3" /> {o.customer_email}
                      </a>
                      {o.customer_phone && (
                        <a href={`tel:${o.customer_phone}`} className="inline-flex items-center gap-1 hover:text-gold">
                          <Phone className="h-3 w-3" /> {o.customer_phone}
                        </a>
                      )}
                      {o.delivery_address && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {o.delivery_address}
                        </span>
                      )}
                    </div>
                    <ul className="mt-3 text-sm text-text-secondary space-y-0.5 border-t border-border pt-2">
                      {(o.items || []).map((it, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{it.qty}× {it.name}</span>
                          <span className="text-text-muted">R{(it.price * it.qty).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                    {o.special_instructions && (
                      <p className="mt-2 text-xs text-text-secondary italic">Customer: "{o.special_instructions}"</p>
                    )}

                    {/* Admin notes */}
                    <div className="mt-3 rounded-lg border border-dashed border-border bg-bg-primary/60 p-3">
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gold mb-1.5">
                        Internal notes
                      </label>
                      <textarea
                        value={draft}
                        onChange={(e) => setNoteDraft((d) => ({ ...d, [o.id]: e.target.value }))}
                        placeholder="Add an internal instruction (e.g. allergy, prep notes, driver instructions)…"
                        rows={2}
                        className="w-full rounded-md bg-bg-secondary border border-border px-2.5 py-1.5 text-xs outline-none focus:border-gold resize-none"
                      />
                      <button
                        onClick={() => saveNote(o.id)}
                        disabled={savingNote === o.id || draft === (o.admin_notes ?? "")}
                        className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold/90 px-3 py-1 text-[11px] font-semibold text-[var(--text-on-gold)] hover:bg-gold disabled:opacity-50"
                      >
                        {savingNote === o.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                        Save note
                      </button>
                    </div>
                  </div>

                  <div className="lg:w-52 shrink-0 space-y-2">
                    <div className="rounded-lg bg-bg-primary border border-border p-3">
                      <div className="flex justify-between text-xs text-text-muted">
                        <span>Subtotal</span><span>R{Number(o.subtotal).toLocaleString()}</span>
                      </div>
                      {Number(o.delivery_fee) > 0 && (
                        <div className="flex justify-between text-xs text-text-muted">
                          <span>Delivery</span><span>R{Number(o.delivery_fee).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-gold mt-1 pt-1 border-t border-border">
                        <span>Total</span><span>R{Number(o.total).toLocaleString()}</span>
                      </div>
                    </div>
                    {idx >= 0 && idx < STATUS_FLOW.length - 1 && (
                      <button
                        onClick={() => advance(o)}
                        className="w-full rounded-lg bg-gold py-2 text-xs font-bold uppercase tracking-wider text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)]"
                      >
                        → {STATUS_FLOW[idx + 1].replace(/_/g, " ")}
                      </button>
                    )}
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="w-full rounded-lg bg-bg-primary border border-border px-3 py-2 text-xs font-semibold capitalize"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                      ))}
                    </select>
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
