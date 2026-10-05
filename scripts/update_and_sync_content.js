const fs = require('fs');
const path = require('path');

const sitePath = path.join(__dirname, '..', 'src', 'data', 'site_content.json');
const content = JSON.parse(fs.readFileSync(sitePath, 'utf8'));

// 1. Hero
content.hero.badge = "Authentic South Indian Flavours";
content.hero.title = "South Indian Vegetarian Restaurant Amersham";
content.hero.subtitle = "Top-rated South-Indian Vegetarian Dining • 100% Pure Veg • Family-Friendly Dining";
content.hero.primaryCta = { text: "View Menu", link: "/#menu" };
content.hero.secondaryCta = { text: "Order Online", link: "/#order" };
content.hero.slides = [
  {
    id: 1,
    image: "/images/3d/masala-dosa-3d.jpg",
    title: "Golden Long Masala Dosa"
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
];

// 2. About section
content.about = {
  badge: "Our Culinary Heritage",
  title: "Award-Winning South Indian Vegetarian Restaurant Amersham",
  paragraphs: [
    "Welcome to Veg Chennai SriLalitha (VCS) Amersham, the premier destination for authentic, traditional South Indian vegetarian and vegan cuisine in Buckinghamshire.",
    "Rooted in centuries-old recipes from Chennai, our master chefs grind our batter fresh daily using stone grinders and prepare every sambar, rasam, and chutney from scratch using hand-roasted spices and cold-pressed sesame oil.",
    "Whether you are craving a paper-thin crispy ghee roast dosa, a rich paneer butter masala, or an elaborate royal thali, we offer a warm, family-friendly atmosphere that makes every meal a celebration."
  ],
  image: "/images/3d/restaurant-feast-3d.jpg",
  stats: [
    { label: "UK Locations", value: "5+" },
    { label: "Years Experience", value: "15+" },
    { label: "Pure Vegetarian", value: "100%" }
  ]
};

// 3. Top Food with long dosa and 3D feast images
content.topFood = {
  badge: "Chef Specials",
  title: "Top Food",
  subtitle: "Handcrafted delicacies perfected over generations by our master South Indian chefs",
  items: [
    {
      id: 1,
      name: "Traditional Golden Long Masala Dosa",
      category: "Dosa Corner",
      price: "£8.95",
      rating: 4.9,
      description: "Crispy golden fermented crepe stuffed with spiced potato masala, served with 3 signature chutneys & hot lentil sambar.",
      image: "/images/3d/masala-dosa-3d.jpg",
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

// 4. Catering matching live website
content.catering = {
  badge: "Bring the Flavours to Your Event",
  title: "Bring the Flavours to Your Event",
  description: "Whether it’s a corporate gathering, wedding celebration, or private party, our catering services bring authentic South Indian vegetarian cuisine to your venue. We handle everything from menu planning to setup, ensuring your event is a delicious success.",
  features: [
    {
      title: "Corporate Events",
      desc: "Impress your colleagues with authentic South Indian cuisine for office gatherings"
    },
    {
      title: "Weddings & Parties",
      desc: "Make your special day memorable with our traditional catering services"
    },
    {
      title: "Private Functions",
      desc: "Customized menus for intimate celebrations and family gatherings"
    }
  ],
  outdoorButtonText: "Outdoor Catering",
  outdoorButtonLink: "/outdoor-catering",
  liveDosaButtonText: "Live Dosa Catering",
  liveDosaButtonLink: "/live-dosa-catering",
  image: "/images/migrated/vcs-catering-buffet-setup-1024x683.jpg"
};

// 5. Why Families Love Us matching live website
content.whyChooseUs = {
  badge: "",
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
      desc: "Recognized as World’s Favourite Dosa Place with consistent 5-star ratings."
    },
    {
      title: "Family Friendly",
      desc: "Warm atmosphere perfect for families, celebrations, and corporate events."
    }
  ]
};

// 6. Real Google Reviews (4.6 stars, 653 reviews)
content.testimonials = {
  badge: "Google Reviews",
  title: "Loved by Diners Across Buckinghamshire",
  subtitle: "Discover why hundreds of food lovers rate us 4.6 stars on Google Reviews",
  overallRating: "4.6",
  totalReviews: "653",
  items: [
    {
      id: 1,
      name: "Danyal Asaraf",
      rating: 5,
      text: "Great service. The restaurant has quite a variety of vegetarian dishes you can choose from. Really enjoyed the masala dosa, cauliflower Manchurian and the chole bhature. The mango lassi went down a treat too. Food comes out pretty quick. The dishes are all very reasonably priced.",
      date: "A month ago",
      verified: true
    },
    {
      id: 2,
      name: "Sivakumar Subramanian",
      rating: 5,
      text: "The most authentic South Indian taste in Amersham! The Masala Dosa was ultra-crisp, sambar had genuine drumstick flavour, and the Madras filter coffee completed a flawless lunch. Outstanding service.",
      date: "3 months ago",
      verified: true
    },
    {
      id: 3,
      name: "Chitra Seetharaman",
      rating: 5,
      text: "Delicious pure vegetarian food with unmatched freshness. The royal thali offers an incredible variety, and the staff are extremely courteous. Our whole family loves visiting every weekend.",
      date: "2 months ago",
      verified: true
    },
    {
      id: 4,
      name: "Nachural",
      rating: 5,
      text: "Booked outdoor catering for an event with 120 guests. The team arrived on time, set up seamlessly, and the food was hot, fresh, and deeply praised by all our attendees. Highly recommended!",
      date: "5 months ago",
      verified: true
    },
    {
      id: 5,
      name: "Shohini Chaudhuri",
      rating: 5,
      text: "The Paneer Tikka was smoky, tender, and seasoned to perfection. Wonderful to have such a top-tier vegetarian gem in Sycamore Road!",
      date: "4 months ago",
      verified: true
    },
    {
      id: 6,
      name: "Alice Grahame",
      rating: 5,
      text: "Superb vegan and gluten-free choices. Everything is clearly labeled, and the team accommodated our dietary allergies without hesitation.",
      date: "6 months ago",
      verified: true
    },
    {
      id: 7,
      name: "Venkatesh Rao",
      rating: 5,
      text: "Outstanding crispy Ghee Roast Dosa and authentic Madras Sambar. Amersham is truly blessed to have Veg Chennai SriLalitha!",
      date: "2 months ago",
      verified: true
    },
    {
      id: 8,
      name: "Priya Sharma",
      rating: 5,
      text: "The weekend buffet spread was phenomenal! Everything from fresh piping hot medu vadas to fragrant biryani was top quality. Friendly staff and fast service.",
      date: "3 weeks ago",
      verified: true
    }
  ]
};

// 7. Clean FAQs
content.faqs = [
  {
    q: "Where is Veg Chennai SriLalitha Amersham located?",
    a: "We are located at 94 Sycamore Rd, Amersham HP6 5EN, United Kingdom in the heart of Amersham town centre."
  },
  {
    q: "Is parking available at your location?",
    a: "Yes, there is convenient street parking along Sycamore Road as well as multiple public car parks within a short 2-minute stroll."
  },
  {
    q: "Do you offer vegan, Jain, and gluten-free options?",
    a: "Absolutely! Our kitchen is 100% vegetarian. All our dosas and idlis are naturally gluten-free fermented rice-lentil batters, and we have extensive vegan items. Jain dietary requirements (no root vegetables, onion, or garlic) are happily accommodated upon request."
  },
  {
    q: "Can I order food for takeaway and home delivery?",
    a: "Yes! You can order online directly via Just Eat, Deliveroo, and Uber Eats for quick doorstep delivery, or call us on 0149 497 2550 for takeaway collection."
  },
  {
    q: "Do you offer live dosa counters and outdoor catering?",
    a: "Yes! We specialize in live on-site dosa catering with commercial griddles and chefs, as well as full buffet catering for weddings, birthdays, and corporate events across Buckinghamshire, London, and Berkshire."
  },
  {
    q: "Do you take reservations for large groups?",
    a: "Yes, we gladly welcome group dining. Please call us in advance on 0149 497 2550 to reserve a table for your family or party."
  }
];

// 7. Header and Footer
content.header = {
  announcement: "Authentic South Indian Pure Vegetarian Cuisine in Amersham",
  phone: "0149 497 2550",
  orderButtonText: "Order Online",
  orderButtonLink: "/#order",
  logoUrl: "/images/migrated/vcs-amersham-round-logo.webp"
};

content.footer = {
  tagline: "Authentic South Indian vegetarian cuisine, served with heart in Amersham.",
  phone: "0149 497 2550",
  email: "vcsramersham@gmail.com",
  address: "94, sycamore Road, Amersham, HP6 5EN.",
  copyright: "© 2026 Veg Chennai SriLalitha Amersham . All rights reserved."
};

// 8. SEO with Long Dosa OG Images
content.seo.home.ogImage = "/images/migrated/vcs-authentic-south-indian-feast.jpeg";
content.seo.menu.ogImage = "/images/long-dosa-feast.png";
content.seo.liveDosaCatering.ogImage = "/images/long-dosa-feast.png";

// Write local JSON
fs.writeFileSync(sitePath, JSON.stringify(content, null, 2), 'utf8');
console.log('Updated src/data/site_content.json successfully!');

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
