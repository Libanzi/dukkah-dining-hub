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

// Real Dukkah photos served from /public/photos/
const p = (name: string) => `/photos/${name}.webp`;

export const MENU: MenuTab[] = [
  {
    id: "alacarte",
    label: "À La Carte",
    items: [
      { category: "STARTER", name: "Dukkah-Crusted Kingklip Ceviche", desc: "Citrus-cured kingklip, cucumber, coriander oil, crispy capers", price: "R165", img: p("food-1"), diet: ["fish"] },
      { category: "STARTER", name: "Oxtail Croquettes", desc: "Slow-braised oxtail, chimichurri, peri-peri aioli", price: "R145", img: p("food-2") },
      { category: "STARTER", name: "Cape Malay Bobotie Spring Rolls", desc: "Spiced mince, apricot chutney, cucumber ribbons", price: "R125", img: p("food-3") },
      { category: "STARTER", name: "Peri-Peri Prawns", desc: "King prawns, garlic & herb butter, lemon, sourdough", price: "R175", img: p("food-4"), diet: ["fish", "spicy"] },
      { category: "MAIN", name: "Slow-Braised Lamb Shank", desc: "Samp & beans, gremolata, red wine jus", price: "R345", img: p("food-5") },
      { category: "MAIN", name: "Grilled Yellowfin Tuna", desc: "Peri-peri butter, sautéed broccolini, lemon", price: "R325", img: p("food-6"), diet: ["fish"] },
      { category: "MAIN", name: "Pan-Seared Duck Breast", desc: "Orange & amarula reduction, creamy polenta, wilted greens", price: "R365", img: p("food-7") },
      { category: "MAIN", name: "Mushroom & Spinach Bunny Chow", desc: "Cape Malay spiced curry, quarter loaf", price: "R185", img: p("food-8"), diet: ["vegetarian", "gluten-free"] },
      { category: "MAIN", name: "Dukkah Wagyu Burger", desc: "Wagyu patty, aged gouda, caramelised onion jam, truffle aioli", price: "R285", img: p("food-9") },
      { category: "MAIN", name: "Prawn & Calamari Linguine", desc: "King prawns, baby calamari, cherry tomato, white wine, garlic", price: "R295", img: p("food-10"), diet: ["fish"] },
    ],
  },
  {
    id: "brunch",
    label: "Sunday Brunch",
    banner: "Sunday Brunch Jazz — Every Sunday, 11:00 to 15:00. Live music included.",
    items: [
      { category: "BRUNCH", name: "Dukkah Turkish Eggs", desc: "Poached eggs, whipped Greek yoghurt & feta, cumin-chilli butter, mint, naan", price: "R145", img: p("brunch-1"), diet: ["vegetarian"] },
      { category: "BRUNCH", name: "Smoked Salmon Benedict", desc: "Norwegian salmon, avo, poached eggs, hollandaise, capers, dill, sourdough", price: "R185", img: p("brunch-2"), diet: ["fish"] },
      { category: "BRUNCH", name: "African Eggs Benedict", desc: "Bobotie-spiced lamb, poached eggs, turmeric hollandaise, rye", price: "R155", img: p("brunch-3") },
      { category: "BRUNCH", name: "Dukkah Shakshuka", desc: "Eggs poached in spiced tomato & pepper sauce, feta, herbs, flatbread", price: "R125", img: p("brunch-4"), diet: ["vegetarian", "gluten-free"] },
      { category: "BRUNCH", name: "Heritage Granola Bowl", desc: "House granola, Greek yoghurt, seasonal fruit, honey, toasted seeds", price: "R95", img: p("brunch-5"), diet: ["vegetarian"] },
      { category: "SUSHI", name: "Sushi Selection Platter", desc: "Chef's selection of nigiri, maki and sashimi, soy & wasabi", price: "R295", img: p("brunch-6"), diet: ["fish"] },
      { category: "SUSHI", name: "Salmon Sashimi", desc: "Fresh Norwegian salmon, ponzu, ginger", price: "R185", img: p("brunch-7"), diet: ["fish"] },
      { category: "SUSHI", name: "Rainbow Maki (8 pcs)", desc: "Salmon, tuna, avo, prawn, cucumber, sesame", price: "R165", img: p("brunch-8"), diet: ["fish"] },
    ],
  },
  {
    id: "cocktails",
    label: "Cocktail Bar",
    items: [
      { category: "SIGNATURE", name: "African Sunset", desc: "Passion fruit, amarula, orange juice, prosecco float", price: "R95", img: p("bar-1") },
      { category: "SIGNATURE", name: "Durban Sling", desc: "Hendrick's gin, hibiscus syrup, ginger beer, lime", price: "R90", img: p("bar-2") },
      { category: "SIGNATURE", name: "The Dukkah Spice", desc: "Dark rum, cinnamon, honey, lime, soda", price: "R90", img: p("bar-3") },
      { category: "SIGNATURE", name: "Peri-Peri Margarita", desc: "Tequila, triple sec, lime, peri-peri syrup, chilli salt rim", price: "R95", img: p("bar-4"), diet: ["spicy"] },
      { category: "SIGNATURE", name: "Amarula Espresso Martini", desc: "Vodka, amarula, fresh espresso, coffee liqueur", price: "R100", img: p("bar-5") },
      { category: "SIGNATURE", name: "Rooibos Old Fashioned", desc: "Bourbon, rooibos syrup, orange bitters, smoked orange peel", price: "R95", img: p("bar-6") },
      { category: "MOCKTAIL", name: "Hibiscus Cooler", desc: "Hibiscus, ginger, lime, soda, mint", price: "R55", img: p("bar-7"), diet: ["vegetarian"] },
      { category: "MOCKTAIL", name: "African Spice Mule", desc: "Ginger beer, passion fruit, lime, cinnamon, soda", price: "R60", img: p("bar-8"), diet: ["vegetarian"] },
    ],
  },
  {
    id: "wine",
    label: "Wine List",
    items: [
      { category: "BUBBLY", name: "Pongrácz Brut", desc: "Cap Classique — green apple, citrus, fresh bread", price: "R430", img: p("wine-1") },
      { category: "ROSÉ", name: "Dawn Patrol Rosé", desc: "Dry, wild strawberries, pomegranate", price: "R275 / R70", img: p("wine-2") },
      { category: "WHITE", name: "Durbanville Hills Sauvignon Blanc", desc: "Zesty lime, yellow fruits, vibrant acidity", price: "R200 / R60", img: p("wine-3") },
      { category: "WHITE", name: "Ken Forrester Petit Chenin", desc: "Minerally, fruit & oak balanced", price: "R195 / R55", img: p("wine-4") },
      { category: "WHITE", name: "Diemersdal Unwooded Chardonnay", desc: "Spicy aromas, fresh fruit", price: "R235 / R65", img: p("wine-5") },
      { category: "BUBBLY", name: "Valdo Garda Prosecco", desc: "Floral, pear, delicate bubbles", price: "R325 / R90", img: p("wine-1") },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    items: [
      { category: "DESSERT", name: "Malva Pudding", desc: "Traditional South African malva, amarula ice cream, caramel", price: "R95", img: p("food-11") },
      { category: "DESSERT", name: "Malted Belgian Waffle", desc: "Amarula cream, dark chocolate shavings, caramelised banana", price: "R115", img: p("food-12") },
      { category: "DESSERT", name: "Dark Chocolate Marquise", desc: "Salted caramel, cocoa tuile, gold leaf", price: "R110", img: p("food-13") },
      { category: "DESSERT", name: "Mango Panna Cotta", desc: "Coconut milk panna cotta, mango coulis, toasted coconut", price: "R90", img: p("food-14"), diet: ["gluten-free"] },
      { category: "DESSERT", name: "SA Cheese Board", desc: "Three local cheeses, quince paste, crackers, nuts, dried fruit", price: "R145", img: p("food-15") },
      { category: "DESSERT", name: "Affogato", desc: "Double espresso poured over vanilla ice cream", price: "R65", img: p("food-16") },
    ],
  },
  {
    id: "coffee",
    label: "Coffee & Drinks",
    items: [
      { category: "COFFEE", name: "Dukkah Cardamom Cappuccino", desc: "Double shot, steamed milk, cardamom-spiced foam", price: "R49", img: p("food-17") },
      { category: "COFFEE", name: "Mega Cappuccino", desc: "220ml double shot", price: "R38", img: p("food-18") },
      { category: "COFFEE", name: "Iced Coffee", desc: "Cold brew over ice, milk of choice", price: "R65", img: p("food-19") },
      { category: "TEA", name: "Rooibos Latté", desc: "Local rooibos, steamed milk, honey", price: "R45", img: p("food-20") },
      { category: "JUICE", name: "Morning Detox", desc: "Carrot, apple, ginger, beetroot, celery", price: "R75", img: p("food-21"), diet: ["vegetarian", "gluten-free"] },
      { category: "SHAKE", name: "Salted Caramel Honeycomb", desc: "Thick milkshake, caramel sauce, honeycomb crunch", price: "R75", img: p("food-22") },
    ],
  },
  {
    id: "veg",
    label: "Vegetarian",
    items: [],
  },
];

// Populate vegetarian tab from all 🌿 items
MENU[6].items = MENU.slice(0, 6).flatMap((t) =>
  t.items.filter((i) => i.diet?.includes("vegetarian")).map((i) => ({ ...i, category: "PLANT-BASED" }))
);
