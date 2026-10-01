'use client';
import { useState } from 'react';
import defaultMenuConfig from '../data/menu.json';

interface MenuProps {
  menuConfig?: {
    categories: string[];
    menuData: Record<string, any[]>;
  };
}

export default function Menu({ menuConfig }: MenuProps) {
  const categories = menuConfig?.categories && menuConfig.categories.length > 0
    ? menuConfig.categories
    : defaultMenuConfig.categories;
  const menuData = menuConfig?.menuData || defaultMenuConfig.menuData;
  const [activeCategory, setActiveCategory] = useState(categories[0] || 'Dosa Corner');
  const [allergyImgFailed, setAllergyImgFailed] = useState(false);

  return (
    <section 
      id="menu" 
      style={{ 
        backgroundColor: '#FDF6F0', 
        padding: 'clamp(1.75rem, 3vw, 2.5rem) 1.5rem', 
        position: 'relative',
        scrollMarginTop: '85px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(196, 92, 38, 0.1)',
              color: '#C45C26',
              border: '1px solid rgba(196, 92, 38, 0.25)',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            Culinary Heritage
          </span>
          <h2 style={{ 
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
            fontSize: '30px', 
            fontWeight: 600, 
            textAlign: 'center', 
            color: '#1e293b', 
            lineHeight: '1.3em',
            margin: 0
          }}>
            Our Menu
          </h2>
        </div>

        {/* Allergy info banner with fallback UI */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          {!allergyImgFailed ? (
            <img 
              src="/images/migrated/WhatsApp-Image-2025-12-03-at-11.49.42-e1764743369811.jpeg" 
              alt="Allergy Legend" 
              style={{ 
                maxWidth: '100%', 
                width: 'min(620px, 100%)', 
                height: 'auto', 
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                border: '1px solid #E8E0D5',
                display: 'block',
              }}
              onError={() => setAllergyImgFailed(true)}
            />
          ) : (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E8E0D5',
                borderRadius: '16px',
                padding: '1rem 1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#C45C26', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Allergen Guide:
              </span>
              <span style={{ fontSize: '0.85rem', color: '#444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <strong style={{ color: '#16a34a' }}>[V]</strong> Vegetarian
              </span>
              <span style={{ fontSize: '0.85rem', color: '#444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <strong style={{ color: '#059669' }}>[VG]</strong> Vegan
              </span>
              <span style={{ fontSize: '0.85rem', color: '#444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <strong style={{ color: '#d97706' }}>[GF]</strong> Gluten-Free
              </span>
              <span style={{ fontSize: '0.85rem', color: '#444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <strong style={{ color: '#dc2626' }}>[N]</strong> Contains Nuts
              </span>
              <span style={{ fontSize: '0.85rem', color: '#444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <strong style={{ color: '#4f46e5' }}>[D]</strong> Dairy
              </span>
            </div>
          )}
        </div>

        {/* Category Tabs with Swiss tactile pill styling */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px', 
          justifyContent: 'center', 
          maxWidth: '1050px',
          margin: '0 auto 2.25rem auto'
        }}>
          {categories.map((cat: string) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.6rem 1.2rem',
                  border: isActive ? '1px solid #C45C26' : '1px solid #E8E0D5',
                  borderRadius: '24px',
                  backgroundColor: isActive ? '#C45C26' : 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: isActive ? '#ffffff' : '#1A1A1A',
                  fontWeight: isActive ? '700' : '600',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 14px rgba(196, 92, 38, 0.35)' : '0 2px 6px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  whiteSpace: 'nowrap',
                  transform: isActive ? 'translateY(-1px)' : 'none',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 3D Category Feature Spotlight Card (Per Transformation Guide) */}
        {(() => {
          const spotlightMap: Record<string, { title: string; subtitle: string; img: string; tag: string }> = {
            "Dosa Corner": {
              title: "Signature Crispy Long Dosas",
              subtitle: "Stone-ground fermented lentil batter roasted golden on traditional hot tawa with pure ghee.",
              img: "/images/long-dosa-feast.png",
              tag: "Tawa Masterpiece",
            },
            "Breads and Curries": {
              title: "Royal Curries & Handi Specials",
              subtitle: "Paneer Tikka, buttery dals and aromatic gravies cooked with freshly ground whole spices.",
              img: "/images/3d/paneer-tikka-3d.jpg",
              tag: "Chef's Special Gravy",
            },
            "Tiffins": {
              title: "Heritage South Indian Tiffins",
              subtitle: "Fluffy steamed idlis, crispy medu vadas, and warm sambars prepared fresh daily.",
              img: "/images/3d/idli-vada-3d.jpg",
              tag: "Morning & Evening Classics",
            },
            "Super Staters": {
              title: "Crispy South Indian Starters",
              subtitle: "Freshly prepared crunchy fritters, samosas, and spicy savory bites with dipping sauces.",
              img: "/images/3d/starters-3d.jpg",
              tag: "Crunchy Starters",
            },
            "Any Timers": {
              title: "South Indian Comfort Classics",
              subtitle: "Traditional light bites and snacks served with fresh coconut and tomato chutneys.",
              img: "/images/long-dosa-feast.png",
              tag: "All-Day Favourites",
            },
            "Rice & Noodles": {
              title: "Fragrant Rice & Grand Feasts",
              subtitle: "Traditional South Indian Thalis, aromatic biryanis, lemon rice, and bisibelebath.",
              img: "/images/3d/thali-royal-3d.jpg",
              tag: "Complete Feast",
            },
            "Desserts/Beverges/Others": {
              title: "Traditional Beverages & Sweets",
              subtitle: "Authentic South Indian Filter Coffee frothed in brass dabara, alongside traditional sweets.",
              img: "/images/3d/filter-coffee-3d.jpg",
              tag: "Authentic Brew",
            },
          };

          const spot = spotlightMap[activeCategory];
          if (!spot) return null;

          return (
            <div
              className="tactile-card"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid #E8E0D5',
                borderRadius: '20px',
                padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                marginBottom: '2.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                gap: 'clamp(1.25rem, 3vw, 2rem)',
                alignItems: 'center',
                boxShadow: '0 8px 25px rgba(196, 92, 38, 0.08)',
              }}
            >
              <div>
                <span
                  style={{
                    backgroundColor: 'rgba(196, 92, 38, 0.12)',
                    color: '#C45C26',
                    padding: '4px 14px',
                    borderRadius: '16px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'inline-block',
                    marginBottom: '0.5rem',
                  }}
                >
                  {spot.tag}
                </span>
                <strong style={{ display: 'block', fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)', fontWeight: 800, color: '#1A1A1A', marginBottom: '0.45rem', letterSpacing: '-0.01em' }}>
                  {spot.title}
                </strong>
                <p style={{ margin: 0, color: '#555555', fontSize: '0.98rem', lineHeight: 1.6 }}>
                  {spot.subtitle}
                </p>
              </div>
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #E8E0D5',
                  aspectRatio: '16 / 9',
                  backgroundColor: '#FDF6F0',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                  width: '100%',
                  position: 'relative',
                }}
              >
                <img
                  src={spot.img}
                  alt={spot.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                  }}
                />
              </div>
            </div>
          );
        })()}

        {/* Menu Grid - 3D Glassmorphic Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', 
          gap: '1.25rem' 
        }}>
          {menuData[activeCategory as keyof typeof menuData]?.map((item, idx) => (
            <div 
              key={idx} 
              className="tactile-card"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.88)', 
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '1.4rem 1.35rem', 
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid #E8E0D5',
                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(196, 92, 38, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(196, 92, 38, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = '#E8E0D5';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', gap: '0.75rem' }}>
                  <strong style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, lineHeight: '1.4', color: '#1A1A1A' }}>
                    {item.title}
                  </strong>
                  <span style={{ 
                    color: '#C45C26', 
                    fontWeight: 800, 
                    fontSize: '1.05rem', 
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em'
                  }}>
                    {item.price}
                  </span>
                </div>
                {item.desc && (
                  <p style={{ margin: 0, color: '#555555', fontSize: '0.88rem', lineHeight: '1.5', marginTop: '0.35rem' }}>
                    {item.desc}
                  </p>
                )}
              </div>
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
