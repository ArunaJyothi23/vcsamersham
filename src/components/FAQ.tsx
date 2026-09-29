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
    a: "Absolutely! The majority of our menu can be made Vegan or Jain upon request. Please let our staff know your dietary requirements."
  },
  {
    q: "Can I order food for takeaway?",
    a: "Yes, you can easily order online through our delivery partners or directly with us for collection."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section style={{ padding: '6rem 2rem', backgroundColor: '#fdfbf7' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#111', marginBottom: '1.5rem' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#4b5563', lineHeight: 1.6 }}>
            Veg Chennai SriLalitha brings the authentic taste of Chennai to London with home-style vegetarian cuisine served in a warm, fine-dining atmosphere. Our chefs from Chennai prepare traditional recipes with fresh ingredients and authentic techniques.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'flex-start' }}>
          {/* Left Image */}
          <div style={{ flex: '1 1 400px' }}>
            <img 
              src="https://images.unsplash.com/photo-1615486171448-4fd143431afb?q=80&w=1000&auto=format&fit=crop" 
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
                  <span style={{ fontSize: '1.5rem', lineHeight: 0, fontWeight: 300 }}>
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
