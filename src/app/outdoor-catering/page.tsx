export default function OutdoorCatering() {
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
      </section>

      {/* Main Content */}
      <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '3rem' }}>
          Authentic 100% vegetarian catering in UK, backed by 21+ years of experience. Proud to have catered to all the VIPs and VVIPs of Indian origin across the UK. Perfect for weddings, corporate events, housewarmings, and temple functions. Enjoy live dosa stations, soft idlis, crispy vadas, and traditional banana-leaf feasts with sambar, rasam, poriyal, and payasam—freshly prepared for a truly authentic and memorable experience.
        </p>

        {/* Options Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginBottom: '4rem' }}>
          {['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6', 'Option 7', 'Option 8', 'Option 9'].map((opt, i) => (
            <button key={i} style={{
              backgroundColor: i === 0 ? '#4cd137' : '#d3997f',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              {opt}
            </button>
          ))}
        </div>

        {/* Standard Menu */}
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: '2rem', color: '#1a3b5c', marginBottom: '1.5rem', fontWeight: 'bold' }}>Standard Menu</h2>
          <p style={{ fontSize: '1.1rem', color: '#333', lineHeight: 1.8, marginBottom: '2rem' }}>
            Idly Or Veg Biryani, Meduvada (Live), Masala Dosa (Live), Plain Dosa(Live), Onion Dosa (Live), PodiDosa (Live), Onion Uthappam (Live), Capsicum Uthappam (Live), Chilli Uthappam (Live), Plain Uthappam (Live), PodiUthappam (Live), Coconut chutney, Tomato & Onion Chutney and Sambar.
          </p>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111' }}>Price :</h3>
          <p style={{ fontSize: '1.1rem', color: '#333', lineHeight: 1.8 }}>
            Minimum call out charge for Live Dosa Station for a Weekend is £480/ up to 40 people (£480/ can be reached by the number of people or by the menu),
            Minimum call out charge for Live Dosa Station for a Weekday is £385/ up to 35 people (£385/ can be reached by the number of people or by the menu).
          </p>
        </div>
      </section>

    </main>
  );
}
