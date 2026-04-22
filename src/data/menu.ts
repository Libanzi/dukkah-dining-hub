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

const img = (q: string) =>
  `https://images.pexels.com/photos/${q}/pexels-photo-${q}.jpeg?auto=compress&cs=tinysrgb&w=600`;

export const MENU: MenuTab[] = [
  {
    id: "alacarte",
    label: "À La Carte",
    items: [
      { category: "STARTER", name: "Dukkah-Crusted Kingklip Ceviche", desc: "Citrus-cured kingklip, cucumber, coriander oil, crispy capers", price: "R165", img: img("3535383"), diet: ["fish"] },
      { category: "STARTER", name: "Oxtail Croquettes", desc: "Slow-braised oxtail, chimichurri, peri-peri aioli", price: "R145", img: img("1640777") },
      { category: "STARTER", name: "Cape Malay Bobotie Spring Rolls", desc: "Spiced mince, apricot chutney, cucumber ribbons", price: "R125", img: img("2092507") },
      { category: "STARTER", name: "Peri-Peri Prawns", desc: "King prawns, garlic & herb butter, lemon, sourdough", price: "R175", img: img("3296434"), diet: ["fish", "spicy"] },
      { category: "MAIN", name: "Slow-Braised Lamb Shank", desc: "Samp & beans, gremolata, red wine jus", price: "R345", img: img("1633578") },
      { category: "MAIN", name: "Grilled Yellowfin Tuna", desc: "Peri-peri butter, sautéed broccolini, lemon", price: "R325", img: img("3296279"), diet: ["fish"] },
      { category: "MAIN", name: "Pan-Seared Duck Breast", desc: "Orange & amarula reduction, creamy polenta, wilted greens", price: "R365", img: img("2233348") },
      { category: "MAIN", name: "Mushroom & Spinach Bunny Chow", desc: "Cape Malay spiced curry, quarter loaf", price: "R185", img: img("1410235"), diet: ["vegetarian", "gluten-free"] },
    ],
  },
  {
    id: "brunch",
    label: "Sunday Brunch",
    banner: "Sunday Brunch Jazz — Every Sunday, 11:00 to 15:00. Live music included.",
    items: [
      { category: "BRUNCH", name: "Dukkah Turkish Eggs", desc: "Poached eggs, whipped Greek yoghurt & feta, cumin-chilli butter, mint, naan", price: "R145", img: img("704971"), diet: ["vegetarian"] },
      { category: "BRUNCH", name: "Smoked Salmon Benedict", desc: "Norwegian salmon, avo, poached eggs, hollandaise, capers, dill, sourdough", price: "R185", img: img("3338497"), diet: ["fish"] },
      { category: "BRUNCH", name: "African Eggs Benedict", desc: "Bobotie-spiced lamb, poached eggs, turmeric hollandaise, rye", price: "R155", img: img("357573") },
      { category: "BRUNCH", name: "Dukkah Shakshuka", desc: "Eggs poached in spiced tomato & pepper sauce, feta, herbs, flatbread", price: "R125", img: img("3735218"), diet: ["vegetarian", "gluten-free"] },
      { category: "BRUNCH", name: "Heritage Granola Bowl", desc: "House granola, Greek yoghurt, seasonal fruit, honey, toasted seeds", price: "R95", img: img("1099680"), diet: ["vegetarian"] },
      { category: "BRUNCH", name: "Chia & Coconut Breakfast", desc: "Chia pudding, almond milk, mango, toasted coconut, berries", price: "R95", img: img("1099680"), diet: ["vegetarian", "gluten-free"] },
    ],
  },
  {
    id: "cocktails",
    label: "Cocktail Bar",
    items: [
      { category: "SIGNATURE", name: "African Sunset", desc: "Passion fruit, amarula, orange juice, prosecco float", price: "R95", img: img("1283219") },
      { category: "SIGNATURE", name: "Durban Sling", desc: "Hendrick's gin, hibiscus syrup, ginger beer, lime", price: "R90", img: img("602750") },
      { category: "SIGNATURE", name: "The Dukkah Spice", desc: "Dark rum, cinnamon, honey, lime, soda", price: "R90", img: img("1170599") },
      { category: "SIGNATURE", name: "Peri-Peri Margarita", desc: "Tequila, triple sec, lime, peri-peri syrup, chilli salt rim", price: "R95", img: img("1304540"), diet: ["spicy"] },
      { category: "SIGNATURE", name: "Amarula Espresso Martini", desc: "Vodka, amarula, fresh espresso, coffee liqueur", price: "R100", img: img("33053") },
      { category: "MOCKTAIL", name: "Hibiscus Cooler", desc: "Hibiscus, ginger, lime, soda, mint", price: "R55", img: img("1170599"), diet: ["vegetarian"] },
    ],
  },
  {
    id: "wine",
    label: "Wine List",
    items: [
      { category: "BUBBLY", name: "Pongrácz Brut", desc: "Cap Classique — green apple, citrus, fresh bread", price: "R430", img: img("3171837") },
      { category: "ROSÉ", name: "Dawn Patrol Rosé", desc: "Dry, wild strawberries, pomegranate", price: "R275 / R70", img: img("1407846") },
      { category: "WHITE", name: "Durbanville Hills Sauvignon Blanc", desc: "Zesty lime, yellow fruits, vibrant acidity", price: "R200 / R60", img: img("1407846") },
      { category: "WHITE", name: "Ken Forrester Petit Chenin", desc: "Minerally, fruit & oak balanced", price: "R195 / R55", img: img("1407846") },
      { category: "WHITE", name: "Diemersdal Unwooded Chardonnay", desc: "Spicy aromas, fresh fruit", price: "R235 / R65", img: img("1407846") },
      { category: "BUBBLY", name: "Valdo Garda Prosecco", desc: "Floral, pear, delicate bubbles", price: "R325 / R90", img: img("3171837") },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    items: [
      { category: "DESSERT", name: "Malva Pudding", desc: "Traditional South African malva, amarula ice cream, caramel", price: "R95", img: img("291528") },
      { category: "DESSERT", name: "Malted Belgian Waffle", desc: "Amarula cream, dark chocolate shavings, caramelised banana", price: "R115", img: img("357573") },
      { category: "DESSERT", name: "Dark Chocolate Marquise", desc: "Salted caramel, cocoa tuile, gold leaf", price: "R110", img: img("3026808") },
      { category: "DESSERT", name: "Mango Panna Cotta", desc: "Coconut milk panna cotta, mango coulis, toasted coconut", price: "R90", img: img("1126359"), diet: ["gluten-free"] },
      { category: "DESSERT", name: "SA Cheese Board", desc: "Three local cheeses, quince paste, crackers, nuts, dried fruit", price: "R145", img: img("821365") },
      { category: "DESSERT", name: "Affogato", desc: "Double espresso poured over vanilla ice cream", price: "R65", img: img("851555") },
    ],
  },
  {
    id: "coffee",
    label: "Coffee & Drinks",
    items: [
      { category: "COFFEE", name: "Dukkah Cardamom Cappuccino", desc: "Double shot, steamed milk, cardamom-spiced foam", price: "R49", img: img("851555") },
      { category: "COFFEE", name: "Mega Cappuccino", desc: "220ml double shot", price: "R38", img: img("302899") },
      { category: "COFFEE", name: "Iced Coffee", desc: "Cold brew over ice, milk of choice", price: "R65", img: img("1187314") },
      { category: "TEA", name: "Rooibos Latté", desc: "Local rooibos, steamed milk, honey", price: "R45", img: img("904616") },
      { category: "JUICE", name: "Morning Detox", desc: "Carrot, apple, ginger, beetroot, celery", price: "R75", img: img("1346155"), diet: ["vegetarian", "gluten-free"] },
      { category: "SHAKE", name: "Salted Caramel Honeycomb", desc: "Thick milkshake, caramel sauce, honeycomb crunch", price: "R75", img: img("1346155") },
    ],
  },
  {
    id: "veg",
    label: "Vegetarian",
    items: [], // populated dynamically from diet flags
  },
];

// Populate vegetarian tab from all 🌿 items
MENU[6].items = MENU.slice(0, 6).flatMap((t) =>
  t.items.filter((i) => i.diet?.includes("vegetarian")).map((i) => ({ ...i, category: "PLANT-BASED" }))
);
