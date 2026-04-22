import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Lock, Mail, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAdminAuth, ADMIN_EMAIL } from "@/lib/admin/useAuth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const { isAdmin, loading, email: sessionEmail } = useAdminAuth();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && isAdmin) nav({ to: "/admin" });
  }, [isAdmin, loading, nav]);

  // If signed in but not the admin email, show explicit reject + sign out
  const wrongAccount = !loading && sessionEmail && sessionEmail !== ADMIN_EMAIL;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setErr(`Only ${ADMIN_EMAIL} can sign in here.`);
      setBusy(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }
    setBusy(false);
  };

  const signInGoogle = async () => {
    setErr(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin/login",
      extraParams: { login_hint: ADMIN_EMAIL, prompt: "select_account" },
    });
    if (result.error) setErr(result.error.message ?? "Google sign-in failed.");
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center px-5">
      <div className="w-full max-w-md rounded-2xl bg-bg-secondary border border-border p-8 shadow-elevated">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mb-3">
            <ShieldCheck className="h-6 w-6 text-gold" />
          </div>
          <h1 className="font-serif text-2xl font-semibold">Dukkah Admin</h1>
          <p className="text-sm text-text-muted mt-1">
            Restricted to <span className="text-gold font-mono">{ADMIN_EMAIL}</span>
          </p>
        </div>

        {wrongAccount && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-500 flex gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              You are signed in as <strong>{sessionEmail}</strong>, which is not the admin account.{" "}
              <button
                onClick={() => supabase.auth.signOut()}
                className="underline font-semibold hover:text-amber-400"
              >
                Sign out
              </button>{" "}
              and try again.
            </div>
          </div>
        )}

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

        <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-wider text-text-muted">
          <div className="h-px flex-1 bg-border" />
          <span>or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          onClick={signInGoogle}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border bg-bg-primary py-3 text-sm font-semibold hover:border-gold hover:text-gold"
        >
          <GoogleIcon /> Continue with Google
        </button>

        <p className="mt-6 text-xs text-text-muted text-center">
          Admin-only area. Only <span className="font-mono text-gold">{ADMIN_EMAIL}</span> is granted access.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.1 14.7 2 12 2 6.9 2 2.8 6.1 2.8 12s4.1 10 9.2 10c5.3 0 8.8-3.7 8.8-9 0-.6-.06-1.1-.16-1.6H12z"/>
    </svg>
  );
}
