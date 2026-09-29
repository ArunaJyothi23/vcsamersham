export default function WhyChooseUs() {
  return (
    <section style={{ padding: '6rem 2rem', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#111', marginBottom: '3rem' }}>
          Why Families Love Us
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {/* Card 1 */}
          <div style={{ border: '2px solid #f3e8df', borderRadius: '12px', padding: '3rem 2rem', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ color: '#d39e7e', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#111' }}>Authentic Recipes</h3>
            <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Traditional Chennai recipes passed down through generations, prepared fresh daily.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{ border: '2px solid #f3e8df', borderRadius: '12px', padding: '3rem 2rem', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ color: '#d39e7e', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" y1="17" x2="18" y2="17"></line></svg>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#111' }}>Expert Chefs</h3>
            <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Skilled chefs from Chennai bringing theatrical live dosa and vada stations.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{ border: '2px solid #f3e8df', borderRadius: '12px', padding: '3rem 2rem', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ color: '#d39e7e', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#111' }}>Award Winning</h3>
            <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Recognized as World's Favourite Dosa Place with consistent 5-star ratings.
            </p>
          </div>

          {/* Card 4 */}
          <div style={{ border: '2px solid #f3e8df', borderRadius: '12px', padding: '3rem 2rem', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ color: '#d39e7e', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#111' }}>Family Friendly</h3>
            <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Warm atmosphere perfect for families, celebrations, and corporate events.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
