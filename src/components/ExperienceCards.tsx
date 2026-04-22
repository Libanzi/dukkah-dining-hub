import { ArrowRight } from "lucide-react";

const cards = [
  {
    pill: "FINE DINING",
    img: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "À La Carte Dining",
    desc: "Classic mains, curated wine pairings, and Chef's daily specials",
    href: "#menu",
  },
  {
    pill: "COCKTAIL BAR",
    img: "https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Craft Cocktails",
    desc: "80+ spirits, signature African-inspired cocktails, and bar snacks",
    href: "#menu",
  },
  {
    pill: "LIVE EVENTS",
    img: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Live Music & Events",
    desc: "Friday jazz, Saturday Afrobeat, private functions",
    href: "#events",
  },
  {
    pill: "PRIVATE DINING",
    img: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Private Dining",
    desc: "Exclusive rooms, set menus, catering for 10–80 guests",
    href: "#private-dining",
  },
];

export function ExperienceCards() {
  return (
    <section className="py-20 md:py-28 px-5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow mb-3">The Dukkah Experience</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">
            Four Reasons to Come Back
          </h2>
          <p className="mt-3 text-text-muted">Durban's most complete dining experience</p>
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 -mx-5 px-5 md:mx-0 md:px-0">
          {cards.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="group relative flex-shrink-0 snap-center w-[80%] md:w-auto h-[420px] overflow-hidden rounded-2xl shadow-elevated transition-all hover:-translate-y-1"
            >
              <img
                src={c.img}
                alt={`${c.title} at Dukkah Restaurant & Bar`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-gold px-3 py-1 text-[10px] font-bold tracking-widest text-[var(--text-on-gold)]">
                {c.pill}
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-serif text-2xl font-semibold mb-2">{c.title}</h3>
                <p className="text-sm text-white/80 mb-3">{c.desc}</p>
                <span className="inline-flex items-center text-gold text-sm font-semibold">
                  Explore <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
