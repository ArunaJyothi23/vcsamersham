'use client';
import { useState } from 'react';
import outdoorData from '@/data/outdoor_catering_data.json';

// Exact Font Awesome mail-bulk icon (#C45C26)
function MailBulkIcon() {
  return (
    <svg viewBox="0 0 576 512" width="24" height="24" fill="#C45C26" style={{ flexShrink: 0 }}>
      <path d="M160 448c-25.6 0-51.2-22.4-64-32-64-44.8-83.2-60.8-96-70.4V480c0 17.67 14.33 32 32 32h256c17.67 0 32-14.33 32-32V345.6c-12.8 9.6-32 25.6-96 70.4-12.8 9.6-38.4 32-64 32zm128-192H32c-17.67 0-32 14.33-32 32v16c25.6 19.2 22.4 19.2 115.2 86.4 9.6 6.4 28.8 25.6 44.8 25.6s35.2-19.2 44.8-22.4c92.8-67.2 89.6-67.2 115.2-86.4V288c0-17.67-14.33-32-32-32zm256-96H224c-17.67 0-32 14.33-32 32v32h96c33.21 0 60.59 25.42 63.71 57.82l.29-.22V416h192c17.67 0 32-14.33 32-32V192c0-17.67-14.33-32-32-32zm-32 128h-64v-64h64v64zm-352-96c0-35.29 28.71-64 64-64h224V32c0-17.67-14.33-32-32-32H96C78.33 0 64 14.33 64 32v192h96v-32z"/>
    </svg>
  );
}

// Exact Font Awesome phone-alt icon (#C45C26)
function PhoneIcon() {
  return (
    <svg viewBox="0 0 512 512" width="24" height="24" fill="#C45C26" style={{ flexShrink: 0 }}>
      <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
    </svg>
  );
}

// Map Pin Icon (#C45C26)
function MapPinIcon() {
  return (
    <svg viewBox="0 0 384 512" width="24" height="24" fill="#C45C26" style={{ flexShrink: 0 }}>
      <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
    </svg>
  );
}

interface OutdoorCateringContentProps {
  siteContent?: any;
}

export default function OutdoorCateringContent({ siteContent }: OutdoorCateringContentProps) {
  // State for Top Option Tabs (Option 1 to Option 9)
  const [selectedOption, setSelectedOption] = useState<number>(0);

  // State for Dish Category Filter Tabs
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventLocation: '',
    dateOfEvent: '',
    noOfPax: '',
    message: '',
  });
  const [customFieldsData, setCustomFieldsData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const customFields = (siteContent?.customFormFields || []).filter(
    (f: any) => f.enabled !== false && f.id !== 'eventLocation' && f.id !== 'dietaryRequirements' && (f.formTarget === 'all' || f.formTarget === 'catering' || f.formTarget === 'outdoorCatering')
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCustomFieldChange = (name: string, value: string) => {
    setCustomFieldsData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const activeOptionName = siteContent?.outdoorCatering?.options?.[selectedOption]?.name || `Option ${selectedOption + 1}`;
      
      // 1. Submit via internal API (which also bridges to Web3Forms and Firestore)
      await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          serviceType: 'Outdoor Catering',
          packageSelected: activeOptionName,
          recipientEmail: 'digitalbotsolutions@gmail.com',
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
            subject: `New Booking Request: Outdoor Catering from ${form.name}${form.eventType ? ` (${form.eventType})` : ''}`,
            from_name: 'Veg Chennai SriLalitha Amersham',
            "Name": form.name,
            "Email": form.email,
            "Phone": form.phone,
            "Event Type": form.eventType || 'Not specified',
            "Event Location": form.eventLocation || 'Not specified',
            "Date Of Event": form.dateOfEvent || 'Not specified',
            "No Of Guests (Pax)": form.noOfPax ? `${form.noOfPax}` : 'Not specified',
            "Service Type": 'Outdoor Catering',
            "Package": activeOptionName,
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
      console.error('Submission error:', err);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    } finally {
      setSubmitting(false);
    }
  };

  // Active category and dishes
  const activeCategory = outdoorData.categories[selectedCategory] || outdoorData.categories[0];

  // Current active option
  const activeOption = outdoorData.options[selectedOption] || outdoorData.options[0];

  const outdoorBadge = siteContent?.outdoorCatering?.badge || '👑 Royal Heritage Catering • 21+ Years UK-Wide';
  const outdoorTitle = siteContent?.outdoorCatering?.title || 'Authentic 100% Pure Vegetarian Catering';
  const outdoorIntro = siteContent?.outdoorCatering?.intro || 'Authentic 100% vegetarian catering in UK, backed by 21+ years of experience. Proud to have catered to all the VIPs and VVIPs of Indian origin across the UK. Perfect for weddings, corporate events, housewarmings, and temple functions. Enjoy live dosa stations, soft idlis, crispy vadas, and traditional banana-leaf feasts with sambar, rasam, poriyal, and payasam—freshly prepared for a truly authentic and memorable experience.';

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
        .outdoor-enquiry-form input:focus,
        .outdoor-enquiry-form textarea:focus {
          border-color: #C45C26 !important;
          box-shadow: 0 0 0 3px rgba(196, 92, 38, 0.15) !important;
          outline: none !important;
        }

        /* Option Tab Content Styling (HTML from WordPress) */
        .option-html-content {
          font-family: inherit;
          color: #222;
        }
        .option-html-content h2 {
          font-size: 1.85rem;
          font-weight: 700;
          color: #1A1A1A;
          margin-top: 0;
          margin-bottom: 1.25rem;
        }
        .option-html-content p {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #444;
          margin-bottom: 1.25rem;
        }
        .option-html-content strong {
          color: #1A1A1A;
          font-weight: 700;
        }
        .option-html-content .uvc-heading-spacer span,
        .option-html-content h3 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #C45C26;
          display: block;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }
        .option-html-content ul {
          list-style: none;
          padding-left: 0;
          margin-bottom: 1.25rem;
        }
        .option-html-content li {
          font-size: 1rem;
          line-height: 1.7;
          color: #333;
          margin-bottom: 0.5rem;
          position: relative;
          padding-left: 1.5rem;
        }
        .option-html-content li::before {
          content: "•";
          position: absolute;
          left: 0.25rem;
          color: #C45C26;
          font-weight: bold;
          font-size: 1.3rem;
          line-height: 1.4;
        }
        .option-html-content .uavc-list {
          list-style: none;
          padding-left: 0;
        }
        .option-html-content .uavc-list li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.6rem;
        }
        .option-html-content .uavc-list li::before {
          content: "•";
          position: absolute;
          left: 0.25rem;
          color: #C45C26;
          font-weight: bold;
          font-size: 1.3rem;
          line-height: 1.4;
        }

        /* Responsive Layouts */
        .outdoor-filter-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        .outdoor-sidebar {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: sticky;
          top: 100px;
        }
        .outdoor-dish-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .outdoor-enquire-container {
          background-color: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid #E8E0D5;
          border-radius: 24px;
          padding: clamp(2rem, 4vw, 3rem);
          margin-bottom: 2rem;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
        }
        .outdoor-enquire-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2.5rem;
          align-items: start;
        }
        .outdoor-name-email-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        @media (max-width: 960px) {
          .outdoor-filter-layout {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .outdoor-sidebar {
            position: static !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justifyContent: center !important;
            top: 0 !important;
          }
          .outdoor-sidebar .cat-btn {
            width: auto !important;
            flex: 1 1 calc(33.33% - 0.75rem) !important;
            min-width: 130px !important;
            padding: 10px 14px !important;
            font-size: 0.95rem !important;
          }
          .outdoor-enquire-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }

        @media (max-width: 600px) {
          .outdoor-sidebar .cat-btn {
            flex: 1 1 calc(50% - 0.5rem) !important;
            font-size: 0.88rem !important;
            padding: 10px 8px !important;
          }
          .outdoor-name-email-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <main style={{ backgroundColor: '#FFFDF9', minHeight: '100vh' }}>
        
        {/* 1. Split 3D Hero Section (Matching Screenshot 1 Aesthetic) */}
        <section
          style={{
            padding: 'clamp(5rem, 7.5vw, 6rem) clamp(1rem, 4vw, 2.5rem) clamp(3rem, 5vw, 4.5rem)',
            backgroundColor: '#FDF6F0',
            position: 'relative',
            borderBottom: '1px solid #E8E0D5',
          }}
        >
          <div
            style={{
              maxWidth: '1240px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
              gap: 'clamp(2.5rem, 5vw, 4.5rem)',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Heading, Description & Stat Badges */}
            <div>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(196, 92, 38, 0.1)',
                  color: '#C45C26',
                  border: '1px solid rgba(196, 92, 38, 0.25)',
                  padding: '6px 16px',
                  borderRadius: '24px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}
              >
                {outdoorBadge}
              </span>

              <h1
                style={{
                  fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
                  fontWeight: 800,
                  marginBottom: '1.25rem',
                  lineHeight: 1.2,
                  color: '#1A1A1A',
                  letterSpacing: '-0.02em',
                }}
              >
                {outdoorTitle}
              </h1>

              <p
                style={{
                  fontSize: 'clamp(0.96rem, 1.8vw, 1.12rem)',
                  color: '#555555',
                  lineHeight: 1.8,
                  marginBottom: '2rem',
                }}
              >
                {outdoorIntro}
              </p>

              {/* Stat / Highlight Badges: Perfect 3-Column Balance on Mobile and Desktop */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'clamp(0.5rem, 2vw, 1rem)',
                  marginBottom: '2.25rem',
                }}
              >
                <div
                  className="tactile-card"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E8E0D5',
                    borderRadius: '16px',
                    padding: 'clamp(0.85rem, 2vw, 1.25rem) clamp(0.35rem, 1.5vw, 0.75rem)',
                    textAlign: 'center',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div style={{ fontSize: 'clamp(1.15rem, 3.6vw, 1.75rem)', fontWeight: 800, color: '#C45C26', lineHeight: 1.1, marginBottom: '0.25rem' }}>
                    21+
                  </div>
                  <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.86rem)', fontWeight: 600, color: '#1A1A1A' }}>
                    Years Experience
                  </div>
                </div>

                <div
                  className="tactile-card"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E8E0D5',
                    borderRadius: '16px',
                    padding: 'clamp(0.85rem, 2vw, 1.25rem) clamp(0.35rem, 1.5vw, 0.75rem)',
                    textAlign: 'center',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div style={{ fontSize: 'clamp(1.15rem, 3.6vw, 1.75rem)', fontWeight: 800, color: '#C45C26', lineHeight: 1.1, marginBottom: '0.25rem' }}>
                    VIP &amp; VVIP
                  </div>
                  <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.86rem)', fontWeight: 600, color: '#1A1A1A' }}>
                    Trusted Caterer
                  </div>
                </div>

                <div
                  className="tactile-card"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E8E0D5',
                    borderRadius: '16px',
                    padding: 'clamp(0.85rem, 2vw, 1.25rem) clamp(0.35rem, 1.5vw, 0.75rem)',
                    textAlign: 'center',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div style={{ fontSize: 'clamp(1.15rem, 3.6vw, 1.75rem)', fontWeight: 800, color: '#C45C26', lineHeight: 1.1, marginBottom: '0.25rem' }}>
                    100% Pure
                  </div>
                  <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.86rem)', fontWeight: 600, color: '#1A1A1A' }}>
                    Banana Leaf Feasts
                  </div>
                </div>
              </div>

              {/* Action Buttons: Responsive & Perfectly Styled on Mobile */}
              <style>{`
                @media (max-width: 560px) {
                  .outdoor-hero-actions {
                    flex-direction: column !important;
                    width: 100% !important;
                    gap: 0.85rem !important;
                  }
                  .outdoor-hero-actions a {
                    width: 100% !important;
                    min-width: 0 !important;
                    box-sizing: border-box !important;
                    text-align: center !important;
                  }
                }
              `}</style>
              <div className="outdoor-hero-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href="#enquire"
                  className="btn-3d-primary"
                  style={{
                    backgroundColor: '#C45C26',
                    color: '#FFFFFF',
                    padding: '0.95rem 2.2rem',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '1.02rem',
                    boxShadow: '0 6px 18px rgba(196, 92, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    minWidth: '160px',
                    textAlign: 'center',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  Enquire Now
                </a>
                <a
                  href="tel:+01494972550"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#C45C26',
                    border: '2px solid #C45C26',
                    padding: '0.95rem 2.2rem',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '1.02rem',
                    minWidth: '160px',
                    textAlign: 'center',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(196, 92, 38, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#C45C26';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#C45C26';
                  }}
                >
                  <span>📞</span>
                  <span>Call +0149 497 2550</span>
                </a>
              </div>
            </div>

            {/* Right Column: 3D Grand Royal Feast Showcase with Floating Rating Badge */}
            <div style={{ position: 'relative', width: '100%', paddingBottom: '1.75rem' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
                  border: '1px solid #E8E0D5',
                  aspectRatio: '4 / 3',
                  backgroundColor: '#FDF6F0',
                }}
              >
                <img
                  src="/images/3d/thali-royal-3d.jpg"
                  alt="Outdoor Catering 3D Grand Royal Feast"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Floating 3D Badge (Matching Screenshot 1) */}
              <div
                className="tactile-card"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: 'clamp(10px, 3vw, 25px)',
                  backgroundColor: 'rgba(196, 92, 38, 0.96)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: '#ffffff',
                  padding: '1.1rem 1.85rem',
                  borderRadius: '16px',
                  boxShadow: '0 14px 32px rgba(196, 92, 38, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 5,
                }}
              >
                <div style={{ display: 'flex', gap: '3px', color: '#D4A017', fontSize: '1.25rem', marginBottom: '3px' }}>
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.2px', whiteSpace: 'nowrap' }}>
                  5,000+ Happy Customers
                </div>
                <div style={{ fontSize: '0.78rem', color: '#FDF6F0', opacity: 0.9, marginTop: '2px' }}>
                  21+ Years UK Catering
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Catering Package Options (Option 1 to Option 9) */}
        <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '4.5rem 1.5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
              Bespoke Menus
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', color: '#1A1A1A', marginBottom: '0.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Catering Package Options
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#555555', fontStyle: 'italic', margin: 0 }}>
              Tailored packages for weddings, family celebrations, and corporate gatherings
            </p>
          </div>

          {/* Horizontal Swiss Option Tabs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              justifyContent: 'center',
              marginBottom: '2.5rem',
            }}
          >
            {outdoorData.options.map((opt, idx) => {
              const isActive = selectedOption === idx;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(idx)}
                  className="tactile-card"
                  style={{
                    backgroundColor: isActive ? '#C45C26' : 'rgba(255, 255, 255, 0.95)',
                    color: isActive ? '#ffffff' : '#1A1A1A',
                    border: isActive ? '1px solid #C45C26' : '1px solid #E8E0D5',
                    borderRadius: '12px',
                    padding: '10px 22px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 6px 18px rgba(196, 92, 38, 0.35)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  {opt.tabTitle}
                </button>
              );
            })}
          </div>

          {/* Dynamic Option Content Container */}
          <div
            className="glass-panel-light"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: 'clamp(1.75rem, 4vw, 3rem)',
              marginBottom: '4.5rem',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.05)',
              border: '1px solid #E8E0D5',
            }}
          >
            {/* Options 1-4, 6-7: Render HTML */}
            {activeOption.contents.length === 1 && activeOption.contents[0].type === 'text' && (
              <div
                className="option-html-content"
                dangerouslySetInnerHTML={{ __html: activeOption.contents[0].content || '' }}
              />
            )}

            {/* Option 5: Dosa Festival */}
            {selectedOption === 4 && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                  <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1A1A1A', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                    First Time in London Dosa Festival At Your Home
                  </h2>
                  <p style={{ fontSize: '1.05rem', color: '#666', fontStyle: 'italic', margin: 0 }}>
                    Brought To You Only By Veg Chennai Sri Lalitha Restaurant. Quality And Trust For Sixteen Years.
                  </p>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {activeOption.contents
                    .filter((c) => c.type === 'list')
                    .flatMap((c) => ('items' in c && Array.isArray(c.items) ? c.items : []))
                    .map((item, i) => (
                      <div
                        key={i}
                        className="tactile-card"
                        style={{
                          backgroundColor: '#ffffff',
                          padding: '14px 18px',
                          borderRadius: '12px',
                          border: '1px solid #E8E0D5',
                          fontWeight: 700,
                          color: '#1A1A1A',
                          textAlign: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        }}
                      >
                        {item}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Options 8 & 9: Gujarathi & Punjabi Menu in ONE Unified Clean Section */}
            {(selectedOption === 7 || selectedOption === 8) && (
              <div style={{ scrollMarginTop: '100px' }}>
                <h2 style={{ 
                  fontFamily: "var(--font-sans), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  fontSize: 'clamp(24px, 2.5vw, 30px)', 
                  fontWeight: 700, 
                  color: '#1A1A1A', 
                  marginBottom: '1.75rem', 
                  textAlign: 'center', 
                  letterSpacing: '-0.01em' 
                }}>
                  {selectedOption === 7 ? 'Gujarathi Menu' : 'Punjabi Menu'}
                </h2>

                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: '1px solid #E8E0D5',
                    padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.75rem',
                  }}
                >
                  {activeOption.contents.map((block, bIdx) => {
                    if (block.type === 'heading') {
                      return (
                        <div 
                          key={bIdx} 
                          style={{ 
                            borderBottom: '2px solid #C45C26', 
                            paddingBottom: '0.5rem', 
                            marginTop: bIdx === 0 ? 0 : '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem'
                          }}
                        >
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C45C26' }} />
                          <h3 style={{ 
                            fontFamily: "var(--font-sans), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                            fontSize: '1.2rem', 
                            fontWeight: 700, 
                            color: '#C45C26', 
                            margin: 0 
                          }}>
                            {block.content}
                          </h3>
                        </div>
                      );
                    }
                    if (block.type === 'list' && 'items' in block && Array.isArray(block.items)) {
                      return (
                        <div
                          key={bIdx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
                            gap: '0.75rem 1.25rem',
                            padding: '0 0.25rem 0.5rem 0.25rem',
                          }}
                        >
                          {block.items.map((it, itIdx) => (
                            <div
                              key={itIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.65rem',
                                fontSize: '0.96rem',
                                color: '#2D3748',
                                fontWeight: 500,
                                lineHeight: 1.45,
                              }}
                            >
                              <svg width="17" height="17" viewBox="0 0 20 20" fill="#C45C26" style={{ flexShrink: 0 }}>
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>{it}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. Filterable Dishes Section (Sidebar + 3 Column Grid) */}
        <section
          style={{
            backgroundColor: '#FDF6F0',
            padding: '4.5rem 1.5rem',
            borderTop: '1px solid #E8E0D5',
            borderBottom: '1px solid #E8E0D5',
          }}
        >
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
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
                Culinary Repertoire
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', color: '#1A1A1A', marginBottom: '0.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Explore Catering Menu Dishes
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#555555', fontStyle: 'italic', margin: 0 }}>
                Filter by category to explore all traditional delicacies prepared for your event
              </p>
            </div>

            {/* Layout: Left Sidebar + Right Dishes Grid */}
            <div className="outdoor-filter-layout">
              {/* Left Sidebar Category Tabs */}
              <div className="outdoor-sidebar">
                {outdoorData.categories.map((cat, idx) => {
                  const isCatActive = selectedCategory === idx;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(idx)}
                      className="cat-btn tactile-card"
                      style={{
                        backgroundColor: isCatActive ? '#C45C26' : 'rgba(255, 255, 255, 0.95)',
                        color: isCatActive ? '#ffffff' : '#1A1A1A',
                        border: isCatActive ? '1px solid #C45C26' : '1px solid #E8E0D5',
                        borderRadius: '12px',
                        padding: '14px 18px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        boxShadow: isCatActive ? '0 6px 18px rgba(196, 92, 38, 0.35)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
                      }}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Right: Dishes 3-Column Grid */}
              <div>
                <div className="outdoor-dish-grid">
                  {activeCategory.dishes.map((dish, dIdx) => (
                    <div
                      key={dIdx}
                      className="tactile-card"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #E8E0D5',
                        borderRadius: '16px',
                        padding: '1.5rem 1.25rem',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: '#1A1A1A',
                          marginTop: 0,
                          marginBottom: dish.description ? '0.45rem' : 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {dish.title}
                      </h4>
                      {dish.description && (
                        <p
                          style={{
                            fontSize: '0.92rem',
                            color: '#555555',
                            lineHeight: 1.55,
                            margin: 0,
                          }}
                        >
                          {dish.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Enquire Now Section (Swiss Glassmorphic Contact & Form) */}
        <section id="enquire" style={{ maxWidth: '1100px', margin: '4.5rem auto 2rem', padding: '0 1.5rem' }}>
          <div className="outdoor-enquire-container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
                Get In Touch
              </span>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4.5vw, 2.6rem)',
                  fontWeight: 800,
                  color: '#1A1A1A',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                Enquire Now
              </h2>
              <p style={{ color: '#666666', fontSize: '1rem', marginTop: '0.5rem', marginBottom: 0 }}>
                Speak with our catering specialists to curate your bespoke vegetarian menu
              </p>
            </div>

            <div className="outdoor-enquire-grid">
              {/* Left - Contact Info Cards */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  justifyContent: 'center',
                }}
              >
                {/* Email */}
                <a
                  href="mailto:vcsramersham@gmail.com"
                  className="tactile-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    padding: '18px 22px',
                    borderRadius: '16px',
                    border: '1px solid #E8E0D5',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                    textDecoration: 'none',
                    color: '#1A1A1A',
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(196, 92, 38, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <MailBulkIcon />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Email Address</span>
                    <span style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: 700 }}>
                      vcsramersham@gmail.com
                    </span>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:+01494972550"
                  className="tactile-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    padding: '18px 22px',
                    borderRadius: '16px',
                    border: '1px solid #E8E0D5',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                    textDecoration: 'none',
                    color: '#1A1A1A',
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(196, 92, 38, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <PhoneIcon />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Phone Hotline</span>
                    <span style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: 700 }}>
                      {siteContent?.restaurant?.phone || '+0149 497 2550'}
                    </span>
                  </div>
                </a>

                {/* Address */}
                <div
                  className="tactile-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    padding: '18px 22px',
                    borderRadius: '16px',
                    border: '1px solid #E8E0D5',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(196, 92, 38, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <MapPinIcon />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Restaurant Location</span>
                    <span style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: 700 }}>
                      {siteContent?.restaurant?.address || '94, sycamore Road, Amersham, HP6 5EN.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right - Enquiry Form */}
              <div>
                <form
                  onSubmit={handleFormSubmit}
                  className="outdoor-enquiry-form"
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}
                >
                  <div className="outdoor-name-email-row">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={form.name}
                      onChange={handleFormChange}
                      required
                      style={formFieldStyle}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={form.email}
                      onChange={handleFormChange}
                      required
                      style={formFieldStyle}
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number *"
                    value={form.phone}
                    onChange={handleFormChange}
                    required
                    style={formFieldStyle}
                  />
                  <div>
                    <label
                      style={{ fontSize: '13px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: 600 }}
                    >
                      Event Type *
                    </label>
                    <select
                      name="eventType"
                      value={form.eventType}
                      onChange={handleFormChange}
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
                    <label
                      style={{ fontSize: '13px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: 600 }}
                    >
                      Event Location / Venue Postcode
                    </label>
                    <input
                      type="text"
                      name="eventLocation"
                      placeholder="e.g. Amersham HP6 5EN, London, Watford"
                      value={form.eventLocation}
                      onChange={handleFormChange}
                      style={formFieldStyle}
                    />
                  </div>
                  <div>
                    <label
                      style={{ fontSize: '13px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: 600 }}
                    >
                      Date of Event
                    </label>
                    <input
                      type="text"
                      name="dateOfEvent"
                      placeholder="Select event date"
                      value={form.dateOfEvent}
                      onChange={handleFormChange}
                      onFocus={(e) => {
                        e.currentTarget.type = 'date';
                      }}
                      onBlur={(e) => {
                        if (!e.currentTarget.value) e.currentTarget.type = 'text';
                      }}
                      style={formFieldStyle}
                    />
                  </div>
                  <input
                    type="number"
                    name="noOfPax"
                    placeholder="Estimated No of Guests (Pax)"
                    value={form.noOfPax}
                    onChange={handleFormChange}
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
                            <option value="">{field.placeholder || `Select ${field.label}`}</option>
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
                    placeholder="Event details, preferred menu options, or dietary requests..."
                    value={form.message}
                    onChange={handleFormChange}
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
                      fontFamily: 'inherit',
                      width: '100%',
                      boxShadow: '0 4px 16px rgba(196, 92, 38, 0.35)',
                    }}
                  >
                    {submitting ? 'Submitting Enquiry...' : submitted ? '✓ Enquiry Received! We will call you shortly.' : 'Submit Catering Enquiry'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Timing Notice Glass Pill */}
          <div style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E8E0D5',
                color: '#1A1A1A',
                fontWeight: 600,
                fontSize: '14px',
                padding: '8px 20px',
                borderRadius: '24px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              📞 Please ring us between 11:00 AM TO 3:30 PM &amp; 5:30 PM TO 10:30 PM
            </span>
          </div>
        </section>
      </main>
    </>
  );
}
