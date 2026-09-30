"use client";

import { useRef } from 'react';

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

export default function TopFood() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350 + 32; // image width + gap
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ padding: '5rem 0', backgroundColor: '#fff', textAlign: 'center', position: 'relative' }}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 20px;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }
        .nav-btn:hover {
          background: rgba(0, 0, 0, 0.8);
        }
      `}</style>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem', color: '#111' }}>
          Top Food
        </h2>
        
        <div style={{ position: 'relative', padding: '0 2rem' }}>
          <button className="nav-btn" style={{ left: '10px' }} onClick={() => scroll('left')}>❮</button>
          
          <div 
            ref={scrollRef}
            className="hide-scrollbar"
            style={{ 
              display: 'flex', 
              gap: '2rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              padding: '1rem 0'
            }}
          >
            {carouselImages.map((src, index) => (
              <img 
                key={index}
                src={src} 
                alt={`Top Food ${index + 1}`}
                style={{ 
                  width: '350px', 
                  height: '250px', 
                  objectFit: 'cover', 
                  borderRadius: '16px',
                  scrollSnapAlign: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                loading="lazy"
              />
            ))}
          </div>

          <button className="nav-btn" style={{ right: '10px' }} onClick={() => scroll('right')}>❯</button>
        </div>
      </div>
    </section>
  );
}
