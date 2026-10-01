"use client";
import defaultSiteContent from "../data/site_content.json";

const carouselImages = [
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.14-2.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.14-7.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.14-6.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.15-3.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.15-2.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.16-4.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.16-2.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.16-1.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.17.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.16-6.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.13-8.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.13-3.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.12-2.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.12.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.12-4.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.13.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.12-1.jpeg",
  "/images/migrated/WhatsApp-Image-2026-04-25-at-12.56.12-3.jpeg",
];

// Double the array to allow for seamless infinite scrolling
const marqueeImages = [...carouselImages, ...carouselImages];

interface TopFoodProps {
  content?: any;
}

export default function TopFood({ content }: TopFoodProps) {
  const topFoodData = content || defaultSiteContent.topFood;
  const rawItems = topFoodData.items && topFoodData.items.length > 0 ? topFoodData.items : defaultSiteContent.topFood.items;

  const signature3DDishes = rawItems.map((item: any) => ({
    title: item.name,
    tag: item.tag || "Special",
    desc: item.description,
    img: item.image,
    price: item.price,
    rating: String(item.rating || "4.9"),
  }));
  return (
    <section style={{ padding: '0.75rem 0 2rem 0', backgroundColor: '#FFFDF9', textAlign: 'center', overflow: 'hidden' }}>
      <style>{`
        @keyframes scrollMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .marquee-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: scrollMarquee 42s linear infinite;
          padding: 0.5rem 0;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .marquee-img {
          width: 320px;
          height: 220px;
          object-fit: cover;
          border-radius: 16px;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          border: 1px solid #E8E0D5;
          transition: transform 0.3s ease;
        }
        .marquee-img:hover {
          transform: scale(1.03);
        }
        @media (max-width: 768px) {
          .marquee-track {
            gap: 1rem;
            animation-duration: 32s;
          }
          .marquee-img {
            width: 240px !important;
            height: 165px !important;
            border-radius: 12px !important;
          }
        }
        .top-food-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(0.75rem, 1.4vw, 1.25rem);
        }
        @media (max-width: 960px) {
          .top-food-cards-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            gap: 1rem !important;
            padding-bottom: 0.85rem !important;
          }
          .top-food-cards-grid > .tactile-card {
            min-width: 280px !important;
            max-width: 300px !important;
            flex-shrink: 0 !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
      
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(1rem, 2.5vw, 2rem)', marginBottom: '1.25rem' }}>
        <h2 style={{ 
          fontFamily: "var(--font-sans), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 'clamp(25px, 2.5vw, 30px)', 
          fontWeight: 600, 
          color: '#1A1A1A', 
          textAlign: 'center', 
          margin: '0 0 1.25rem 0', 
          lineHeight: '1.3em',
          letterSpacing: '-0.01em' 
        }}>
          {topFoodData.title || 'Top Food'}
        </h2>

        {/* All Signature 3D Visual Cards in 1 Row */}
        <div
          className="top-food-cards-grid"
          style={{
            textAlign: 'left',
          }}
        >
          {signature3DDishes.map((dish: any, idx: number) => (
            <div
              key={idx}
              className="tactile-card"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderRadius: '20px',
                border: '1px solid #E8E0D5',
                overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* 3D Food Image */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', overflow: 'hidden', backgroundColor: '#FDF6F0' }}>
                <img
                  src={dish.img}
                  alt={dish.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(18, 14, 12, 0.75)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '16px',
                    border: '1px solid rgba(232, 168, 124, 0.4)',
                  }}
                >
                  {dish.tag}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    color: '#D4A017',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '16px',
                    border: '1px solid #E8E0D5',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  }}
                >
                  ★ {dish.rating}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem 1.25rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '1.15rem', fontWeight: 800, color: '#1A1A1A', marginBottom: '0.45rem', letterSpacing: '-0.01em' }}>
                    {dish.title}
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#555555', lineHeight: 1.55 }}>
                    {dish.desc}
                  </p>
                </div>
                <div style={{ marginTop: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <a
                    href="/#menu"
                    style={{
                      color: '#C45C26',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    View in Menu →
                  </a>
                  <span style={{ fontSize: '0.78rem', color: '#888888', fontWeight: 600 }}>Pure Vegetarian</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Header & Carousel */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 1.5rem', padding: '0 1.25rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#888888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0 }}>
          More From Our Daily Kitchen
        </p>
      </div>

      <div className="marquee-track">
        {marqueeImages.map((src, index) => (
          <img 
            key={index}
            src={src} 
            alt={`Top Food Dish ${index + 1}`}
            className="marquee-img"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        ))}
      </div>
    </section>
  );
}
