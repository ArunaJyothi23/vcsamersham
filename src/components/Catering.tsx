import Link from 'next/link';

export default function Catering() {
  return (
    <section id="catering" style={{ padding: 'clamp(3rem, 6vw, 6rem) clamp(1rem, 4vw, 2rem)', backgroundColor: '#fcf8f2' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', 
        gap: 'clamp(2rem, 5vw, 4rem)', 
        alignItems: 'center' 
      }}>
        
        {/* Left Content */}
        <div>
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', 
            fontWeight: 700, 
            color: '#111', 
            marginBottom: '1.25rem', 
            lineHeight: 1.25 
          }}>
            Bring the Flavours to Your Event
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)', color: '#666', lineHeight: 1.6, marginBottom: '2rem' }}>
            Whether it&apos;s a corporate gathering, wedding celebration, or private party, our catering services bring authentic South Indian vegetarian cuisine to your venue. We handle everything from menu planning to setup, ensuring your event is a delicious success.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {/* Feature 1 */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#fcf0e3', padding: '0.75rem', borderRadius: '12px', flexShrink: 0 }}>
                <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/Screenshot-2025-11-01-172630.png" alt="Corporate Events" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.3rem 0', color: '#111' }}>Corporate Events</h3>
                <p style={{ margin: 0, color: '#666', lineHeight: 1.5, fontSize: '0.92rem' }}>Impress your colleagues with authentic South Indian cuisine for office gatherings.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#fcf0e3', padding: '0.75rem', borderRadius: '12px', flexShrink: 0 }}>
                <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/Screenshot-2025-11-01-172645.png" alt="Weddings & Parties" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.3rem 0', color: '#111' }}>Weddings &amp; Parties</h3>
                <p style={{ margin: 0, color: '#666', lineHeight: 1.5, fontSize: '0.92rem' }}>Make your special day memorable with our traditional catering services.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#fcf0e3', padding: '0.75rem', borderRadius: '12px', flexShrink: 0 }}>
                <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/Screenshot-2025-11-01-172702.png" alt="Private Functions" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.3rem 0', color: '#111' }}>Private Functions</h3>
                <p style={{ margin: 0, color: '#666', lineHeight: 1.5, fontSize: '0.92rem' }}>Customized menus for intimate celebrations and family gatherings.</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <Link href="/outdoor-catering" style={{
              backgroundColor: '#d39e7e',
              color: '#fff',
              padding: '0.75rem 1.4rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.98rem',
              transition: 'background-color 0.2s',
              boxShadow: '0 2px 6px rgba(211, 158, 126, 0.3)'
            }}>Outdoor Catering</Link>
            <Link href="/live-dosa-catering" style={{
              backgroundColor: '#d39e7e',
              color: '#fff',
              padding: '0.75rem 1.4rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.98rem',
              transition: 'background-color 0.2s',
              boxShadow: '0 2px 6px rgba(211, 158, 126, 0.3)'
            }}>Live Dosa Catering</Link>
          </div>
        </div>

        {/* Right Image */}
        <div>
          <img 
            src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2025-11-03-at-20.09.01-e1762181892424-revfovesohdolmi0nfd5hx1m4gzkocdy54c36on35k.jpeg" 
            alt="South Indian Catering" 
            style={{ width: '100%', height: 'auto', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', objectFit: 'cover' }}
          />
        </div>

      </div>
    </section>
  );
}
