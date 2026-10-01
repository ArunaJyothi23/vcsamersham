import defaultSiteContent from '../data/site_content.json';

interface ContactProps {
  restaurant?: any;
}

export default function Contact({ restaurant }: ContactProps) {
  const rest = restaurant || defaultSiteContent.restaurant;

  return (
    <section id="contact" style={{ padding: 'clamp(3.5rem, 6vw, 6rem) clamp(1rem, 4vw, 2rem)', backgroundColor: '#FFFDF9' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', 
        gap: 'clamp(2rem, 5vw, 4rem)',
        alignItems: 'start'
      }}>
        
        {/* Contact Details Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
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
              alignSelf: 'flex-start'
            }}
          >
            Visit & Connect
          </span>

          <h2 style={{ 
            fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', 
            fontWeight: 800, 
            color: '#1A1A1A', 
            marginBottom: '2rem',
            letterSpacing: '-0.02em'
          }}>
            Contact Us
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Phone */}
            <div 
              className="tactile-card"
              style={{ 
                display: 'flex', 
                gap: '1.25rem', 
                alignItems: 'center', 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '1.25rem 1.5rem', 
                borderRadius: '16px',
                border: '1px solid #E8E0D5',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{ 
                backgroundColor: '#FDF6F0', 
                color: '#C45C26', 
                width: '46px', 
                height: '46px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0,
                border: '1px solid #E8E0D5'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div>
                <strong style={{ display: 'block', margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#1A1A1A' }}>Phone</strong>
                <a href={`tel:${rest.phoneRaw || rest.phone}`} style={{ margin: 0, color: '#555555', fontSize: '0.98rem', textDecoration: 'none', fontWeight: 500 }}>{rest.phone}</a>
              </div>
            </div>

            {/* Gmail */}
            <div 
              className="tactile-card"
              style={{ 
                display: 'flex', 
                gap: '1.25rem', 
                alignItems: 'center', 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '1.25rem 1.5rem', 
                borderRadius: '16px',
                border: '1px solid #E8E0D5',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{ 
                backgroundColor: '#FDF6F0', 
                color: '#C45C26', 
                width: '46px', 
                height: '46px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0,
                border: '1px solid #E8E0D5'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <strong style={{ display: 'block', margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#1A1A1A' }}>Email</strong>
                <a href={`mailto:${rest.email}`} style={{ margin: 0, color: '#555555', fontSize: '0.98rem', textDecoration: 'none', wordBreak: 'break-all', fontWeight: 500 }}>{rest.email}</a>
              </div>
            </div>

            {/* Address */}
            <div 
              className="tactile-card"
              style={{ 
                display: 'flex', 
                gap: '1.25rem', 
                alignItems: 'center', 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '1.25rem 1.5rem', 
                borderRadius: '16px',
                border: '1px solid #E8E0D5',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{ 
                backgroundColor: '#FDF6F0', 
                color: '#C45C26', 
                width: '46px', 
                height: '46px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0,
                border: '1px solid #E8E0D5'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <strong style={{ display: 'block', margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#1A1A1A' }}>Address</strong>
                <p style={{ margin: 0, color: '#555555', fontSize: '0.98rem', lineHeight: 1.4, fontWeight: 500 }}>{rest.address}</p>
              </div>
            </div>

            {/* Open Timings */}
            <div 
              className="tactile-card"
              style={{ 
                display: 'flex', 
                gap: '1.25rem', 
                alignItems: 'center', 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '1.25rem 1.5rem', 
                borderRadius: '16px',
                border: '1px solid #E8E0D5',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{ 
                backgroundColor: '#FDF6F0', 
                color: '#C45C26', 
                width: '46px', 
                height: '46px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0,
                border: '1px solid #E8E0D5'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <strong style={{ display: 'block', margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#1A1A1A' }}>Opening Hours</strong>
                <p style={{ margin: 0, color: '#555555', fontSize: '0.98rem', lineHeight: 1.5, fontWeight: 500 }}>
                  {rest.openingHours.weekday}<br/>{rest.openingHours.weekend}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Column */}
        <div style={{ 
          width: '100%', 
          minHeight: '400px', 
          height: '100%', 
          minWidth: 0, 
          borderRadius: '20px', 
          overflow: 'hidden', 
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E8E0D5'
        }}>
          <iframe 
            loading="lazy" 
            src="https://maps.google.com/maps?q=srilatha%2094%2C%20sycamore%20Road%2C%20Amersham%2C%20HP6%205EN.&t=m&z=12&output=embed&iwloc=near" 
            title="srilatha 94, sycamore Road, Amersham, HP6 5EN." 
            aria-label="srilatha 94, sycamore Road, Amersham, HP6 5EN."
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '400px', display: 'block' }}
          ></iframe>
        </div>

      </div>
    </section>
  );
}
