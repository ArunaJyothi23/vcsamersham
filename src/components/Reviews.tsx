'use client';
import { useEffect, useRef } from 'react';
import defaultSiteContent from '../data/site_content.json';

const AVATAR_COLORS = [
  '#ea4335', // Google Red
  '#0f766e', // Teal
  '#6c2bd9', // Purple
  '#16a34a', // Green
  '#4f46e5', // Indigo
  '#9333ea', // Violet
  '#2563eb', // Blue
  '#d97706', // Amber
];

interface ReviewItem {
  id?: number | string;
  author?: string;
  name?: string;
  avatarLetter?: string;
  avatarColor?: string;
  time?: string;
  date?: string;
  rating?: number;
  text?: string;
}

interface ReviewsProps {
  testimonials?: {
    items?: ReviewItem[];
    averageRating?: number | string;
    reviewCount?: number | string;
  };
}

export default function Reviews({ testimonials }: ReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rawItems = testimonials?.items || defaultSiteContent.testimonials?.items || [];

  const reviews = rawItems.map((item: any, idx: number) => {
    const authorName = item.name || item.author || 'Happy Customer';
    const cleanLetters = authorName.replace(/[^a-zA-Z]/g, '');
    const firstLetter = (cleanLetters[0] || 'G').toUpperCase();
    return {
      author: authorName,
      avatarLetter: firstLetter,
      avatarColor: item.avatarColor || AVATAR_COLORS[idx % AVATAR_COLORS.length],
      time: item.date || item.time || 'Recently',
      rating: typeof item.rating === 'number' ? item.rating : 5,
      text: item.text || '',
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const scrollLeftBtn = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
  };

  const scrollRightBtn = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
  };

  return (
    <section id="reviews" style={{ padding: 'clamp(3.5rem, 6vw, 5.5rem) clamp(1rem, 4vw, 2rem)', backgroundColor: '#FDF6F0', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <span
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(212, 160, 23, 0.12)',
            color: '#D4A017',
            border: '1px solid rgba(212, 160, 23, 0.3)',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          Customer Testimonials
        </span>

        <h2 style={{ 
          fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', 
          fontWeight: 800, 
          color: '#1A1A1A', 
          marginBottom: '2.5rem',
          letterSpacing: '-0.02em'
        }}>
          Google reviews
        </h2>

        <div style={{ position: 'relative' }}>
          {/* Left Arrow */}
          <button 
            type="button"
            aria-label="Scroll left"
            onClick={scrollLeftBtn} 
            style={{ 
              position: 'absolute', 
              left: '-15px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              width: '42px', 
              height: '42px', 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '50%', 
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              zIndex: 10, 
              cursor: 'pointer', 
              color: '#1A1A1A',
              border: '1px solid #E8E0D5',
              backdropFilter: 'blur(8px)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          {/* Right Arrow */}
          <button 
            type="button"
            aria-label="Scroll right"
            onClick={scrollRightBtn} 
            style={{ 
              position: 'absolute', 
              right: '-15px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              width: '42px', 
              height: '42px', 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '50%', 
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              zIndex: 10, 
              cursor: 'pointer', 
              color: '#1A1A1A',
              border: '1px solid #E8E0D5',
              backdropFilter: 'blur(8px)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <div 
            ref={scrollRef}
            style={{ 
              display: 'flex', 
              gap: '1.5rem', 
              overflowX: 'auto', 
              paddingBottom: '2rem', 
              scrollbarWidth: 'none', 
              scrollSnapType: 'x mandatory', 
              padding: '0.5rem 0.5rem 2rem 0.5rem' 
            }}
          >
            {/* Summary Card */}
            <div 
              className="tactile-card"
              style={{ 
                minWidth: '320px',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '18px',
                padding: '2rem 1.5rem',
                textAlign: 'left',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                scrollSnapAlign: 'start',
                border: '1px solid #E8E0D5',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(212, 160, 23, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                <img src="/images/migrated/vcsr-logo.webp" alt="Logo" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
                <strong style={{ fontSize: '0.92rem', margin: 0, fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', lineHeight: 1.4, display: 'block' }}>
                  VEG CHENNAI SRILALITHA RESTAURANT, AMERSHAM
                </strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#D4A017' }}>4.6</span>
                <span style={{ color: '#D4A017', fontSize: '1.25rem', letterSpacing: '2px' }}>★★★★★</span>
              </div>
              <p style={{ margin: '0 0 0.8rem 0', color: '#666666', fontSize: '0.9rem', fontWeight: 500 }}>
                Based on 645 reviews
              </p>
              <p style={{ margin: '0 0 1.5rem 0', color: '#888888', fontSize: '0.85rem' }}>
                powered by <span style={{ fontWeight: 700, color: '#1A1A1A' }}>Google</span>
              </p>
              <a 
                href="https://search.google.com/local/reviews?placeid=ChIJlQn9sipndkgR9CoUH8Wmwzs" 
                target="_blank" 
                rel="noreferrer" 
                style={{
                  backgroundColor: '#4285f4',
                  color: '#ffffff',
                  padding: '0.65rem 1.3rem',
                  borderRadius: '24px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                  transition: 'transform 0.2s ease'
                }}
              >
                review us on <span style={{ backgroundColor: '#ffffff', color: '#4285f4', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '11px', fontWeight: 700 }}>G</span>
              </a>
            </div>

            {/* Review Cards */}
            {reviews.map((rev, idx) => (
              <div 
                key={idx} 
                className="tactile-card"
                style={{ 
                  minWidth: 'min(320px, 80vw)',
                  maxWidth: 'min(320px, 80vw)',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: '18px',
                  padding: '1.75rem 1.35rem',
                  textAlign: 'left',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
                  position: 'relative',
                  scrollSnapAlign: 'start',
                  border: '1px solid #E8E0D5',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.04)';
                }}
              >
                {/* Google G Logo top right */}
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '20px', height: '20px' }}>
                  <svg viewBox="0 0 512 512"><path d="M482.56 261.36c0-16.73-1.5-32.83-4.29-48.27H256v91.29h127.01c-5.47 29.5-22.1 54.49-47.09 71.23v59.21h76.27c44.63-41.09 70.37-101.59 70.37-173.46z" fill="#4285f4"/><path d="M256 492c63.72 0 117.14-21.13 156.19-57.18l-76.27-59.21c-21.13 14.16-48.17 22.53-79.92 22.53-61.47 0-113.49-41.51-132.05-97.3H45.1v61.15c38.83 77.13 118.64 130.01 210.9 130.01z" fill="#34a853"/><path d="M123.95 300.84c-4.72-14.16-7.4-29.29-7.4-44.84s2.68-30.68 7.4-44.84V150.01H45.1C29.12 181.87 20 217.92 20 256c0 38.08 9.12 74.13 25.1 105.99l78.85-61.15z" fill="#fbbc05"/><path d="M256 113.86c34.65 0 65.76 11.91 90.22 35.29l67.69-67.69C373.03 43.39 319.61 20 256 20c-92.25 0-172.07 52.89-210.9 130.01l78.85 61.15c18.56-55.78 70.59-97.3 132.05-97.3z" fill="#ea4335"/></svg>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: rev.avatarColor, color: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', fontWeight: 600 }}>
                    {rev.avatarLetter}
                  </div>
                  <div>
                    <strong style={{ margin: '0 0 0.15rem 0', fontSize: '0.98rem', color: '#1A1A1A', fontWeight: 700, display: 'block' }}>{rev.author}</strong>
                    <span style={{ fontSize: '0.82rem', color: '#888888' }}>{rev.time}</span>
                  </div>
                </div>
                <div style={{ color: '#D4A017', fontSize: '1.2rem', marginBottom: '0.85rem', letterSpacing: '2px' }}>
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} style={{ opacity: i < rev.rating ? 1 : 0.25 }}>★</span>
                  ))}
                </div>
                <p style={{ margin: 0, color: '#555555', fontSize: '0.92rem', lineHeight: 1.6 }}>{rev.text}</p>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C45C26' }}></div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E8E0D5' }}></div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E8E0D5' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
