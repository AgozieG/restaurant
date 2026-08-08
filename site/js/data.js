// Daisy Life menu data (from the restaurant's published Grills & BBQ and Pasta & Rice menus)
const SIDES = [
  { name: "Chips", price: 2500 },
  { name: "Bole", price: 1500 },
  { name: "Coleslaw", price: 1500 },
  { name: "Yam", price: 1500 },
  { name: "Fried Plantain", price: 1000 },
  { name: "Extra Pepper Sauce", price: 1000 },
  { name: "Extra Rice", price: 3000 },
  { name: "Stir Fried Veggies", price: 2000 },
  { name: "Boiled Egg", price: 1000 },
];

const DRINKS = [
  { name: "Soft drink", price: 800 },
  { name: "Zobo", price: 800 },
  { name: "Parfait", price: 4000 },
  { name: "Milkshake", price: 4000 },
];

const PROTEINS = [
  { name: "Chicken lap", price: 5500 },
  { name: "Turkey", price: 7500 },
  { name: "Beef kebab", price: 3500 },
  { name: "Titus fish", price: 3500 },
  { name: "Cut catfish (body)", price: 3500 },
  { name: "Cut catfish (tail)", price: 4000 },
  { name: "Asun", price: 5000 },
];

const SAUCES = [
  { name: "Curry sauce", price: 5000 },
  { name: "Assorted meat sauce", price: 5000 },
  { name: "Vegetable meat sauce", price: 7000 },
  { name: "Chilli sauce", price: 1000 },
];

const WING_FLAVOURS = ["Peppered", "Honey glazed", "Crunchy", "BBQ", "Sauced"];

const MENU = [
  // ---- Best sellers ----
  {
    id: "combo-chicken", cat: "combos", badge: "Huge value", hot: true,
    name: "Whole Chicken BBQ Combo", base: 25000,
    desc: "Whole grilled chicken + 2 sides + pepper sauce.",
    options: [
      { key: "sides", label: "Pick your 2 sides", type: "multi", items: SIDES },
      { key: "drink", label: "Add a drink", type: "single", items: DRINKS, optional: true },
    ],
  },
  {
    id: "combo-catfish", cat: "combos", badge: "Best seller",
    name: "Whole Catfish BBQ Combo", base: 25000,
    desc: "Whole grilled catfish + 2 sides + pepper sauce.",
    options: [
      { key: "sides", label: "Pick your 2 sides", type: "multi", items: SIDES },
      { key: "drink", label: "Add a drink", type: "single", items: DRINKS, optional: true },
    ],
  },
  {
    id: "smoky-spag", cat: "combos", badge: "Most ordered", hot: true,
    name: "Smoky Spaghetti & Chicken", base: 10000,
    desc: "Spaghetti + chicken + sauce, smoked the Daisy way.",
    options: [
      { key: "extras", label: "Make it better", type: "multi", items: SIDES, optional: true },
      { key: "drink", label: "Wash it down with", type: "single", items: DRINKS, optional: true },
    ],
  },
  {
    id: "friedrice-chicken", cat: "combos",
    name: "Fried Rice & Chicken", base: 10000,
    desc: "Fried rice + chicken + coleslaw.",
    options: [
      { key: "extras", label: "Make it better", type: "multi", items: SIDES, optional: true },
      { key: "drink", label: "Wash it down with", type: "single", items: DRINKS, optional: true },
    ],
  },
  {
    id: "noodles-kebab", cat: "combos",
    name: "Singapore Noodles & Beef Kebab", base: 9800,
    desc: "Singapore noodles + beef kebab + chilli sauce.",
    options: [
      { key: "extras", label: "Make it better", type: "multi", items: SIDES, optional: true },
      { key: "drink", label: "Wash it down with", type: "single", items: DRINKS, optional: true },
    ],
  },

  // ---- Grills & BBQ ----
  {
    id: "chicken-lap-meal", cat: "grills",
    name: "Chicken Lap BBQ Meal", base: 8500,
    desc: "Chicken lap + 1 side + pepper sauce.",
    options: [
      { key: "side", label: "Choose your side", type: "single", items: SIDES },
      { key: "extras", label: "Make it a full plate", type: "multi", items: SIDES, optional: true },
    ],
  },
  {
    id: "half-chicken-meal", cat: "grills",
    name: "Half Chicken BBQ Meal", base: 15500,
    desc: "½ whole chicken + 2 sides.",
    options: [
      { key: "sides", label: "Pick your 2 sides", type: "multi", items: SIDES },
      { key: "drink", label: "Pick a drink", type: "single", items: DRINKS, optional: true },
    ],
  },
  {
    id: "catfish-body", cat: "grills",
    name: "Cut Catfish Meal — Body", base: 6000,
    desc: "Grilled body cut + 1 side.",
    options: [{ key: "side", label: "Choose your side", type: "single", items: SIDES }],
  },
  {
    id: "catfish-tail", cat: "grills",
    name: "Cut Catfish Meal — Tail", base: 7000,
    desc: "Grilled tail cut + 1 side.",
    options: [{ key: "side", label: "Choose your side", type: "single", items: SIDES }],
  },
  {
    id: "wings-platter", cat: "grills", badge: "Sharing",
    name: "BBQ Wings Platter", base: 8000,
    desc: "A loaded platter of wings — choose any flavour.",
    options: [
      { key: "flavour", label: "Available flavours", type: "single", items: WING_FLAVOURS.map((f) => ({ name: f, price: 0 })) },
      { key: "extras", label: "Make it a full plate", type: "multi", items: SIDES, optional: true },
    ],
  },
  {
    id: "peppered-turkey", cat: "grills",
    name: "Peppered Turkey", base: 7500,
    desc: "Turkey drenched in Daisy pepper blend.",
    options: [{ key: "extras", label: "Make it a full plate", type: "multi", items: SIDES, optional: true }],
  },
  {
    id: "grilled-turkey", cat: "grills",
    name: "Grilled Turkey", base: 7500,
    desc: "Slow grilled turkey, smoky and tender.",
    options: [{ key: "extras", label: "Make it a full plate", type: "multi", items: SIDES, optional: true }],
  },

  // ---- Pasta ----
  {
    id: "singapore-noodles", cat: "pasta",
    name: "Singapore Noodles", base: 5000,
    desc: "Wok-tossed noodles. Pick your protein below.",
    options: [
      { key: "protein", label: "Pick your protein", type: "single", items: PROTEINS, optional: true },
      { key: "sauce", label: "Choose your sauce", type: "single", items: SAUCES, optional: true },
      { key: "extras", label: "Make it better", type: "multi", items: SIDES, optional: true },
    ],
  },
  {
    id: "spaghetti", cat: "pasta",
    name: "Spaghetti", base: 3800,
    desc: "Classic Daisy spaghetti. Pick your protein below.",
    options: [
      { key: "protein", label: "Pick your protein", type: "single", items: PROTEINS, optional: true },
      { key: "sauce", label: "Choose your sauce", type: "single", items: SAUCES, optional: true },
      { key: "extras", label: "Make it better", type: "multi", items: SIDES, optional: true },
    ],
  },
  {
    id: "macaroni", cat: "pasta",
    name: "Macaroni", base: 3500,
    desc: "Comforting macaroni, your way.",
    options: [
      { key: "protein", label: "Pick your protein", type: "single", items: PROTEINS, optional: true },
      { key: "sauce", label: "Choose your sauce", type: "single", items: SAUCES, optional: true },
      { key: "extras", label: "Make it better", type: "multi", items: SIDES, optional: true },
    ],
  },

  // ---- Rice ----
  {
    id: "fried-rice", cat: "rice",
    name: "Fried Rice", base: 3800,
    desc: "Party-style fried rice with veggies.",
    options: [
      { key: "protein", label: "Pick your protein", type: "single", items: PROTEINS, optional: true },
      { key: "extras", label: "Make it better", type: "multi", items: SIDES, optional: true },
    ],
  },
  {
    id: "jollof-rice", cat: "rice", badge: "Local favourite",
    name: "Jollof Rice", base: 3500,
    desc: "Smoky Enugu jollof, deeply seasoned.",
    options: [
      { key: "protein", label: "Pick your protein", type: "single", items: PROTEINS, optional: true },
      { key: "extras", label: "Make it better", type: "multi", items: SIDES, optional: true },
    ],
  },
  {
    id: "white-rice", cat: "rice",
    name: "White Rice / Spaghetti", base: 2000,
    desc: "Plain base — add a sauce and protein.",
    options: [
      { key: "sauce", label: "Choose your sauce", type: "single", items: SAUCES, optional: true },
      { key: "protein", label: "Pick your protein", type: "single", items: PROTEINS, optional: true },
    ],
  },
  {
    id: "dirty-rice", cat: "rice",
    name: "Dirty Rice (Basmati)", base: 5000,
    desc: "Basmati cooked down with spice and meat.",
    options: [
      { key: "protein", label: "Pick your protein", type: "single", items: PROTEINS, optional: true },
      { key: "extras", label: "Make it better", type: "multi", items: SIDES, optional: true },
    ],
  },

  // ---- Sides & drinks as standalone ----
  ...SIDES.map((s) => ({
    id: "side-" + s.name.toLowerCase().replace(/[^a-z]+/g, "-"), cat: "sides",
    name: s.name, base: s.price, desc: "Served hot and fresh on the side.", options: [],
  })),
  ...DRINKS.map((d) => ({
    id: "drink-" + d.name.toLowerCase().replace(/[^a-z]+/g, "-"), cat: "drinks",
    name: d.name, base: d.price, desc: "Cold & refreshing.", options: [],
  })),
];

const CATEGORIES = [
  { key: "all", label: "Everything" },
  { key: "combos", label: "🔥 Best sellers" },
  { key: "grills", label: "Grills & BBQ" },
  { key: "pasta", label: "Pasta" },
  { key: "rice", label: "Rice" },
  { key: "sides", label: "Sides" },
  { key: "drinks", label: "Drinks" },
];

window.DAISY_DATA = { MENU, CATEGORIES, SIDES, DRINKS, PROTEINS, SAUCES };
