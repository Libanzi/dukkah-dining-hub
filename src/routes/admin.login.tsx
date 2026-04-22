import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/lib/admin/useAuth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const { isAdmin, loading } = useAdminAuth();
  const [email, setEmail] = useState("admin@dukkah.co.za");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && isAdmin) nav({ to: "/admin" });
  }, [isAdmin, loading, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }
    // redirect handled by effect once admin role check resolves
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center px-5">
      <div className="w-full max-w-md rounded-2xl bg-bg-secondary border border-border p-8 shadow-elevated">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mb-3">
            <ShieldCheck className="h-6 w-6 text-gold" />
          </div>
          <h1 className="font-serif text-2xl font-semibold">Dukkah Admin</h1>
          <p className="text-sm text-text-muted mt-1">Sign in to manage the restaurant</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
              Email
            </span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-bg-primary border border-border pl-9 pr-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </label>
          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
              Password
            </span>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-bg-primary border border-border pl-9 pr-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </label>
          {err && <p className="text-sm text-terracotta">{err}</p>}
          <button
            disabled={busy}
            className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)] disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-xs text-text-muted text-center">
          Admin-only area. Unauthorized access is logged.
        </p>
      </div>
    </div>
  );
}
