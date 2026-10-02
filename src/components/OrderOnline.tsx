'use client';

interface DeliveryPlatform {
  id: string;
  name: string;
  url: string;
  image: string;
  desc?: string;
}

interface OrderOnlineProps {
  deliveryPlatforms?: DeliveryPlatform[];
}

const DEFAULT_CARDS: DeliveryPlatform[] = [
  {
    id: 'just-eat',
    name: 'Just Eat',
    url: 'https://www.just-eat.co.uk/restaurants-veg-chennai-srilalitha-restaurant-amersham/menu',
    image: '/images/migrated/Add-a-heading-6.png',
    desc: 'Fast local home delivery straight to your doorstep.',
  },
  {
    id: 'deliveroo',
    name: 'Deliveroo',
    url: 'https://deliveroo.co.uk/menu/london/amersham/veg-chennai-srilalitha-restaurant-amersham-94-sycamore-road?srsltid=AfmBOorzUfSYUnlbsIN5SoZGUbYlThiZfIwXAxhjawxxeLOhrBXGmHSu',
    image: '/images/migrated/Add-a-heading-7.png',
    desc: 'Track your authentic hot meal in real-time.',
  },
  {
    id: 'uber-eats',
    name: 'Uber Eats',
    url: 'https://www.ubereats.com/gb/store/veg-chennai-srilalitha-restaurant/bT7Vlm2LXG6Pxxw_AfOPLQ?srsltid=AfmBOopjKkWAUzwoh2nLsTm0qoSvR83K5GvCEfUTAra5oj7gJTmyMXU6',
    image: '/images/migrated/Add-a-heading-8.png',
    desc: 'Order with your Uber account for quick pickup or delivery.',
  },
];

export default function OrderOnline({ deliveryPlatforms }: OrderOnlineProps) {
  // Use admin-provided platforms if available, otherwise fall back to defaults
  const cards = (deliveryPlatforms && deliveryPlatforms.length > 0)
    ? deliveryPlatforms
    : DEFAULT_CARDS;

  return (
    <section 
      id="order" 
      style={{ 
        padding: 'clamp(1.75rem, 3vw, 2.5rem) 1.5rem', 
        backgroundColor: '#FFFDF9', 
        textAlign: 'center',
        scrollMarginTop: '85px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ 
          fontFamily: "var(--font-sans), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 'clamp(25px, 2.5vw, 30px)', 
          fontWeight: 600, 
          color: '#1A1A1A', 
          letterSpacing: '-0.01em',
          lineHeight: '1.3em',
          margin: '0 auto 1.5rem auto'
        }}>
          Order Online
        </h2>
        
        {/* 3 Live Site Image Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(1.25rem, 2.5vw, 2rem)',
          justifyContent: 'center',
          alignItems: 'stretch',
          maxWidth: '1080px',
          margin: '0 auto',
        }}>
          {cards.map((card, idx) => (
            <div
              key={card.id || idx}
              className="tactile-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E8E0D5',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.75rem 1.5rem',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              {/* Live Site Graphic / Logo Image */}
              <div style={{ width: '100%', maxWidth: '280px', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <img
                  src={card.image}
                  alt={`Order on ${card.name} - Veg Chennai Srilalitha Amersham`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    display: 'block',
                  }}
                />
              </div>

              {/* Order Now Button (Live Site Matching Style) */}
              <a 
                href={card.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-3d-primary"
                style={{ 
                  backgroundColor: '#C45C26', 
                  color: '#FFFFFF', 
                  padding: '13px 32px', 
                  borderRadius: '4px', 
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '1em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(196, 92, 38, 0.35)',
                  width: '80%',
                  maxWidth: '220px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                Order Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
