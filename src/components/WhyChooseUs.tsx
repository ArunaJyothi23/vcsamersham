'use client';

interface WhyChooseUsProps {
  content?: any;
}

const defaultCards = [
  {
    title: "Authentic Recipes",
    desc: "Traditional Chennai recipes passed down through generations, prepared fresh daily.",
  },
  {
    title: "Expert Chefs",
    desc: "Skilled chefs from Chennai bringing theatrical live dosa and vada stations.",
  },
  {
    title: "Award Winning",
    desc: "Recognized as World's Favourite Dosa Place with consistent 5-star ratings.",
  },
  {
    title: "Family Friendly",
    desc: "Warm atmosphere perfect for families, celebrations, and corporate events.",
  },
];

const cardIcons: Record<number, React.ReactNode> = {
  0: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#C45C26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5z" />
      <path d="M9 16v4" />
      <path d="M15 16v4" />
      <path d="M12 16v4" />
    </svg>
  ),
  1: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#C45C26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <line x1="6" y1="17" x2="18" y2="17" />
    </svg>
  ),
  2: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#C45C26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
      <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  3: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#C45C26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
};

export default function WhyChooseUs({ content }: WhyChooseUsProps) {
  const badge = content?.badge || 'Pure Authenticity';
  const title = content?.title || 'Why Families Love Us';
  const rawFeatures = content?.features || content?.cards || defaultCards;
  const cards = rawFeatures.map((item: any, idx: number) => ({
    title: item.title,
    desc: item.desc || item.description,
    icon: cardIcons[idx % 4],
  }));

  return (
    <section style={{ padding: 'clamp(1.75rem, 3vw, 2.5rem) 1.5rem', backgroundColor: '#FDF6F0' }}>
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
          {badge}
        </span>

        <h2 style={{ 
          fontFamily: "var(--font-sans), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 'clamp(25px, 2.5vw, 30px)', 
          fontWeight: 600, 
          color: '#1A1A1A', 
          marginBottom: '2.25rem',
          lineHeight: '1.3em',
          letterSpacing: '-0.01em'
        }}>
          {title}
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: '1.5rem'
        }}>
          {cards.map((card: any, idx: number) => (
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
