'use client';
import Link from 'next/link';

export default function Footer() {
  const headingStyle = {
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    marginBottom: '1.5rem'
  };

  const linkStyle = {
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '0.9rem',
    display: 'block',
    marginBottom: '0.75rem',
    transition: 'color 0.2s',
    fontWeight: '400'
  };

  const textStyle = {
    color: '#9ca3af',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    fontWeight: '400'
  };

  return (
    <footer style={{ backgroundColor: '#050505', color: '#fff', paddingTop: '3.5rem', paddingBottom: '1.5rem' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(1.25rem, 4vw, 2rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
        gap: '2.5rem',
        borderBottom: '1px solid #222',
        paddingBottom: '2.5rem',
        marginBottom: '1.5rem'
      }}>
        
        {/* Column 1: Logo & About */}
        <div>
          <div style={{ backgroundColor: '#fff', display: 'inline-flex', padding: '0.4rem 0.8rem', borderRadius: '6px', marginBottom: '1.2rem' }}>
            <img 
              src="https://vcsamersham.co.uk/wp-content/uploads/2026/06/vcsr-logo.webp" 
              alt="VCS Amersham Logo" 
              style={{ height: '40px', width: 'auto' }}
            />
          </div>
          <p style={{ ...textStyle, paddingRight: '1rem' }}>
            Authentic South Indian vegetarian cuisine, served with heart in Amersham.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={headingStyle}>Quick Links</h4>
          <Link href="/#menu" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>Menu</Link>
          <Link href="/outdoor-catering" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>Outdoor Catering</Link>
          <Link href="/live-dosa-catering" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>Live Dosa Catering</Link>
          <Link href="/#contact" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>Contact</Link>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h4 style={headingStyle}>Contact</h4>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <p style={{ ...textStyle, margin: 0 }}>94, Sycamore Road,<br/>Amersham, HP6 5EN</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <p style={{ ...textStyle, margin: 0 }}>+0149 497 2550</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <p style={{ ...textStyle, margin: 0 }}>vcsramersham@gmail.com</p>
          </div>
        </div>

        {/* Column 4: Legal & Social */}
        <div>
          <h4 style={headingStyle}>Legal Links</h4>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <a href="#" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#9ca3af', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'; }} onMouseOut={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = '#4b5563'; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#9ca3af', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'; }} onMouseOut={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = '#4b5563'; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
          <Link href="/privacy-policy" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>Privacy Policy</Link>
          <Link href="/cookies-policy" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>Cookies Policy</Link>
          <Link href="/disclaimer" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>Disclaimer</Link>
        </div>

      </div>

      {/* Bottom Bar */}
      <div style={{ textAlign: 'center', padding: '0 2rem' }}>
        <p style={{ color: '#4b5563', fontSize: '0.8rem', margin: 0, letterSpacing: '0.5px' }}>
          &copy; 2026 Veg Chennai Srilalitha Amersham. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
