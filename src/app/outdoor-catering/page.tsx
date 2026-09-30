export default function OutdoorCatering() {
  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* Hero Header */}
      <section style={{
        position: 'relative',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#111',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2000&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 800, 
          margin: 0,
          textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
        }}>
          Outdoor Catering
        </h1>
      </section>

      {/* Main Content */}
      <section style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#111', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Authentic 100% Pure Vegetarian Catering
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#4b5563', lineHeight: 1.8 }}>
            Authentic 100% vegetarian catering in UK, backed by 21+ years of experience. Proud to have catered to all the VIPs and VVIPs of Indian origin across the UK. Perfect for weddings, corporate events, housewarmings, and temple functions. Enjoy live dosa stations, soft idlis, crispy vadas, and traditional banana-leaf feasts with sambar, rasam, poriyal, and payasam—freshly prepared for a truly authentic and memorable experience.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          <div style={{ backgroundColor: '#fdfbf7', padding: '2.5rem', borderRadius: '12px', borderTop: '4px solid #d38b6d', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#111', marginBottom: '1rem' }}>Menu Option 1</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#4b5563', lineHeight: 1.8 }}>
              <li>• Starters & Snacks</li>
              <li>• Live Dosa Counter</li>
              <li>• Main Course Curries</li>
              <li>• Rice Varieties</li>
              <li>• Traditional Sweets</li>
            </ul>
          </div>
          <div style={{ backgroundColor: '#fdfbf7', padding: '2.5rem', borderRadius: '12px', borderTop: '4px solid #d38b6d', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#111', marginBottom: '1rem' }}>Menu Option 2 (Premium)</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#4b5563', lineHeight: 1.8 }}>
              <li>• Extended Starters</li>
              <li>• Live Dosa & Vada Counters</li>
              <li>• Grand Banana Leaf Feast</li>
              <li>• Assorted Breads & Curries</li>
              <li>• Multiple Desserts & Beverages</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', backgroundColor: '#111', color: '#fff', borderRadius: '16px', padding: '4rem 2rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Enquire Now</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.2rem' }}>
            <p><strong>Email:</strong> vcsramersham@gmail.com</p>
            <p><strong>Phone:</strong> +0149 497 2550</p>
            <p><strong>Location:</strong> 94, Sycamore Road, Amersham, HP6 5EN</p>
            <p style={{ marginTop: '1rem', color: '#9ca3af' }}>Please ring us between 11:00 AM TO 3.30PM AND 5.30 PM TO 10.30PM</p>
          </div>
        </div>
      </section>
    </main>
  );
}
