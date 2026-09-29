export default function AboutSection() {
  return (
    <section style={{ padding: '5rem 2rem', backgroundColor: '#fcfaf6' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '4rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1 1 500px' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            marginBottom: '1.5rem',
            color: '#111',
            lineHeight: 1.2
          }}>
            Award-Winning South Indian Vegetarian Restaurant Amersham
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.8, marginBottom: '1rem' }}>
            As a South Indian restaurant serving fully 100% vegetarian dishes, we
            specialise in crispy dosas, aromatic sambars, traditional idlis, and
            wholesome South Indian vegetarian dishes prepared with fresh ingredients
            and family recipes. We also offer flavourful South and North Indian Thali's
            for those who want a complete meal experience. Known as one of the top-
            rated Indian veg restaurants near me in Amersham, our dining space is
            warm, welcoming, and perfect for all ages, making it a genuinely family-
            friendly Indian vegetarian restaurant. Whether you're craving the best dosa
            restaurant in Amersham or looking for 100% pure vegetarian catering
            services for events, we bring quality, purity, and tradition to every plate—right
            here in the heart of Amersham.
          </p>
        </div>
        <div style={{ flex: '1 1 500px' }}>
          <img 
            src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/CaffeChennai-70-1024x683.jpg" 
            alt="Restaurant Interior"
            style={{ 
              width: '100%', 
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
          />
        </div>
      </div>
    </section>
  );
}
