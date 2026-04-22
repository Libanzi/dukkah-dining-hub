import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, MapPin } from "lucide-react";
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
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
}

const STATUSES = ["received", "preparing", "ready", "out_for_delivery", "completed", "cancelled"];

export function OrdersAdmin() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

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
          {STATUSES.map((s) => (
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
          {filtered.map((o) => (
            <article key={o.id} className="rounded-xl bg-bg-secondary border border-border p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4 justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold font-mono text-gold">{o.order_number}</h3>
                    <span className="text-[10px] uppercase tracking-wider rounded-full bg-bg-tertiary px-2 py-0.5 font-bold">
                      {o.order_type}
                    </span>
                    <span className="text-xs text-text-muted">
                      {new Date(o.created_at).toLocaleString("en-ZA")}
                    </span>
                  </div>
                  <p className="font-semibold mt-1">{o.customer_name}</p>
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
                    {(o.items || []).map((it, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{it.qty}× {it.name}</span>
                        <span className="text-text-muted">R{(it.price * it.qty).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                  {o.special_instructions && (
                    <p className="mt-2 text-xs text-text-secondary italic">"{o.special_instructions}"</p>
                  )}
                </div>
                <div className="lg:w-48 shrink-0 space-y-2">
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
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="w-full rounded-lg bg-bg-primary border border-border px-3 py-2 text-xs font-semibold capitalize"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
