export default function Catering() {
  return (
    <section id="catering" style={{ padding: '6rem 2rem', backgroundColor: '#fcf8f2' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
        
        {/* Left Content */}
        <div style={{ flex: '1 1 500px' }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 700, color: '#111', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Bring the Flavours to Your Event
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Whether it's a corporate gathering, wedding celebration, or private party, our catering services bring authentic South Indian vegetarian cuisine to your venue. We handle everything from menu planning to setup, ensuring your event is a delicious success.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
            {/* Feature 1 */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#fcf0e3', padding: '0.8rem', borderRadius: '12px' }}>
                <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/Screenshot-2025-11-01-172630.png" alt="Corporate Events" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 0.4rem 0', color: '#111' }}>Corporate Events</h3>
                <p style={{ margin: 0, color: '#666', lineHeight: 1.5, fontSize: '1rem' }}>Impress your colleagues with authentic South Indian cuisine for office gatherings.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#fcf0e3', padding: '0.8rem', borderRadius: '12px' }}>
                <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/Screenshot-2025-11-01-172645.png" alt="Weddings & Parties" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 0.4rem 0', color: '#111' }}>Weddings & Parties</h3>
                <p style={{ margin: 0, color: '#666', lineHeight: 1.5, fontSize: '1rem' }}>Make your special day memorable with our traditional catering services.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#fcf0e3', padding: '0.8rem', borderRadius: '12px' }}>
                <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/Screenshot-2025-11-01-172702.png" alt="Private Functions" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 0.4rem 0', color: '#111' }}>Private Functions</h3>
                <p style={{ margin: 0, color: '#666', lineHeight: 1.5, fontSize: '1rem' }}>Customized menus for intimate celebrations and family gatherings.</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/outdoor-catering" style={{
              backgroundColor: '#d39e7e',
              color: '#fff',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'background-color 0.2s',
            }}>Outdoor Catering</a>
            <a href="/live-dosa-catering" style={{
              backgroundColor: '#d39e7e',
              color: '#fff',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'background-color 0.2s',
            }}>Live Dosa Catering</a>
          </div>
        </div>

        {/* Right Image */}
        <div style={{ flex: '1 1 500px' }}>
          <img 
            src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2025-11-03-at-20.09.01-e1762181892424-revfovesohdolmi0nfd5hx1m4gzkocdy54c36on35k.jpeg" 
            alt="South Indian Catering" 
            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', objectFit: 'cover' }}
          />
        </div>

      </div>
    </section>
  );
}
