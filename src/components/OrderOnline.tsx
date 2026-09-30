'use client';
export default function OrderOnline() {
  return (
    <section id="order" style={{ padding: '5rem 2rem', backgroundColor: '#fff', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          marginBottom: '3rem',
          color: '#111'
        }}>
          Order Online
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          justifyItems: 'center'
        }}>
          
          <a href="https://www.just-eat.co.uk/restaurants-veg-chennai-srilalitha-restaurant-amersham/menu" target="_blank" rel="noopener noreferrer" style={{ transition: 'transform 0.2s', display: 'block' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/Screenshot-2025-11-01-172306.png" alt="Order on Just Eat" style={{ width: '100%', maxWidth: '350px', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          </a>

          <a href="https://deliveroo.co.uk/menu/london/amersham/veg-chennai-srilalitha-restaurant-amersham-94-sycamore-road" target="_blank" rel="noopener noreferrer" style={{ transition: 'transform 0.2s', display: 'block' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/Screenshot-2025-11-01-172314.png" alt="Order on Deliveroo" style={{ width: '100%', maxWidth: '350px', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          </a>

          <a href="https://www.ubereats.com/gb/store/veg-chennai-srilalitha-restaurant/bT7Vlm2LXG6Pxxw_AfOPLQ?srsltid=AfmBOopjKkWAUzwoh2nLsTm0qoSvR83K5GvCEfUTAra5oj7gJTmyMXU6" target="_blank" rel="noopener noreferrer" style={{ transition: 'transform 0.2s', display: 'block' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/Screenshot-2025-11-01-172321.png" alt="Order on Uber Eats" style={{ width: '100%', maxWidth: '350px', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          </a>

        </div>
      </div>
    </section>
  );
}
