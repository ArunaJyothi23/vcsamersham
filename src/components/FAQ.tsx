'use client';
import { useState } from 'react';

const faqs = [
  {
    q: "Where is Veg Chennai SriLalitha Amersham located?",
    a: "We are located at 94 Sycamore Rd, Amersham HP6 5EN, United Kingdom"
  },
  {
    q: "Is parking available at your locations?",
    a: "Yes, there is convenient street parking and public parking lots located very close to the restaurant."
  },
  {
    q: "Do you offer vegan and Jain options?",
    a: "Absolutely! All our food is 100% vegetarian, and we have extensive vegan options. We also cater to Jain dietary requirements with no onion, garlic, or root vegetables upon request."
  },
  {
    q: "Can I order food for takeaway?",
    a: "Yes, you can easily order online through our delivery partners or directly with us for collection."
  },
  {
    q: "Do you cater for private events?",
    a: "Yes! Whether it's a corporate gathering, wedding, or private party, our catering services bring authentic South Indian cuisine to your venue."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section style={{ padding: '6rem 2rem', backgroundColor: '#fdfbf7' }}>
      <div style={{ maxWidth: '90%', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'flex-start' }}>
          {/* Left Image */}
          <div style={{ flex: '1 1 400px' }}>
            <img 
              src="https://vcsamersham.co.uk/wp-content/uploads/2026/07/CaffeChennai-70-1024x683.jpg" 
              alt="South Indian Food Spread" 
              style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            />
          </div>

          {/* Right Accordion */}
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#fff',
                overflow: 'hidden'
              }}>
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#111'
                  }}
                >
                  {faq.q}
                  <span style={{ fontSize: '1.5rem', lineHeight: 0, fontWeight: 700, color: '#111' }}>
                    {openIndex === idx ? '−' : '+'}
                  </span>
                </button>
                
                {openIndex === idx && (
                  <div style={{ 
                    padding: '0 1.5rem 1.5rem 1.5rem', 
                    color: '#6b7280', 
                    lineHeight: 1.6,
                    borderTop: '1px solid #f3f4f6',
                    paddingTop: '1.5rem'
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
