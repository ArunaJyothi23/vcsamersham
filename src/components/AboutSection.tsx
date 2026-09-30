export default function AboutSection() {
  return (
    <section style={{ padding: 'clamp(3.5rem, 6vw, 5.5rem) clamp(1rem, 4vw, 2rem)', backgroundColor: '#faf4ee' }}>
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
          gap: 'clamp(2.5rem, 5vw, 4.5rem)',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Heading, Description & Stats */}
        <div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4.2vw, 2.85rem)',
              fontWeight: 800,
              marginBottom: '1.5rem',
              color: '#111',
              lineHeight: 1.25,
            }}
          >
            Award-Winning South Indian Vegetarian Restaurant Amersham
          </h2>
          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)',
              color: '#555',
              lineHeight: 1.8,
              marginBottom: '2rem',
            }}
          >
            As a South Indian restaurant serving fully 100% vegetarian dishes, we
            specialise in crispy dosas, aromatic sambars, traditional idlis, and
            wholesome South Indian vegetarian dishes prepared with fresh ingredients
            and family recipes. We also offer flavourful South and North Indian Thali&apos;s
            for those who want a complete meal experience. Known as one of the top-
            rated Indian veg restaurants near me in Amersham, our dining space is
            warm, welcoming, and perfect for all ages, making it a genuinely family-
            friendly Indian vegetarian restaurant. Whether you&apos;re craving the best dosa
            restaurant in Amersham or looking for 100% pure vegetarian catering
            services for events, we bring quality, purity, and tradition to every plate—right
            here in the heart of Amersham.
          </p>

          {/* Stats: 5 UK Locations & 15+ Years Experience */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1.25rem',
              marginTop: '1.5rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '1.35rem 1.5rem',
                textAlign: 'center',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0, 0, 0, 0.04)',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                  fontWeight: 800,
                  color: '#d38b6d',
                  lineHeight: 1.1,
                  marginBottom: '0.4rem',
                }}
              >
                5
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#333' }}>
                UK Locations
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '1.35rem 1.5rem',
                textAlign: 'center',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0, 0, 0, 0.04)',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                  fontWeight: 800,
                  color: '#d38b6d',
                  lineHeight: 1.1,
                  marginBottom: '0.4rem',
                }}
              >
                15+
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#333' }}>
                Years Experience
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interior Photo with Floating Rating Badge */}
        <div style={{ position: 'relative', width: '100%', paddingBottom: '1.75rem' }}>
          <img
            src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/CaffeChennai-70-1024x683.jpg"
            alt="Restaurant Interior Amersham"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '24px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
              display: 'block',
              objectFit: 'cover',
            }}
          />

          {/* Floating Badge: ★★★★★ 5,000+ Happy Customers */}
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              right: 'clamp(10px, 3vw, 25px)',
              backgroundColor: '#c57c5d',
              color: '#ffffff',
              padding: '1.1rem 1.75rem',
              borderRadius: '14px',
              boxShadow: '0 12px 28px rgba(197, 124, 93, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '1.25rem',
                letterSpacing: '3px',
                color: '#ffffff',
                lineHeight: 1,
                marginBottom: '0.35rem',
              }}
            >
              ★★★★★
            </div>
            <div
              style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                fontWeight: 700,
                color: '#ffffff',
                whiteSpace: 'nowrap',
              }}
            >
              5,000+ Happy Customers
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
