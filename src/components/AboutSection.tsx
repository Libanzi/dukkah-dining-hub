import { useEffect, useRef, useState } from "react";
import { DukkahName } from "./DukkahName";

const stats = [
  { value: 20, suffix: "+", label: "Years on Florida Road" },
  { value: 80, suffix: "+", label: "Cocktails on the bar" },
  { value: 30200, suffix: "", label: "Followers on Instagram" },
  { value: 1400, suffix: "+", label: "Reviews on Google" },
];

function useCounter(target: number, active: boolean, duration = 2000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

function StatItem({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
  const count = useCounter(value, active);
  return (
    <div className="text-center md:text-left">
      <p className="font-serif text-4xl md:text-5xl font-semibold text-gold">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-text-muted">{label}</p>
    </div>
  );
}

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="py-20 md:py-28 px-5 bg-bg-secondary">
      <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-elevated">
          <img
            src="/photos/new-int-dining-1.jpeg"
            alt="Inside Dukkah Restaurant & Bar — Florida Road, Durban"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <p className="eyebrow mb-3">Our Story</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary leading-tight">
            Born From the African Table
          </h2>
          <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
            <p>
              <DukkahName /> Restaurant & Bar has been a cornerstone of Durban's Florida Road dining
              scene since 2006. Named after the Egyptian spice blend, <DukkahName /> celebrates the
              diversity of African food culture — from the Cape Malay spices of the Western
              Cape to the smoky braai traditions of KwaZulu-Natal.
            </p>
            <p>
              We source our ingredients from South African farmers, pair them with global
              technique, and serve them in an atmosphere that honours African hospitality.
            </p>
          </div>
          <a href="#menu" className="mt-6 inline-flex items-center text-gold font-semibold hover:gap-2 transition-all gap-1">
            Read Our Full Story →
          </a>
        </div>
      </div>

      <div ref={ref} className="mx-auto max-w-7xl mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-border">
        {stats.map((s) => (
          <StatItem key={s.label} {...s} active={active} />
        ))}
      </div>
    </section>
  );
}
