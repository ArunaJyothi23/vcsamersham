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
      <section style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#111', marginBottom: '1.5rem', fontWeight: 'bold' }}>
          Live Dosa Station Menu
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#333', lineHeight: 1.8 }}>
          Each item is prepared fresh on the spot with theatrical flair...
        </p>
      </section>

    </main>
  );
}
