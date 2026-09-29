export default function Catering() {
  return (
    <section id="catering" style={{ padding: '6rem 2rem', backgroundColor: '#fdfbf7' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
        
        {/* Left Content */}
        <div style={{ flex: '1 1 500px' }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#111', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Bring the Flavours to Your Event
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Whether it's a corporate gathering, wedding celebration, or private party, our catering services bring authentic South Indian vegetarian cuisine to your venue. We handle everything from menu planning to setup, ensuring your event is a delicious success.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
            {/* Feature 1 */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#fcf0e3', padding: '1rem', borderRadius: '12px', color: '#d38b6d' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#111' }}>Corporate Events</h3>
                <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.5 }}>Impress your colleagues with authentic South Indian cuisine for office gatherings.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#fcf0e3', padding: '1rem', borderRadius: '12px', color: '#d38b6d' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"></path><path d="M12 2v20"></path><path d="M20 16a8 8 0 1 1-16 0"></path><path d="M12 4a8 8 0 0 1 8 8"></path></svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#111' }}>Private Functions</h3>
                <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.5 }}>Customized menus for intimate celebrations and family gatherings.</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/outdoor-catering" style={{
              backgroundColor: '#d39e7e',
              color: '#fff',
              padding: '0.8rem 2rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>Outdoor Catering</a>
            <a href="/live-dosa-catering" style={{
              backgroundColor: '#d39e7e',
              color: '#fff',
              padding: '0.8rem 2rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>Live Dosa Catering</a>
          </div>
        </div>

        {/* Right Image */}
        <div style={{ flex: '1 1 500px' }}>
          <img 
            src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000&auto=format&fit=crop" 
            alt="South Indian Catering Thali" 
            style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          />
        </div>

      </div>
    </section>
  );
}
