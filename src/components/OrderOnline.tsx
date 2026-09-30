'use client';

export default function OrderOnline() {
  const cards = [
    {
      name: 'Just Eat',
      img: 'https://vcsamersham.co.uk/wp-content/uploads/2026/06/Add-a-heading-6.png',
      url: 'https://www.just-eat.co.uk/restaurants-veg-chennai-srilalitha-restaurant-amersham/menu',
      bgColor: '#F47921',
      btnColor: '#F47921',
    },
    {
      name: 'Deliveroo',
      img: 'https://vcsamersham.co.uk/wp-content/uploads/2026/06/Add-a-heading-7.png',
      url: 'https://deliveroo.co.uk/menu/london/amersham/veg-chennai-srilalitha-restaurant-amersham-94-sycamore-road?srsltid=AfmBOorzUfSYUnlbsIN5SoZGUbYlThiZfIwXAxhjawxxeLOhrBXGmHSu',
      bgColor: '#37B7B3',
      btnColor: '#37B7B3',
    },
    {
      name: 'Uber Eats',
      img: 'https://vcsamersham.co.uk/wp-content/uploads/2026/06/Add-a-heading-8.png',
      url: 'https://www.ubereats.com/gb/store/veg-chennai-srilalitha-restaurant/bT7Vlm2LXG6Pxxw_AfOPLQ?srsltid=AfmBOopjKkWAUzwoh2nLsTm0qoSvR83K5GvCEfUTAra5oj7gJTmyMXU6',
      bgColor: '#00C532',
      btnColor: '#00C532',
    },
  ];

  return (
    <section id="order" style={{ padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 2rem)', backgroundColor: '#ffffff', textAlign: 'center' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: 'clamp(2.2rem, 5vw, 2.85rem)', 
          fontWeight: 700, 
          marginBottom: '3rem',
          color: '#000000',
          fontFamily: 'inherit'
        }}>
          Order Online
        </h2>
        
        {/* 3 Equal Cards Grid Matching Exact Live Design */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(1.5rem, 3vw, 2.25rem)',
          justifyContent: 'center',
          alignItems: 'stretch'
        }}>
          {cards.map((card, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: card.bgColor,
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingBottom: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{ width: '100%', overflow: 'hidden' }}>
                <img 
                  src={card.img} 
                  alt={card.name} 
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    display: 'block', 
                    objectFit: 'contain'
                  }} 
                />
              </div>

              {/* White Pill Button Overlaid at bottom */}
              <a 
                href={card.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  color: card.btnColor, 
                  padding: '9px 28px', 
                  borderRadius: '25px', 
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: `1px solid ${card.btnColor}`,
                  boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
                  display: 'inline-block',
                  marginTop: '-56px',
                  position: 'relative',
                  zIndex: 2,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = card.btnColor;
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = card.btnColor;
                  e.currentTarget.style.borderColor = card.btnColor;
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
