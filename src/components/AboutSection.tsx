import defaultSiteContent from '../data/site_content.json';

interface AboutSectionProps {
  content?: any;
  restaurant?: any;
}

export default function AboutSection({ content, restaurant }: AboutSectionProps) {
  const about = content || defaultSiteContent.about;
  const stats = about.stats && about.stats.length > 0 ? about.stats : defaultSiteContent.about.stats;

  return (
    <section style={{ padding: 'clamp(3.5rem, 6vw, 6rem) clamp(1rem, 4vw, 2.5rem)', backgroundColor: '#FDF6F0', position: 'relative' }}>
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 'clamp(2rem, 5vw, 4.5rem)',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Heading, Description & Stats */}
        <div>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(196, 92, 38, 0.1)',
              color: '#C45C26',
              border: '1px solid rgba(196, 92, 38, 0.25)',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '0.85rem',
            }}
          >
            {about.badge || "Since 2011 • Pure Heritage"}
          </span>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4.2vw, 2.85rem)',
              fontWeight: 800,
              marginBottom: '1.5rem',
              color: '#1A1A1A',
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
            }}
          >
            {about.title || defaultSiteContent.about.title}
          </h2>
          <div
            style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)',
              color: '#555555',
              lineHeight: 1.8,
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {(about.paragraphs || defaultSiteContent.about.paragraphs).map((p: string, idx: number) => (
              <p key={idx} style={{ margin: 0 }}>
                {p}
              </p>
            ))}
          </div>

          {/* Dynamic Trust Metric Stats - Responsive with no overflow */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 110px), 1fr))',
              gap: 'clamp(0.6rem, 1.5vw, 1rem)',
              marginTop: '1.5rem',
            }}
          >
            {stats.map((st: any, idx: number) => (
              <div
                key={idx}
                className="tactile-card"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  padding: '1rem 0.6rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #E8E0D5',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(1.35rem, 2.2vw, 1.8rem)',
                    fontWeight: 800,
                    color: '#C45C26',
                    lineHeight: 1.1,
                    marginBottom: '0.35rem',
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {st.value}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.25 }}>
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 3D Dining Feast with Perfectly Positioned Floating Badge */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '580px', margin: '0 auto' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
              border: '1px solid #E8E0D5',
              aspectRatio: '4 / 3',
              backgroundColor: '#FDF6F0',
            }}
          >
            <img
              src="/images/3d/restaurant-feast-3d.jpg"
              alt="3D Illustrated South Indian Dining Feast Amersham"
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover',
              }}
            />

            {/* Floating 3D Badge kept cleanly inside the image frame */}
            <div
              className="tactile-card"
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                backgroundColor: 'rgba(196, 92, 38, 0.95)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: '#ffffff',
                padding: '0.65rem 1.15rem',
                borderRadius: '14px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
              }}
            >
              <div
                style={{
                  fontSize: '0.95rem',
                  color: '#FFD700',
                  letterSpacing: '2px',
                  marginBottom: '0.15rem',
                }}
              >
                ★★★★★
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.3px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                5,000+ Happy Customers
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
