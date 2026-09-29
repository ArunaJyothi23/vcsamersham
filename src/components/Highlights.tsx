export default function Highlights() {
  const features = [
    {
      title: "100% Pure Veg",
      description: "Authentic South Indian vegetarian dishes crafted with fresh ingredients.",
      icon: "🌱"
    },
    {
      title: "Family Friendly",
      description: "A welcoming atmosphere perfect for family dinners and celebrations.",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      title: "Online Ordering",
      description: "Order your favorite meals online for quick pickup or delivery.",
      icon: "🛍️"
    }
  ];

  return (
    <section style={{ padding: '5rem 2rem', backgroundColor: '#f9fafb', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: '#1f2937' }}>Why Choose Us?</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {features.map((feature, index) => (
          <div key={index} style={{
            padding: '2rem',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>{feature.title}</h3>
            <p style={{ color: '#4b5563', lineHeight: 1.6 }}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
