import { DukkahName } from "./DukkahName";

const staff = [
  {
    name: "Chef [Name TBC]",
    role: "Executive Chef",
    img: "/photos/brunch-1.webp",
    imgPosition: "center top",
    bio: "Over 15 years across Johannesburg, Lagos, and London have shaped a bold, ingredient-first philosophy. Every plate on the menu is a tribute to the African table — precise, seasonal, unapologetic.",
    tags: ["Fine Dining", "African Cuisine", "Seasonal Menus"],
  },
  {
    name: "[Name TBC]",
    role: "Head Mixologist",
    img: "/photos/team-2.webp",
    imgPosition: "center 20%",
    bio: "Our bar programme is built around African botanicals, local distilleries, and technique honed behind some of Durban's most celebrated bars. 80+ spirits, zero shortcuts.",
    tags: ["Craft Cocktails", "African Botanicals", "80+ Spirits"],
  },
];

export function StaffSection() {
  return (
    <section className="py-20 md:py-28 px-5 bg-bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow mb-3">Our People</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary leading-tight">
            The Team Behind <DukkahName />
          </h2>
          <p className="mt-4 text-text-secondary leading-relaxed">
            Every experience at <DukkahName /> is shaped by people who care deeply — about craft, hospitality, and the stories food can tell.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {staff.map((s) => (
            <div
              key={s.role}
              className="group relative overflow-hidden rounded-2xl shadow-elevated bg-bg-primary"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={s.img}
                  alt={`${s.role} at Dukkah Restaurant & Bar`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: s.imgPosition }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-1">
                    {s.role}
                  </p>
                  <h3 className="font-serif text-2xl font-semibold text-white">
                    {s.name}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-text-secondary text-sm leading-relaxed">{s.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-gold/10 border border-gold/25 text-gold px-3 py-1 text-xs font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-text-secondary mb-4">
            Passionate about hospitality? We'd love to hear from you.
          </p>
          <a
            href="mailto:careers@dukkah.co.za"
            className="inline-block border border-gold text-gold px-8 py-3 rounded-full text-sm font-semibold hover:bg-gold hover:text-bg-primary transition-colors duration-200"
          >
            View Open Positions
          </a>
        </div>
      </div>
    </section>
  );
}
