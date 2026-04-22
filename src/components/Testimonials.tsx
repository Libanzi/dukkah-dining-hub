import { Star } from "lucide-react";
import { DukkahName } from "./DukkahName";

const reviews = [
  { quote: "Dukkah is consistently the best restaurant on Florida Road. The lamb shank alone is worth the trip from Johannesburg.", name: "Thabo M." },
  { quote: "Incredible atmosphere, attentive staff, and cocktails I still dream about three months later.", name: "Priya N." },
  { quote: "Perfect for a date night. We were there for 3 hours and didn't want to leave. The jazz made it.", name: "James & Lisa K." },
  { quote: "Hosted my 40th here. Chef's private dining menu was exceptional. Every guest raved about it.", name: "Zanele D." },
  { quote: "Best oxtail croquettes I've had in South Africa. The service was as good as the food.", name: "Andre B." },
  { quote: "Honestly the most beautiful plating I've ever seen. The Cape Malay spring rolls — wow.", name: "Sarah W." },
  { quote: "From the welcome drink to the dessert, every moment was considered. World-class.", name: "Mandla S." },
  { quote: "We come back every Friday for the jazz. Never disappointed.", name: "Carla J." },
  { quote: "The wine list is sensational and our sommelier knew every story behind every bottle.", name: "Rohan P." },
  { quote: "Sunday Brunch Jazz is the best Sunday in Durban. Period.", name: "Naledi K." },
];

const loop = [...reviews, ...reviews];

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-bg-secondary overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 mb-10">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow mb-3">In Their Words</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary">
            What Durban Says About <DukkahName />
          </h2>
          <p className="mt-3 text-text-muted">Over 1,400 reviews on Google</p>
        </div>
      </div>

      <div className="relative group">
        <div className="flex gap-5 w-max animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((r, i) => (
            <article key={i} className="w-[340px] md:w-[400px] shrink-0 rounded-2xl bg-bg-primary border border-border p-6 shadow-warm/30">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, n) => (
                  <Star key={n} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="font-display italic text-text-secondary leading-relaxed">"{r.quote}"</p>
              <p className="mt-4 text-sm font-semibold text-text-primary">{r.name}</p>
              <p className="text-xs text-text-muted">Google Reviews</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
