import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { CartButton } from "./cart/CartDrawer";
import { DukkahLogo } from "./DukkahLogo";

const navLinks = [
  { label: "Home", href: "#home", route: null },
  { label: "Menu", href: "#order", route: null },
  { label: "Reservations", href: "#reservations", route: null },
  { label: "Events", href: "#events", route: null },
  { label: "Gallery", href: null, route: "/gallery" },
  { label: "About", href: "#about", route: null },
  { label: "Contact", href: "#footer", route: null },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
      style={scrolled ? { backgroundColor: "color-mix(in oklab, var(--nav-bg) 70%, transparent)" } : undefined}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:h-[72px]">
        <Link to="/" className="flex items-center" aria-label="Dukkah Restaurant & Bar — Home">
          <DukkahLogo height={44} className="text-gold" showTagline={false} />
        </Link>

        <ul className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => (
            <li key={l.label}>
              {l.route ? (
                <Link
                  to={l.route}
                  className="text-sm font-medium text-text-secondary transition-colors hover:text-gold relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gold after:transition-all hover:after:w-full"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  href={l.href!}
                  className="text-sm font-medium text-text-secondary transition-colors hover:text-gold relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gold after:transition-all hover:after:w-full"
                >
                  {l.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/account"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold hover:bg-gold/10"
            aria-label="My account"
          >
            <User className="h-4 w-4" />
          </Link>
          <CartButton />
          <a
            href="#reservations"
            className="hidden sm:inline-flex items-center rounded-full bg-gold px-5 py-2 text-sm font-semibold text-[var(--text-on-gold)] transition-all hover:bg-[var(--accent-gold-dark)] hover:scale-[1.03] active:scale-[0.97]"
          >
            Reserve
          </a>
          <button
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-bg-primary animate-fade-in lg:hidden">
          <div className="flex items-center justify-between px-5 h-[72px]">
            <DukkahLogo height={40} className="text-gold" showTagline={false} />

            <button
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ul className="flex flex-col items-center justify-center gap-6 px-6 pt-12">
            {navLinks.map((l) => (
              <li key={l.label}>
                {l.route ? (
                  <Link
                    to={l.route}
                    onClick={() => setMobileOpen(false)}
                    className="font-serif text-3xl text-text-primary hover:text-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    href={l.href!}
                    onClick={() => setMobileOpen(false)}
                    className="font-serif text-3xl text-text-primary hover:text-gold transition-colors"
                  >
                    {l.label}
                  </a>
                )}
              </li>
            ))}
            <li className="mt-4">
              <a
                href="#reservations"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center rounded-full bg-gold px-7 py-3 text-base font-semibold text-[var(--text-on-gold)]"
              >
                Reserve a Table
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
