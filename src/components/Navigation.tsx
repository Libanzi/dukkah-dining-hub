import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "Reservations", href: "#reservations" },
  { label: "Order Online", href: "#order" },
  { label: "Events", href: "#events" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#footer" },
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
      className={`fixed top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
      style={{ backgroundColor: "var(--nav-bg)" }}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:h-[72px]">
        <Link to="/" className="flex items-center gap-1">
          <span className="font-serif text-2xl font-semibold text-gold tracking-wide">
            DUKK
          </span>
          <span className="inline-block h-2 w-2 rotate-45 bg-terracotta" />
          <span className="font-serif text-2xl font-semibold text-gold tracking-wide">
            AH
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-gold relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gold after:transition-all hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
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
            <span className="font-serif text-2xl font-semibold text-gold">DUKKAH</span>
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
                <a
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-3xl text-text-primary hover:text-gold transition-colors"
                >
                  {l.label}
                </a>
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
