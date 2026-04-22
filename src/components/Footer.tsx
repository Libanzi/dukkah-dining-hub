import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="footer" className="bg-bg-tertiary border-t border-border pt-16 pb-6 px-5">
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-1 mb-3">
            <span className="font-serif text-2xl font-semibold text-gold">DUKK</span>
            <span className="inline-block h-2 w-2 rotate-45 bg-terracotta" />
            <span className="font-serif text-2xl font-semibold text-gold">AH</span>
          </div>
          <p className="text-sm text-text-muted mb-4">African Fine Dining — Florida Road, Durban</p>
          <div className="flex gap-3 mb-3">
            <a href="https://instagram.com/dukkahdurban" target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-bg-secondary border border-border flex items-center justify-center text-gold hover:bg-gold hover:text-[var(--text-on-gold)] transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="h-9 w-9 rounded-full bg-bg-secondary border border-border flex items-center justify-center text-gold hover:bg-gold hover:text-[var(--text-on-gold)] transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
          <span className="inline-flex items-center rounded-full bg-gold/15 border border-gold/30 px-3 py-1 text-xs font-semibold text-gold">
            30,200 followers on Instagram
          </span>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-text-primary mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            {["Home", "Menu", "Reservations", "Order Online", "Events", "Gallery"].map((l) => (
              <li key={l}><a href={`#${l.toLowerCase().replace(/\s+/g, "")}`} className="hover:text-gold transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-text-primary mb-3">Visit Us</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" /><span>59 Florida Road, Morningside, Durban, 4001</span></li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /><span>031 XXX XXXX</span></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /><span>admin@dukkah.co.za</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-text-primary mb-3">Hours</h4>
          <ul className="space-y-1.5 text-sm text-text-muted">
            <li className="flex justify-between"><span>Mon</span><span>Closed</span></li>
            <li className="flex justify-between"><span>Tue–Thu</span><span>12–22</span></li>
            <li className="flex justify-between"><span>Fri–Sat</span><span>12–23</span></li>
            <li className="flex justify-between"><span>Sun</span><span>12–21</span></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl mt-10 pt-6 border-t border-border flex flex-col md:flex-row gap-2 justify-between text-xs text-text-muted">
        <p>© 2026 Dukkah Restaurant & Bar. All rights reserved.</p>
        <p>Website by <a href="https://www.payguardafrica.co.za" className="text-gold hover:underline">PayGuard Africa</a></p>
      </div>
    </footer>
  );
}
