export function CTASection() {
  return (
    <section className="py-20 md:py-28 px-5 bg-terracotta dark:bg-gradient-to-br dark:from-terracotta dark:to-gold-dark">
      <div className="mx-auto max-w-4xl text-center text-white">
        <h2 className="font-serif text-4xl md:text-6xl font-semibold leading-tight">
          Florida Road's Finest Table Awaits
        </h2>
        <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
          Book tonight. Order now. Gift someone they'll never forget.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#reservations" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-terracotta hover:scale-[1.03] transition-all">
            Reserve a Table
          </a>
          <a href="#order" className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white hover:text-terracotta transition-all">
            Order Online
          </a>
          <a href="#gift-cards" className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white hover:text-terracotta transition-all">
            Buy a Gift Card
          </a>
        </div>
      </div>
    </section>
  );
}
