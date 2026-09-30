export const metadata = {
  title: 'Live Dosa Catering | Veg Chennai Srilalitha Amersham',
  description: 'Live Dosa Catering - Fresh dosa station for your events. Professional chef, commercial-grade equipment, and authentic South Indian flavours.',
};

const menuItems = [
  { name: 'Idly, Meduvada (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Masala Dosa (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Plain Dosa (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Onion Dosa (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'PodiDosa (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Onion Uthappam (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Capsicum Uthappam (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Chilli Uthappam (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Plain Uthappam (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'PodiUthappam (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'One Dessert', desc: 'Crisp & golden, the classic favourite' },
  { name: 'One Main Course Dish', desc: 'Crisp & golden, the classic favourite' },
];

const includedItems = [
  'Professional chef with traditional skills',
  'Commercial-grade griddle & cooking equipment',
  'Fresh batter & premium ingredients',
  'Authentic condiments & chutneys',
  'Serving staff for smooth service',
  'Eco-friendly disposables (optional)',
];

// Fork icon SVG component
function ForkIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M20 8 L20 28 C20 32 24 34 28 34 L28 56 C28 58 30 60 32 60 C34 60 36 58 36 56 L36 34 C40 34 44 32 44 28 L44 8" stroke="#c9862a" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="26" y1="8" x2="26" y2="24" stroke="#c9862a" strokeWidth="3" strokeLinecap="round"/>
        <line x1="32" y1="8" x2="32" y2="24" stroke="#c9862a" strokeWidth="3" strokeLinecap="round"/>
        <line x1="38" y1="8" x2="38" y2="24" stroke="#c9862a" strokeWidth="3" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

// Green check icon
function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" stroke="#22c55e" strokeWidth="2" fill="none"/>
      <path d="M7 12.5 L10.5 16 L17 9" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function LiveDosaCatering() {
  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      
      {/* Hero Header */}
      <section style={{
        position: 'relative',
        height: '450px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#111',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://vcsamersham.co.uk/wp-content/uploads/2026/06/WhatsApp-Image-2025-11-01-at-15.41.07-2.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 700, 
          margin: 0,
          textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
          letterSpacing: '1px'
        }}>
          Live Dosa Catering
        </h1>
      </section>

      {/* Live Dosa Station Menu */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#111', marginBottom: '0.75rem', fontWeight: 700 }}>
            Live Dosa Station Menu
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#6b7280', fontStyle: 'italic' }}>
            Each item is prepared fresh on the spot with theatrical flair
          </p>
        </div>

        {/* Menu Grid - 3 columns */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1.5rem', 
          marginBottom: '4rem' 
        }}>
          {menuItems.map((item, idx) => (
            <div key={idx} style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              transition: 'box-shadow 0.3s, transform 0.3s',
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <ForkIcon />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111', marginBottom: '0.5rem' }}>
                {item.name}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* What's Included */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#111', textAlign: 'center', marginBottom: '2rem' }}>
            What&apos;s Included
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1rem' 
          }}>
            {includedItems.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: '#fdf8f4',
                padding: '1.25rem 1.5rem',
                borderRadius: '10px',
                border: '1px solid #f3e8de',
              }}>
                <CheckIcon />
                <span style={{ fontSize: '1rem', color: '#374151', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Note */}
        <div style={{
          backgroundColor: '#fef3c7',
          borderRadius: '10px',
          padding: '1.25rem 2rem',
          textAlign: 'center',
          marginBottom: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          border: '1px solid #fde68a',
        }}>
          <span style={{ fontSize: '1.3rem' }}>💷</span>
          <span style={{ color: '#92400e', fontWeight: 500, fontSize: '1rem' }}>
            Pricing: Per item or per-head options available — request a custom quote based on your event size
          </span>
        </div>

        {/* Enquire Now */}
        <div style={{ 
          textAlign: 'center', 
          backgroundColor: '#111', 
          color: '#fff', 
          borderRadius: '16px', 
          padding: '4rem 2rem' 
        }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 700 }}>Enquire Now</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.2rem' }}>
            <p><strong>Email:</strong> vcsramersham@gmail.com</p>
            <p><strong>Phone:</strong> +0149 497 2550</p>
            <p><strong>Location:</strong> 94, Sycamore Road, Amersham, HP6 5EN</p>
            <p style={{ marginTop: '1rem', color: '#9ca3af' }}>Please ring us between 11:00 AM TO 3.30PM AND 5.30 PM TO 10.30PM</p>
          </div>
        </div>
      </section>
    </main>
  );
}
