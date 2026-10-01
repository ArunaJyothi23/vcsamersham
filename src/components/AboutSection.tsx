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

          {/* Dynamic Trust Metric Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1.25rem',
              marginTop: '1.5rem',
            }}
          >
            {stats.map((st: any, idx: number) => (
              <div
                key={idx}
                className="tactile-card"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #E8E0D5',
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
                    fontWeight: 800,
                    color: '#C45C26',
                    lineHeight: 1.1,
                    marginBottom: '0.4rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {st.value}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1A1A1A' }}>
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 3D Dining Feast with Floating Rating Badge */}
        <div style={{ position: 'relative', width: '100%', paddingBottom: '1.75rem' }}>
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
          </div>

          {/* Floating 3D Glass Badge: ★★★★★ 5,000+ Happy Customers */}
          <div
            className="tactile-card"
            style={{
              position: 'absolute',
              bottom: '0',
              right: 'clamp(8px, 3vw, 25px)',
              maxWidth: 'calc(100% - 16px)',
              backgroundColor: 'rgba(196, 92, 38, 0.96)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#ffffff',
              padding: 'clamp(0.75rem, 2.5vw, 1.1rem) clamp(1rem, 3.5vw, 1.85rem)',
              borderRadius: '16px',
              boxShadow: '0 14px 32px rgba(196, 92, 38, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
            }}
          >
            <div
              style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                color: '#FFD700',
                letterSpacing: '2px',
                marginBottom: '0.2rem',
              }}
            >
              ★★★★★
            </div>
            <div
              style={{
                fontSize: 'clamp(0.9rem, 2.8vw, 1.05rem)',
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
    </section>
  );
}
