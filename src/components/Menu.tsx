'use client';
import { useState, useMemo } from 'react';
import defaultMenuConfig from '../data/menu.json';

interface MenuProps {
  menuConfig?: {
    categories: string[];
    menuData: Record<string, any[]>;
  };
  spotlightData?: Record<string, { title: string; subtitle: string; img: string; tag: string }>;
}

// All 9 Dietary & Allergen Guide items displayed in a clean single row
export const ALL_DIETARY = [
  { code: 'V', label: 'Vegan', dot: '#16A34A', bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  { code: 'M', label: 'Milk / Dairy', dot: '#2563EB', bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  { code: 'N', label: 'Nuts', dot: '#D97706', bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  { code: 'P', label: 'Peanut', dot: '#B45309', bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
  { code: 'OJ', label: 'Option for Jain', dot: '#7C3AED', bg: '#FAF5FF', text: '#6D28D9', border: '#E9D5FF' },
  { code: 'OV', label: 'Option for Vegan', dot: '#059669', bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
  { code: 'GF', label: 'Gluten free', dot: '#0D9488', bg: '#F0FDFA', text: '#0F766E', border: '#99F6E4' },
  { code: 'SB', label: 'Soya Beans', dot: '#475569', bg: '#F8FAFC', text: '#334155', border: '#CBD5E1' },
  { code: 'SE', label: 'Sesame', dot: '#EA580C', bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
];

const DIETARY_CONFIG_MAP: Record<string, typeof ALL_DIETARY[0]> = {};
ALL_DIETARY.forEach((item) => {
  DIETARY_CONFIG_MAP[item.code] = item;
});
// Map 'D' (Dairy) to 'M' (Milk / Dairy)
DIETARY_CONFIG_MAP['D'] = DIETARY_CONFIG_MAP['M'];

function formatTitle(title: string): string {
  if (!title) return '';
  const trimmed = title.trim();
  // Check if mostly uppercase
  const letters = trimmed.replace(/[^a-zA-Z]/g, '');
  const upperCount = (trimmed.match(/[A-Z]/g) || []).length;
  if (letters.length > 0 && upperCount / letters.length > 0.6) {
    return trimmed.replace(/\b[a-zA-Z]+/g, (word) => {
      // Keep acronyms like 3D, D, etc. if short, otherwise capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  }
  return trimmed;
}

function parseDishTitle(rawTitle: string, existingDietary: string[] = []) {
  let clean = (rawTitle || '').trim();
  const tags = new Set<string>((existingDietary || []).map(t => t.toUpperCase() === 'D' ? 'M' : t.toUpperCase()));

  // 1. Typos and glued strings
  clean = clean.replace(/DOSANOJD/i, () => { tags.add('N'); tags.add('OJ'); tags.add('M'); return 'Dosa'; });
  clean = clean.replace(/\(D\)/i, () => { tags.add('M'); return ''; });
  clean = clean.replace(/\(Milk\)\s*D/i, () => { tags.add('M'); return '(Milk)'; });

  // 2. Embedded before WITH PAPPAD
  clean = clean.replace(/\s+(OV|GF|SB|SE|OJ|N|P|M|V|D)(\s+(OV|GF|SB|SE|OJ|N|P|M|V|D))*\s+(?=WITH\b)/i, (match) => {
    const found = match.match(/\b(OV|GF|SB|SE|OJ|N|P|M|V|D)\b/gi);
    if (found) {
      found.forEach((c: string) => tags.add(c.toUpperCase() === 'D' ? 'M' : c.toUpperCase()));
    }
    return ' ';
  });

  // 3. Glued compound codes
  const compounds = [
    { regex: /\bVNOJ\b|\s+VNOJ$/i, codes: ['V', 'N', 'OJ'] },
    { regex: /\bNDOJ\b|\s+NDOJ$/i, codes: ['N', 'M', 'OJ'] },
    { regex: /\bN\s*DOJ\b|\s+N\s*DOJ$/i, codes: ['N', 'M', 'OJ'] },
    { regex: /\bN\s*D\s*0J\b|\s+N\s*D\s*0J$/i, codes: ['N', 'M', 'OJ'] },
    { regex: /\bN\s*D\s*OJ\b|\s+N\s*D\s*OJ$/i, codes: ['N', 'M', 'OJ'] },
    { regex: /\bOJD\b|\s+OJD$/i, codes: ['OJ', 'M'] },
    { regex: /\bOVD\b|\s+OVD$/i, codes: ['OV', 'M'] },
    { regex: /\bDOJ\b|\s+DOJ$/i, codes: ['M', 'OJ'] },
    { regex: /\bVOJ\b|\s+VOJ$/i, codes: ['V', 'OJ'] },
    { regex: /\bDN\b|\s+DN$/i, codes: ['M', 'N'] },
    { regex: /\bVN\s*oJ\b|\s+VN\s*oJ$/i, codes: ['V', 'N', 'OJ'] },
    { regex: /\bVN\b|\s+VN$/i, codes: ['V', 'N'] },
    { regex: /\bOV\s+ND\b|\s+OV\s+ND$/i, codes: ['OV', 'N', 'M'] },
  ];

  compounds.forEach(({ regex, codes }) => {
    if (regex.test(clean)) {
      clean = clean.replace(regex, ' ').trim();
      codes.forEach((c: string) => tags.add(c));
    }
  });

  // 4. Trailing codes with optional pipes: e.g. ' V | N |', ' V |', ' M N', ' V'
  clean = clean.replace(/(\s+[|•/,]?\s*\b(OV|GF|SB|SE|OJ|N|P|M|V|D)\b)+(\s*[|•/,]?)*$/i, (match) => {
    const found = match.match(/\b(OV|GF|SB|SE|OJ|N|P|M|V|D)\b/gi);
    if (found) {
      found.forEach((c: string) => tags.add(c.toUpperCase() === 'D' ? 'M' : c.toUpperCase()));
    }
    return '';
  });

  // 5. Parenthesized codes: '(OJ | OV | M)' or '(OJ, OV, M)'
  clean = clean.replace(/\s*\(([^)]*\b(?:OV|GF|SB|SE|OJ|N|P|M|V|D)\b[^)]*)\)\s*$/i, (match, inside) => {
    const found = inside.match(/\b(OV|GF|SB|SE|OJ|N|P|M|V|D)\b/gi);
    const nonCodes = inside.replace(/\b(OV|GF|SB|SE|OJ|N|P|M|V|D)\b/gi, '').replace(/[\s,|/•\-]/g, '');
    if (found && nonCodes.length === 0) {
      found.forEach((c: string) => tags.add(c.toUpperCase() === 'D' ? 'M' : c.toUpperCase()));
      return '';
    }
    return match;
  });

  clean = clean.replace(/[\s|/•\-]+$/, '').replace(/\s+/g, ' ').trim();

  return { cleanTitle: clean, tags: Array.from(tags) };
}

export default function Menu({ menuConfig, spotlightData }: MenuProps) {
  const categories = menuConfig?.categories && menuConfig.categories.length > 0
    ? menuConfig.categories
    : defaultMenuConfig.categories;
  const rawMenuData = menuConfig?.menuData || defaultMenuConfig.menuData;

  const [activeCategory, setActiveCategory] = useState(categories[0] || 'Super Staters');
  const [selectedDietary, setSelectedDietary] = useState<string | null>(null);

  // Process and filter menu items (with clean title, formatTitle and deduplication)
  const activeItems = useMemo(() => {
    const items = rawMenuData[activeCategory as keyof typeof rawMenuData] || [];
    const seen = new Set<string>();
    return items
      .map((item: any) => {
        const { cleanTitle, tags } = parseDishTitle(item.title, item.dietary);
        const formattedTitle = formatTitle(cleanTitle);
        return {
          ...item,
          cleanTitle: formattedTitle,
          tags,
        };
      })
      .filter((item: any) => {
        const key = item.cleanTitle.trim().toUpperCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [rawMenuData, activeCategory]);

  const filteredDishes = useMemo(() => {
    if (!selectedDietary) return activeItems;
    return activeItems.filter((item) => item.tags.includes(selectedDietary));
  }, [activeItems, selectedDietary]);

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
      <style>{`
        /* Category Tabs matching Image 3 */
        .menu-category-pill {
          padding: 0.55rem 1rem;
          border-radius: 24px;
          border: 1px solid #E8E0D5;
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #1A1A1A;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          outline: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          user-select: none;
        }

        .menu-category-pill:hover {
          border-color: #C45C26;
          color: #C45C26;
        }

        .menu-category-pill.active {
          border-color: #C45C26;
          background-color: #C45C26;
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(196, 92, 38, 0.35);
          transform: translateY(-1px);
        }

        /* Dietary Guide Pill Chip matching Image 2 */
        .dietary-guide-pill {
          background-color: #FFFFFF;
          border: 1px solid #E8E0D5;
          border-radius: 8px;
          padding: 4px 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.15s ease;
          font-family: inherit;
          outline: none;
          user-select: none;
          white-space: nowrap;
          flex-shrink: 0;
          font-size: 0.81rem;
        }

        .dietary-guide-pill:hover {
          border-color: #C45C26;
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .dietary-guide-pill.active {
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          transform: translateY(-1px);
        }

        /* Mobile Scroll & Responsive Containers */
        .menu-category-scroll-container {
          display: flex;
          flex-wrap: nowrap;
          gap: 8px;
          justify-content: center;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto 2.25rem auto;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 4px 4px 10px 4px;
        }
        .menu-category-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .dietary-guide-scroll-container {
          display: flex;
          flex-wrap: nowrap;
          gap: 6px;
          align-items: center;
          justify-content: center;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 2px 2px 6px 2px;
        }
        .dietary-guide-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .menu-spotlight-card {
          background-color: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid #E8E0D5;
          border-radius: 20px;
          padding: clamp(1.25rem, 3vw, 1.75rem);
          margin-bottom: 2.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
          gap: clamp(1.25rem, 3vw, 2rem);
          align-items: center;
          box-shadow: 0 8px 25px rgba(196, 92, 38, 0.08);
        }

        .menu-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
          gap: 1.25rem;
        }

        .menu-dish-card {
          background-color: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 1.35rem 1.25rem;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid #E8E0D5;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
        }

        @media (max-width: 768px) {
          .menu-category-scroll-container {
            justify-content: flex-start !important;
            padding-left: 6px !important;
            padding-right: 6px !important;
            margin-bottom: 1.5rem !important;
          }
          .dietary-guide-scroll-container {
            justify-content: flex-start !important;
            padding-left: 4px !important;
            padding-right: 4px !important;
          }
          .menu-spotlight-card {
            grid-template-columns: 1fr !important;
            padding: 1.15rem !important;
            gap: 1.15rem !important;
            border-radius: 16px !important;
            margin-bottom: 1.75rem !important;
          }
          .menu-grid-container {
            grid-template-columns: 1fr !important;
            gap: 0.85rem !important;
          }
          .menu-dish-card {
            padding: 1.1rem 1rem !important;
            border-radius: 14px !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
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

        {/* 1. Dynamic Dietary & Allergen Guide Box in a Single Line */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E0D5',
            padding: '1.1rem 1.4rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '0.96rem', fontWeight: 800, color: '#1A1A1A' }}>
                Dietary Guide:
              </strong>
            </div>

            {selectedDietary && (
              <button
                onClick={() => setSelectedDietary(null)}
                style={{
                  background: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  color: '#1A1A1A',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Filtered: <strong style={{ color: DIETARY_CONFIG_MAP[selectedDietary]?.text }}>{DIETARY_CONFIG_MAP[selectedDietary]?.label || selectedDietary}</strong></span>
                <span style={{ color: '#888' }}>✕ Clear</span>
              </button>
            )}
          </div>

          {/* All 9 Dietary options displayed in clean responsive scroll row */}
          <div className="dietary-guide-scroll-container">
            {ALL_DIETARY.map((item) => {
              const isSelected = selectedDietary === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => setSelectedDietary(isSelected ? null : item.code)}
                  className={`dietary-guide-pill ${isSelected ? 'active' : ''}`}
                  style={{
                    backgroundColor: isSelected ? item.bg : '#FFFFFF',
                    borderColor: isSelected ? item.dot : '#E8E0D5',
                  }}
                  title={isSelected ? 'Click to clear filter' : `Filter dishes for ${item.label}`}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: item.dot,
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#333333', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    <strong style={{ color: item.text }}>{item.code}</strong> = {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Category Tabs in responsive scroll row */}
        <div className="menu-category-scroll-container">
          {categories.map((cat: string) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`menu-category-pill ${isActive ? 'active' : ''}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 3. 3D Category Feature Spotlight Card (Restored from Screenshot 2) */}
        {(() => {
          const defaultSpotlightMap: Record<string, { title: string; subtitle: string; img: string; tag: string }> = {
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
              img: "/images/3d/masala-dosa-3d.jpg",
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

          // Merge admin-provided spotlight data over defaults
          const spotlightMap = { ...defaultSpotlightMap };
          if (spotlightData) {
            for (const key of Object.keys(spotlightData)) {
              spotlightMap[key] = { ...spotlightMap[key], ...spotlightData[key] };
            }
          }

          const spot = spotlightMap[activeCategory];
          if (!spot) return null;

          return (
            <div className="tactile-card menu-spotlight-card">
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

        {/* 4. Menu Grid - 3D Glassmorphic Cards (Responsive mobile & desktop) */}
        <div className="menu-grid-container">
          {filteredDishes.map((item, idx) => (
            <div 
              key={idx} 
              className="tactile-card menu-dish-card"
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
                {/* Title and Price Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <strong style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, lineHeight: '1.4', color: '#1A1A1A' }}>
                    {item.cleanTitle || item.title}
                  </strong>
                  <span style={{ 
                    color: '#C45C26', 
                    fontWeight: 800, 
                    fontSize: '1.05rem', 
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                    flexShrink: 0,
                  }}>
                    {item.price}
                  </span>
                </div>

                {/* Dietary Options Pills Row (Restored exact design from screenshot) */}
                {item.tags && item.tags.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
                    {item.tags.map((tag: string) => {
                      const normalizedTag = (tag || '').toUpperCase() === 'D' ? 'M' : (tag || '').toUpperCase();
                      const cfg = DIETARY_CONFIG_MAP[normalizedTag] || DIETARY_CONFIG_MAP[tag];
                      return (
                        <span
                          key={tag}
                          title={cfg?.label || tag}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: cfg?.bg || '#F3F4F6',
                            color: cfg?.text || '#374151',
                            border: `1px solid ${cfg?.border || '#E5E7EB'}`,
                            letterSpacing: '0.4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            lineHeight: 1.3,
                            userSelect: 'none',
                          }}
                        >
                          {normalizedTag}
                        </span>
                      );
                    })}
                  </div>
                )}
                {item.desc && (
                  <p style={{ margin: 0, color: '#555555', fontSize: '0.88rem', lineHeight: '1.5', marginTop: '0.35rem' }}>
                    {item.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {filteredDishes.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#6b7280', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E0D5' }}>
              <p style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>No dishes match this dietary filter in {activeCategory}.</p>
              <button
                onClick={() => setSelectedDietary(null)}
                style={{
                  backgroundColor: '#C45C26',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
