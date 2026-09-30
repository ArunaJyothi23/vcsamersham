export default function LiveDosaCatering() {
  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* Hero Header */}
      <section style={{
        position: 'relative',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#111',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://vcsamersham.co.uk/wp-content/uploads/2026/06/WhatsApp-Image-2025-11-03-at-18.48.43-1024x430.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 800, 
          margin: 0,
          textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
        }}>
          Live Dosa Catering
        </h1>
      </section>

      {/* Main Content */}
      <section style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#111', marginBottom: '1rem', fontWeight: 'bold' }}>
            Live Dosa Station Menu
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#4b5563', lineHeight: 1.8 }}>
            Each item is prepared fresh on the spot with theatrical flair.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center', marginBottom: '5rem' }}>
          <div style={{ flex: '1 1 300px', backgroundColor: '#fdfbf7', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#d38b6d', marginBottom: '1rem' }}>Idly, Meduvada (Live)</h3>
            <p style={{ color: '#4b5563' }}>Crisp &amp; golden, the classic favourite</p>
          </div>
          <div style={{ flex: '1 1 300px', backgroundColor: '#fdfbf7', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#d38b6d', marginBottom: '1rem' }}>Live Dosa Varieties</h3>
            <p style={{ color: '#4b5563' }}>Freshly spread and crisped with ghee, butter, and authentic fillings on the spot.</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '3rem', marginBottom: '5rem' }}>
          <h3 style={{ fontSize: '2rem', color: '#111', marginBottom: '2rem', textAlign: 'center' }}>What's Included</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {['Professional chef with traditional skills', 'Commercial-grade griddle & cooking equipment', 'Fresh batter & premium ingredients', 'Authentic condiments & chutneys', 'Serving staff for smooth service', 'Eco-friendly disposables (optional)'].map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', color: '#374151' }}>
                <span style={{ color: '#059669', fontSize: '1.5rem' }}>✓</span> {item}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fef3c7', borderRadius: '8px', color: '#92400e', fontWeight: 500, textAlign: 'center' }}>
            Pricing: Per item or per-head options available — request a custom quote based on your event size.
          </div>
        </div>

        <div style={{ textAlign: 'center', backgroundColor: '#111', color: '#fff', borderRadius: '16px', padding: '4rem 2rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Enquire Now</h2>
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
