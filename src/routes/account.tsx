import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Loader2,
  LogOut,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CalendarDays,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

interface Reservation {
  id: string;
  date: string;
  time: string;
  party_size: string;
  status: string;
  created_at: string;
}
interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  status_updated_at: string | null;
  order_type: string;
}

function AccountPage() {
  const nav = useNavigate();
  const [session, setSession] = useState<{
    email: string;
    name: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_e, s) => {
      if (s?.user?.email) {
        setSession({
          email: s.user.email,
          name: (s.user.user_metadata?.full_name as string) ?? null,
        });
      } else {
        setSession(null);
      }
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) {
        setSession({
          email: data.session.user.email,
          name: (data.session.user.user_metadata?.full_name as string) ?? null,
        });
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-bg-primary text-text-muted">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (session) {
    return (
      <Dashboard
        email={session.email}
        name={session.name}
        onSignOut={async () => {
          await supabase.auth.signOut();
          nav({ to: "/account" });
        }}
      />
    );
  }

  return <AuthScreen />;
}

/* -------------------------------------------------------------------------- */
/* Auth screen — full-bleed Dukkah hero with frosted glass form               */
/* -------------------------------------------------------------------------- */

type Mode = "signin" | "signup";

function AuthScreen() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const signInGoogle = async () => {
    setErr(null);
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/account",
    });
    if (result.error) {
      setErr(result.error.message ?? "Google sign-in failed.");
      setBusy(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/account",
          data: { full_name: name || null },
        },
      });
      if (error) setErr(error.message);
      else
        setInfo(
          "Check your inbox to verify your email, then sign in below.",
        );
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setErr(error.message);
    }
    setBusy(false);
  };

  const forgot = async () => {
    if (!email) {
      setErr("Enter your email above first.");
      return;
    }
    setErr(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/account",
    });
    if (error) setErr(error.message);
    else setInfo("Password reset link sent. Check your inbox.");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background image */}
      <img
        src="/photos/interior-1.webp"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.18),transparent_55%)]" />

      {/* Top bar */}
      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dukkah
        </Link>
        <div className="flex items-center gap-1 font-serif text-xl text-white">
          <span className="text-[hsl(45,65%,55%)]">DUKK</span>
          <span className="inline-block h-1.5 w-1.5 rotate-45 bg-[hsl(15,55%,55%)]" />
          <span className="text-[hsl(45,65%,55%)]">AH</span>
        </div>
      </div>

      {/* Card */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-5 pb-10">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-2xl sm:p-9">
          <div className="mb-6 text-center">
            <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1.5 text-sm text-white/60">
              {mode === "signin"
                ? "Sign in to manage your reservations & orders."
                : "Join Dukkah to book tables and order online."}
            </p>
          </div>

          <button
            onClick={signInGoogle}
            disabled={busy}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-white/95 disabled:opacity-60"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-white/40">
            <span className="h-px flex-1 bg-white/15" />
            or with email
            <span className="h-px flex-1 bg-white/15" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <Field
                icon={null}
                type="text"
                placeholder="Full name"
                value={name}
                onChange={setName}
                required
              />
            )}
            <Field
              icon={Mail}
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={setEmail}
              required
            />
            <div className="relative">
              <Field
                icon={Lock}
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={setPassword}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {mode === "signin" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={forgot}
                  className="text-xs text-white/60 hover:text-[hsl(45,65%,65%)]"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {err && (
              <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {err}
              </p>
            )}
            {info && (
              <p className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-semibold text-[var(--text-on-gold)] transition hover:bg-[var(--accent-gold-dark)] disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-white/60">
            {mode === "signin" ? "New here? " : "Already have an account? "}
            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setErr(null);
                setInfo(null);
              }}
              className="font-semibold text-[hsl(45,65%,65%)] hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>

          <p className="mt-5 text-center text-[11px] text-white/40">
            By continuing you agree to our Terms & Privacy.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  required,
  minLength,
}: {
  icon: React.ElementType | null;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className={`w-full rounded-lg border border-white/15 bg-white/[0.04] py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-[hsl(45,65%,55%)] focus:bg-white/[0.08] ${Icon ? "pl-10 pr-3" : "px-3"}`}
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Customer dashboard — reservations + orders with status badges              */
/* -------------------------------------------------------------------------- */

function Dashboard({
  email,
  name,
  onSignOut,
}: {
  email: string;
  name: string | null;
  onSignOut: () => void;
}) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [resR, ordR] = await Promise.all([
        supabase
          .from("reservations")
          .select("id,date,time,party_size,status,created_at")
          .eq("email", email)
          .order("date", { ascending: false }),
        supabase
          .from("orders")
          .select(
            "id,order_number,status,total,created_at,status_updated_at,order_type",
          )
          .eq("customer_email", email)
          .order("created_at", { ascending: false }),
      ]);
      setReservations((resR.data as Reservation[]) || []);
      setOrders((ordR.data as Order[]) || []);
      setLoading(false);
    })();
  }, [email]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <header className="border-b border-border bg-bg-primary/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to Dukkah
          </Link>
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text-muted hover:border-terracotta hover:text-terracotta"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <section className="mb-8">
          <p className="eyebrow">My Account</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold">
            Welcome{name ? `, ${name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-text-muted">{email}</p>
        </section>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <Panel
              icon={CalendarDays}
              title="Reservations"
              empty="No reservations yet."
              ctaTo="/"
              ctaHash="#reservations"
              ctaLabel="Book a table"
              count={reservations.length}
            >
              {reservations.map((r) => (
                <article
                  key={r.id}
                  className="rounded-xl border border-border bg-bg-secondary p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gold">
                      {new Date(r.date).toLocaleDateString("en-ZA", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      • {r.time}
                    </p>
                    <ResStatusBadge status={r.status} />
                  </div>
                  <p className="mt-1 text-xs text-text-muted">
                    Party of {r.party_size} • Booked{" "}
                    {new Date(r.created_at).toLocaleDateString("en-ZA")}
                  </p>
                </article>
              ))}
            </Panel>

            <Panel
              icon={ShoppingBag}
              title="Orders"
              empty="No orders yet."
              ctaTo="/"
              ctaHash="#order"
              ctaLabel="Order online"
              count={orders.length}
            >
              {orders.map((o) => (
                <article
                  key={o.id}
                  className="rounded-xl border border-border bg-bg-secondary p-4"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-mono text-sm font-semibold text-gold">
                      {o.order_number}
                    </p>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-text-muted">
                    <span className="capitalize">{o.order_type}</span>
                    <span>R{Number(o.total).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-text-muted">
                    Placed {new Date(o.created_at).toLocaleString("en-ZA")}
                    {o.status_updated_at &&
                      o.status_updated_at !== o.created_at && (
                        <>
                          {" "}
                          • Updated{" "}
                          {new Date(o.status_updated_at).toLocaleString("en-ZA")}
                        </>
                      )}
                  </p>
                </article>
              ))}
            </Panel>
          </div>
        )}
      </main>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  count,
  empty,
  ctaTo,
  ctaHash,
  ctaLabel,
  children,
}: {
  icon: React.ElementType;
  title: string;
  count: number;
  empty: string;
  ctaTo: string;
  ctaHash: string;
  ctaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 font-serif text-xl font-semibold">
          <Icon className="h-5 w-5 text-gold" /> {title}
          <span className="text-xs text-text-muted">({count})</span>
        </h2>
        <Link
          to={ctaTo}
          hash={ctaHash.replace("#", "")}
          className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:text-[var(--accent-gold-dark)]"
        >
          <Sparkles className="h-3 w-3" /> {ctaLabel}
        </Link>
      </div>
      {count === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-bg-secondary/50 p-6 text-center text-sm text-text-muted">
          {empty}
        </p>
      ) : (
        <div className="space-y-2.5">{children}</div>
      )}
    </section>
  );
}

function ResStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    confirmed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    cancelled: "bg-red-500/15 text-red-500 border-red-500/30",
  };
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        map[status] || "bg-bg-tertiary text-text-muted"
      }`}
    >
      {status}
    </span>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    received: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    preparing: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    ready: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    out_for_delivery: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        map[status] || "bg-bg-tertiary text-text-muted"
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
