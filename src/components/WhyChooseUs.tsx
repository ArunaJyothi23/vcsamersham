'use client';

export default function WhyChooseUs() {
  const cards = [
    {
      title: "Authentic Recipes",
      desc: "Traditional Chennai recipes passed down through generations, prepared fresh daily.",
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#C45C26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5z" />
          <path d="M9 16v4" />
          <path d="M15 16v4" />
          <path d="M12 16v4" />
        </svg>
      ),
    },
    {
      title: "Expert Chefs",
      desc: "Skilled chefs from Chennai bringing theatrical live dosa and vada stations.",
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#C45C26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
          <line x1="6" y1="17" x2="18" y2="17" />
        </svg>
      ),
    },
    {
      title: "Award Winning",
      desc: "Recognized as World's Favourite Dosa Place with consistent 5-star ratings.",
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#C45C26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
          <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      ),
    },
    {
      title: "Family Friendly",
      desc: "Warm atmosphere perfect for families, celebrations, and corporate events.",
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#C45C26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      ),
    },
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
                backgroundColor: 'rgba(255, 255, 255, 0.92)', 
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
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
                {card.icon}
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
