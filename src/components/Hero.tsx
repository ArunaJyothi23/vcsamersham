export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      height: '85vh',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#fff',
      backgroundColor: '#111',
      // Using a clean high-quality Indian food background that closely matches the original vibe without the watermark text
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=2000&auto=format&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div style={{ maxWidth: '900px', padding: '2rem', zIndex: 10 }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 800, 
          marginBottom: '1rem',
          lineHeight: 1.2,
          textShadow: '3px 3px 6px rgba(0,0,0,0.9), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
        }}>
          South Indian Vegetarian Restaurant Amersham
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          marginBottom: '2.5rem',
          color: '#f5f5f5',
          fontWeight: 500,
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
        }}>
          Top-rated South-Indian Vegetarian Dining • 100% Pure Veg • Family-Friendly Dining
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <a href="/#menu" style={{
            backgroundColor: '#d38b6d', // Matching beige/orange color
            color: '#fff',
            padding: '1rem 2.5rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
            View Menu
          </a>
          <a href="/#order" style={{
            backgroundColor: '#d38b6d', // Matching beige/orange color
            color: '#fff',
            padding: '1rem 2.5rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
            Order Online
          </a>
        </div>
      </div>
    </section>
  );
}
