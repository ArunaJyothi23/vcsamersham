export default function WhyChooseUs() {
  const cards = [
    {
      title: "Authentic Recipes",
      desc: "Traditional Chennai recipes passed down through generations, prepared fresh daily.",
      img: "/images/migrated/Screenshot-2025-11-01-172306.png"
    },
    {
      title: "Expert Chefs",
      desc: "Skilled chefs from Chennai bringing theatrical live dosa and vada stations.",
      img: "/images/migrated/Screenshot-2025-11-01-172314.png"
    },
    {
      title: "Award Winning",
      desc: "Recognized as World's Favourite Dosa Place with consistent 5-star ratings.",
      img: "/images/migrated/Screenshot-2025-11-01-172321.png"
    },
    {
      title: "Family Friendly",
      desc: "Warm atmosphere perfect for families, celebrations, and corporate events.",
      img: "/images/migrated/Screenshot-2025-11-01-172329.png"
    }
  ];

  return (
    <section style={{ padding: 'clamp(3.5rem, 6vw, 5.5rem) clamp(1rem, 4vw, 2rem)', backgroundColor: '#FDF6F0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
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
            marginBottom: '0.75rem',
          }}
        >
          Pure Authenticity
        </span>

        <h2 style={{ 
          fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', 
          fontWeight: 800, 
          color: '#1A1A1A', 
          marginBottom: '2.5rem',
          letterSpacing: '-0.02em'
        }}>
          Why Families Love Us
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: '1.5rem'
        }}>
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="tactile-card"
              style={{ 
                border: '1px solid #E8E0D5', 
                borderRadius: '18px', 
                padding: '2.5rem 1.75rem', 
                backgroundColor: 'rgba(255, 255, 255, 0.88)', 
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <div style={{ 
                marginBottom: '1.5rem', 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(196, 92, 38, 0.08)',
                border: '1px solid rgba(196, 92, 38, 0.2)'
              }}>
                <img src={card.img} alt={card.title} style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
              </div>
              <strong style={{ display: 'block', fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1A1A1A' }}>
                {card.title}
              </strong>
              <p style={{ color: '#555555', lineHeight: 1.6, fontSize: '0.92rem', margin: 0 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
