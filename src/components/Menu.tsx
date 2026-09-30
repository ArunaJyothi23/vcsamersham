'use client';
import { useState } from 'react';

const categories = [
  "Super Staters",
  "Dosa Corner",
  "Any Timers",
  "Tiffins",
  "Rice & Noodles",
  "Breads and Curries",
  "Desserts/Beverges/Others"
];

const menuData: Record<string, { title: string, price: string, desc: string }[]> = {
  "Super Staters": [
    { title: "VEGETABLE SPRING ROLL (3 pieces) (OJ | OV | M)", price: "£4.99", desc: "Fried rice paper wrapper filled with sauteed crispy chopped vegetables" },
    { title: "CRISPY BHAJIA V OJ", price: "£5.99", desc: "Thin sliced potatoes dipped in gram flour with spices and deep fried" },
    { title: "CHILLI GARLIC MOGO V OJ", price: "£7.99", desc: "Cassava chips dipped in batter and deep fried, mixed with special gravy garnished with onions and capsicum." },
    { title: "PLAIN CHIPS/FRENCH FRIES V GF OJ", price: "£3.99", desc: "" },
    { title: "CRISPY VEGETABLES V OJ", price: "£7.99", desc: "Fried seasonal vegetables dipped in batter and deep fried" },
    { title: "CHILLI GOBI V OJ", price: "£8.99", desc: "Fried cauliflower florets dipped in gravy mixed and garnished with onions and capsicum." },
    { title: "TANDOORI SOYA TIKKA M SB", price: "£8.99", desc: "Marinated soya chunks cooked in Tandoori Oven" },
    { title: "TANDOORI PANEER TIKKA M", price: "£8.99", desc: "Marinated Cottage Cheese cooked in Tandoori Oven" },
    { title: "BHINDI KURKURE V OJ", price: "£8.99", desc: "Thin Ladies finger pieces Dipped in batter and deep fried." },
    { title: "GOBI MANCHURIAN V", price: "£8.99", desc: "Cauliflower is dipped in batter and deep fried, mixed with special gravy garnished with onions and capsicum." },
    { title: "MUSHROOM MANCHURIAN V", price: "£8.99", desc: "Mushroom is dipped in batter and deep fried, mixed with special gravy garnished with onions and capsicum." },
    { title: "PANEER MANCHURIAN M", price: "£9.99", desc: "Cottage cheese is dipped in batter and deep fried, mixed with special gravy garnished with onions and capsicum." },
    { title: "CHILLI PANEER M OJ", price: "£9.99", desc: "Fried cottage cheese, dipped in gravy, garnished with onions capsicums and chillies." },
    { title: "CHILLI SOYA V SB OJ", price: "£9.99", desc: "Fried soya chunks, dipped in gravy, garnished with onions capsicums and chillies." },
    { title: "PANEER - 65 M OJ", price: "£8.99", desc: "Cottage cheese dipped in batter and deep fried" },
    { title: "BROCOLLI 65", price: "£8.99", desc: "Brocolli dipped in batter and deep fried" },
    { title: "GOBI - 65 V OJ", price: "£7.99", desc: "Cauliflower florets dipped in batter and deep fried" },
    { title: "GOBI MALLIGAE V OJ", price: "£8.99", desc: "Cauliflower is dipped in special green batter and deep fried." },
    { title: "CHILLI BROCOLLI V OJ", price: "£9.99", desc: "Fried brocolli florets dipped in gravy mixed and garnished with onions and capsicum." },
    { title: "CHILLI MUSHROOM V OJ", price: "£8.99", desc: "Fried mushroom dipped in gravy mixed and garnished with onions and capsicum." },
    { title: "SAMOSA (3 Pieces)", price: "£5.99", desc: "Fried triangular shaped pastry filled with spicy vegetables." },
    { title: "CRISPY PALAK V OJ", price: "£6.99", desc: "Fresh Spinach leaves dipped in batter and deep fried" },
    { title: "BABY CORN 65 V OJ", price: "£7.99", desc: "Baby corn dipped in batter and fried, like pakoras." },
    { title: "BABY CORN MANCHURIAN V", price: "£5.99", desc: "Baby corn dipped in batter, fried, mixed with special gravy garnished with onions and capsicum." },
    { title: "SOUTHINDIAN BAJJI (5pieces) V OJ", price: "£7.99", desc: "Chilli / potato / onion pieces dipped in batter and fried." },
    { title: "PLAIN PAPPAD V OJ", price: "£1.49", desc: "Fried thin Indian wafers" },
    { title: "MASALA PAPPAD V OJ", price: "£2.49", desc: "Fried thin Indian wafers topped with chopped onions, chopped tomatoes and spices." },
    { title: "DHAL VADA V GF", price: "£6.99", desc: "Fried masala vada made of chana dal, spices and herbs" },
    { title: "PANEER BAJJI M OJ", price: "£8.99", desc: "Cottage cheese slices dipped in batter and fried like bhajias." }
  ],
  "Dosa Corner": [],
  "Any Timers": [],
  "Tiffins": [],
  "Rice & Noodles": [],
  "Breads and Curries": [],
  "Desserts/Beverges/Others": []
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("Super Staters");

  return (
    <section id="menu" style={{ backgroundColor: '#fcf8f2', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem', color: '#111' }}>
          Our Menu
        </h2>

        {/* Allergy info banner replica */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <img 
            src="https://vcsamersham.co.uk/wp-content/uploads/2026/06/Add-a-heading-6.png" 
            alt="Menu Allergy Guide" 
            style={{ width: '100%', maxWidth: '500px', height: 'auto', borderRadius: '4px' }}
          />
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.8rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: activeCategory === cat ? '#fff' : '#d39e7e',
                color: activeCategory === cat ? '#111' : '#fff',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: activeCategory === cat ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {menuData[activeCategory]?.map((item, idx) => (
            <div key={idx} style={{ 
              backgroundColor: '#fff', 
              padding: '1.5rem', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, paddingRight: '1rem', lineHeight: '1.4' }}>
                  {item.title}
                </h3>
                <span style={{ color: '#059669', fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                  {item.price}
                </span>
              </div>
              {item.desc && (
                <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.5', marginTop: '0.5rem' }}>
                  {item.desc}
                </p>
              )}
            </div>
          ))}
          
          {menuData[activeCategory]?.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              Menu items coming soon for {activeCategory}...
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
