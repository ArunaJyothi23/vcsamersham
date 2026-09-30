export default function Reviews() {
  const reviews = [
    {
      author: "Shohini Chaudhuri",
      avatarLetter: "S",
      avatarColor: "#6c2bd9",
      time: "5 months ago",
      rating: 5,
      text: "quick and amazing service with good quality food."
    },
    {
      author: "Marudavanan Soma...",
      avatarImg: "https://lh3.googleusercontent.com/a/ACg8ocK1wz7qBqC8281V2y2Q5zB37R4P7_413sD-qR3F-7b=s36-c-k-c0x00ffffff-no-rj", 
      time: "5 months ago",
      rating: 5,
      text: "Excellent restaurant with delicious vegetarian food in the beautiful small town of Amersham"
    },
    {
      author: "Alice Grahame",
      avatarLetter: "A",
      avatarColor: "#4f46e5",
      time: "11 months ago",
      rating: 5,
      text: "Lovely place. The food was absolutely delicious, big portions and excellent value for money. Veggie with lots of vegan items"
    },
    {
      author: "Vivian Lewis",
      avatarLetter: "V",
      avatarColor: "#9333ea",
      time: "12 months ago",
      rating: 1,
      text: "Food used to be good but is on a downhill track. Service is very bad, no smile when greeting and looked disinterested. Zero check"
    },
    {
      author: "Ketan Bhavan",
      avatarImg: "https://lh3.googleusercontent.com/a-/ALV-UjWOoHqC24DXYjU49qL73uA0J4934YhP5=s36-c-k-c0x00ffffff-no-rj",
      time: "last year",
      rating: 5,
      text: "Really nice south Indian food! Really enjoyed our visit with a wide range of dosas that all tasted great!Pure vegetarian"
    }
  ];

  return (
    <section id="reviews" style={{ padding: '5rem 2rem', backgroundColor: '#f9fafb', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111', marginBottom: '3rem' }}>
          Google reviews
        </h2>

        <div style={{ position: 'relative' }}>
          {/* Left Arrow Mock */}
          <div style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, cursor: 'pointer', color: '#666' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </div>

          {/* Right Arrow Mock */}
          <div style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, cursor: 'pointer', color: '#666' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '1.5rem',
            overflowX: 'auto',
            paddingBottom: '2rem',
            scrollbarWidth: 'none',
            scrollSnapType: 'x mandatory',
            padding: '1rem'
          }}>
            {/* Summary Card */}
            <div style={{ 
              minWidth: '320px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'left',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              scrollSnapAlign: 'start',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                <img src="https://vcsamersham.co.uk/wp-content/uploads/2026/06/vcsr-logo.webp" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 'bold', color: '#111', textTransform: 'uppercase', lineHeight: 1.4 }}>
                  VEG CHENNAI SRILALITHA RESTAURANT, AMERSHAM
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#e7711b' }}>4.6</span>
                <span style={{ color: '#e7711b', fontSize: '1.2rem', letterSpacing: '2px' }}>★★★★★</span>
              </div>
              <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>
                Based on 645 reviews
              </p>
              <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.85rem' }}>
                powered by <span style={{ fontWeight: 'bold', color: '#111' }}>Google</span>
              </p>
              <a href="https://search.google.com/local/reviews?placeid=ChIJlQn9sipndkgR9CoUH8Wmwzs" target="_blank" rel="noreferrer" style={{
                backgroundColor: '#4285f4',
                color: '#fff',
                padding: '0.5rem 1.2rem',
                borderRadius: '20px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                review us on <span style={{ backgroundColor: '#fff', color: '#4285f4', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '11px', fontWeight: 'bold' }}>G</span>
              </a>
            </div>

            {/* Review Cards */}
            {reviews.map((rev, idx) => (
              <div key={idx} style={{ 
                minWidth: '320px',
                maxWidth: '320px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'left',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                position: 'relative',
                scrollSnapAlign: 'start',
                border: '1px solid #f3f4f6'
              }}>
                {/* Google G Logo top right */}
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '20px', height: '20px' }}>
                  <svg viewBox="0 0 512 512"><path d="M482.56 261.36c0-16.73-1.5-32.83-4.29-48.27H256v91.29h127.01c-5.47 29.5-22.1 54.49-47.09 71.23v59.21h76.27c44.63-41.09 70.37-101.59 70.37-173.46z" fill="#4285f4"/><path d="M256 492c63.72 0 117.14-21.13 156.19-57.18l-76.27-59.21c-21.13 14.16-48.17 22.53-79.92 22.53-61.47 0-113.49-41.51-132.05-97.3H45.1v61.15c38.83 77.13 118.64 130.01 210.9 130.01z" fill="#34a853"/><path d="M123.95 300.84c-4.72-14.16-7.4-29.29-7.4-44.84s2.68-30.68 7.4-44.84V150.01H45.1C29.12 181.87 20 217.92 20 256c0 38.08 9.12 74.13 25.1 105.99l78.85-61.15z" fill="#fbbc05"/><path d="M256 113.86c34.65 0 65.76 11.91 90.22 35.29l67.69-67.69C373.03 43.39 319.61 20 256 20c-92.25 0-172.07 52.89-210.9 130.01l78.85 61.15c18.56-55.78 70.59-97.3 132.05-97.3z" fill="#ea4335"/></svg>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  {rev.avatarImg ? (
                    <img src={rev.avatarImg} alt={rev.author} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: rev.avatarColor, color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.3rem', fontWeight: '500' }}>
                      {rev.avatarLetter}
                    </div>
                  )}
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1rem', color: '#1a0dab', fontWeight: 'bold' }}>{rev.author}</h4>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>{rev.time}</span>
                  </div>
                </div>
                <div style={{ color: '#e7711b', fontSize: '1.2rem', marginBottom: '1rem', letterSpacing: '2px' }}>
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} style={{ opacity: i < rev.rating ? 1 : 0.3 }}>★</span>
                  ))}
                </div>
                <p style={{ margin: 0, color: '#444', fontSize: '0.95rem', lineHeight: 1.5 }}>{rev.text}</p>
              </div>
            ))}
          </div>

          {/* Dots Mock */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d39e7e' }}></div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e5e7eb' }}></div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e5e7eb' }}></div>
          </div>
        </div>

        <div style={{ textAlign: 'left', marginTop: '3rem', color: '#666', fontSize: '0.9rem' }}>
          [trustindex-feed-instagram]
        </div>
      </div>
    </section>
  );
}
