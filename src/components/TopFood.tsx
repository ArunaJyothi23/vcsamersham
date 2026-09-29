export default function TopFood() {
  return (
    <section style={{ padding: '5rem 2rem', backgroundColor: '#fff', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          marginBottom: '3rem',
          color: '#111'
        }}>
          Top Food
        </h2>
        
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <img 
            src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.12.jpeg" 
            alt="Top Food 1"
            style={{ width: '350px', height: '250px', objectFit: 'cover', borderRadius: '16px' }}
          />
          <img 
            src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.13.jpeg" 
            alt="Top Food 2"
            style={{ width: '350px', height: '250px', objectFit: 'cover', borderRadius: '16px' }}
          />
          <img 
            src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.14-2.jpeg" 
            alt="Top Food 3"
            style={{ width: '350px', height: '250px', objectFit: 'cover', borderRadius: '16px' }}
          />
        </div>
      </div>
    </section>
  );
}
