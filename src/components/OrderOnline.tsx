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
            backgroundColor: '#ff8a00', 
            borderRadius: '16px', 
            padding: '4rem 2rem',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 10px 20px rgba(255, 138, 0, 0.2)'
          }}>
            <div style={{ backgroundColor: '#fff', width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', padding: '1rem' }}>
               <svg viewBox="0 0 100 100" width="90" height="90" fill="#ff8a00">
                  <path d="M50 5 L10 40 L15 40 L15 95 L40 95 L40 60 L60 60 L60 95 L85 95 L85 40 L90 40 Z M35 30 L35 80 L30 80 L30 45 L27 45 L27 80 L22 80 L22 45 L19 45 L19 80 L14 80 L14 30 Z M75 30 L75 80 L70 80 L70 45 Q70 30 55 30 Z" />
               </svg>
            </div>
            <h3 style={{ fontSize: '2.5rem', margin: '1rem 0 0 0', fontWeight: 'bold' }}>Just Eat</h3>
            <a href="https://www.just-eat.co.uk/restaurants-veg-chennai-srilalitha-restaurant-amersham/menu" target="_blank" rel="noopener noreferrer" style={{ 
              backgroundColor: '#fff', 
              color: '#ff8a00', 
              padding: '0.8rem 2rem', 
              borderRadius: '30px', 
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              marginTop: '1rem',
              transition: 'transform 0.2s'
            }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Order Now</a>
          </div>

          {/* Deliveroo */}
          <div style={{ 
            backgroundColor: '#00ccbc', 
            borderRadius: '16px', 
            padding: '4rem 2rem',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 10px 20px rgba(0, 204, 188, 0.2)'
          }}>
            <div style={{ backgroundColor: '#fff', width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', padding: '1rem' }}>
               <svg viewBox="0 0 100 100" width="100" height="100" fill="#00ccbc">
                 <path d="M20 70 L25 40 L50 30 L60 50 L80 15 L95 25 L75 90 L25 80 Z" />
                 <circle cx="45" cy="60" r="4" fill="#fff" />
                 <circle cx="65" cy="55" r="4" fill="#fff" />
               </svg>
            </div>
            <h3 style={{ fontSize: '2.5rem', margin: '1rem 0 0 0', fontWeight: 'bold' }}>Deliveroo</h3>
            <a href="https://deliveroo.co.uk/menu/london/amersham/veg-chennai-srilalitha-restaurant-amersham-94-sycamore-road" target="_blank" rel="noopener noreferrer" style={{ 
              backgroundColor: '#fff', 
              color: '#00ccbc', 
              padding: '0.8rem 2rem', 
              borderRadius: '30px', 
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              marginTop: '1rem',
              transition: 'transform 0.2s'
            }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Order Now</a>
          </div>

          {/* Uber Eats */}
          <div style={{ 
            backgroundColor: '#06c167', 
            borderRadius: '16px', 
            padding: '4rem 2rem',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 10px 20px rgba(6, 193, 103, 0.2)'
          }}>
            <div style={{ backgroundColor: '#fff', width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.9 }}>
                <span style={{ color: '#000', fontSize: '3.5rem', fontWeight: 500, fontFamily: 'sans-serif', letterSpacing: '-1px' }}>Uber</span>
                <span style={{ color: '#06c167', fontSize: '3.5rem', fontWeight: 700, fontFamily: 'sans-serif', letterSpacing: '-1px' }}>Eats</span>
              </div>
            </div>
            <h3 style={{ fontSize: '2.5rem', margin: '1rem 0 0 0', fontWeight: 'bold' }}>Uber Eats</h3>
            <a href="https://www.ubereats.com/gb/store/veg-chennai-srilalitha-restaurant/bT7Vlm2LXG6Pxxw_AfOPLQ?srsltid=AfmBOopjKkWAUzwoh2nLsTm0qoSvR83K5GvCEfUTAra5oj7gJTmyMXU6" target="_blank" rel="noopener noreferrer" style={{ 
              backgroundColor: '#fff', 
              color: '#06c167', 
              padding: '0.8rem 2rem', 
              borderRadius: '30px', 
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              marginTop: '1rem',
              transition: 'transform 0.2s'
            }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Order Now</a>
          </div>

        </div>
      </div>
    </section>
  );
}
