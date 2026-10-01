const fs = require('fs');
const path = require('path');

const sitePath = path.join(__dirname, '..', 'src', 'data', 'site_content.json');
const content = JSON.parse(fs.readFileSync(sitePath, 'utf8'));

// 1. Hero: Slides restored to original 3D collection, with Slide 1 being the LONG DOSA
content.hero = {
  badge: "✦ PURE VEGETARIAN FINE DINING ✦",
  title: "South Indian Vegetarian Restaurant Amersham",
  subtitle: "Top-rated South-Indian Vegetarian Dining • Crispy Dosas & Authentic Thalis • Family-Friendly Dining",
  primaryCta: {
    text: "View Menu",
    link: "/#menu"
  },
  secondaryCta: {
    text: "Order Online",
    link: "/#order"
  },
  slides: [
    {
      id: 1,
      image: "/images/long-dosa-feast.png",
      title: "Traditional Golden Long Masala Dosa Feast"
    },
    {
      id: 2,
      image: "/images/3d/paneer-tikka-3d.jpg",
      title: "Royal Paneer Tikka"
    },
    {
      id: 3,
      image: "/images/3d/idli-vada-3d.jpg",
      title: "Steamed Idli & Medu Vada"
    },
    {
      id: 4,
      image: "/images/3d/thali-royal-3d.jpg",
      title: "Grand Royal Feast Thali"
    },
    {
      id: 5,
      image: "/images/3d/filter-coffee-3d.jpg",
      title: "Kumbakonam Filter Coffee"
    }
  ]
};

// 2. About: Restored to original 3D layout with stats and restaurant feast
content.about = {
  badge: "Since 2011 • Pure Heritage",
  title: "Award-Winning South Indian Vegetarian Restaurant Amersham",
  paragraphs: [
    "Welcome to Veg Chennai SriLalitha (VCS) Amersham, the premier destination for authentic, traditional South Indian vegetarian and vegan cuisine in Buckinghamshire.",
    "Rooted in centuries-old recipes from Chennai, our master chefs grind our batter fresh daily using stone grinders and prepare every sambar, rasam, and chutney from scratch using hand-roasted spices and cold-pressed sesame oil.",
    "Whether you are craving a paper-thin crispy ghee roast dosa, a rich paneer butter masala, or an elaborate royal thali, we offer a warm, family-friendly atmosphere that makes every meal a celebration."
  ],
  image: "/images/3d/restaurant-feast-3d.jpg",
  stats: [
    {
      label: "UK Locations",
      value: "5+",
      desc: "Across England"
    },
    {
      label: "Years Experience",
      value: "15+",
      desc: "Culinary Mastery"
    },
    {
      label: "Pure Vegetarian",
      value: "100%",
      desc: "Dedicated Kitchen"
    },
    {
      label: "Happy Diners",
      value: "5,000+",
      desc: "5-Star Community"
    }
  ]
};

// 3. Top Food: 4 3D Glassy Cards (with Card 1 = Long Dosa)
content.topFood = {
  badge: "Gastronomic Excellence",
  title: "Top Food",
  subtitle: "Indulge in our masterfully prepared South Indian vegetarian specialties, crafted with pure ghee, stone-ground batters, and hand-roasted spices.",
  items: [
    {
      id: 1,
      name: "Masala Dosa",
      category: "Dosa Corner",
      price: "£8.95",
      rating: 4.9,
      description: "Crispy golden fermented crepe stuffed with spiced potato masala, served with 3 signature chutneys & hot lentil sambar.",
      image: "/images/long-dosa-feast.png",
      tag: "Bestseller"
    },
    {
      id: 2,
      name: "Paneer Tikka",
      category: "Tandoori Starters",
      price: "£9.95",
      rating: 4.8,
      description: "Char-grilled fresh cottage cheese cubes marinated in Kashmiri chili, hung yogurt & roasted spices.",
      image: "/images/3d/paneer-tikka-3d.jpg",
      tag: "Chef Special"
    },
    {
      id: 3,
      name: "Idli Vada Combo",
      category: "Tiffins",
      price: "£7.95",
      rating: 4.8,
      description: "Pillowy steamed rice cakes and golden crunchy medu vada served with piping hot vegetable sambar & fresh coconut chutney.",
      image: "/images/3d/idli-vada-3d.jpg",
      tag: "Traditional"
    },
    {
      id: 4,
      name: "Royal South Indian Thali",
      category: "Signature Meals",
      price: "£14.95",
      rating: 4.9,
      description: "An imperial platter featuring 2 vegetable curries, kootu, dal, rasam, hot sambar, poori, fragrant basmati rice & traditional sweet.",
      image: "/images/3d/thali-royal-3d.jpg",
      tag: "Grand Feast"
    }
  ]
};

// 4. Catering: Restored to original 3D layout
content.catering = {
  badge: "Special Events & Celebrations",
  title: "Bring the Flavours to Your Event",
  description: "Whether it’s a corporate gathering, wedding celebration, or private party, our catering services bring authentic South Indian vegetarian cuisine to your venue. We handle everything from menu planning to setup, ensuring your event is a delicious success.",
  features: [
    {
      title: "Corporate Events",
      desc: "Impress your colleagues with authentic South Indian cuisine for office gatherings."
    },
    {
      title: "Weddings & Parties",
      desc: "Make your special day memorable with our traditional catering services."
    },
    {
      title: "Private Functions",
      desc: "Customized menus for intimate celebrations and family gatherings."
    }
  ],
  outdoorButtonText: "Outdoor Catering",
  outdoorButtonLink: "/outdoor-catering",
  liveDosaButtonText: "Live Dosa Catering",
  liveDosaButtonLink: "/live-dosa-catering",
  image: "/images/3d/restaurant-feast-3d.jpg"
};

// 5. Why Choose Us
content.whyChooseUs = {
  badge: "Pure Authenticity",
  title: "Why Families Love Us",
  cards: [
    {
      title: "Authentic Recipes",
      desc: "Traditional Chennai recipes passed down through generations, prepared fresh daily."
    },
    {
      title: "Expert Chefs",
      desc: "Skilled chefs from Chennai bringing theatrical live dosa and vada stations."
    },
    {
      title: "Award Winning",
      desc: "Recognized as World's Favourite Dosa Place with consistent 5-star ratings."
    },
    {
      title: "Family Friendly",
      desc: "Warm atmosphere perfect for families, celebrations, and corporate events."
    }
  ]
};

// Save locally
fs.writeFileSync(sitePath, JSON.stringify(content, null, 2), 'utf8');
console.log('Restored 3D glassy content schema to src/data/site_content.json');

// Sync to Firebase Cloud Firestore
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCd6EskMn3ED4SJ2FeeiWwOtYP1nXaKxeU';
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'vcs-amersham';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

fetch(`${FIRESTORE_BASE}/content/site?key=${API_KEY}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fields: {
      data: { stringValue: JSON.stringify(content) },
      updatedAt: { stringValue: new Date().toISOString() }
    }
  })
}).then(res => {
  console.log('Firebase Cloud Firestore sync HTTP status:', res.status);
}).catch(err => {
  console.error('Firebase Cloud sync error:', err.message);
});
