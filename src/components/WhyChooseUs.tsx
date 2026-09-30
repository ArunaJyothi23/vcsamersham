export default function WhyChooseUs() {
  return (
    <section style={{ padding: '5rem 2rem', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111', marginBottom: '3rem' }}>
          Why Families Love Us
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {/* Card 1 */}
          <div style={{ border: '1px solid #d39e7e', borderRadius: '12px', padding: '3rem 2rem', backgroundColor: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/Screenshot-2025-11-01-172306.png" alt="Authentic Recipes" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>Authentic Recipes</h3>
            <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>
              Traditional Chennai recipes passed down through generations, prepared fresh daily.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{ border: '1px solid #d39e7e', borderRadius: '12px', padding: '3rem 2rem', backgroundColor: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/Screenshot-2025-11-01-172314.png" alt="Expert Chefs" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>Expert Chefs</h3>
            <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>
              Skilled chefs from Chennai bringing theatrical live dosa and vada stations.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{ border: '1px solid #d39e7e', borderRadius: '12px', padding: '3rem 2rem', backgroundColor: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/Screenshot-2025-11-01-172321.png" alt="Award Winning" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>Award Winning</h3>
            <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>
              Recognized as World's Favourite Dosa Place with consistent 5-star ratings.
            </p>
          </div>

          {/* Card 4 */}
          <div style={{ border: '1px solid #d39e7e', borderRadius: '12px', padding: '3rem 2rem', backgroundColor: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/Screenshot-2025-11-01-172329.png" alt="Family Friendly" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>Family Friendly</h3>
            <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>
              Warm atmosphere perfect for families, celebrations, and corporate events.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
