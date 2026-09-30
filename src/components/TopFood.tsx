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
    <section style={{ padding: '5rem 0', backgroundColor: '#fff', textAlign: 'center', overflow: 'hidden' }}>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          display: flex;
          gap: 2rem;
          width: max-content;
          animation: scroll 40s linear infinite;
          padding: 1rem 0;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem', color: '#111' }}>
          Top Food
        </h2>
      </div>

      <div className="marquee-track">
        {marqueeImages.map((src, index) => (
          <img 
            key={index}
            src={src} 
            alt={`Top Food ${index + 1}`}
            style={{ 
              width: '350px', 
              height: '250px', 
              objectFit: 'cover', 
              borderRadius: '16px',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
