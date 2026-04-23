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
const p = (name: string) => `/photos/${name}`;
// Unsplash CDN for items without a matching in-house photo
const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&h=400&q=80`;

export const MENU: MenuTab[] = [
  {
    id: "alacarte",
    label: "À La Carte",
    items: [
      { category: "STARTER", name: "Dukkah-Crusted Kingklip Ceviche", desc: "Citrus-cured kingklip, cucumber, coriander oil, crispy capers", price: "R165", img: u("1559827260-dc66d52bef19"), diet: ["fish"] },
      { category: "STARTER", name: "Oxtail Croquettes", desc: "Slow-braised oxtail, chimichurri, peri-peri aioli", price: "R145", img: p("new-food-croquettes.jpeg") },
      { category: "STARTER", name: "Cape Malay Bobotie Spring Rolls", desc: "Spiced mince, apricot chutney, cucumber ribbons", price: "R125", img: u("1581802261290-991b38693d1b") },
      { category: "STARTER", name: "Peri-Peri Prawns", desc: "King prawns, garlic & herb butter, lemon, sourdough", price: "R175", img: p("new-food-prawns-1.jpeg"), diet: ["fish", "spicy"] },
      { category: "MAIN", name: "Slow-Braised Lamb Shank", desc: "Samp & beans, gremolata, red wine jus", price: "R345", img: u("1546069901-ba9599a7e63c") },
      { category: "MAIN", name: "Grilled Yellowfin Tuna", desc: "Peri-peri butter, sautéed broccolini, lemon", price: "R325", img: u("1598103442097-8b74394b95c6"), diet: ["fish"] },
      { category: "MAIN", name: "Pan-Seared Duck Breast", desc: "Orange & amarula reduction, creamy polenta, wilted greens", price: "R365", img: u("1554080221-cbf9e5bb9cae") },
      { category: "MAIN", name: "Mushroom & Spinach Bunny Chow", desc: "Cape Malay spiced curry, quarter loaf", price: "R185", img: u("1455619452474-d2be8b1e4e31"), diet: ["vegetarian", "gluten-free"] },
      { category: "MAIN", name: "Dukkah Wagyu Burger", desc: "Wagyu patty, aged gouda, caramelised onion jam, truffle aioli", price: "R285", img: u("1568901346375-23c9450c58cd") },
      { category: "MAIN", name: "Prawn & Calamari Linguine", desc: "King prawns, baby calamari, cherry tomato, white wine, garlic", price: "R295", img: p("new-food-prawns-2.jpeg"), diet: ["fish"] },
    ],
  },
  {
    id: "brunch",
    label: "Sunday Brunch",
    banner: "Sunday Brunch Jazz — Every Sunday, 11:00 to 15:00. Live music included.",
    items: [
      { category: "BRUNCH", name: "Dukkah Turkish Eggs", desc: "Poached eggs, whipped Greek yoghurt & feta, cumin-chilli butter, mint, naan", price: "R145", img: p("new-food-brunch-1.jpeg"), diet: ["vegetarian"] },
      { category: "BRUNCH", name: "Smoked Salmon Benedict", desc: "Norwegian salmon, avo, poached eggs, hollandaise, capers, dill, sourdough", price: "R185", img: p("new-food-benedict.jpeg"), diet: ["fish"] },
      { category: "BRUNCH", name: "African Eggs Benedict", desc: "Bobotie-spiced lamb, poached eggs, turmeric hollandaise, rye", price: "R155", img: p("new-food-brunch-2.jpeg") },
      { category: "BRUNCH", name: "Dukkah Shakshuka", desc: "Eggs poached in spiced tomato & pepper sauce, feta, herbs, flatbread", price: "R125", img: u("1527976325861-cc4c6b3c5d56"), diet: ["vegetarian", "gluten-free"] },
      { category: "BRUNCH", name: "Heritage Granola Bowl", desc: "House granola, Greek yoghurt, seasonal fruit, honey, toasted seeds", price: "R95", img: u("1516685313867-4e904b58afa1"), diet: ["vegetarian"] },
      { category: "SUSHI", name: "Sushi Selection Platter", desc: "Chef's selection of nigiri, maki and sashimi, soy & wasabi", price: "R295", img: p("new-sushi-4.jpeg"), diet: ["fish"] },
      { category: "SUSHI", name: "Salmon Sashimi", desc: "Fresh Norwegian salmon, ponzu, ginger", price: "R185", img: p("new-sushi-3.jpeg"), diet: ["fish"] },
      { category: "SUSHI", name: "Rainbow Maki (8 pcs)", desc: "Salmon, tuna, avo, prawn, cucumber, sesame", price: "R165", img: p("new-sushi-1.jpeg"), diet: ["fish"] },
    ],
  },
  {
    id: "cocktails",
    label: "Cocktail Bar",
    items: [
      { category: "SIGNATURE", name: "African Sunset", desc: "Passion fruit, amarula, orange juice, prosecco float", price: "R95", img: p("new-cocktail-orange.jpeg") },
      { category: "SIGNATURE", name: "Durban Sling", desc: "Hendrick's gin, hibiscus syrup, ginger beer, lime", price: "R90", img: p("new-cocktail-blue.jpeg") },
      { category: "SIGNATURE", name: "The Dukkah Spice", desc: "Dark rum, cinnamon, honey, lime, soda", price: "R90", img: p("new-cocktail-dark.jpeg") },
      { category: "SIGNATURE", name: "Peri-Peri Margarita", desc: "Tequila, triple sec, lime, peri-peri syrup, chilli salt rim", price: "R95", img: p("new-cocktail-red.jpeg"), diet: ["spicy"] },
      { category: "SIGNATURE", name: "Amarula Espresso Martini", desc: "Vodka, amarula, fresh espresso, coffee liqueur", price: "R100", img: p("new-cocktail-top.jpeg") },
      { category: "SIGNATURE", name: "Rooibos Old Fashioned", desc: "Bourbon, rooibos syrup, orange bitters, smoked orange peel", price: "R95", img: p("new-cocktail-amber.jpeg") },
      { category: "MOCKTAIL", name: "Hibiscus Cooler", desc: "Hibiscus, ginger, lime, soda, mint", price: "R55", img: p("new-cocktail-green.jpeg"), diet: ["vegetarian"] },
      { category: "MOCKTAIL", name: "African Spice Mule", desc: "Ginger beer, passion fruit, lime, cinnamon, soda", price: "R60", img: u("1536305816828-e1ca1f6d95e6"), diet: ["vegetarian"] },
    ],
  },
  {
    id: "wine",
    label: "Wine List",
    items: [
      { category: "BUBBLY", name: "Pongrácz Brut", desc: "Cap Classique — green apple, citrus, fresh bread", price: "R430", img: p("new-champagne-wall.jpeg") },
      { category: "ROSÉ", name: "Dawn Patrol Rosé", desc: "Dry, wild strawberries, pomegranate", price: "R275 / R70", img: p("new-wine-2.png") },
      { category: "WHITE", name: "Durbanville Hills Sauvignon Blanc", desc: "Zesty lime, yellow fruits, vibrant acidity", price: "R200 / R60", img: p("new-wine-3.png") },
      { category: "WHITE", name: "Ken Forrester Petit Chenin", desc: "Minerally, fruit & oak balanced", price: "R195 / R55", img: p("new-wine-1.png") },
      { category: "WHITE", name: "Diemersdal Unwooded Chardonnay", desc: "Spicy aromas, fresh fruit", price: "R235 / R65", img: p("new-wine-service.jpeg") },
      { category: "BUBBLY", name: "Valdo Garda Prosecco", desc: "Floral, pear, delicate bubbles", price: "R325 / R90", img: p("new-bar-champagne.jpeg") },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    items: [
      { category: "DESSERT", name: "Malva Pudding", desc: "Traditional South African malva, amarula ice cream, caramel", price: "R95", img: p("new-food-dessert-3.jpeg") },
      { category: "DESSERT", name: "Malted Belgian Waffle", desc: "Amarula cream, dark chocolate shavings, caramelised banana", price: "R115", img: u("1614707267537-b85faf00021b") },
      { category: "DESSERT", name: "Dark Chocolate Marquise", desc: "Salted caramel, cocoa tuile, gold leaf", price: "R110", img: p("new-food-dessert-1.jpeg") },
      { category: "DESSERT", name: "Mango Panna Cotta", desc: "Coconut milk panna cotta, mango coulis, toasted coconut", price: "R90", img: p("new-food-dessert-2.jpeg"), diet: ["gluten-free"] },
      { category: "DESSERT", name: "SA Cheese Board", desc: "Three local cheeses, quince paste, crackers, nuts, dried fruit", price: "R145", img: u("1589985643453-e5c5db61d68f") },
      { category: "DESSERT", name: "Affogato", desc: "Double espresso poured over vanilla ice cream", price: "R65", img: u("1461023058943-07fcbe16d735") },
    ],
  },
  {
    id: "coffee",
    label: "Coffee & Drinks",
    items: [
      { category: "COFFEE", name: "Dukkah Cardamom Cappuccino", desc: "Double shot, steamed milk, cardamom-spiced foam", price: "R49", img: u("1511537190424-e5b84d0acb5c") },
      { category: "COFFEE", name: "Mega Cappuccino", desc: "220ml double shot", price: "R38", img: u("1509042239860-f550ce710b93") },
      { category: "COFFEE", name: "Iced Coffee", desc: "Cold brew over ice, milk of choice", price: "R65", img: u("1517668808822-9ebb02ae2a0e") },
      { category: "TEA", name: "Rooibos Latté", desc: "Local rooibos, steamed milk, honey", price: "R45", img: u("1551632786-a3d8a5d35f7a") },
      { category: "JUICE", name: "Morning Detox", desc: "Carrot, apple, ginger, beetroot, celery", price: "R75", img: u("1553530666-ba953a5ad259"), diet: ["vegetarian", "gluten-free"] },
      { category: "SHAKE", name: "Salted Caramel Honeycomb", desc: "Thick milkshake, caramel sauce, honeycomb crunch", price: "R75", img: u("1553283169-83dff1d2e9bf") },
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
