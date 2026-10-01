'use client';
import { useState, useEffect } from 'react';
import defaultSiteContent from '../data/site_content.json';

interface HeroProps {
  content?: any;
}

export default function Hero({ content }: HeroProps) {
  const heroData = content || defaultSiteContent.hero;
  const carouselSlides = heroData.slides && heroData.slides.length > 0 ? heroData.slides : defaultSiteContent.hero.slides;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play carousel slowly (every 4.5 seconds)
  useEffect(() => {
    if (carouselSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        minHeight: 'clamp(520px, 80vh, 760px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        backgroundColor: '#0c0a08',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .hero-section {
            min-height: auto !important;
            padding: 3.25rem 0 3.25rem 0 !important;
          }
          .hero-content-wrapper {
            padding: 1rem 1.25rem !important;
          }
        }
      `}</style>

      {/* 1. Full-Bleed 3D Carousel Background with Smooth Video-Style Crossfade */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        {carouselSlides.map((slide: any, idx: number) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                transition: 'opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1), transform 5.5s ease-out',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                willChange: 'opacity, transform',
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 48%',
                  display: 'block',
                }}
              />
            </div>
          );
        })}

        {/* Ambient Fine-Dining Cinematic Vignette: Food has warm 3D depth, text has 100% contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 95% 85% at 50% 50%, rgba(14, 10, 8, 0.44) 0%, rgba(10, 7, 5, 0.78) 75%, rgba(6, 4, 3, 0.94) 100%), linear-gradient(to bottom, rgba(6, 4, 3, 0.7) 0%, transparent 22%, transparent 78%, rgba(6, 4, 3, 0.88) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* 2. Foreground Content Container: Ultra-Premium Classy Fine-Dining Layout */}
      <div
        className="hero-content-wrapper"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '960px',
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1.25rem, 4vw, 2.5rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Luxury Crest Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.85rem',
            marginBottom: '1.15rem',
          }}
        >
          <span
            style={{
              width: '36px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #E8A87C)',
            }}
          />
          <span
            style={{
              fontSize: 'clamp(0.74rem, 1.4vw, 0.84rem)',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: '#F4D3A1',
              fontWeight: 600,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
            }}
          >
            ✦ PURE VEGETARIAN FINE DINING ✦
          </span>
          <span
            style={{
              width: '36px',
              height: '1px',
              background: 'linear-gradient(90deg, #E8A87C, transparent)',
            }}
          />
        </div>

        {/* Prestigious Royal Headline with Serif Typography & Champagne-Gold Gradient */}
        <h1
          style={{
            fontFamily: 'var(--font-serif), "Playfair Display", Georgia, serif',
            fontSize: 'clamp(2.4rem, 5.8vw, 4.35rem)',
            fontWeight: 700,
            lineHeight: 1.14,
            letterSpacing: '-0.015em',
            marginBottom: '1.35rem',
            maxWidth: '900px',
            filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.95))',
          }}
        >
          <span
            style={{
              display: 'block',
              background: 'linear-gradient(180deg, #FFFFFF 25%, #FFF2E2 75%, #F0DFCC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {heroData.title || defaultSiteContent.hero.title}
          </span>
        </h1>

        {/* Refined Subtitle in Warm Ivory with Golden Bullets */}
        <h2
          style={{
            fontSize: 'clamp(0.98rem, 1.9vw, 1.2rem)',
            fontWeight: 400,
            lineHeight: 1.65,
            color: '#F6EFE9',
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.95)',
            maxWidth: '760px',
            marginBottom: '2.5rem',
            letterSpacing: '0.01em',
          }}
        >
          {heroData.subtitle || defaultSiteContent.hero.subtitle}
        </h2>

        {/* High-End Tactile Action Buttons */}
        <style>{`
          @media (max-width: 560px) {
            .hero-action-buttons {
              flex-direction: column !important;
              width: 100% !important;
              gap: 0.9rem !important;
            }
            .hero-action-buttons a {
              width: 100% !important;
              max-width: 320px !important;
              box-sizing: border-box !important;
              padding: 0.9rem 1.5rem !important;
            }
          }
        `}</style>
        <div
          className="hero-action-buttons"
          style={{
            display: 'flex',
            gap: '1.35rem',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="/#menu"
            className="btn-3d-primary"
            style={{
              background: 'linear-gradient(135deg, #DE7843 0%, #B8531D 100%)',
              color: '#FFFFFF',
              padding: '1rem 2.65rem',
              borderRadius: '14px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.05rem',
              letterSpacing: '0.03em',
              boxShadow:
                '0 10px 28px rgba(184, 83, 29, 0.48), inset 0 1px 1px rgba(255, 255, 255, 0.45)',
              minWidth: '160px',
              textAlign: 'center',
              display: 'inline-block',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            View Menu
          </a>
          <a
            href="/#order"
            className="btn-3d-secondary"
            style={{
              background: 'rgba(255, 255, 255, 0.09)',
              border: '1.5px solid rgba(248, 213, 158, 0.5)',
              color: '#FFFFFF',
              padding: '1rem 2.65rem',
              borderRadius: '14px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.05rem',
              letterSpacing: '0.03em',
              boxShadow:
                '0 10px 28px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
              minWidth: '160px',
              textAlign: 'center',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              display: 'inline-block',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Order Online
          </a>
        </div>
      </div>
    </section>
  );
}
