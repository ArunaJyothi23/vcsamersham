'use client';
import Link from 'next/link';

interface CateringProps {
  content?: any;
}

export default function Catering({ content }: CateringProps) {
  const title = content?.title || 'Bring the Flavours to Your Event';
  const description = content?.description || 'Whether it’s a corporate gathering, wedding celebration, or private party, our catering services bring authentic South Indian vegetarian cuisine to your venue. We handle everything from menu planning to setup, ensuring your event is a delicious success.';
  return (
    <section id="catering" style={{ padding: 'clamp(1.75rem, 3vw, 2.5rem) 1.5rem', backgroundColor: '#FFFDF9' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', 
        gap: 'clamp(2rem, 4vw, 3.5rem)', 
        alignItems: 'center' 
      }}>
        
        {/* Left Content */}
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
            Special Events & Celebrations
          </span>

          <h2 style={{ 
            fontFamily: "var(--font-sans), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: 'clamp(25px, 2.5vw, 30px)', 
            fontWeight: 600, 
            color: '#1A1A1A', 
            marginBottom: '1.25rem', 
            lineHeight: '1.3em',
            letterSpacing: '-0.01em'
          }}>
            {title}
          </h2>
          <p style={{ 
            fontFamily: "var(--font-sans), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: '16px', 
            color: '#555555', 
            lineHeight: 1.65, 
            marginBottom: '2rem' 
          }}>
            {description}
          </p>

          {(() => {
            const defaultFeatures = [
              {
                title: 'Corporate Events',
                desc: 'Impress your colleagues with authentic South Indian cuisine for office gatherings.',
              },
              {
                title: 'Weddings & Parties',
                desc: 'Make your special day memorable with our traditional catering services.',
              },
              {
                title: 'Private Functions',
                desc: 'Customized menus for intimate celebrations and family gatherings.',
              },
            ];

            const featureIcons: Record<number, React.ReactNode> = {
              0: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C45C26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              ),
              1: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C45C26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              ),
              2: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C45C26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ),
            };

            const features = content?.features || defaultFeatures;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                {features.map((feat: any, idx: number) => (
                  <div
                    key={idx}
                    className="tactile-card"
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      alignItems: 'flex-start',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid #E8E0D5',
                      borderRadius: '14px',
                      padding: '1rem 1.25rem',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                    }}
                  >
                    <div style={{ backgroundColor: '#FDF6F0', padding: '0.75rem', borderRadius: '12px', flexShrink: 0, border: '1px solid #E8E0D5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {featureIcons[idx % 3]}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.08rem', fontWeight: 700, margin: '0 0 0.3rem 0', color: '#1A1A1A' }}>{feat.title}</strong>
                      <p style={{ margin: 0, color: '#666666', lineHeight: 1.5, fontSize: '0.92rem' }}>{feat.desc || feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Call to Action Buttons - Responsive on Mobile with Explicit Contrast */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link 
              href="/outdoor-catering" 
              className="btn-3d-primary"
              style={{
                backgroundColor: '#C45C26',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '1em',
                boxShadow: '0 6px 18px rgba(196, 92, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '160px',
                textAlign: 'center',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              Outdoor Catering
            </Link>
            <Link 
              href="/live-dosa-catering" 
              style={{
                backgroundColor: '#FFFFFF',
                color: '#C45C26',
                border: '2px solid #C45C26',
                padding: '14px 28px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '1em',
                boxShadow: '0 4px 14px rgba(196, 92, 38, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '160px',
                textAlign: 'center',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C45C26';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(196, 92, 38, 0.35)';
                const span = e.currentTarget.querySelector('span');
                if (span) span.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#C45C26';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(196, 92, 38, 0.12)';
                const span = e.currentTarget.querySelector('span');
                if (span) span.style.color = '#C45C26';
              }}
            >
              <span style={{ color: '#C45C26', fontWeight: 700, transition: 'color 0.2s' }}>
                Live Dosa Catering
              </span>
            </Link>
          </div>
        </div>

        {/* Right Image with Glassmorphism 3D Frame */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: '-15px',
            background: 'radial-gradient(circle, rgba(196, 92, 38, 0.2) 0%, transparent 70%)',
            zIndex: 0,
            borderRadius: '28px',
            pointerEvents: 'none'
          }} />
          <div
            className="tactile-card"
            style={{
              position: 'relative',
              zIndex: 1,
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.12)',
              border: '1px solid #E8E0D5',
              backgroundColor: '#FDF6F0',
            }}
          >
            <img 
              src="/images/3d/thali-royal-3d.jpg" 
              alt="South Indian Catering Grand Thali Feast" 
              style={{ 
                width: '100%', 
                height: 'auto', 
                display: 'block',
                objectFit: 'cover' 
              }}
            />
            {/* Floating Glass Pill */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '14px',
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #E8E0D5',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
              }}
            >
              <div>
                <strong style={{ display: 'block', color: '#1A1A1A', fontSize: '0.96rem', fontWeight: 800 }}>
                  Grand Royal Feast Catering
                </strong>
                <span style={{ color: '#666666', fontSize: '0.82rem' }}>
                  Weddings, Corporate &amp; Private Celebrations
                </span>
              </div>
              <span
                style={{
                  backgroundColor: '#C45C26',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                Book Catering
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
