export default function Hero() {
  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        minHeight: '520px',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#0a0a0a',
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.45)), url("https://vcsamersham.co.uk/wp-content/uploads/2026/06/WhatsApp-Image-2025-11-01-at-15.41.07-2.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .hero-section {
            min-height: 520px !important;
            height: auto !important;
            padding: 3.5rem 1rem 3.5rem !important;
            background-position: center 30% !important;
          }
          .hero-content-card {
            background: rgba(12, 10, 8, 0.65) !important;
            backdrop-filter: blur(6px) !important;
            -webkit-backdrop-filter: blur(6px) !important;
            border: 1px solid rgba(211, 139, 109, 0.3) !important;
            border-radius: 16px !important;
            padding: 1.75rem 1.25rem !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
          }
        }
      `}</style>

      <div
        className="hero-content-card"
        style={{
          maxWidth: '900px',
          padding: '2.5rem 1.5rem',
          zIndex: 10,
          borderRadius: '16px',
          margin: '0 1rem',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(211, 139, 109, 0.22)',
            color: '#e5a87a',
            border: '1px solid rgba(211, 139, 109, 0.4)',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          🌿 100% Pure Vegetarian South Indian
        </span>

        <h1
          style={{
            fontSize: 'clamp(1.9rem, 5.2vw, 3.8rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            lineHeight: 1.2,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
          }}
        >
          South Indian Vegetarian Restaurant Amersham
        </h1>

        <p
          style={{
            fontSize: 'clamp(0.95rem, 2.2vw, 1.25rem)',
            marginBottom: '2rem',
            color: '#f0ede6',
            fontWeight: 500,
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)',
            maxWidth: '750px',
            margin: '0 auto 2rem',
            lineHeight: 1.5,
          }}
        >
          Top-rated South-Indian Vegetarian Dining • Crispy Dosas & Authentic Thalis • Family-Friendly Dining
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/#menu"
            style={{
              backgroundColor: '#d38b6d',
              color: '#fff',
              padding: '0.85rem 2.2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.05rem',
              boxShadow: '0 4px 12px rgba(211, 139, 109, 0.4)',
              minWidth: '150px',
              transition: 'transform 0.2s, background-color 0.2s',
            }}
          >
            View Menu
          </a>
          <a
            href="/#order"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              color: '#fff',
              padding: '0.85rem 2.2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.05rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              minWidth: '150px',
              backdropFilter: 'blur(4px)',
              transition: 'transform 0.2s, background-color 0.2s',
            }}
          >
            Order Online
          </a>
        </div>
      </div>
    </section>
  );
}
