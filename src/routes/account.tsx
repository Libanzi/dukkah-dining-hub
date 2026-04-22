import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogIn, User, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
      setName((session?.user?.user_metadata?.full_name as string) ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email ?? null);
      setName((data.session?.user?.user_metadata?.full_name as string) ?? null);
      setLoading(false);
    });
  }, []);

  const signInGoogle = async () => {
    setErr(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/account",
    });
    if (result.error) setErr(result.error.message ?? "Google sign-in failed.");
  };

  if (loading) return <div className="min-h-screen grid place-items-center bg-bg-primary text-text-muted">Loading…</div>;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center px-5">
      <div className="w-full max-w-md rounded-2xl bg-bg-secondary border border-border p-8 shadow-elevated">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mb-3">
            <User className="h-6 w-6 text-gold" />
          </div>
          <h1 className="font-serif text-2xl font-semibold">My Dukkah</h1>
          <p className="text-sm text-text-muted mt-1">
            {email ? "Welcome back" : "Sign in to track your orders & reservations"}
          </p>
        </div>

        {email ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-bg-primary p-4 text-sm">
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Signed in as</p>
              <p className="font-semibold">{name ?? email}</p>
              <p className="text-xs text-text-muted">{email}</p>
            </div>
            <Link
              to="/"
              className="block w-full text-center rounded-full bg-gold py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)]"
            >
              <Sparkles className="inline h-4 w-4 mr-1.5" />
              Continue to Dukkah
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                nav({ to: "/account" });
              }}
              className="w-full rounded-full border border-border py-2.5 text-xs font-semibold text-text-muted hover:border-terracotta hover:text-terracotta"
            >
              Sign out
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={signInGoogle}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-semibold text-[var(--text-on-gold)] hover:bg-[var(--accent-gold-dark)]"
            >
              <GoogleIcon /> Continue with Google
            </button>
            {err && <p className="mt-3 text-sm text-terracotta text-center">{err}</p>}
            <p className="mt-6 text-xs text-text-muted text-center">
              By continuing you agree to our Terms & Privacy.
            </p>
            <div className="mt-6 pt-4 border-t border-border text-center">
              <Link to="/" className="text-xs text-text-muted hover:text-gold inline-flex items-center gap-1">
                <LogIn className="h-3 w-3 rotate-180" /> Back to homepage
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#fff" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.1 14.7 2 12 2 6.9 2 2.8 6.1 2.8 12s4.1 10 9.2 10c5.3 0 8.8-3.7 8.8-9 0-.6-.06-1.1-.16-1.6H12z"/>
    </svg>
  );
}
