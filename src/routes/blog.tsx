import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Clock, Calendar, ChevronRight } from "lucide-react";
import { DukkahLogo } from "@/components/DukkahLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

type Category = "All" | "Food & Culture" | "Recipes" | "Events" | "Bar & Wine" | "Behind the Scenes";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  date: string;
  readTime: number;
  author: string;
  img: string;
  featured?: boolean;
}

const POSTS: Post[] = [
  {
    slug: "story-behind-dukkah-spice",
    title: "The Story Behind Our Dukkah Spice Blend",
    excerpt: "Long before dukkah became a buzzword on Cape Town menus, we were grinding hazelnuts, coriander, and cumin in our Durban kitchen. Here's how the spice that named us became the thread running through every dish we serve.",
    category: "Food & Culture",
    date: "2026-04-10",
    readTime: 6,
    author: "Chef Tariq Abrahams",
    img: "/photos/food-18.webp",
    featured: true,
  },
  {
    slug: "friday-jazz-april-recap",
    title: "Friday Jazz Night: An April to Remember",
    excerpt: "The candles burned low and the saxophones played on. We recapped an unforgettable Friday session with The Mfana Quartet — and what went into the food and cocktail pairing menu we built around the night.",
    category: "Events",
    date: "2026-04-07",
    readTime: 4,
    author: "Dukkah Team",
    img: "/photos/event-1.webp",
  },
  {
    slug: "peri-peri-prawns-recipe",
    title: "Peri-Peri Prawns: The Home Version",
    excerpt: "Our head chef breaks down the technique behind the restaurant's most-ordered starter — garlic-herb butter, the right heat level, and why the quality of your prawns is non-negotiable.",
    category: "Recipes",
    date: "2026-03-29",
    readTime: 8,
    author: "Chef Tariq Abrahams",
    img: "/photos/food-10.webp",
  },
  {
    slug: "african-sunset-cocktail",
    title: "Behind the Bar: Crafting the African Sunset",
    excerpt: "Passion fruit, amarula, OJ, and a prosecco float — our most Instagrammed cocktail looks simple. Our bar manager explains why it took three months of testing to get it right.",
    category: "Bar & Wine",
    date: "2026-03-21",
    readTime: 5,
    author: "Sipho Dlamini, Bar Manager",
    img: "/photos/bar-5.webp",
  },
  {
    slug: "sunday-brunch-jazz",
    title: "Why Sunday Brunch at Dukkah Feels Different",
    excerpt: "Live jazz, sushi on the pass, bottomless bubbles, and eggs benedict with turmeric hollandaise. We look at how Sunday brunch became a Durban institution — and what we're adding this season.",
    category: "Food & Culture",
    date: "2026-03-14",
    readTime: 5,
    author: "Nadia Khumalo",
    img: "/photos/brunch-2.webp",
  },
  {
    slug: "sa-wine-pairing-guide",
    title: "A South African's Guide to Wine Pairing with African Cuisine",
    excerpt: "Rooibos-smoked lamb with a Durbanville Sauvignon Blanc. Bobotie spring rolls and a Chenin Blanc. Our sommelier shares the unconventional pairings that have become table favourites.",
    category: "Bar & Wine",
    date: "2026-03-05",
    readTime: 7,
    author: "Priya Naidoo, Sommelier",
    img: "/photos/wine-1.webp",
  },
  {
    slug: "meet-the-chef",
    title: "Meet the Chef: Twenty Years on Florida Road",
    excerpt: "Chef Tariq Abrahams arrived in Durban with a single bag and a Cordon Bleu certificate. Two decades later he's built one of the city's most enduring fine dining restaurants — and he's not done yet.",
    category: "Behind the Scenes",
    date: "2026-02-22",
    readTime: 9,
    author: "Dukkah Team",
    img: "/photos/food-23.webp",
  },
  {
    slug: "cape-malay-influence",
    title: "Cape Malay Spice: The Quiet Hero of Our Kitchen",
    excerpt: "From the cardamom in our cappuccino to the turmeric in our hollandaise, Cape Malay flavour profiles run deeper through the Dukkah menu than most diners realise. Here's how.",
    category: "Food & Culture",
    date: "2026-02-14",
    readTime: 6,
    author: "Chef Tariq Abrahams",
    img: "/photos/brunch-1.webp",
  },
  {
    slug: "spring-menu-2026",
    title: "The Spring 2026 Menu: What's New and Why",
    excerpt: "A darker chocolate marquise, a new wagyu preparation, and an unexpected mango panna cotta that somehow became our dessert of the season. Here's the thinking behind our biggest seasonal update in three years.",
    category: "Behind the Scenes",
    date: "2026-02-01",
    readTime: 5,
    author: "Chef Tariq Abrahams",
    img: "/photos/food-15.webp",
  },
];

const CATEGORIES: Category[] = ["All", "Food & Culture", "Recipes", "Events", "Bar & Wine", "Behind the Scenes"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPage() {
  const [active, setActive] = useState<Category>("All");

  const featured = POSTS.find((p) => p.featured)!;
  const filtered = POSTS.filter((p) => !p.featured && (active === "All" || p.category === active));

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg-primary/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5">
          <Link to="/" className="flex items-center" aria-label="Dukkah home">
            <DukkahLogo height={40} className="text-gold" showTagline={false} />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dukkah
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative py-20 md:py-28 px-5 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--accent-gold)_12%,transparent),transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-4">Dukkah Stories</p>
            <h1 className="font-serif text-5xl md:text-6xl font-semibold text-text-primary leading-tight">
              From Our Kitchen,<br />
              <span className="text-gold">To Your Table</span>
            </h1>
            <p className="mt-6 text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
              Recipes, chef dispatches, event recaps, and the thinking behind every dish, drink, and detail at Dukkah.
            </p>
          </div>
        </section>

        {/* Featured post */}
        <section className="px-5 pb-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold tracking-widest text-gold uppercase mb-6">Featured</p>
            <article className="group grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden bg-bg-secondary border border-border shadow-elevated transition-all hover:shadow-warm">
              <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                <img
                  src={featured.img}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-secondary/20 lg:block hidden" />
                <span className="absolute top-5 left-5 inline-flex items-center rounded-full bg-gold px-3 py-1 text-[10px] font-bold tracking-widest text-[var(--text-on-gold)]">
                  {featured.category}
                </span>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {formatDate(featured.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {featured.readTime} min read
                  </span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-text-primary leading-snug mb-4">
                  {featured.title}
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-muted">{featured.author}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold group-hover:gap-2 transition-all">
                    Read more <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Category tabs */}
        <section className="px-5 pb-4">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-x-auto -mx-5 px-5">
              <div className="flex gap-2 min-w-max border-b border-border pb-0">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActive(cat)}
                    className={`relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors ${
                      active === cat ? "text-gold" : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    {cat}
                    {active === cat && (
                      <span className="absolute -bottom-px left-2 right-2 h-[2px] bg-gold" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Posts grid */}
        <section className="px-5 py-10 pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" key={active}>
              {filtered.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-text-muted py-20">No posts in this category yet.</p>
            )}
          </div>
        </section>
      </main>

      {/* Footer strip */}
      <footer className="border-t border-border px-5 py-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Dukkah Restaurant & Bar · Florida Road, Durban
          </p>
          <Link to="/" className="text-sm font-semibold text-gold hover:text-[var(--accent-gold-dark)] transition-colors">
            Visit Dukkah →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-bg-secondary border border-border transition-all hover:-translate-y-1 hover:shadow-warm">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={post.img}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-bg-primary/90 px-3 py-1 text-[10px] font-bold tracking-widest text-gold">
          {post.category}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[11px] text-text-muted mb-3">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readTime} min
          </span>
        </div>
        <h3 className="font-serif text-lg font-semibold text-text-primary leading-snug mb-2">
          {post.title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed flex-1 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs font-semibold text-text-muted">{post.author}</p>
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-gold group-hover:gap-1.5 transition-all">
            Read <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
