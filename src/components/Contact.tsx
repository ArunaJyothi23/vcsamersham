export default function Contact() {
  return (
    <section id="contact" style={{ padding: '4rem 2rem', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', fontWeight: 'bold' }}>
          Contact Us
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem'
        }}>
          {/* Contact Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#f5f5f5', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>
                📞
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', fontWeight: 600 }}>Phone</h3>
                <p style={{ margin: 0, color: '#555' }}>+0149 497 2550</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#f5f5f5', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>
                ✉️
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', fontWeight: 600 }}>Gmail</h3>
                <p style={{ margin: 0, color: '#555' }}>vcsramersham@gmail.com</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#f5f5f5', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>
                📍
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', fontWeight: 600 }}>Address</h3>
                <p style={{ margin: 0, color: '#555' }}>94, sycamore Road, Amersham, HP6 5EN.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#f5f5f5', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>
                🕒
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', fontWeight: 600 }}>Open Timings</h3>
                <p style={{ margin: 0, color: '#555' }}>Mon–Fri: 12pm–10pm<br/>Sat–Sun: 11am–10pm</p>
              </div>
            </div>
          </div>

          {/* Map Column */}
          <div style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <iframe 
              loading="lazy" 
              src="https://maps.google.com/maps?q=srilatha%2094%2C%20sycamore%20Road%2C%20Amersham%2C%20HP6%205EN.&t=m&z=10&output=embed&iwloc=near" 
              title="srilatha 94, sycamore Road, Amersham, HP6 5EN." 
              aria-label="srilatha 94, sycamore Road, Amersham, HP6 5EN."
              width="100%"
              height="100%"
              style={{ border: 0 }}
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
