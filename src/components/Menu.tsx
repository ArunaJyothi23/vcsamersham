'use client';
import { useState } from 'react';
import menuDataConfig from '../data/menu.json';

const categories = menuDataConfig.categories;
const menuData = menuDataConfig.menuData;

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section id="menu" style={{ backgroundColor: '#fcf8f2', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem', color: '#111' }}>
          Our Menu
        </h2>

        {/* Allergy info banner replica as Image */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <img 
            src="https://vcsamersham.co.uk/wp-content/uploads/2026/06/WhatsApp-Image-2025-12-03-at-11.49.42-e1764743369811.jpeg" 
            alt="Allergy Legend" 
            style={{ maxWidth: '100%', width: '600px', height: 'auto' }}
          />
        </div>

        {/* Category Tabs */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '10px', 
          justifyContent: 'center', 
          marginBottom: '3rem',
          maxWidth: '1000px',
          margin: '0 auto 3rem auto'
        }}>
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.6rem 1.2rem',
                border: activeCategory === cat ? '1px solid #111' : '1px solid transparent',
                borderRadius: '8px',
                backgroundColor: activeCategory === cat ? '#fff' : '#d39e7e',
                color: activeCategory === cat ? '#111' : '#fff',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: activeCategory === cat ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {menuData[activeCategory as keyof typeof menuData]?.map((item, idx) => (
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
          
          {(!menuData[activeCategory as keyof typeof menuData] || menuData[activeCategory as keyof typeof menuData].length === 0) && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              Menu items coming soon for {activeCategory}...
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

