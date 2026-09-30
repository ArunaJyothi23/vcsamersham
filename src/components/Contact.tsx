export default function Contact() {
  return (
    <section id="contact" style={{ padding: 'clamp(3rem, 6vw, 6rem) clamp(1rem, 4vw, 2rem)', backgroundColor: '#fff' }}>
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
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontWeight: 'bold', color: '#111', marginBottom: '2rem' }}>
            Contact Us
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Phone */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', backgroundColor: '#fdf6f0', padding: '1.25rem 1.5rem', borderRadius: '12px' }}>
              <div style={{ color: '#d39e7e', flexShrink: 0 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 'bold', color: '#111' }}>Phone</h3>
                <a href="tel:+01494972550" style={{ margin: 0, color: '#666', fontSize: '0.98rem', textDecoration: 'none' }}>+0149 497 2550</a>
              </div>
            </div>

            {/* Gmail */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', backgroundColor: '#fdf6f0', padding: '1.25rem 1.5rem', borderRadius: '12px' }}>
              <div style={{ color: '#d39e7e', flexShrink: 0 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 'bold', color: '#111' }}>Email</h3>
                <a href="mailto:vcsramersham@gmail.com" style={{ margin: 0, color: '#666', fontSize: '0.98rem', textDecoration: 'none', wordBreak: 'break-all' }}>vcsramersham@gmail.com</a>
              </div>
            </div>

            {/* Address */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', backgroundColor: '#fdf6f0', padding: '1.25rem 1.5rem', borderRadius: '12px' }}>
              <div style={{ color: '#d39e7e', flexShrink: 0 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 'bold', color: '#111' }}>Address</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.98rem', lineHeight: 1.4 }}>94, Sycamore Road, Amersham, HP6 5EN.</p>
              </div>
            </div>

            {/* Open Timings */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', backgroundColor: '#fdf6f0', padding: '1.25rem 1.5rem', borderRadius: '12px' }}>
              <div style={{ color: '#d39e7e', flexShrink: 0 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 'bold', color: '#111' }}>Opening Hours</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.98rem', lineHeight: 1.5 }}>
                  Mon - Fri: 12:00 PM - 10:00 PM<br/>Sat - Sun: 11:00 AM - 10:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Column */}
        <div style={{ width: '100%', minHeight: '380px', height: '100%', minWidth: 0, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <iframe 
            loading="lazy" 
            src="https://maps.google.com/maps?q=srilatha%2094%2C%20sycamore%20Road%2C%20Amersham%2C%20HP6%205EN.&t=m&z=12&output=embed&iwloc=near" 
            title="srilatha 94, sycamore Road, Amersham, HP6 5EN." 
            aria-label="srilatha 94, sycamore Road, Amersham, HP6 5EN."
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '380px' }}
          ></iframe>
        </div>

      </div>
    </section>
  );
}
