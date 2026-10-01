'use client';

export default function OrderOnline() {
  const cards = [
    {
      name: 'Just Eat',
      url: 'https://www.just-eat.co.uk/restaurants-veg-chennai-srilalitha-restaurant-amersham/menu',
      brandColor: '#F47921',
      tagline: 'Order on Just Eat UK',
      logo: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"/>
          </svg>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em' }}>JUST EAT</span>
        </div>
      ),
    },
    {
      name: 'Deliveroo',
      url: 'https://deliveroo.co.uk/menu/london/amersham/veg-chennai-srilalitha-restaurant-amersham-94-sycamore-road?srsltid=AfmBOorzUfSYUnlbsIN5SoZGUbYlThiZfIwXAxhjawxxeLOhrBXGmHSu',
      brandColor: '#00CDBC',
      tagline: 'Fast Delivery to Your Door',
      logo: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M18.8 6.2c-.4-1.2-1.3-2-2.5-2.2-.4-.1-.8-.1-1.2 0-1.2.3-2.2 1.2-2.6 2.4-.2.5-.2 1.1-.1 1.6l-6.8 4c-.7-.5-1.6-.7-2.6-.5-1.4.3-2.5 1.5-2.8 2.9-.4 1.8.8 3.5 2.6 3.8.4.1.8.1 1.2 0 1.2-.3 2.2-1.2 2.6-2.4.2-.5.2-1.1.1-1.6l6.8-4c.7.5 1.6.7 2.6.5 1.4-.3 2.5-1.5 2.8-2.9.2-.6.1-1.1-.1-1.6z"/>
          </svg>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em' }}>deliveroo</span>
        </div>
      ),
    },
    {
      name: 'Uber Eats',
      url: 'https://www.ubereats.com/gb/store/veg-chennai-srilalitha-restaurant/bT7Vlm2LXG6Pxxw_AfOPLQ?srsltid=AfmBOopjKkWAUzwoh2nLsTm0qoSvR83K5GvCEfUTAra5oj7gJTmyMXU6',
      brandColor: '#06C167',
      tagline: 'Track Your Live Order',
      logo: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            Uber <span style={{ color: '#000000', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', marginLeft: '4px' }}>Eats</span>
          </span>
        </div>
      ),
    },
  ];

  return (
    <section 
      id="order" 
      style={{ 
        padding: 'clamp(3.5rem, 6vw, 5.5rem) clamp(1rem, 4vw, 2rem)', 
        backgroundColor: '#FFFDF9', 
        textAlign: 'center',
        scrollMarginTop: '85px',
      }}
    >
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
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
          Direct to Your Door
        </span>
        <h2 style={{ 
          fontSize: 'clamp(2.2rem, 5vw, 2.85rem)', 
          fontWeight: 800, 
          color: '#1A1A1A', 
          letterSpacing: '-0.02em',
          margin: '0 auto 2.75rem auto'
        }}>
          Order Online
        </h2>
        
        {/* 3 Equal Cards Grid Matching Exact Brand Colors */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(1.5rem, 3vw, 2.25rem)',
          justifyContent: 'center',
          alignItems: 'stretch'
        }}>
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="tactile-card"
              style={{
                backgroundColor: card.brandColor,
                borderRadius: '18px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '2.5rem 1.75rem',
                minHeight: '220px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {card.logo}
                <span style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                  {card.tagline}
                </span>
              </div>

              {/* White Pill Button */}
              <a 
                href={card.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  color: card.brandColor, 
                  padding: '11px 32px', 
                  borderRadius: '30px', 
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Order Now →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
