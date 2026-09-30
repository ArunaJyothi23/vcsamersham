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

// Exact fork and knife icon from the live website
function ForkIcon() {
  return (
    <img
      src="/dosa-menu-icon.png"
      alt="Fork and knife icon"
      width={47}
      height={45}
      style={{
        width: '47px',
        height: '45px',
        objectFit: 'contain',
        display: 'inline-block',
      }}
    />
  );
}

// Exact Font Awesome check-circle icon from the original live site (#D19979)
function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 512 512" width="20" height="20" fill="#D19979" style={{ flexShrink: 0 }}>
      <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"/>
    </svg>
  );
}

// Exact Font Awesome pound-sign icon from the original live site (#D19979)
function PoundSignIcon() {
  return (
    <svg viewBox="0 0 320 512" width="20" height="20" fill="#D19979" style={{ flexShrink: 0 }}>
      <path d="M308 352h-45.495c-6.627 0-12 5.373-12 12v50.848H128V288h84c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-84v-63.556c0-32.266 24.562-57.086 61.792-57.086 23.658 0 45.878 11.505 57.652 18.849 5.151 3.213 11.888 2.051 15.688-2.685l28.493-35.513c4.233-5.276 3.279-13.005-2.119-17.081C273.124 54.56 236.576 32 187.931 32 106.026 32 48 84.742 48 157.961V224H20c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h28v128H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h296c6.627 0 12-5.373 12-12V364c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

// Exact Font Awesome mail-bulk icon from the original live site (#D19979)
function MailBulkIcon() {
  return (
    <svg viewBox="0 0 576 512" width="24" height="24" fill="#D19979" style={{ flexShrink: 0 }}>
      <path d="M160 448c-25.6 0-51.2-22.4-64-32-64-44.8-83.2-60.8-96-70.4V480c0 17.67 14.33 32 32 32h256c17.67 0 32-14.33 32-32V345.6c-12.8 9.6-32 25.6-96 70.4-12.8 9.6-38.4 32-64 32zm128-192H32c-17.67 0-32 14.33-32 32v16c25.6 19.2 22.4 19.2 115.2 86.4 9.6 6.4 28.8 25.6 44.8 25.6s35.2-19.2 44.8-22.4c92.8-67.2 89.6-67.2 115.2-86.4V288c0-17.67-14.33-32-32-32zm256-96H224c-17.67 0-32 14.33-32 32v32h96c33.21 0 60.59 25.42 63.71 57.82l.29-.22V416h192c17.67 0 32-14.33 32-32V192c0-17.67-14.33-32-32-32zm-32 128h-64v-64h64v64zm-352-96c0-35.29 28.71-64 64-64h224V32c0-17.67-14.33-32-32-32H96C78.33 0 64 14.33 64 32v192h96v-32z"/>
    </svg>
  );
}

// Exact Font Awesome phone-alt icon from the original live site (#D19979)
function PhoneIcon() {
  return (
    <svg viewBox="0 0 512 512" width="24" height="24" fill="#D19979" style={{ flexShrink: 0 }}>
      <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
    </svg>
  );
}

export default function LiveDosaContent() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dateOfEvent: '', noOfPax: '', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', phone: '', dateOfEvent: '', noOfPax: '', message: '' });
  };

  const formFieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid #D19979',
    borderRadius: '10px',
    fontSize: '15px',
    fontFamily: 'inherit',
    backgroundColor: 'rgba(255, 255, 255, 0.33)',
    color: '#000000',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <>
      <style>{`
        .live-dosa-enquiry-form input,
        .live-dosa-enquiry-form textarea {
          border: 2px solid #D19979 !important;
          border-radius: 10px !important;
          background-color: rgba(255, 255, 255, 0.33) !important;
          color: #000000 !important;
          font-size: 15px !important;
          font-family: inherit !important;
          padding: 10px 14px !important;
          box-sizing: border-box !important;
          width: 100% !important;
        }
        .live-dosa-enquiry-form input::placeholder,
        .live-dosa-enquiry-form textarea::placeholder {
          color: #777777 !important;
          opacity: 1 !important;
        }
        .live-dosa-enquiry-form input:focus,
        .live-dosa-enquiry-form textarea:focus {
          border-color: #b88264 !important;
          background-color: #ffffff !important;
          outline: none !important;
        }
        .dosa-menu-card {
          background-color: #ffffff;
          border: 1px solid #D4D4D4;
          border-radius: 10px;
          padding: 1.75rem 1.25rem;
          text-align: center;
          transition: box-shadow 0.25s ease, transform 0.25s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .dosa-menu-card:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
          transform: translateY(-2px);
        }

        /* Responsive Media Queries */
        .live-dosa-section-wrapper {
          max-width: 1100px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        .live-dosa-menu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 4rem;
        }
        .live-dosa-included-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .live-dosa-enquire-container {
          background-color: #FAF3EE;
          border-radius: 10px;
          padding: 35px 32px;
          margin-bottom: 2rem;
        }
        .live-dosa-enquire-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        .live-dosa-name-email-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        @media (max-width: 860px) {
          .live-dosa-menu-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }
          .live-dosa-enquire-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .live-dosa-section-wrapper {
            padding: 3rem 1.25rem !important;
          }
        }

        @media (max-width: 580px) {
          .live-dosa-menu-grid {
            grid-template-columns: 1fr !important;
          }
          .live-dosa-included-grid {
            grid-template-columns: 1fr !important;
          }
          .live-dosa-name-email-row {
            grid-template-columns: 1fr !important;
          }
          .live-dosa-enquire-container {
            padding: 24px 16px !important;
          }
        }
      `}</style>
      <main style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      
      {/* Hero Header */}
      <section style={{
        position: 'relative',
        height: '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#111',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://vcsamersham.co.uk/wp-content/uploads/2026/06/WhatsApp-Image-2025-11-01-at-15.41.07-2.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <h1 style={{ 
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', 
          fontWeight: 700, 
          margin: '0 1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
          letterSpacing: '1px'
        }}>
          Live Dosa Catering
        </h1>
      </section>

      {/* Live Dosa Station Menu */}
      <section className="live-dosa-section-wrapper">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#111', marginBottom: '0.75rem', fontWeight: 700 }}>
            Live Dosa Station Menu
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#6b7280', fontStyle: 'italic', margin: 0 }}>
            Each item is prepared fresh on the spot with theatrical flair
          </p>
        </div>

        {/* Menu Grid - responsive columns */}
        <div className="live-dosa-menu-grid">
          {menuItems.map((item, idx) => (
            <div key={idx} className="dosa-menu-card">
              <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>
                <ForkIcon />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#000', marginBottom: '0.5rem' }}>
                {item.name}
              </h3>
              <p style={{ color: '#777', fontSize: '0.95rem', margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* What's Included */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#111', textAlign: 'center', marginBottom: '2rem' }}>
            What&apos;s Included
          </h2>
          <div className="live-dosa-included-grid">
            {includedItems.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: '#FAF3EE',
                padding: '1.25rem 1.5rem',
                borderRadius: '10px',
                border: '1px solid #E2E2E2',
              }}>
                <CheckCircleIcon />
                <span style={{ fontSize: '1rem', color: '#374151', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Note */}
        <div style={{
          backgroundColor: '#FAF3EE',
          borderRadius: '10px',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          marginBottom: '3.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          border: '1px solid #E2E2E2',
        }}>
          <PoundSignIcon />
          <span style={{ color: '#000000', fontWeight: 500, fontSize: '0.98rem' }}>
            Pricing: Per item or per-head options available — request a custom quote based on your event size
          </span>
        </div>

        {/* Enquire Now - Section Container */}
        <div className="live-dosa-enquire-container">
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 36px)', 
            fontWeight: 700, 
            color: '#000000', 
            textAlign: 'center', 
            marginBottom: '2rem',
            fontFamily: 'inherit'
          }}>
            Enquire Now
          </h2>
          
          <div className="live-dosa-enquire-grid">
            {/* Left - Contact Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              {/* Email */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                backgroundColor: '#FFFFFF',
                padding: '16px 20px',
                borderRadius: '10px',
                border: '1px solid #D4D4D4',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}>
                <MailBulkIcon />
                <span style={{ color: '#000000', fontSize: '16px', fontWeight: 400, wordBreak: 'break-all' }}>
                  vcsramersham@gmail.com
                </span>
              </div>

              {/* Phone */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                backgroundColor: '#FFFFFF',
                padding: '16px 20px',
                borderRadius: '10px',
                border: '1px solid #D4D4D4',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}>
                <PhoneIcon />
                <span style={{ color: '#000000', fontSize: '16px', fontWeight: 400 }}>
                  +0149 497 2550
                </span>
              </div>

              {/* Address */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                backgroundColor: '#FFFFFF',
                padding: '16px 20px',
                borderRadius: '10px',
                border: '1px solid #D4D4D4',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}>
                <MailBulkIcon />
                <span style={{ color: '#000000', fontSize: '16px', fontWeight: 400 }}>
                  94, sycamore Road, Amersham, HP6 5EN.
                </span>
              </div>
            </div>

            {/* Right - Enquiry Form */}
            <div>
              <form onSubmit={handleSubmit} className="live-dosa-enquiry-form" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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
                  <label style={{ fontSize: '13px', color: '#666', marginBottom: '3px', display: 'block' }}>Date of Event</label>
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
                  style={{
                    backgroundColor: '#D19979',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    transition: 'background-color 0.2s',
                    fontFamily: 'inherit',
                    width: '100%',
                  }}
                  onMouseOver={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#b88264'; }}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#D19979'}
                >
                  {submitting ? 'Submitting...' : submitted ? '✓ Submitted!' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Timing Notice */}
        <p style={{ 
          textAlign: 'center', 
          color: '#000000', 
          fontWeight: 400, 
          fontSize: '15px',
          padding: '1rem 0 2rem',
        }}>
          Please ring us between 11:00 AM TO 3.30PM AND 5.30 PM TO 10.30PM
        </p>
      </section>
    </main>
    </>
  );
}
