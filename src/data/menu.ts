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
const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

export const MENU: MenuTab[] = [
  {
    id: "alacarte",
    label: "À La Carte",
    items: [
      { category: "STARTER", name: "Dukkah-Crusted Kingklip Ceviche", desc: "Citrus-cured kingklip, cucumber, coriander oil, crispy capers", price: "R165", img: u("1535400671853-53b54a19f73f"), diet: ["fish"] },
      // fried croquette balls in cream — exact match
      { category: "STARTER", name: "Oxtail Croquettes", desc: "Slow-braised oxtail, chimichurri, peri-peri aioli", price: "R145", img: pj("new-food-croquettes") },
      { category: "STARTER", name: "Cape Malay Bobotie Spring Rolls", desc: "Spiced mince, apricot chutney, cucumber ribbons", price: "R125", img: u("1563245372-f21724e3856d") },
      // king prawns in garlic butter sauce with lemon — perfect
      { category: "STARTER", name: "Peri-Peri Prawns", desc: "King prawns, garlic & herb butter, lemon, sourdough", price: "R175", img: pj("new-food-prawns-2"), diet: ["fish", "spicy"] },
      // elegant braised meat medallion with jus, top-down fine-dining plate
      { category: "MAIN", name: "Slow-Braised Lamb Shank", desc: "Samp & beans, gremolata, red wine jus", price: "R345", img: pj("new-food-beef-1") },
      // breaded fish patty with noodles — fish main
      { category: "MAIN", name: "Grilled Yellowfin Tuna", desc: "Peri-peri butter, sautéed broccolini, lemon", price: "R325", img: pj("new-food-fishcake"), diet: ["fish"] },
      // poultry with cream sauce poured tableside — duck breast presentation
      { category: "MAIN", name: "Pan-Seared Duck Breast", desc: "Orange & amarula reduction, creamy polenta, wilted greens", price: "R365", img: pj("new-food-sauce") },
      { category: "MAIN", name: "Mushroom & Spinach Bunny Chow", desc: "Cape Malay spiced curry, quarter loaf", price: "R185", img: u("1585937421612-70a008356fbe"), diet: ["vegetarian", "gluten-free"] },
      // dukkah-crusted beef fillet with bone marrow, mash, broccolini
      { category: "MAIN", name: "Dukkah Wagyu Burger", desc: "Wagyu patty, aged gouda, caramelised onion jam, truffle aioli", price: "R285", img: pj("new-food-beef-2") },
      { category: "MAIN", name: "Prawn & Calamari Linguine", desc: "King prawns, baby calamari, cherry tomato, white wine, garlic", price: "R295", img: u("1563379926898-05f4575a45d8"), diet: ["fish"] },
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
      { category: "BRUNCH", name: "African Eggs Benedict", desc: "Bobotie-spiced lamb, poached eggs, turmeric hollandaise, rye", price: "R155", img: u("1525351484163-7529414344d8") },
      // baked egg in ramekin with avocado and toast — shakshuka
      { category: "BRUNCH", name: "Dukkah Shakshuka", desc: "Eggs poached in spiced tomato & pepper sauce, feta, herbs, flatbread", price: "R125", img: pj("new-food-brunch-1"), diet: ["vegetarian", "gluten-free"] },
      { category: "BRUNCH", name: "Heritage Granola Bowl", desc: "House granola, Greek yoghurt, seasonal fruit, honey, toasted seeds", price: "R95", img: u("1484723091739-30a097e8f929"), diet: ["vegetarian"] },
      // maki plate with soy sauce and ginger
      { category: "SUSHI", name: "Sushi Selection Platter", desc: "Chef's selection of nigiri, maki and sashimi, soy & wasabi", price: "R295", img: pj("new-sushi-2"), diet: ["fish"] },
      // hand holding a single maki/sashimi piece close-up
      { category: "SUSHI", name: "Salmon Sashimi", desc: "Fresh Norwegian salmon, ponzu, ginger", price: "R185", img: pj("new-sushi-3"), diet: ["fish"] },
      // top-down maki rolls with chopsticks and soy
      { category: "SUSHI", name: "Rainbow Maki (8 pcs)", desc: "Salmon, tuna, avo, prawn, cucumber, sesame", price: "R165", img: pj("new-sushi-1"), diet: ["fish"] },
    ],
  },
  {
    id: "cocktails",
    label: "Cocktail Bar",
    items: [
      // orange/red sunset-coloured cocktail with flower garnish — passion fruit, OJ
      { category: "SIGNATURE", name: "African Sunset", desc: "Passion fruit, amarula, orange juice, prosecco float", price: "R95", img: pj("new-cocktail-orange") },
      // amber cocktail with pineapple and cherry — tropical sling
      { category: "SIGNATURE", name: "Durban Sling", desc: "Hendrick's gin, hibiscus syrup, ginger beer, lime", price: "R90", img: pj("new-cocktail-amber") },
      // dark red layered coupe — dark rum, spiced
      { category: "SIGNATURE", name: "The Dukkah Spice", desc: "Dark rum, cinnamon, honey, lime, soda", price: "R90", img: pj("new-cocktail-red") },
      { category: "SIGNATURE", name: "Peri-Peri Margarita", desc: "Tequila, triple sec, lime, peri-peri syrup, chilli salt rim", price: "R95", img: u("1514362545857-3bc16c4c7d1b"), diet: ["spicy"] },
      { category: "SIGNATURE", name: "Amarula Espresso Martini", desc: "Vodka, amarula, fresh espresso, coffee liqueur", price: "R100", img: u("1622483767028-3f66f32aef97") },
      // dark layered coupe with smoked orange slice — bourbon old fashioned
      { category: "SIGNATURE", name: "Rooibos Old Fashioned", desc: "Bourbon, rooibos syrup, orange bitters, smoked orange peel", price: "R95", img: pj("new-cocktail-dark") },
      // vibrant green coupe — hibiscus, lime, mint mocktail
      { category: "MOCKTAIL", name: "Hibiscus Cooler", desc: "Hibiscus, ginger, lime, soda, mint", price: "R55", img: pj("new-cocktail-green"), diet: ["vegetarian"] },
      // teal/blue refreshing cocktail with citrus peel — ginger beer mule
      { category: "MOCKTAIL", name: "African Spice Mule", desc: "Ginger beer, passion fruit, lime, cinnamon, soda", price: "R60", img: pj("new-cocktail-blue"), diet: ["vegetarian"] },
    ],
  },
  {
    id: "wine",
    label: "Wine List",
    items: [
      // two people toasting with champagne flutes — Cap Classique celebration
      { category: "BUBBLY", name: "Pongrácz Brut", desc: "Cap Classique — green apple, citrus, fresh bread", price: "R430", img: pj("new-bar-champagne") },
      // pink rosé champagne flute — dry rosé
      { category: "ROSÉ", name: "Dawn Patrol Rosé", desc: "Dry, wild strawberries, pomegranate", price: "R275 / R70", img: pp("new-wine-1") },
      // sommelier presenting bottle from wine wall
      { category: "WHITE", name: "Durbanville Hills Sauvignon Blanc", desc: "Zesty lime, yellow fruits, vibrant acidity", price: "R200 / R60", img: pj("new-wine-service") },
      // Dukkah wine cellar lounge with curated bottle wall
      { category: "WHITE", name: "Ken Forrester Petit Chenin", desc: "Minerally, fruit & oak balanced", price: "R195 / R55", img: pp("new-wine-3") },
      { category: "WHITE", name: "Diemersdal Unwooded Chardonnay", desc: "Spicy aromas, fresh fruit", price: "R235 / R65", img: u("1510812431401-41d2bd2722f3") },
      // champagne flute at brunch table — prosecco celebration
      { category: "BUBBLY", name: "Valdo Garda Prosecco", desc: "Floral, pear, delicate bubbles", price: "R325 / R90", img: pp("new-wine-2") },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    items: [
      // sorbet with caramel drizzle and edible flowers — caramel dessert
      { category: "DESSERT", name: "Malva Pudding", desc: "Traditional South African malva, amarula ice cream, caramel", price: "R95", img: pj("new-food-dessert-2") },
      { category: "DESSERT", name: "Malted Belgian Waffle", desc: "Amarula cream, dark chocolate shavings, caramelised banana", price: "R115", img: u("1562376552-0d160a2f238d") },
      // elegant dark plate with chocolate marquise/parfait, sorbet, edible flowers
      { category: "DESSERT", name: "Dark Chocolate Marquise", desc: "Salted caramel, cocoa tuile, gold leaf", price: "R110", img: pj("new-food-dessert-1") },
      // panna cotta in glass with fresh mixed fruit and shortbread biscuits
      { category: "DESSERT", name: "Mango Panna Cotta", desc: "Coconut milk panna cotta, mango coulis, toasted coconut", price: "R90", img: pj("new-food-dessert-3"), diet: ["gluten-free"] },
      { category: "DESSERT", name: "SA Cheese Board", desc: "Three local cheeses, quince paste, crackers, nuts, dried fruit", price: "R145", img: u("1505575967455-40e256f73a6e") },
      { category: "DESSERT", name: "Affogato", desc: "Double espresso poured over vanilla ice cream", price: "R65", img: u("1534308983496-4fabb1a015ee") },
    ],
  },
  {
    id: "coffee",
    label: "Coffee & Drinks",
    items: [
      { category: "COFFEE", name: "Dukkah Cardamom Cappuccino", desc: "Double shot, steamed milk, cardamom-spiced foam", price: "R49", img: u("1509042239860-f550ce710b93") },
      { category: "COFFEE", name: "Mega Cappuccino", desc: "220ml double shot", price: "R38", img: u("1461023058943-07fcbe16d735") },
      { category: "COFFEE", name: "Iced Coffee", desc: "Cold brew over ice, milk of choice", price: "R65", img: u("1558618666-fcd25c85cd64") },
      { category: "TEA", name: "Rooibos Latté", desc: "Local rooibos, steamed milk, honey", price: "R45", img: u("1544787219-7f47ccb76574") },
      { category: "JUICE", name: "Morning Detox", desc: "Carrot, apple, ginger, beetroot, celery", price: "R75", img: u("1600271886742-f049cd451bba"), diet: ["vegetarian", "gluten-free"] },
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
