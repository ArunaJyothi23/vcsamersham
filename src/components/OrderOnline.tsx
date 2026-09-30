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
          gap: '2rem'
        }}>
          
          {/* Just Eat */}
          <div style={{ 
            backgroundColor: '#f16e00', // Just Eat exact orange
            borderRadius: '12px', 
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 24px rgba(241, 110, 0, 0.2)',
            overflow: 'hidden'
          }}>
            {/* White top with framing */}
            <div style={{
              backgroundColor: '#fff',
              margin: '16px 16px 0 16px',
              height: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Custom SVG approximating the house/fork Just Eat logo */}
               <svg viewBox="0 0 100 100" width="120" height="120" fill="#f16e00">
                  <path d="M50 15 L15 45 L20 45 L20 85 L45 85 L45 55 L55 55 L55 85 L80 85 L80 45 L85 45 Z M35 30 L35 75 L30 75 L30 45 L27 45 L27 75 L22 75 L22 45 L19 45 L19 75 L14 75 L14 30 Z M75 30 L75 75 L70 75 L70 45 Q70 30 55 30 Z" />
               </svg>
            </div>
            
            {/* Bottom colored area */}
            <div style={{ 
              padding: '2rem 1rem 3rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
            }}>
              <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: 700, color: '#fff' }}>Just Eat</h3>
              <a href="https://www.just-eat.co.uk/restaurants-veg-chennai-srilalitha-restaurant-amersham/menu" target="_blank" rel="noopener noreferrer" style={{ 
                backgroundColor: '#fff', 
                color: '#f16e00', 
                padding: '0.6rem 2rem', 
                borderRadius: '30px', 
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'transform 0.2s'
              }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Order Now</a>
            </div>
          </div>

          {/* Deliveroo */}
          <div style={{ 
            backgroundColor: '#00ccbc', 
            borderRadius: '12px', 
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 24px rgba(0, 204, 188, 0.2)',
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: '#fff',
              margin: '16px 16px 0 16px',
              height: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
               <svg viewBox="0 0 100 100" width="130" height="130" fill="#00ccbc">
                 <path d="M20 70 L25 40 L50 30 L60 50 L80 15 L95 25 L75 90 L25 80 Z" />
                 <circle cx="45" cy="60" r="4" fill="#fff" />
                 <circle cx="65" cy="55" r="4" fill="#fff" />
               </svg>
            </div>
            <div style={{ 
              padding: '2rem 1rem 3rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
            }}>
              <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: 700, color: '#fff' }}>Deliveroo</h3>
              <a href="https://deliveroo.co.uk/menu/london/amersham/veg-chennai-srilalitha-restaurant-amersham-94-sycamore-road" target="_blank" rel="noopener noreferrer" style={{ 
                backgroundColor: '#fff', 
                color: '#00ccbc', 
                padding: '0.6rem 2rem', 
                borderRadius: '30px', 
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'transform 0.2s'
              }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Order Now</a>
            </div>
          </div>

          {/* Uber Eats */}
          <div style={{ 
            backgroundColor: '#06c167', 
            borderRadius: '12px', 
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 24px rgba(6, 193, 103, 0.2)',
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: '#fff',
              margin: '16px 16px 0 16px',
              height: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.9 }}>
                <span style={{ color: '#000', fontSize: '4.5rem', fontWeight: 500, fontFamily: 'sans-serif', letterSpacing: '-2px' }}>Uber</span>
                <span style={{ color: '#06c167', fontSize: '4.5rem', fontWeight: 700, fontFamily: 'sans-serif', letterSpacing: '-2px' }}>Eats</span>
              </div>
            </div>
            <div style={{ 
              padding: '2rem 1rem 3rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
            }}>
              <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: 700, color: '#fff' }}>Uber Eats</h3>
              <a href="https://www.ubereats.com/gb/store/veg-chennai-srilalitha-restaurant/bT7Vlm2LXG6Pxxw_AfOPLQ?srsltid=AfmBOopjKkWAUzwoh2nLsTm0qoSvR83K5GvCEfUTAra5oj7gJTmyMXU6" target="_blank" rel="noopener noreferrer" style={{ 
                backgroundColor: '#fff', 
                color: '#06c167', 
                padding: '0.6rem 2rem', 
                borderRadius: '30px', 
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'transform 0.2s'
              }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Order Now</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
