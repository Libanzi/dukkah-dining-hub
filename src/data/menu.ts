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

export const MENU: MenuTab[] = [
  {
    id: "alacarte",
    label: "À La Carte",
    items: [
      // No in-house ceviche photo — omit img
      { category: "STARTER", name: "Dukkah-Crusted Kingklip Ceviche", desc: "Citrus-cured kingklip, cucumber, coriander oil, crispy capers", price: "R165", diet: ["fish"] },
      // brunch-3: fried croquette balls in cream sauce — matches oxtail croquettes
      { category: "STARTER", name: "Oxtail Croquettes", desc: "Slow-braised oxtail, chimichurri, peri-peri aioli", price: "R145", img: p("brunch-3") },
      // No spring rolls photo — omit img
      { category: "STARTER", name: "Cape Malay Bobotie Spring Rolls", desc: "Spiced mince, apricot chutney, cucumber ribbons", price: "R125" },
      // food-10: king prawns with orange peri-peri sauce and lemon — perfect match
      { category: "STARTER", name: "Peri-Peri Prawns", desc: "King prawns, garlic & herb butter, lemon, sourdough", price: "R175", img: p("food-10"), diet: ["fish", "spicy"] },
      // food-18: rack of lamb with dukkah crust, broccolini, mash — lamb dish
      { category: "MAIN", name: "Slow-Braised Lamb Shank", desc: "Samp & beans, gremolata, red wine jus", price: "R345", img: p("food-18") },
      // food-23: fish fillet with prawn and sauce — fish main
      { category: "MAIN", name: "Grilled Yellowfin Tuna", desc: "Peri-peri butter, sautéed broccolini, lemon", price: "R325", img: p("food-23"), diet: ["fish"] },
      // bar-10: elegant fillet with carrots, jus, greens — duck/meat main from Dukkah's own feed
      { category: "MAIN", name: "Pan-Seared Duck Breast", desc: "Orange & amarula reduction, creamy polenta, wilted greens", price: "R365", img: p("bar-10") },
      // No bunny chow photo — omit img
      { category: "MAIN", name: "Mushroom & Spinach Bunny Chow", desc: "Cape Malay spiced curry, quarter loaf", price: "R185", diet: ["vegetarian", "gluten-free"] },
      // bar-13: dukkah-crusted beef with bone marrow, mash, broccolini — premium wagyu beef preparation
      { category: "MAIN", name: "Dukkah Wagyu Burger", desc: "Wagyu patty, aged gouda, caramelised onion jam, truffle aioli", price: "R285", img: p("bar-13") },
      // food-20: mussels and calamari linguine in cream sauce — perfect match
      { category: "MAIN", name: "Prawn & Calamari Linguine", desc: "King prawns, baby calamari, cherry tomato, white wine, garlic", price: "R295", img: p("food-20"), diet: ["fish"] },
    ],
  },
  {
    id: "brunch",
    label: "Sunday Brunch",
    banner: "Sunday Brunch Jazz — Every Sunday, 11:00 to 15:00. Live music included.",
    items: [
      // brunch-1: eggs with tomato sauce on toast — matches Turkish eggs style
      { category: "BRUNCH", name: "Dukkah Turkish Eggs", desc: "Poached eggs, whipped Greek yoghurt & feta, cumin-chilli butter, mint, naan", price: "R145", img: p("brunch-1"), diet: ["vegetarian"] },
      // brunch-2: classic eggs benedict with hollandaise — perfect match
      { category: "BRUNCH", name: "Smoked Salmon Benedict", desc: "Norwegian salmon, avo, poached eggs, hollandaise, capers, dill, sourdough", price: "R185", img: p("brunch-2"), diet: ["fish"] },
      // No second benedict photo — omit img
      { category: "BRUNCH", name: "African Eggs Benedict", desc: "Bobotie-spiced lamb, poached eggs, turmeric hollandaise, rye", price: "R155" },
      // wine-3: shakshuka baked in ramekin with avocado and bread from Dukkah's own IG — perfect
      { category: "BRUNCH", name: "Dukkah Shakshuka", desc: "Eggs poached in spiced tomato & pepper sauce, feta, herbs, flatbread", price: "R125", img: p("wine-3"), diet: ["vegetarian", "gluten-free"] },
      // No granola photo — omit img
      { category: "BRUNCH", name: "Heritage Granola Bowl", desc: "House granola, Greek yoghurt, seasonal fruit, honey, toasted seeds", price: "R95", diet: ["vegetarian"] },
      // brunch-8: full sushi platter with variety of nigiri, maki, prawn — perfect match
      { category: "SUSHI", name: "Sushi Selection Platter", desc: "Chef's selection of nigiri, maki and sashimi, soy & wasabi", price: "R295", img: p("brunch-8"), diet: ["fish"] },
      // No sashimi slices photo — omit img
      { category: "SUSHI", name: "Salmon Sashimi", desc: "Fresh Norwegian salmon, ponzu, ginger", price: "R185", diet: ["fish"] },
      // brunch-7: 5 maki rolls on plate with soy sauce and ginger — perfect match
      { category: "SUSHI", name: "Rainbow Maki (8 pcs)", desc: "Salmon, tuna, avo, prawn, cucumber, sesame", price: "R165", img: p("brunch-7"), diet: ["fish"] },
    ],
  },
  {
    id: "cocktails",
    label: "Cocktail Bar",
    items: [
      // bar-5: orange/amber tropical cocktail with ice — passion fruit & OJ sunset colours
      { category: "SIGNATURE", name: "African Sunset", desc: "Passion fruit, amarula, orange juice, prosecco float", price: "R95", img: p("bar-5") },
      // food-6: yellow cocktail with pineapple & cherry — tropical gin-style drink
      { category: "SIGNATURE", name: "Durban Sling", desc: "Hendrick's gin, hibiscus syrup, ginger beer, lime", price: "R90", img: p("food-6") },
      // food-2: dark red cocktail in stemmed glass — dark rum, cinnamon, honey
      { category: "SIGNATURE", name: "The Dukkah Spice", desc: "Dark rum, cinnamon, honey, lime, soda", price: "R90", img: p("food-2") },
      // No margarita-style photo — omit img
      { category: "SIGNATURE", name: "Peri-Peri Margarita", desc: "Tequila, triple sec, lime, peri-peri syrup, chilli salt rim", price: "R95", diet: ["spicy"] },
      // No espresso martini photo — omit img
      { category: "SIGNATURE", name: "Amarula Espresso Martini", desc: "Vodka, amarula, fresh espresso, coffee liqueur", price: "R100" },
      // bar-7: dark layered cocktail in coupe with orange peel — bourbon old fashioned style
      { category: "SIGNATURE", name: "Rooibos Old Fashioned", desc: "Bourbon, rooibos syrup, orange bitters, smoked orange peel", price: "R95", img: p("bar-7") },
      // bar-2: vibrant green cocktail in coupe — hibiscus/lime/mint mocktail
      { category: "MOCKTAIL", name: "Hibiscus Cooler", desc: "Hibiscus, ginger, lime, soda, mint", price: "R55", img: p("bar-2"), diet: ["vegetarian"] },
      // No mule-style photo — omit img
      { category: "MOCKTAIL", name: "African Spice Mule", desc: "Ginger beer, passion fruit, lime, cinnamon, soda", price: "R60", diet: ["vegetarian"] },
    ],
  },
  {
    id: "wine",
    label: "Wine List",
    items: [
      // bar-1: two people toasting with champagne flutes — Cap Classique celebration
      { category: "BUBBLY", name: "Pongrácz Brut", desc: "Cap Classique — green apple, citrus, fresh bread", price: "R430", img: p("bar-1") },
      // wine-2: rosé-tinted champagne flute with brunch — rosé bubbly
      { category: "ROSÉ", name: "Dawn Patrol Rosé", desc: "Dry, wild strawberries, pomegranate", price: "R275 / R70", img: p("wine-2") },
      // wine-1: private dinner event with Durbanville Hills bottle visible on table
      { category: "WHITE", name: "Durbanville Hills Sauvignon Blanc", desc: "Zesty lime, yellow fruits, vibrant acidity", price: "R200 / R60", img: p("wine-1") },
      // bar-6: wine cellar wall with rows of bottles — curated wine collection
      { category: "WHITE", name: "Ken Forrester Petit Chenin", desc: "Minerally, fruit & oak balanced", price: "R195 / R55", img: p("bar-6") },
      // wine-4: wine wall lounge interior — ambient wine bar setting
      { category: "WHITE", name: "Diemersdal Unwooded Chardonnay", desc: "Spicy aromas, fresh fruit", price: "R235 / R65", img: p("wine-4") },
      // brunch-5: elegant champagne bottle display wall — prosecco celebration
      { category: "BUBBLY", name: "Valdo Garda Prosecco", desc: "Floral, pear, delicate bubbles", price: "R325 / R90", img: p("brunch-5") },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    items: [
      // food-17: elegant dessert — caramel, sorbet, edible flowers on stone plate
      { category: "DESSERT", name: "Malva Pudding", desc: "Traditional South African malva, amarula ice cream, caramel", price: "R95", img: p("food-17") },
      // No waffle photo — omit img
      { category: "DESSERT", name: "Malted Belgian Waffle", desc: "Amarula cream, dark chocolate shavings, caramelised banana", price: "R115" },
      // food-15: elegant red-sphere dessert on dark plate with chocolate crumb and flowers
      { category: "DESSERT", name: "Dark Chocolate Marquise", desc: "Salted caramel, cocoa tuile, gold leaf", price: "R110", img: p("food-15") },
      // food-21: cream panna cotta in glass with fresh mixed fruit and butter biscuits
      { category: "DESSERT", name: "Mango Panna Cotta", desc: "Coconut milk panna cotta, mango coulis, toasted coconut", price: "R90", img: p("food-21"), diet: ["gluten-free"] },
      // No cheese board photo — omit img
      { category: "DESSERT", name: "SA Cheese Board", desc: "Three local cheeses, quince paste, crackers, nuts, dried fruit", price: "R145" },
      // No affogato photo — omit img
      { category: "DESSERT", name: "Affogato", desc: "Double espresso poured over vanilla ice cream", price: "R65" },
    ],
  },
  {
    id: "coffee",
    label: "Coffee & Drinks",
    items: [
      // No in-house coffee photos — omit all imgs
      { category: "COFFEE", name: "Dukkah Cardamom Cappuccino", desc: "Double shot, steamed milk, cardamom-spiced foam", price: "R49" },
      { category: "COFFEE", name: "Mega Cappuccino", desc: "220ml double shot", price: "R38" },
      { category: "COFFEE", name: "Iced Coffee", desc: "Cold brew over ice, milk of choice", price: "R65" },
      { category: "TEA", name: "Rooibos Latté", desc: "Local rooibos, steamed milk, honey", price: "R45" },
      { category: "JUICE", name: "Morning Detox", desc: "Carrot, apple, ginger, beetroot, celery", price: "R75", diet: ["vegetarian", "gluten-free"] },
      { category: "SHAKE", name: "Salted Caramel Honeycomb", desc: "Thick milkshake, caramel sauce, honeycomb crunch", price: "R75" },
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
