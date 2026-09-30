'use client';
export default function OrderOnline() {
  return (
    <section id="order" style={{ padding: '4rem 2rem', backgroundColor: '#fcf8f2', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700, 
          marginBottom: '3rem',
          color: '#111'
        }}>
          Order Online
        </h2>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem'
        }}>
          
          {/* Just Eat */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
              src="https://vcsamersham.co.uk/wp-content/uploads/2026/06/Add-a-heading-6.png" 
              alt="Just Eat" 
              style={{ width: '300px', height: '300px', objectFit: 'contain', marginBottom: '1rem' }} 
            />
            <a href="https://www.just-eat.co.uk/restaurants-veg-chennai-srilalitha-restaurant-amersham/menu" 
               target="_blank" 
               rel="noopener noreferrer" 
               style={{ 
                 backgroundColor: '#d39e7e', 
                 color: '#fff', 
                 padding: '0.6rem 2rem', 
                 borderRadius: '4px', 
                 textDecoration: 'none',
                 fontWeight: 'bold',
                 fontSize: '1rem'
               }}>
              Order Now
            </a>
          </div>

          {/* Deliveroo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
              src="https://vcsamersham.co.uk/wp-content/uploads/2026/06/Add-a-heading-7.png" 
              alt="Deliveroo" 
              style={{ width: '300px', height: '300px', objectFit: 'contain', marginBottom: '1rem' }} 
            />
            <a href="https://deliveroo.co.uk/menu/london/amersham/veg-chennai-srilalitha-restaurant-amersham-94-sycamore-road" 
               target="_blank" 
               rel="noopener noreferrer" 
               style={{ 
                 backgroundColor: '#d39e7e', 
                 color: '#fff', 
                 padding: '0.6rem 2rem', 
                 borderRadius: '4px', 
                 textDecoration: 'none',
                 fontWeight: 'bold',
                 fontSize: '1rem'
               }}>
              Order Now
            </a>
          </div>

          {/* Uber Eats */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
              src="https://vcsamersham.co.uk/wp-content/uploads/2026/06/Add-a-heading-8.png" 
              alt="Uber Eats" 
              style={{ width: '300px', height: '300px', objectFit: 'contain', marginBottom: '1rem' }} 
            />
            <a href="https://www.ubereats.com/gb/store/veg-chennai-srilalitha-restaurant/bT7Vlm2LXG6Pxxw_AfOPLQ" 
               target="_blank" 
               rel="noopener noreferrer" 
               style={{ 
                 backgroundColor: '#d39e7e', 
                 color: '#fff', 
                 padding: '0.6rem 2rem', 
                 borderRadius: '4px', 
                 textDecoration: 'none',
                 fontWeight: 'bold',
                 fontSize: '1rem'
               }}>
              Order Now
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

