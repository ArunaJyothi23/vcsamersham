'use client';
import { useState } from 'react';
import defaultSiteContent from '../data/site_content.json';

interface FAQProps {
  faqs?: Array<{ q: string; a: string }>;
}

export default function FAQ({ faqs: propFaqs }: FAQProps) {
  const faqs = propFaqs && propFaqs.length > 0 ? propFaqs : defaultSiteContent.faqs;
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section style={{ padding: 'clamp(3.5rem, 6vw, 6rem) clamp(1rem, 4vw, 2rem)', backgroundColor: '#FDF6F0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
            Got Questions?
          </span>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', 
            fontWeight: 800, 
            color: '#1A1A1A',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            Frequently Asked Questions
          </h2>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3.5rem', alignItems: 'center' }}>
          {/* Left Image with Glassmorphic 3D styling */}
          <div style={{ flex: '1 1 45%', minWidth: '300px', position: 'relative' }}>
            <div
              className="tactile-card"
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.12)',
                border: '1px solid #E8E0D5',
                backgroundColor: '#FDF6F0',
              }}
            >
              <img 
                src="/images/3d/idli-vada-3d.jpg" 
                alt="Traditional South Indian Idli and Vada Spread" 
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  objectFit: 'cover', 
                  display: 'block'
                }}
              />
              {/* Floating Pill Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: '14px',
                  padding: '10px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #E8E0D5',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
                }}
              >
                <div>
                  <strong style={{ display: 'block', color: '#1A1A1A', fontSize: '0.94rem', fontWeight: 800 }}>
                    Steamed Fresh Every Morning
                  </strong>
                  <span style={{ color: '#666666', fontSize: '0.8rem' }}>
                    100% Pure Vegetarian &amp; Vegan Friendly
                  </span>
                </div>
                <span style={{ color: '#D4A017', fontSize: '1rem', letterSpacing: '1px' }}>★★★★★</span>
              </div>
            </div>
          </div>

          {/* Right Accordion */}
          <div style={{ flex: '1 1 45%', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="tactile-card"
                style={{ 
                  border: '1px solid #E8E0D5',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  overflow: 'hidden',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                  transition: 'box-shadow 0.2s ease, border-color 0.2s ease'
                }}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#1A1A1A',
                    gap: '1rem'
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ 
                    fontSize: '1.4rem', 
                    lineHeight: 1, 
                    fontWeight: 700, 
                    color: '#C45C26',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(196, 92, 38, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {openIndex === idx ? '−' : '+'}
                  </span>
                </button>
                
                {openIndex === idx && (
                  <div style={{ 
                    padding: '0 1.5rem 1.35rem 1.5rem', 
                    color: '#555555', 
                    lineHeight: 1.6,
                    borderTop: '1px solid #FDF6F0',
                    paddingTop: '1rem',
                    fontSize: '0.95rem'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
