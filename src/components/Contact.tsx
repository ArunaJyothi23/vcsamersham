'use client';

import { useState } from 'react';
import defaultSiteContent from '../data/site_content.json';

interface ContactProps {
  restaurant?: any;
  siteContent?: any;
}

export default function Contact({ restaurant, siteContent }: ContactProps) {
  const rest = restaurant || defaultSiteContent.restaurant;

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
    (f: any) => f.enabled !== false && f.id !== 'eventLocation' && f.id !== 'dietaryRequirements' && (f.formTarget === 'all' || f.formTarget === 'contact')
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCustomFieldChange = (name: string, value: string) => {
    setCustomFieldsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Submit via internal API (which also bridges to Web3Forms and Firestore)
      await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          serviceType: 'Contact / Table Booking Inquiry',
          recipientEmail: siteContent?.web3forms?.email || rest.email || 'vcsramersham@gmail.com',
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
            subject: `New Booking Request: Contact / Table Booking from ${form.name}${form.eventType ? ` (${form.eventType})` : ''}`,
            from_name: 'Veg Chennai SriLalitha Amersham',
            "Name": form.name,
            "Email": form.email,
            "Phone": form.phone,
            "Event Type": form.eventType || 'Not specified',
            "Event Location": form.eventLocation || 'Not specified',
            "Date Of Event": form.dateOfEvent || 'Not specified',
            "Service Type": 'Table Booking / Contact Inquiry',
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
      console.error('Contact submit error:', err);
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
    <section id="contact" style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem', backgroundColor: '#FFFDF9' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Section Title */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(196, 92, 38, 0.1)',
              color: '#C45C26',
              border: '1px solid rgba(196, 92, 38, 0.25)',
              padding: '5px 16px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            Visit &amp; Connect
          </span>

          <h2
            style={{
              fontFamily: "var(--font-sans), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: 'clamp(26px, 3.5vw, 38px)',
              fontWeight: 700,
              color: '#1A1A1A',
              margin: '0 0 0.5rem 0',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
            }}
          >
            Get in Touch with Us
          </h2>
          <p style={{ color: '#666666', fontSize: '1.02rem', maxWidth: '620px', margin: '0 auto' }}>
            Book a table, inquire about catering, or say hello. Messages route directly to our management team.
          </p>
        </div>

        {/* 2-Column Grid: Contact Details & Interactive Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: 'clamp(1.75rem, 3.5vw, 3rem)',
            alignItems: 'start',
            marginBottom: '3rem',
          }}
        >
          {/* Left Column: Contact Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Phone */}
            <div
              className="tactile-card"
              style={{
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                border: '1px solid #E8E0D5',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div
                style={{
                  backgroundColor: '#FDF6F0',
                  color: '#C45C26',
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid #E8E0D5',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <strong style={{ display: 'block', margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#1A1A1A' }}>Direct Phone</strong>
                <a href={`tel:${rest.phoneRaw || rest.phone}`} style={{ margin: 0, color: '#C45C26', fontSize: '1.05rem', textDecoration: 'none', fontWeight: 700 }}>
                  {rest.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div
              className="tactile-card"
              style={{
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                border: '1px solid #E8E0D5',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div
                style={{
                  backgroundColor: '#FDF6F0',
                  color: '#C45C26',
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid #E8E0D5',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <strong style={{ display: 'block', margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#1A1A1A' }}>Email Inquiries</strong>
                <a href={`mailto:${rest.email}`} style={{ margin: 0, color: '#555555', fontSize: '0.98rem', textDecoration: 'none', wordBreak: 'break-all', fontWeight: 500 }}>
                  {rest.email}
                </a>
              </div>
            </div>

            {/* Address */}
            <div
              className="tactile-card"
              style={{
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                border: '1px solid #E8E0D5',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div
                style={{
                  backgroundColor: '#FDF6F0',
                  color: '#C45C26',
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid #E8E0D5',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <strong style={{ display: 'block', margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#1A1A1A' }}>Restaurant Address</strong>
                <p style={{ margin: 0, color: '#555555', fontSize: '0.98rem', lineHeight: 1.4, fontWeight: 500 }}>{rest.address}</p>
              </div>
            </div>

            {/* Opening Hours */}
            <div
              className="tactile-card"
              style={{
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                border: '1px solid #E8E0D5',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div
                style={{
                  backgroundColor: '#FDF6F0',
                  color: '#C45C26',
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid #E8E0D5',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <strong style={{ display: 'block', margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#1A1A1A' }}>Opening Hours</strong>
                <p style={{ margin: 0, color: '#555555', fontSize: '0.95rem', lineHeight: 1.5, fontWeight: 500 }}>
                  {rest.openingHours?.weekday || 'Monday – Friday: 12:00 PM – 10:00 PM'}<br />
                  {rest.openingHours?.weekend || 'Saturday – Sunday: 11:00 AM – 10:00 PM'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Web3Forms Contact / Reservation Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              border: '1.5px solid #E8E0D5',
              boxShadow: '0 12px 36px rgba(196, 92, 38, 0.06)',
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1A1A1A', margin: '0 0 0.35rem 0' }}>
                Send Us a Message
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#666', margin: 0 }}>
                Fill out the form below and our team will get back to you promptly.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.95rem' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Full Name *"
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.95rem' }}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={handleFormChange}
                  required
                  style={formFieldStyle}
                />
                <select
                  name="eventType"
                  value={form.eventType}
                  onChange={handleFormChange}
                  style={formFieldStyle}
                >
                  <option value="">Event Type (Select type)</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Outdoor Catering">Outdoor Catering</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.95rem' }}>
                <input
                  type="text"
                  name="eventLocation"
                  placeholder="Event Location / Postcode"
                  value={form.eventLocation}
                  onChange={handleFormChange}
                  style={formFieldStyle}
                />
                <input
                  type="text"
                  name="dateOfEvent"
                  placeholder="Preferred Date / Time"
                  value={form.dateOfEvent}
                  onChange={handleFormChange}
                  onFocus={(e) => { e.currentTarget.type = 'date'; }}
                  onBlur={(e) => { if (!e.currentTarget.value) e.currentTarget.type = 'text'; }}
                  style={formFieldStyle}
                />
              </div>

              {/* Dynamic Custom Form Fields */}
              {customFields.map((field: any) => {
                const fieldVal = customFieldsData[field.name || field.id] || '';
                return (
                  <div key={field.id}>
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
                placeholder="Your message, table booking details, or catering requirements..."
                value={form.message}
                onChange={handleFormChange}
                rows={3}
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
                  transition: 'all 0.2s ease',
                }}
              >
                {submitting
                  ? 'Sending Message...'
                  : submitted
                  ? '✓ Message Sent Successfully!'
                  : 'Send Message ✉️'}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div
          style={{
            width: '100%',
            height: '420px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.08)',
            border: '1px solid #E8E0D5',
          }}
        >
          <iframe
            loading="lazy"
            src="https://maps.google.com/maps?q=srilatha%2094%2C%20sycamore%20Road%2C%20Amersham%2C%20HP6%205EN.&t=m&z=12&output=embed&iwloc=near"
            title="srilatha 94, sycamore Road, Amersham, HP6 5EN."
            aria-label="srilatha 94, sycamore Road, Amersham, HP6 5EN."
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '420px', display: 'block' }}
          />
        </div>

      </div>
    </section>
  );
}
