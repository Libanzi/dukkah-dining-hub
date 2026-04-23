export type DietTag = "vegetarian" | "gluten-free" | "spicy" | "fish";

export interface MenuItem {
  name: string;
  desc: string;
  price: string;
  category: string;
  img?: string;
  diet?: DietTag[];
}

export interface MenuTab {
  id: string;
  label: string;
  banner?: string;
  items: MenuItem[];
}

const p = (name: string) => `/photos/${name}.webp`;
const pj = (name: string) => `/photos/${name}.jpeg`;
const pp = (name: string) => `/photos/${name}.png`;

// Unsplash CDN — served from user's browser, not the build server.
// These 9 items have no matching Dukkah repo photo; replace with local
// copies if internet download becomes possible from this environment.
const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

export const MENU: MenuTab[] = [
  {
    id: "alacarte",
    label: "À La Carte",
    items: [
      // king prawn & scallop in bisque — premium seafood starter (Dukkah photo)
      { category: "STARTER", name: "Dukkah-Crusted Kingklip Ceviche", desc: "Citrus-cured kingklip, cucumber, coriander oil, crispy capers", price: "R165", img: pj("new-food-12"), diet: ["fish"] },
      // fried croquette balls in cream sauce — exact match
      { category: "STARTER", name: "Oxtail Croquettes", desc: "Slow-braised oxtail, chimichurri, peri-peri aioli", price: "R145", img: pj("new-food-croquettes") },
      // No repo match — Unsplash crispy spring rolls
      { category: "STARTER", name: "Cape Malay Bobotie Spring Rolls", desc: "Spiced mince, apricot chutney, cucumber ribbons", price: "R125", img: u("1563245372-f21724e3856d") },
      // king prawns in garlic butter sauce with lemon
      { category: "STARTER", name: "Peri-Peri Prawns", desc: "King prawns, garlic & herb butter, lemon, sourdough", price: "R175", img: pj("new-food-prawns-2"), diet: ["fish", "spicy"] },
      // dukkah-crusted rack of lamb with red wine jus & butternut purée (Dukkah photo)
      { category: "MAIN", name: "Slow-Braised Lamb Shank", desc: "Samp & beans, gremolata, red wine jus", price: "R345", img: pj("new-food-9") },
      // breaded fish patty with noodles and citrus
      { category: "MAIN", name: "Grilled Yellowfin Tuna", desc: "Peri-peri butter, sautéed broccolini, lemon", price: "R325", img: pj("new-food-fishcake"), diet: ["fish"] },
      // poultry with cream sauce poured tableside
      { category: "MAIN", name: "Pan-Seared Duck Breast", desc: "Orange & amarula reduction, creamy polenta, wilted greens", price: "R365", img: pj("new-food-sauce") },
      // mushroom & vegetable bowl with avocado, greens (Dukkah photo)
      { category: "MAIN", name: "Mushroom & Spinach Bunny Chow", desc: "Cape Malay spiced curry, quarter loaf", price: "R185", img: pj("new-food-13"), diet: ["vegetarian", "gluten-free"] },
      // dukkah-crusted beef fillet with bone marrow, mash, broccolini
      { category: "MAIN", name: "Dukkah Wagyu Burger", desc: "Wagyu patty, aged gouda, caramelised onion jam, truffle aioli", price: "R285", img: pj("new-food-beef-2") },
      // seafood linguine with mussels & calamari in white wine cream — exact match (Dukkah photo)
      { category: "MAIN", name: "Prawn & Calamari Linguine", desc: "King prawns, baby calamari, cherry tomato, white wine, garlic", price: "R295", img: pj("new-food-10"), diet: ["fish"] },
    ],
  },
  {
    id: "brunch",
    label: "Sunday Brunch",
    banner: "Sunday Brunch Jazz — Every Sunday, 11:00 to 15:00. Live music included.",
    items: [
      // scrambled eggs with spiced tomato sauce on toast — Turkish eggs style
      { category: "BRUNCH", name: "Dukkah Turkish Eggs", desc: "Poached eggs, whipped Greek yoghurt & feta, cumin-chilli butter, mint, naan", price: "R145", img: pj("new-food-brunch-2"), diet: ["vegetarian"] },
      // classic eggs benedict with hollandaise
      { category: "BRUNCH", name: "Smoked Salmon Benedict", desc: "Norwegian salmon, avo, poached eggs, hollandaise, capers, dill, sourdough", price: "R185", img: pj("new-food-benedict"), diet: ["fish"] },
      // No repo match — Unsplash eggs benedict
      { category: "BRUNCH", name: "African Eggs Benedict", desc: "Bobotie-spiced lamb, poached eggs, turmeric hollandaise, rye", price: "R155", img: u("1525351484163-7529414344d8") },
      // baked egg in ramekin with avocado — shakshuka
      { category: "BRUNCH", name: "Dukkah Shakshuka", desc: "Eggs poached in spiced tomato & pepper sauce, feta, herbs, flatbread", price: "R125", img: pj("new-food-brunch-1"), diet: ["vegetarian", "gluten-free"] },
      // No repo match — Unsplash granola bowl
      { category: "BRUNCH", name: "Heritage Granola Bowl", desc: "House granola, Greek yoghurt, seasonal fruit, honey, toasted seeds", price: "R95", img: u("1484723091739-30a097e8f929"), diet: ["vegetarian"] },
      // full sushi platter — nigiri, maki, prawn tempura (Dukkah photo)
      { category: "SUSHI", name: "Sushi Selection Platter", desc: "Chef's selection of nigiri, maki and sashimi, soy & wasabi", price: "R295", img: pj("new-sushi-4"), diet: ["fish"] },
      // hand holding maki piece — close-up sashimi/maki
      { category: "SUSHI", name: "Salmon Sashimi", desc: "Fresh Norwegian salmon, ponzu, ginger", price: "R185", img: pj("new-sushi-3"), diet: ["fish"] },
      // top-down maki plate with soy and ginger
      { category: "SUSHI", name: "Rainbow Maki (8 pcs)", desc: "Salmon, tuna, avo, prawn, cucumber, sesame", price: "R165", img: pj("new-sushi-1"), diet: ["fish"] },
    ],
  },
  {
    id: "cocktails",
    label: "Cocktail Bar",
    items: [
      // orange/red sunset colours with flower garnish
      { category: "SIGNATURE", name: "African Sunset", desc: "Passion fruit, amarula, orange juice, prosecco float", price: "R95", img: pj("new-cocktail-orange") },
      // amber cocktail with pineapple and cherry
      { category: "SIGNATURE", name: "Durban Sling", desc: "Hendrick's gin, hibiscus syrup, ginger beer, lime", price: "R90", img: pj("new-cocktail-amber") },
      // dark red layered coupe — dark rum, spiced
      { category: "SIGNATURE", name: "The Dukkah Spice", desc: "Dark rum, cinnamon, honey, lime, soda", price: "R90", img: pj("new-cocktail-red") },
      // No repo match — Unsplash margarita
      { category: "SIGNATURE", name: "Peri-Peri Margarita", desc: "Tequila, triple sec, lime, peri-peri syrup, chilli salt rim", price: "R95", img: u("1514362545857-3bc16c4c7d1b"), diet: ["spicy"] },
      // dark cocktail top-down with charred citrus — espresso martini style (Dukkah photo)
      { category: "SIGNATURE", name: "Amarula Espresso Martini", desc: "Vodka, amarula, fresh espresso, coffee liqueur", price: "R100", img: pj("new-cocktail-top") },
      // dark layered coupe with smoked orange slice
      { category: "SIGNATURE", name: "Rooibos Old Fashioned", desc: "Bourbon, rooibos syrup, orange bitters, smoked orange peel", price: "R95", img: pj("new-cocktail-dark") },
      // vibrant green coupe — hibiscus, lime, mint
      { category: "MOCKTAIL", name: "Hibiscus Cooler", desc: "Hibiscus, ginger, lime, soda, mint", price: "R55", img: pj("new-cocktail-green"), diet: ["vegetarian"] },
      // teal/blue cocktail with citrus peel — ginger mule style
      { category: "MOCKTAIL", name: "African Spice Mule", desc: "Ginger beer, passion fruit, lime, cinnamon, soda", price: "R60", img: pj("new-cocktail-blue"), diet: ["vegetarian"] },
    ],
  },
  {
    id: "wine",
    label: "Wine List",
    items: [
      // two people toasting with champagne flutes
      { category: "BUBBLY", name: "Pongrácz Brut", desc: "Cap Classique — green apple, citrus, fresh bread", price: "R430", img: pj("new-bar-champagne") },
      // pink rosé champagne flute
      { category: "ROSÉ", name: "Dawn Patrol Rosé", desc: "Dry, wild strawberries, pomegranate", price: "R275 / R70", img: pp("new-wine-1") },
      // sommelier presenting bottle from wine wall
      { category: "WHITE", name: "Durbanville Hills Sauvignon Blanc", desc: "Zesty lime, yellow fruits, vibrant acidity", price: "R200 / R60", img: pj("new-wine-service") },
      // Dukkah wine cellar lounge — curated bottle wall
      { category: "WHITE", name: "Ken Forrester Petit Chenin", desc: "Minerally, fruit & oak balanced", price: "R195 / R55", img: pp("new-wine-3") },
      // No repo match — Unsplash white wine glass
      { category: "WHITE", name: "Diemersdal Unwooded Chardonnay", desc: "Spicy aromas, fresh fruit", price: "R235 / R65", img: u("1510812431401-41d2bd2722f3") },
      // champagne flute at brunch table
      { category: "BUBBLY", name: "Valdo Garda Prosecco", desc: "Floral, pear, delicate bubbles", price: "R325 / R90", img: pp("new-wine-2") },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    items: [
      // caramel sorbet quenelle on chocolate crumb with edible flowers
      { category: "DESSERT", name: "Malva Pudding", desc: "Traditional South African malva, amarula ice cream, caramel", price: "R95", img: pj("new-food-dessert-2") },
      // No repo match — Unsplash Belgian waffle
      { category: "DESSERT", name: "Malted Belgian Waffle", desc: "Amarula cream, dark chocolate shavings, caramelised banana", price: "R115", img: u("1562376552-0d160a2f238d") },
      // elegant dark plate with chocolate marquise, sorbet, edible flowers
      { category: "DESSERT", name: "Dark Chocolate Marquise", desc: "Salted caramel, cocoa tuile, gold leaf", price: "R110", img: pj("new-food-dessert-1") },
      // panna cotta in glass with fresh mixed fruit and shortbread
      { category: "DESSERT", name: "Mango Panna Cotta", desc: "Coconut milk panna cotta, mango coulis, toasted coconut", price: "R90", img: pj("new-food-dessert-3"), diet: ["gluten-free"] },
      // No repo match — Unsplash cheese board
      { category: "DESSERT", name: "SA Cheese Board", desc: "Three local cheeses, quince paste, crackers, nuts, dried fruit", price: "R145", img: u("1505575967455-40e256f73a6e") },
      // No repo match — Unsplash affogato
      { category: "DESSERT", name: "Affogato", desc: "Double espresso poured over vanilla ice cream", price: "R65", img: u("1534308983496-4fabb1a015ee") },
    ],
  },
  {
    id: "coffee",
    label: "Coffee & Drinks",
    items: [
      // No repo match — Unsplash latte art
      { category: "COFFEE", name: "Dukkah Cardamom Cappuccino", desc: "Double shot, steamed milk, cardamom-spiced foam", price: "R49", img: u("1509042239860-f550ce710b93") },
      // No repo match — Unsplash large cappuccino
      { category: "COFFEE", name: "Mega Cappuccino", desc: "220ml double shot", price: "R38", img: u("1461023058943-07fcbe16d735") },
      // No repo match — Unsplash iced coffee
      { category: "COFFEE", name: "Iced Coffee", desc: "Cold brew over ice, milk of choice", price: "R65", img: u("1558618666-fcd25c85cd64") },
      // No repo match — Unsplash tea latte
      { category: "TEA", name: "Rooibos Latté", desc: "Local rooibos, steamed milk, honey", price: "R45", img: u("1544787219-7f47ccb76574") },
      // No repo match — Unsplash fresh pressed juice
      { category: "JUICE", name: "Morning Detox", desc: "Carrot, apple, ginger, beetroot, celery", price: "R75", img: u("1600271886742-f049cd451bba"), diet: ["vegetarian", "gluten-free"] },
      // No repo match — Unsplash caramel milkshake
      { category: "SHAKE", name: "Salted Caramel Honeycomb", desc: "Thick milkshake, caramel sauce, honeycomb crunch", price: "R75", img: u("1572490122747-3e9197926a3b") },
    ],
  },
  {
    id: "veg",
    label: "Vegetarian",
    items: [],
  },
];

// Populate vegetarian tab from all plant-based items
MENU[6].items = MENU.slice(0, 6).flatMap((t) =>
  t.items.filter((i) => i.diet?.includes("vegetarian")).map((i) => ({ ...i, category: "PLANT-BASED" }))
);
