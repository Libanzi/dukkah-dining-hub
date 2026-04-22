import { DukkahName } from "./DukkahName";

export function MeetTheChef() {
  return (
    <section className="py-20 md:py-28 px-5">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <p className="eyebrow mb-3">In the Kitchen</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary leading-tight">
            The Hand Behind the Plate
          </h2>
          <p className="mt-2 font-display text-xl text-gold">Chef [Name TBC]</p>
          <p className="mt-6 text-text-secondary leading-relaxed">
            With over 15 years of experience across South Africa, West Africa, and London, our head chef brings
            a deep respect for African ingredients and a fearless approach to technique. Every dish on the
            <DukkahName /> menu carries the belief that African food deserves its place among the world's great cuisines.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Johannesburg Culinary Arts", "London Extern, 2012", "15+ Years"].map((c) => (
              <span key={c} className="rounded-full bg-terracotta/15 border border-terracotta/30 text-terracotta px-3 py-1 text-xs font-semibold">
                {c}
              </span>
            ))}
          </div>
          <a href="#private-dining" className="mt-6 inline-block text-gold font-semibold hover:underline">
            Chef's Table Enquiry →
          </a>
        </div>
        <div className="order-1 lg:order-2 relative aspect-[4/5] overflow-hidden rounded-2xl shadow-elevated">
          <img
            src="/photos/team-1.webp"
            alt="Head chef at Dukkah Restaurant & Bar — Florida Road, Durban"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
