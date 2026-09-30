export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '520px',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#111',
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("https://vcsamersham.co.uk/wp-content/uploads/2026/06/WhatsApp-Image-2025-11-01-at-15.41.07-2.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div style={{ maxWidth: '900px', padding: '2rem 1.25rem', zIndex: 10 }}>
        <h1
          style={{
            fontSize: 'clamp(2rem, 5.5vw, 3.8rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            lineHeight: 1.2,
            textShadow:
              '3px 3px 6px rgba(0,0,0,0.9), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
          }}
        >
          South Indian Vegetarian Restaurant Amersham
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            marginBottom: '2rem',
            color: '#f5f5f5',
            fontWeight: 500,
            textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
            maxWidth: '750px',
            margin: '0 auto 2rem',
          }}
        >
          Top-rated South-Indian Vegetarian Dining • 100% Pure Veg • Family-Friendly Dining
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/#menu"
            style={{
              backgroundColor: '#d38b6d',
              color: '#fff',
              padding: '0.85rem 2rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.05rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              minWidth: '150px',
            }}
          >
            View Menu
          </a>
          <a
            href="/#order"
            style={{
              backgroundColor: '#d38b6d',
              color: '#fff',
              padding: '0.85rem 2rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.05rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              minWidth: '150px',
            }}
          >
            Order Online
          </a>
        </div>
      </div>
    </section>
  );
}
