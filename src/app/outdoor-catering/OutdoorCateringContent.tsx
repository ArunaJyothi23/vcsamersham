'use client';
import { useState } from 'react';
import outdoorData from '@/data/outdoor_catering_data.json';

// Exact Font Awesome mail-bulk icon (#D19979)
function MailBulkIcon() {
  return (
    <svg viewBox="0 0 576 512" width="24" height="24" fill="#D19979" style={{ flexShrink: 0 }}>
      <path d="M160 448c-25.6 0-51.2-22.4-64-32-64-44.8-83.2-60.8-96-70.4V480c0 17.67 14.33 32 32 32h256c17.67 0 32-14.33 32-32V345.6c-12.8 9.6-32 25.6-96 70.4-12.8 9.6-38.4 32-64 32zm128-192H32c-17.67 0-32 14.33-32 32v16c25.6 19.2 22.4 19.2 115.2 86.4 9.6 6.4 28.8 25.6 44.8 25.6s35.2-19.2 44.8-22.4c92.8-67.2 89.6-67.2 115.2-86.4V288c0-17.67-14.33-32-32-32zm256-96H224c-17.67 0-32 14.33-32 32v32h96c33.21 0 60.59 25.42 63.71 57.82l.29-.22V416h192c17.67 0 32-14.33 32-32V192c0-17.67-14.33-32-32-32zm-32 128h-64v-64h64v64zm-352-96c0-35.29 28.71-64 64-64h224V32c0-17.67-14.33-32-32-32H96C78.33 0 64 14.33 64 32v192h96v-32z"/>
    </svg>
  );
}

// Exact Font Awesome phone-alt icon (#D19979)
function PhoneIcon() {
  return (
    <svg viewBox="0 0 512 512" width="24" height="24" fill="#D19979" style={{ flexShrink: 0 }}>
      <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
    </svg>
  );
}

export default function OutdoorCateringContent() {
  // State for Top Option Tabs (Option 1 to Option 9)
  const [selectedOption, setSelectedOption] = useState<number>(0);

  // State for Dish Category Filter Tabs
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfEvent: '',
    noOfPax: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', phone: '', dateOfEvent: '', noOfPax: '', message: '' });
  };

  // Active category and dishes
  const activeCategory = outdoorData.categories[selectedCategory] || outdoorData.categories[0];

  // Current active option
  const activeOption = outdoorData.options[selectedOption] || outdoorData.options[0];

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
        .outdoor-enquiry-form input,
        .outdoor-enquiry-form textarea {
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
        .outdoor-enquiry-form input::placeholder,
        .outdoor-enquiry-form textarea::placeholder {
          color: #777777 !important;
          opacity: 1 !important;
        }
        .outdoor-enquiry-form input:focus,
        .outdoor-enquiry-form textarea:focus {
          border-color: #b88264 !important;
          background-color: #ffffff !important;
          outline: none !important;
        }

        /* Option Tab Content Styling */
        .option-html-content {
          font-family: inherit;
          color: #222;
        }
        .option-html-content h2 {
          font-size: 1.85rem;
          font-weight: 700;
          color: #000;
          margin-top: 0;
          margin-bottom: 1.25rem;
        }
        .option-html-content p {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #333;
          margin-bottom: 1.25rem;
        }
        .option-html-content strong {
          color: #000;
          font-weight: 700;
        }
        .option-html-content .uvc-heading-spacer span,
        .option-html-content h3 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #000;
          display: block;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }
        .option-html-content ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .option-html-content li {
          font-size: 1rem;
          line-height: 1.7;
          color: #333;
          margin-bottom: 0.4rem;
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
          left: 0;
          color: #000;
          font-weight: bold;
          font-size: 1.3rem;
          line-height: 1;
        }

        /* Dish Card Hover */
        .outdoor-dish-card {
          background-color: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          padding: 1.5rem 1.25rem;
          transition: box-shadow 0.25s ease, transform 0.25s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .outdoor-dish-card:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
          transform: translateY(-2px);
        }

        /* Category Button transition */
        .cat-btn {
          transition: background-color 0.2s ease, transform 0.15s ease;
        }
        .cat-btn:hover {
          opacity: 0.95;
        }

        /* Responsive Media Queries */
        .outdoor-options-box {
          background-color: #FAF3EE;
          border-radius: 12px;
          padding: 2.5rem 3rem;
          margin-bottom: 4.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
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
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .outdoor-enquire-container {
          background-color: #FAF3EE;
          border-radius: 10px;
          padding: 35px 32px;
          margin-bottom: 2rem;
        }
        .outdoor-enquire-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
          .outdoor-dish-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .outdoor-enquire-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .outdoor-options-box {
            padding: 2rem 1.5rem !important;
          }
        }

        @media (max-width: 600px) {
          .outdoor-sidebar .cat-btn {
            flex: 1 1 calc(50% - 0.5rem) !important;
            font-size: 0.88rem !important;
            padding: 10px 8px !important;
          }
          .outdoor-dish-grid {
            grid-template-columns: 1fr !important;
          }
          .outdoor-name-email-row {
            grid-template-columns: 1fr !important;
          }
          .outdoor-enquire-container {
            padding: 24px 16px !important;
          }
          .outdoor-options-box {
            padding: 1.5rem 1rem !important;
          }
        }
      `}</style>

      <main style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        {/* 1. Hero Header */}
        <section
          style={{
            position: 'relative',
            height: '460px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#fff',
            backgroundColor: '#111',
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url("/outdoor-hero.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }}
        >
          <div style={{ maxWidth: '900px', padding: '0 1.5rem' }}>
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                fontWeight: 700,
                margin: 0,
                textShadow: '2px 2px 6px rgba(0,0,0,0.7)',
                letterSpacing: '0.5px',
                lineHeight: 1.2,
              }}
            >
              Authentic 100% Pure Vegetarian Catering
            </h1>
          </div>
        </section>

        {/* 2. Intro Description */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 2rem 1.5rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto 3rem', textAlign: 'center' }}>
            <p
              style={{
                fontSize: '1.12rem',
                color: '#333333',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              Authentic 100% vegetarian catering in UK, backed by 21+ years of experience. Proud to
              have catered to all the VIPs and VVIPs of Indian origin across the UK. Perfect for
              weddings, corporate events, housewarmings, and temple functions. Enjoy live dosa
              stations, soft idlis, crispy vadas, and traditional banana-leaf feasts with sambar,
              rasam, poriyal, and payasam—freshly prepared for a truly authentic and memorable
              experience.
            </p>
          </div>

          {/* 3. Horizontal Option Tabs (Option 1 to Option 9) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.65rem',
              justifyContent: 'center',
              marginBottom: '2rem',
            }}
          >
            {outdoorData.options.map((opt, idx) => {
              const isActive = selectedOption === idx;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(idx)}
                  style={{
                    backgroundColor: isActive ? '#38c172' : '#C5926B',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '9px 20px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(56, 193, 114, 0.3)' : 'none',
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#b88264';
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#C5926B';
                  }}
                >
                  {opt.tabTitle}
                </button>
              );
            })}
          </div>

          {/* Dynamic Option Content Container */}
          <div className="outdoor-options-box">
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
                  <h2 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#000', marginBottom: '0.75rem' }}>
                    First Time in London Dosa Festival At Your Home
                  </h2>
                  <p style={{ fontSize: '1.1rem', color: '#555', fontStyle: 'italic', margin: 0 }}>
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
                        style={{
                          backgroundColor: '#ffffff',
                          padding: '12px 18px',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB',
                          fontWeight: 600,
                          color: '#222',
                          textAlign: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                      >
                        {item}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Options 8 & 9: Gujarathi & Punjabi Menu */}
            {(selectedOption === 7 || selectedOption === 8) && (
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#000', marginBottom: '2rem', textAlign: 'center' }}>
                  {selectedOption === 7 ? 'Gujarathi Menu' : 'Punjabi Menu'}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {activeOption.contents.map((block, bIdx) => {
                    if (block.type === 'heading') {
                      return (
                        <div key={bIdx} style={{ borderBottom: '2px solid #D19979', paddingBottom: '0.5rem', marginTop: '1rem' }}>
                          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#92400e', margin: 0 }}>
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
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '0.75rem',
                          }}
                        >
                          {block.items.map((it, itIdx) => (
                            <div
                              key={itIdx}
                              style={{
                                backgroundColor: '#ffffff',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB',
                                fontSize: '0.95rem',
                                color: '#333',
                                fontWeight: 500,
                              }}
                            >
                              • {it}
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

        {/* 4. Filterable Dishes Section (Sidebar + 3 Column Grid) */}
        <section
          style={{
            backgroundColor: '#FAF3EE',
            padding: '4rem 2rem',
            borderTop: '1px solid #f0e6dc',
            borderBottom: '1px solid #f0e6dc',
          }}
        >
          <div style={{ maxWidth: '1250px', margin: '0 auto' }}>
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
                      className="cat-btn"
                      style={{
                        backgroundColor: isCatActive ? '#38c172' : '#C5926B',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '14px 18px',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        boxShadow: isCatActive ? '0 4px 14px rgba(56, 193, 114, 0.35)' : 'none',
                      }}
                      onMouseOver={(e) => {
                        if (!isCatActive) e.currentTarget.style.backgroundColor = '#b88264';
                      }}
                      onMouseOut={(e) => {
                        if (!isCatActive) e.currentTarget.style.backgroundColor = '#C5926B';
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
                    <div key={dIdx} className="outdoor-dish-card">
                      <h4
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          color: '#000000',
                          marginTop: 0,
                          marginBottom: dish.description ? '0.45rem' : 0,
                        }}
                      >
                        {dish.title}
                      </h4>
                      {dish.description && (
                        <p
                          style={{
                            fontSize: '0.92rem',
                            color: '#444444',
                            lineHeight: 1.5,
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

        {/* 5. Enquire Now Section (Exact Match) */}
        <section style={{ maxWidth: '1100px', margin: '4rem auto 2rem', padding: '0 2rem' }}>
          <div className="outdoor-enquire-container">
            <h2
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#000000',
                textAlign: 'center',
                marginBottom: '2.5rem',
                fontFamily: 'inherit',
              }}
            >
              Enquire Now
            </h2>

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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    padding: '18px 22px',
                    borderRadius: '10px',
                    border: '1px solid #D4D4D4',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  <MailBulkIcon />
                  <span style={{ color: '#000000', fontSize: '17px', fontWeight: 400 }}>
                    vcsramersham@gmail.com
                  </span>
                </div>

                {/* Phone */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    padding: '18px 22px',
                    borderRadius: '10px',
                    border: '1px solid #D4D4D4',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  <PhoneIcon />
                  <span style={{ color: '#000000', fontSize: '17px', fontWeight: 400 }}>
                    +0149 497 2550
                  </span>
                </div>

                {/* Address */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    padding: '18px 22px',
                    borderRadius: '10px',
                    border: '1px solid #D4D4D4',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  <MailBulkIcon />
                  <span style={{ color: '#000000', fontSize: '17px', fontWeight: 400 }}>
                    94, sycamore Road, Amersham, HP6 5EN.
                  </span>
                </div>
              </div>

              {/* Right - Enquiry Form */}
              <div>
                <form
                  onSubmit={handleFormSubmit}
                  className="outdoor-enquiry-form"
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
                >
                  <div className="outdoor-name-email-row">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={form.name}
                      onChange={handleFormChange}
                      required
                      style={formFieldStyle}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleFormChange}
                      required
                      style={formFieldStyle}
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleFormChange}
                    required
                    style={formFieldStyle}
                  />
                  <div>
                    <label
                      style={{ fontSize: '13px', color: '#666', marginBottom: '3px', display: 'block' }}
                    >
                      Date of Event
                    </label>
                    <input
                      type="text"
                      name="dateOfEvent"
                      placeholder="Date of Event"
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
                    placeholder="No of Pax"
                    value={form.noOfPax}
                    onChange={handleFormChange}
                    style={formFieldStyle}
                  />
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={form.message}
                    onChange={handleFormChange}
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
                    onMouseOver={(e) => {
                      if (!submitting) e.currentTarget.style.backgroundColor = '#b88264';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#D19979';
                    }}
                  >
                    {submitting ? 'Submitting...' : submitted ? '✓ Submitted!' : 'Submit'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Timing Notice */}
          <p
            style={{
              textAlign: 'center',
              color: '#000000',
              fontWeight: 400,
              fontSize: '15px',
              padding: '1rem 0 2rem',
            }}
          >
            Please ring us between 11:00 AM TO 3.30PM AND 5.30 PM TO 10.30PM
          </p>
        </section>
      </main>
    </>
  );
}
