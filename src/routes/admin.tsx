import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, ShieldCheck, CalendarDays, ShoppingBag, Sparkles, MessageCircle, Loader2 } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/useAuth";
import { ReservationsAdmin } from "@/components/admin/ReservationsAdmin";
import { OrdersAdmin } from "@/components/admin/OrdersAdmin";
import { EventsAdmin } from "@/components/admin/EventsAdmin";
import { EnquiriesAdmin } from "@/components/admin/EnquiriesAdmin";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Tab = "reservations" | "orders" | "events" | "enquiries";

function AdminPage() {
  const { loading, isAdmin, email, userId, signOut } = useAdminAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("reservations");

  useEffect(() => {
    if (!loading && (!userId || !isAdmin)) {
      nav({ to: "/admin/login" });
    }
  }, [loading, userId, isAdmin, nav]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-muted">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
    { id: "reservations", label: "Reservations", icon: CalendarDays },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "events", label: "Events", icon: Sparkles },
    { id: "enquiries", label: "Enquiries", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <header className="sticky top-0 z-30 border-b border-border bg-bg-primary/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-gold" />
            <span className="font-serif text-lg font-semibold">
              Dukkah <span className="text-gold">Admin</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-text-muted">{email}</span>
            <button
              onClick={async () => {
                await signOut();
                nav({ to: "/admin/login" });
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-gold hover:text-gold"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-5 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative inline-flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                    active ? "text-gold" : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                  {active && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold" />}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {tab === "reservations" && <ReservationsAdmin />}
        {tab === "orders" && <OrdersAdmin />}
        {tab === "events" && <EventsAdmin />}
        {tab === "enquiries" && <EnquiriesAdmin />}
      </main>
    </div>
  );
}
