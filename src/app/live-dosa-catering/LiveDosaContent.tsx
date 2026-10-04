'use client';
import { useState } from 'react';

const menuItems = [
  { name: 'Idly, Meduvada (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Masala Dosa (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Plain Dosa (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Onion Dosa (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'PodiDosa (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Onion Uthappam (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Capsicum Uthappam (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Chilli Uthappam (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'Plain Uthappam (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'PodiUthappam (Live)', desc: 'Crisp & golden, the classic favourite' },
  { name: 'One Dessert', desc: 'Crisp & golden, the classic favourite' },
  { name: 'One Main Course Dish', desc: 'Crisp & golden, the classic favourite' },
];

const includedItems = [
  'Professional chef with traditional skills',
  'Commercial-grade griddle & cooking equipment',
  'Fresh batter & premium ingredients',
  'Authentic condiments & chutneys',
  'Serving staff for smooth service',
  'Eco-friendly disposables (optional)',
];

function ForkIcon() {
  return (
    <img
      src="/dosa-menu-icon.png"
      alt="Fork and knife icon"
      width={47}
      height={45}
      style={{
        width: '44px',
        height: '42px',
        objectFit: 'contain',
        display: 'inline-block',
      }}
    />
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#DE7843" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="16 9 10.5 14.5 8 12" />
    </svg>
  );
}

function PoundSignIcon() {
  return (
    <svg viewBox="0 0 320 512" width="22" height="22" fill="#C45C26" style={{ flexShrink: 0 }}>
      <path d="M308 352h-45.495c-6.627 0-12 5.373-12 12v50.848H128V288h84c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-84v-63.556c0-32.266 24.562-57.086 61.792-57.086 23.658 0 45.878 11.505 57.652 18.849 5.151 3.213 11.888 2.051 15.688-2.685l28.493-35.513c4.233-5.276 3.279-13.005-2.119-17.081C273.124 54.56 236.576 32 187.931 32 106.026 32 48 84.742 48 157.961V224H20c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h28v128H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h296c6.627 0 12-5.373 12-12V364c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function MailBulkIcon() {
  return (
    <svg viewBox="0 0 576 512" width="24" height="24" fill="#C45C26" style={{ flexShrink: 0 }}>
      <path d="M160 448c-25.6 0-51.2-22.4-64-32-64-44.8-83.2-60.8-96-70.4V480c0 17.67 14.33 32 32 32h256c17.67 0 32-14.33 32-32V345.6c-12.8 9.6-32 25.6-96 70.4-12.8 9.6-38.4 32-64 32zm128-192H32c-17.67 0-32 14.33-32 32v16c25.6 19.2 22.4 19.2 115.2 86.4 9.6 6.4 28.8 25.6 44.8 25.6s35.2-19.2 44.8-22.4c92.8-67.2 89.6-67.2 115.2-86.4V288c0-17.67-14.33-32-32-32zm256-96H224c-17.67 0-32 14.33-32 32v32h96c33.21 0 60.59 25.42 63.71 57.82l.29-.22V416h192c17.67 0 32-14.33 32-32V192c0-17.67-14.33-32-32-32zm-32 128h-64v-64h64v64zm-352-96c0-35.29 28.71-64 64-64h224V32c0-17.67-14.33-32-32-32H96C78.33 0 64 14.33 64 32v192h96v-32z"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 512 512" width="24" height="24" fill="#C45C26" style={{ flexShrink: 0 }}>
      <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 384 512" width="24" height="24" fill="#C45C26" style={{ flexShrink: 0 }}>
      <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
    </svg>
  );
}

interface LiveDosaContentProps {
  siteContent?: any;
}

export default function LiveDosaContent({ siteContent }: LiveDosaContentProps) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', eventType: '', eventLocation: '', dateOfEvent: '', noOfPax: '', message: ''
  });
  const [customFieldsData, setCustomFieldsData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const customFields = (siteContent?.customFormFields || []).filter(
    (f: any) => f.enabled !== false && f.id !== 'eventLocation' && f.id !== 'dietaryRequirements' && (f.formTarget === 'all' || f.formTarget === 'catering' || f.formTarget === 'liveDosa')
  );

  const liveMenuItems = siteContent?.liveDosaCatering?.menuItems?.length
    ? siteContent.liveDosaCatering.menuItems
    : menuItems;

  const rawInclusions = siteContent?.liveDosaCatering?.includedItems?.length
    ? siteContent.liveDosaCatering.includedItems
    : includedItems;
  const liveInclusions = rawInclusions.filter((item: string) => !item.toLowerCase().startsWith('pricing'));

  const heroBadge = siteContent?.liveDosaCatering?.badge || '🌿 100% Pure Vegetarian Live Catering';
  const heroTitle = siteContent?.liveDosaCatering?.title || 'Live Dosa Catering';
  const heroSubtitle = siteContent?.liveDosaCatering?.subtitle || 'Each item is prepared fresh on the spot with theatrical flair';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCustomFieldChange = (name: string, value: string) => {
    setCustomFieldsData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Submit via internal API (bridges to Web3Forms and Firestore)
      await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          serviceType: 'Live Dosa Catering',
          packageSelected: 'Live Dosa Catering Station',
          recipientEmail: siteContent?.web3forms?.email || 'vcsramersham@gmail.com',
          ...customFieldsData,
        }),
      });

      // Direct Web3Forms submission to user account
      const web3Key = siteContent?.web3forms?.accessKey || '01e0a173-fe53-4027-a850-5fdef2d441ad';
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `New Booking Request: Live Dosa Catering from ${form.name}${form.eventType ? ` (${form.eventType})` : ''}`,
            from_name: 'Veg Chennai SriLalitha Amersham',
            "Name": form.name,
            "Email": form.email,
            "Phone": form.phone,
            "Event Type": form.eventType || 'Not specified',
            "Event Location": form.eventLocation || 'Not specified',
            "Date Of Event": form.dateOfEvent || 'Not specified',
            "No Of Guests (Pax)": form.noOfPax ? `${form.noOfPax}` : 'Not specified',
            "Service Type": 'Live Dosa Catering',
            "Package": 'Live Dosa Catering Station',
            "Message": form.message || 'No extra message',
          }),
        });
      } catch (e) {
        console.warn('Direct web3forms notice:', e);
      }

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
      setForm({ name: '', email: '', phone: '', eventType: '', eventLocation: '', dateOfEvent: '', noOfPax: '', message: '' });
      setCustomFieldsData({});
    } catch (err) {
      console.error('Live Dosa submission error:', err);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    } finally {
      setSubmitting(false);
    }
  };

  const formFieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #E8E0D5',
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    color: '#1A1A1A',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  return (
    <>
      <style>{`
        .live-dosa-enquiry-form input:focus,
        .live-dosa-enquiry-form textarea:focus {
          border-color: #C45C26 !important;
          box-shadow: 0 0 0 3px rgba(196, 92, 38, 0.15) !important;
          outline: none !important;
        }
        .live-dosa-section-wrapper {
          max-width: 1240px;
          margin: 0 auto;
          padding: 4.5rem 1.5rem;
        }
        .live-dosa-menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
          gap: 1.25rem;
          margin-bottom: 4.5rem;
        }
        .live-dosa-included-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        .live-dosa-enquire-container {
          background-color: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid #E8E0D5;
          border-radius: 24px;
          padding: clamp(2rem, 4vw, 3rem);
          margin-bottom: 2rem;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
        }
        .live-dosa-enquire-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2.5rem;
          align-items: start;
        }
        .live-dosa-name-email-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }
        @media (max-width: 860px) {
          .live-dosa-enquire-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .live-dosa-section-wrapper {
            padding: 3rem 1.25rem !important;
          }
        }
        @media (max-width: 580px) {
          .live-dosa-name-email-row {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .live-dosa-included-grid {
            grid-template-columns: 1fr !important;
            gap: 0.85rem !important;
          }
          .live-dosa-hero-section {
            height: auto !important;
            min-height: 85vh !important;
            padding: 3.5rem 0 !important;
          }
          .live-dosa-hero-wrapper {
            padding: 1.25rem 1.25rem !important;
          }
        }
        @media (max-width: 560px) {
          .live-dosa-hero-actions {
            flex-direction: column !important;
            width: 100% !important;
            gap: 0.9rem !important;
          }
          .live-dosa-hero-actions a {
            width: 100% !important;
            max-width: 320px !important;
            box-sizing: border-box !important;
            padding: 14px 24px !important;
          }
        }
      `}</style>

      <main style={{ backgroundColor: '#FFFDF9', minHeight: '100vh' }}>
        
        {/* 1. Full Viewport Hero Section (Matches Home Page Dimensions & Aesthetics like 3rd image) */}
        <section
          className="live-dosa-hero-section"
          style={{
            position: 'relative',
            height: 'calc(100vh - 80px)',
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            backgroundColor: '#0c0a08',
            overflow: 'hidden',
            fontFamily: "var(--font-sans), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
          }}
        >
          {/* Full-Bleed Background Image */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <img
              src="/images/long-dosa-feast.png"
              alt="Live Dosa Catering"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 48%',
                display: 'block',
              }}
            />
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

          {/* Foreground Content: Exact Same Clean Layout as Home Hero (Image 2) - No Box */}
          <div
            className="live-dosa-hero-wrapper"
            style={{
              position: 'relative',
              zIndex: 10,
              maxWidth: '960px',
              width: '100%',
              margin: '0 auto',
              padding: 'clamp(2rem, 4vw, 3.5rem) clamp(1.25rem, 4vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.85rem',
                marginBottom: '1rem',
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
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#F4D3A1',
                  fontWeight: 600,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
                }}
              >
                ✦ 100% PURE VEGETARIAN LIVE CATERING ✦
              </span>
              <span
                style={{
                  width: '36px',
                  height: '1px',
                  background: 'linear-gradient(90deg, #E8A87C, transparent)',
                }}
              />
            </div>

            {/* Main Title */}
            <h1
              style={{
                fontFamily: "var(--font-sans), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: 'clamp(28px, 4.2vw, 44px)',
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: '-0.015em',
                marginBottom: '1.25rem',
                maxWidth: '900px',
                color: '#FFFFFF',
                textShadow: '0 3px 16px rgba(0, 0, 0, 0.95)',
              }}
            >
              Live Dosa Catering
            </h1>

            {/* Subtitle directly from Reference Website */}
            <p
              style={{
                fontFamily: "var(--font-sans), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: 'clamp(15px, 1.6vw, 18px)',
                fontWeight: 400,
                lineHeight: 1.75,
                color: '#FFFFFF',
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0, 0, 0, 0.9)',
                maxWidth: '820px',
                marginBottom: '2rem',
                letterSpacing: '0.01em',
              }}
            >
              {heroSubtitle}
            </p>

            {/* Action Buttons */}
            <div
              className="live-dosa-hero-actions"
              style={{
                display: 'flex',
                gap: '1.25rem',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <a
                href="#enquire"
                className="btn-3d-primary"
                style={{
                  background: 'linear-gradient(135deg, #DE7843 0%, #B8531D 100%)',
                  color: '#FFFFFF',
                  padding: '14px 32px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '1em',
                  letterSpacing: '0.02em',
                  boxShadow:
                    '0 8px 24px rgba(184, 83, 29, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.45)',
                  minWidth: '160px',
                  textAlign: 'center',
                  display: 'inline-block',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                Enquire Now
              </a>
              <a
                href="tel:+441494972550"
                className="btn-3d-secondary"
                style={{
                  background: 'rgba(255, 255, 255, 0.09)',
                  border: '1.5px solid rgba(248, 213, 158, 0.5)',
                  color: '#FFFFFF',
                  padding: '14px 32px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '1em',
                  letterSpacing: '0.02em',
                  minWidth: '160px',
                  textAlign: 'center',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <span>📞</span>
                <span>Call 0149 497 2550</span>
              </a>
            </div>
          </div>
        </section>

        {/* 2. Live Dosa Station Menu */}
        <section className="live-dosa-section-wrapper">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(28px, 4vw, 36px)', 
              color: '#000000', 
              marginBottom: '0.75rem', 
              fontWeight: 700, 
              letterSpacing: '-0.01em', 
              fontFamily: 'var(--font-roboto), "Roboto", var(--font-sans), sans-serif' 
            }}>
              Live Dosa Station Menu
            </h2>
            <p style={{ 
              fontFamily: 'var(--font-roboto), "Roboto", var(--font-sans), sans-serif',
              fontSize: '18px', 
              color: '#555555', 
              margin: 0 
            }}>
              Each item is prepared fresh on the spot with theatrical flair
            </p>
          </div>

          {/* 3D Menu Grid */}
          <div className="live-dosa-menu-grid">
            {liveMenuItems.map((item: any, idx: number) => (
              <div 
                key={idx} 
                className="tactile-card"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid #E8E0D5',
                  borderRadius: '18px',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{ 
                  marginBottom: '1.25rem', 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(196, 92, 38, 0.08)',
                  border: '1px solid rgba(196, 92, 38, 0.2)'
                }}>
                  <ForkIcon />
                </div>
                <strong style={{ display: 'block', fontSize: '1.15rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.5rem' }}>
                  {item.name}
                </strong>
                <p style={{ color: '#666666', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 3. What's Included */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: 'clamp(28px, 4vw, 36px)', 
                fontWeight: 700, 
                color: '#000000', 
                margin: 0, 
                letterSpacing: '-0.01em', 
                fontFamily: 'var(--font-roboto), "Roboto", var(--font-sans), sans-serif' 
              }}>
                What&apos;s Included
              </h2>
            </div>

            <div className="live-dosa-included-grid">
              {liveInclusions.map((item: string, idx: number) => (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    backgroundColor: '#FAF6F2',
                    padding: '1.1rem 1.4rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(220, 205, 190, 0.55)',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <CheckCircleIcon />
                  <span style={{ 
                    fontFamily: 'var(--font-roboto), "Roboto", var(--font-sans), sans-serif',
                    fontSize: '19px', 
                    color: '#1A1A1A', 
                    fontWeight: 400,
                    lineHeight: 1.4
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Pricing Note */}
          <div 
            style={{
              backgroundColor: '#FAF6F2',
              borderRadius: '12px',
              padding: '1.25rem 1.75rem',
              textAlign: 'center',
              marginBottom: '3.5rem',
              marginTop: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              border: '1px solid rgba(220, 205, 190, 0.55)',
            }}
          >
            <span style={{ color: '#DE7843', fontWeight: 700, fontSize: '1.2rem', lineHeight: 1 }}>£</span>
            <span style={{ 
              fontFamily: 'var(--font-roboto), "Roboto", var(--font-sans), sans-serif',
              color: '#333333', 
              fontWeight: 400, 
              fontSize: '16px',
              lineHeight: 1.5
            }}>
              Pricing: Per item or per-head options available — request a custom quote based on your event size
            </span>
          </div>

          {/* 5. Enquire Now Section Container */}
          <div id="enquire" className="live-dosa-enquire-container">
            <h2 style={{ 
              fontSize: 'clamp(28px, 4vw, 36px)', 
              fontWeight: 700, 
              color: '#000000', 
              textAlign: 'center', 
              marginBottom: '2.5rem',
              letterSpacing: '-0.01em',
              fontFamily: 'var(--font-roboto), "Roboto", var(--font-sans), sans-serif',
            }}>
              Enquire Now
            </h2>
            
            <div className="live-dosa-enquire-grid">
              {/* Left - Contact Info Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Email */}
                <div 
                  className="tactile-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: '1px solid #E8E0D5',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ backgroundColor: '#FDF6F0', padding: '10px', borderRadius: '10px', display: 'flex' }}>
                    <MailBulkIcon />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Us</strong>
                    <span style={{ color: '#1A1A1A', fontSize: '15px', fontWeight: 600, wordBreak: 'break-all' }}>
                      vcsramersham@gmail.com
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div 
                  className="tactile-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: '1px solid #E8E0D5',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ backgroundColor: '#FDF6F0', padding: '10px', borderRadius: '10px', display: 'flex' }}>
                    <PhoneIcon />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Call Us</strong>
                    <a href={'tel:' + (siteContent?.restaurant?.phoneRaw || siteContent?.restaurant?.phone || '+01494972550')} style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: 700, textDecoration: 'none' }}>
                      {siteContent?.restaurant?.phone || '+0149 497 2550'}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div 
                  className="tactile-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: '1px solid #E8E0D5',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ backgroundColor: '#FDF6F0', padding: '10px', borderRadius: '10px', display: 'flex' }}>
                    <MapPinIcon />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</strong>
                    <span style={{ color: '#1A1A1A', fontSize: '15px', fontWeight: 500 }}>
                      {siteContent?.restaurant?.address || '94, sycamore Road, Amersham, HP6 5EN.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right - Enquiry Form */}
              <div>
                <form onSubmit={handleSubmit} className="live-dosa-enquiry-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="live-dosa-name-email-row">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      style={formFieldStyle}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      style={formFieldStyle}
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    style={formFieldStyle}
                  />
                  <div>
                    <label style={{ fontSize: '13px', color: '#666666', marginBottom: '4px', display: 'block', fontWeight: 600 }}>
                      Event Type *
                    </label>
                    <select
                      name="eventType"
                      value={form.eventType}
                      onChange={handleChange}
                      required
                      style={formFieldStyle}
                    >
                      <option value="">Select type</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Graduation">Graduation</option>
                      <option value="Outdoor Catering">Outdoor Catering</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#666666', marginBottom: '4px', display: 'block', fontWeight: 600 }}>
                      Event Location / Venue Postcode
                    </label>
                    <input
                      type="text"
                      name="eventLocation"
                      placeholder="e.g. Amersham HP6 5EN, London, Watford"
                      value={form.eventLocation}
                      onChange={handleChange}
                      style={formFieldStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#666666', marginBottom: '4px', display: 'block', fontWeight: 600 }}>Date of Event</label>
                    <input
                      type="text"
                      name="dateOfEvent"
                      placeholder="Date of Event"
                      value={form.dateOfEvent}
                      onChange={handleChange}
                      onFocus={(e) => { e.currentTarget.type = 'date'; }}
                      onBlur={(e) => { if (!e.currentTarget.value) e.currentTarget.type = 'text'; }}
                      style={formFieldStyle}
                    />
                  </div>
                  <input
                    type="number"
                    name="noOfPax"
                    placeholder="No of Pax"
                    value={form.noOfPax}
                    onChange={handleChange}
                    style={formFieldStyle}
                  />

                  {/* Dynamic Custom Form Field Boxes Added from Admin */}
                  {customFields.map((field: any) => {
                    const fieldVal = customFieldsData[field.name || field.id] || '';
                    if (field.type === 'textarea') {
                      return (
                        <div key={field.id}>
                          {field.label && (
                            <label style={{ fontSize: '13px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: 600 }}>
                              {field.label} {field.required ? '*' : ''}
                            </label>
                          )}
                          <textarea
                            rows={3}
                            placeholder={field.placeholder || field.label}
                            value={fieldVal}
                            required={!!field.required}
                            onChange={(e) => handleCustomFieldChange(field.name || field.id, e.target.value)}
                            style={{ ...formFieldStyle, resize: 'vertical' }}
                          />
                        </div>
                      );
                    }
                    if (field.type === 'select' && Array.isArray(field.options)) {
                      return (
                        <div key={field.id}>
                          {field.label && (
                            <label style={{ fontSize: '13px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: 600 }}>
                              {field.label} {field.required ? '*' : ''}
                            </label>
                          )}
                          <select
                            value={fieldVal}
                            required={!!field.required}
                            onChange={(e) => handleCustomFieldChange(field.name || field.id, e.target.value)}
                            style={formFieldStyle}
                          >
                            <option value="">{field.placeholder || ('Select ' + field.label)}</option>
                            {field.options.map((opt: string, optIdx: number) => (
                              <option key={optIdx} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      );
                    }
                    return (
                      <div key={field.id}>
                        {field.label && (
                          <label style={{ fontSize: '13px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: 600 }}>
                            {field.label} {field.required ? '*' : ''}
                          </label>
                        )}
                        <input
                          type={field.type || 'text'}
                          placeholder={field.placeholder || field.label}
                          value={fieldVal}
                          required={!!field.required}
                          onChange={(e) => handleCustomFieldChange(field.name || field.id, e.target.value)}
                          style={formFieldStyle}
                        />
                      </div>
                    );
                  })}

                  <textarea
                    name="message"
                    placeholder="Message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    style={{ ...formFieldStyle, resize: 'vertical' }}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-3d-primary"
                    style={{
                      backgroundColor: '#C45C26',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px',
                      fontSize: '16px',
                      fontWeight: 700,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.7 : 1,
                      boxShadow: '0 4px 16px rgba(196, 92, 38, 0.4)',
                      fontFamily: 'inherit',
                      width: '100%',
                    }}
                  >
                    {submitting ? 'Submitting...' : submitted ? '✓ Submitted!' : 'Submit Enquiry'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Timing Notice */}
          <p style={{ 
            textAlign: 'center', 
            color: '#666666', 
            fontWeight: 500, 
            fontSize: '15px',
            padding: '1rem 0 2rem',
            margin: 0
          }}>
            Please ring us between 11:00 AM TO 3.30PM AND 5.30 PM TO 10.30PM
          </p>
        </section>
      </main>
    </>
  );
}
