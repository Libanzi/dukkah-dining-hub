import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_date: string | null;
  event_type: string | null;
  guest_count: number | null;
  budget_range: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export function EnquiriesAdmin() {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("private_dining_enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as Enquiry[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("private_dining_enquiries").update({ status }).eq("id", id);
    load();
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-serif text-2xl font-semibold">Private Dining Enquiries</h2>
        <p className="text-sm text-text-muted">{rows.length} enquiries</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
      ) : rows.length === 0 ? (
        <p className="text-center text-text-muted py-16">No enquiries yet.</p>
      ) : (
        <div className="grid gap-3">
          {rows.map((e) => (
            <article key={e.id} className="rounded-xl bg-bg-secondary border border-border p-4 sm:p-5">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{e.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider rounded-full bg-bg-tertiary px-2 py-0.5 font-bold text-text-muted">
                      {e.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                    <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1 hover:text-gold"><Mail className="h-3 w-3" /> {e.email}</a>
                    {e.phone && <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1 hover:text-gold"><Phone className="h-3 w-3" /> {e.phone}</a>}
                    {e.guest_count && <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {e.guest_count} guests</span>}
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">
                    {e.event_type || "Event"}
                    {e.event_date && ` • ${new Date(e.event_date).toLocaleDateString("en-ZA")}`}
                    {e.budget_range && ` • ${e.budget_range}`}
                  </p>
                  {e.message && (
                    <p className="mt-2 text-sm text-text-secondary italic border-l-2 border-gold/40 pl-3">"{e.message}"</p>
                  )}
                </div>
                <select
                  value={e.status}
                  onChange={(ev) => setStatus(e.id, ev.target.value)}
                  className="rounded-lg bg-bg-primary border border-border px-3 py-2 text-xs font-semibold"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="booked">Booked</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
