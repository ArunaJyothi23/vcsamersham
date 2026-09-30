"use client";

const carouselImages = [
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.14-2.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.14-7.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.14-6.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.15-3.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.15-2.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.16-4.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.16-2.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.16-1.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.17.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.16-6.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.13-8.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.13-3.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.12-2.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.12.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.12-4.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.13.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.12-1.jpeg",
  "https://vcsamersham.co.uk/wp-content/uploads/2026/07/WhatsApp-Image-2026-04-25-at-12.56.12-3.jpeg",
];

// Double the array to allow for seamless infinite scrolling
const marqueeImages = [...carouselImages, ...carouselImages];

export default function TopFood() {
  return (
    <section style={{ padding: 'clamp(3rem, 5vw, 5rem) 0', backgroundColor: '#ffffff', textAlign: 'center', overflow: 'hidden' }}>
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
          width: 340px;
          height: 240px;
          object-fit: cover;
          border-radius: 16px;
          flex-shrink: 0;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
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
            width: 250px !important;
            height: 175px !important;
            border-radius: 12px !important;
          }
        }
      `}</style>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', marginBottom: '2.5rem' }}>
        <span
          style={{
            color: '#d38b6d',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.5rem',
          }}
        >
          Fresh from our Kitchen
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#111', marginBottom: '0.5rem' }}>
          Top Food & Signatures
        </h2>
        <p style={{ color: '#666', fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)', maxWidth: '600px', margin: '0 auto' }}>
          Crispy dosas, authentic sambar, soft idlis, and freshly prepared South Indian delicacies.
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
          />
        ))}
      </div>
    </section>
  );
}
