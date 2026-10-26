// Sip Avenue — Specialty Coffee Roasters & Tea Merchants
// Curated Product Catalog, Initial Testimonials, and Campaign Codes

const PRODUCTS_DATA = [
  {
    id: "sip-01",
    name: "Spanish Cortado Latte",
    category: "espresso",
    price: 185,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 142,
    badge: "House Favorite",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80",
    description: "Double ristretto extracted from our Sagada dark roast, swirled with sweet condensed milk, warm steamed dairy, and dusted lightly with crushed Ceylon cinnamon bark.",
    tastingNotes: "Condensed milk, dark cocoa crema, crushed cinnamon",
    origin: "Sagada, Mountain Province (1,500m)",
    process: "Washed Arabica",
    availableSizes: [
      { name: "Regular (8oz)", extra: 0 },
      { name: "Large (12oz)", extra: 35 }
    ],
    temperatureOptions: ["Hot (Traditional)", "Iced over hand-carved ice"],
    milkOptions: ["Whole Dairy", "Organic Oat (+₱35)", "Roasted Almond (+₱35)"],
    sweetnessOptions: ["Standard (Balanced)", "Half Sweet (Subtle)", "Unsweetened"]
  },
  {
    id: "sip-02",
    name: "Benguet Hand-Poured V60",
    category: "pourover",
    price: 190,
    originalPrice: null,
    rating: 5.0,
    reviewCount: 89,
    badge: "Single Origin",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    description: "Harvested by indigenous Ibaloi farmers on the mist-covered slopes of Atok, Benguet. Brewed to order through paper filter for translucent clarity, vibrant acidity, and honeyed finish.",
    tastingNotes: "Wild mountain honey, cacao nibs, calamansi peel",
    origin: "Atok, Benguet (1,650m)",
    process: "Yellow Honey Process",
    availableSizes: [
      { name: "Single Server (300ml)", extra: 0 },
      { name: "Sharing Carafe (500ml)", extra: 75 }
    ],
    temperatureOptions: ["Hot Pour-Over (93°C)", "Flash-Chilled on Japanese Ice"],
    milkOptions: ["Served Black"],
    sweetnessOptions: ["Pure (No Sweetener)", "Side Raw Honey (+₱20)"]
  },
  {
    id: "sip-03",
    name: "18-Hour Kyoto Cold Steep",
    category: "coldbrew",
    price: 195,
    originalPrice: 220,
    rating: 4.8,
    reviewCount: 116,
    badge: "Slow Brew",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=900&q=80",
    description: "Coarsely ground Sagada Typica steeped in chilled filtered mountain water for 18 slow hours. Crowned with a float of cold-whipped sea-salted caramel cream.",
    tastingNotes: "Bittersweet chocolate, toasted hazelnut, Maldon salt cream",
    origin: "Sagada & Benguet Blend",
    process: "Extended Cold Immersion",
    availableSizes: [
      { name: "Glass (12oz)", extra: 0 },
      { name: "Takeaway Flask (16oz)", extra: 40 }
    ],
    temperatureOptions: ["Chilled on Ice"],
    milkOptions: ["Sea Salt Cream Float", "Dairy-Free Oat Foam (+₱30)", "Black & Clean"],
    sweetnessOptions: ["House Recipe", "Low Sugar", "Unsweetened"]
  },
  {
    id: "sip-04",
    name: "Artisanal Dirty Ube Latte",
    category: "espresso",
    price: 215,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 204,
    badge: "Seasonal",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80",
    description: "Pure purple yam halaya slowly simmered with coconut nectar, textured with warm oat milk, and finished with a floating double shot of bold dark-roasted espresso.",
    tastingNotes: "Earthy purple yam, toasted coconut, roasted espresso",
    origin: "Bohol Ube & Benguet Espresso",
    process: "Artisan Reduction",
    availableSizes: [
      { name: "Regular (12oz)", extra: 0 },
      { name: "Large (16oz)", extra: 35 }
    ],
    temperatureOptions: ["Iced (Recommended)", "Hot & Steamed"],
    milkOptions: ["Creamy Oat Milk (Default)", "Whole Dairy", "Almond Milk (+₱20)"],
    sweetnessOptions: ["Balanced (Default)", "Less Sweet"]
  },
  {
    id: "sip-05",
    name: "Madagascar Vanilla Cortado",
    category: "espresso",
    price: 170,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 74,
    badge: "Classic",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
    description: "Equal proportions of dense double ristretto and warm textured whole milk, perfumed with real Madagascar bourbon vanilla bean infusion.",
    tastingNotes: "Woody vanilla, buttery crema, toasted almond",
    origin: "Benguet Single Origin",
    process: "Medium Drum Roast",
    availableSizes: [
      { name: "Traditional 6oz Glass", extra: 0 },
      { name: "Double 8oz", extra: 30 }
    ],
    temperatureOptions: ["Warm / Steamed (65°C)", "Iced Cortado"],
    milkOptions: ["Whole Dairy", "Oat Milk (+₱30)"],
    sweetnessOptions: ["Subtle Vanilla", "Unsweetened"]
  },
  {
    id: "sip-06",
    name: "Ceremonial Uji Matcha Cloud",
    category: "tea",
    price: 210,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 98,
    badge: "Kyoto Direct",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=900&q=80",
    description: "Spring-harvested ceremonial grade green tea from Uji, Kyoto. Whisked live with a bamboo chasen over iced oat milk and layered with an airy vanilla cold foam.",
    tastingNotes: "Vegetal sweetness, umami cream, delicate floral aroma",
    origin: "Uji, Kyoto, Japan",
    process: "Shade-Grown Stone Milled",
    availableSizes: [
      { name: "Regular (12oz)", extra: 0 },
      { name: "Large (16oz)", extra: 35 }
    ],
    temperatureOptions: ["Iced", "Hot Whisked (75°C)"],
    milkOptions: ["Minor Figures Oat", "Whole Dairy", "Almond Milk (+₱20)"],
    sweetnessOptions: ["Light Cane Sugar (Default)", "No Added Sugar"]
  },
  {
    id: "sip-07",
    name: "Calamansi & Honey Cold Brew Tonic",
    category: "coldbrew",
    price: 185,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 63,
    badge: "Botanical",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80",
    description: "A sparkling, crisp afternoon tonic. Cold brew concentrate layered over artisanal tonic water, fresh squeezed Palawan calamansi, and raw honey with rosemary.",
    tastingNotes: "Sparkling citrus zest, raw honeycomb, crisp espresso tonic",
    origin: "Palawan Calamansi & Sagada Arabica",
    process: "Botanical Infusion",
    availableSizes: [
      { name: "Highball (14oz)", extra: 0 }
    ],
    temperatureOptions: ["Iced & Sparkling"],
    milkOptions: ["No Milk (Clean Tonic)"],
    sweetnessOptions: ["Natural Honey Balance", "Less Sweet"]
  },
  {
    id: "sip-08",
    name: "Twice-Baked Almond Croissant",
    category: "pastry",
    price: 145,
    originalPrice: null,
    rating: 5.0,
    reviewCount: 162,
    badge: "Bakery",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80",
    description: "Laminated French butter croissant twice-baked with homemade California almond frangipane cream, dusted with powdered sugar and toasted sliced almonds.",
    tastingNotes: "Isigny butter, sweet almond cream, toasted golden crunch",
    origin: "Baked fresh daily at 6:30 AM",
    process: "72-Hour Laminated Dough",
    availableSizes: [
      { name: "Single Piece", extra: 0 },
      { name: "Pair (2 Pieces)", extra: 130 }
    ],
    temperatureOptions: ["Warmed in Deck Oven", "Room Temperature"],
    milkOptions: [],
    sweetnessOptions: []
  },
  {
    id: "sip-09",
    name: "Burnt Basque Cheesecake Slice",
    category: "pastry",
    price: 195,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 131,
    badge: "Bakery",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80",
    description: "Baked at high heat for a caramelized, dark blistered exterior that gives way to a velvety, molten cream cheese center infused with vanilla bean and flaky sea salt.",
    tastingNotes: "Caramelized crust, molten cream, flaky Maldon salt",
    origin: "In-House Pastry Kitchen",
    process: "High Heat Basque Bake",
    availableSizes: [
      { name: "Generous Slice", extra: 0 },
      { name: "Slice with Espresso Shot", extra: 90 }
    ],
    temperatureOptions: ["Chilled"],
    milkOptions: [],
    sweetnessOptions: []
  },
  {
    id: "sip-10",
    name: "Sagada Mountain Arabica (250g Whole Bean)",
    category: "beans",
    price: 490,
    originalPrice: 540,
    rating: 5.0,
    reviewCount: 95,
    badge: "Whole Bean",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=80",
    description: "Direct-trade high-altitude Typica and Bourbon varietals grown at 1,500m in the limestone cliffs of Mountain Province. Roasted every Tuesday on our drum roaster.",
    tastingNotes: "Dark chocolate truffle, roasted walnut, brown sugar",
    origin: "Sagada, Mountain Province",
    process: "Medium-Dark Roast · Altitude 1,500m",
    availableSizes: [
      { name: "250g Valve Bag", extra: 0 },
      { name: "500g Value Pack", extra: 430 }
    ],
    temperatureOptions: ["Whole Bean (Unopened)", "Ground: V60 / Drip", "Ground: French Press / Cold Brew", "Ground: Espresso"],
    milkOptions: [],
    sweetnessOptions: []
  },
  {
    id: "sip-11",
    name: "Benguet Typica Honey Lot (250g Whole Bean)",
    category: "beans",
    price: 540,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 62,
    badge: "Micro-Lot",
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=900&q=80",
    description: "A delicate yellow honey microlot from Tublay, Benguet. Fermented with natural mucilage intact to retain sweet stone fruit characteristics and floral tea finish.",
    tastingNotes: "Yellow peach, sugarcane, bergamot tea aroma",
    origin: "Tublay, Benguet",
    process: "Light-Medium Roast · Altitude 1,700m",
    availableSizes: [
      { name: "250g Valve Bag", extra: 0 },
      { name: "500g Value Pack", extra: 480 }
    ],
    temperatureOptions: ["Whole Bean (Unopened)", "Ground: V60 / Drip", "Ground: Aeropress / Chemex"],
    milkOptions: [],
    sweetnessOptions: []
  },
  {
    id: "sip-12",
    name: "Heat-Resistant Glass Server & Filter (600ml)",
    category: "beans",
    price: 980,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 48,
    badge: "Brew Ware",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80",
    description: "Borosilicate glass coffee server with ergonomic walnut wood collar, silicone gasket, and reusable stainless steel micro-mesh filter cone.",
    tastingNotes: "Heat resistant up to 150°C, 600ml capacity, dishwasher safe",
    origin: "Sip Avenue Equipment Co.",
    process: "Artisan Glassware",
    availableSizes: [
      { name: "600ml Glass Server Set", extra: 0 }
    ],
    temperatureOptions: ["Includes 10x unbleached paper filters"],
    milkOptions: [],
    sweetnessOptions: []
  }
];

const INITIAL_TESTIMONIALS = [
  {
    id: "rev-01",
    author: "Clara Mendoza",
    location: "Salcedo Village, Makati",
    date: "October 18",
    favoriteOrder: "Benguet Hand-Poured V60",
    comment: "The quietest, most thoughtful coffee in the city. The Atok honey lot has this clean, citrusy sweetness that doesn't need a grain of sugar. It arrives warm and perfectly extracted every morning."
  },
  {
    id: "rev-02",
    author: "Anton Valenzuela",
    location: "BGC, Taguig",
    date: "October 14",
    favoriteOrder: "18-Hour Kyoto Cold Steep",
    comment: "I used to buy Japanese canned cold brew until Sip Avenue launched. The salted caramel cream cap on the cold steep is restrained and not cloying. Consistent roast quality every single week."
  },
  {
    id: "rev-03",
    author: "Isabel Soriano",
    location: "Tomas Morato, QC",
    date: "October 08",
    favoriteOrder: "Spanish Cortado & Almond Croissant",
    comment: "The pastry is genuinely laminated—shatters in buttery flakes. Paired with the Spanish cortado, it has become our Saturday morning ritual before the city wakes up."
  }
];

const PROMO_CODES = {
  "RITUAL15": { type: "percent", value: 15, description: "15% off your morning order" },
  "SIP15": { type: "percent", value: 15, description: "15% off your first order" },
  "FREESHIP": { type: "shipping", value: 65, description: "Complimentary Metro Manila delivery" },
  "WELCOME50": { type: "fixed", value: 50, description: "₱50 off first purchase" }
};
