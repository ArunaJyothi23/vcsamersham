import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found (404) | Veg Chennai Srilalitha',
  description: 'The requested page could not be found. Explore our menu, catering, or return to our home page.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '65vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.5rem',
        backgroundColor: '#FFFDF9',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div
          style={{
            fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
            fontWeight: 900,
            color: '#DE7843',
            lineHeight: 1,
            letterSpacing: '-2px',
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontWeight: 800,
            color: '#1C1917',
            margin: '1.25rem 0 0.85rem 0',
          }}
        >
          Page Not Found
        </h1>
        <p
          style={{
            color: '#57534E',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            marginBottom: '2.25rem',
          }}
        >
          We couldn&apos;t locate the page you were looking for. The link may have changed, expired, or been moved. Use the links below to explore our website:
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.85rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              padding: '0.8rem 1.6rem',
              borderRadius: '8px',
              backgroundColor: '#DE7843',
              color: '#FFFFFF',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.95rem',
              boxShadow: '0 4px 12px rgba(222, 120, 67, 0.25)',
            }}
          >
            ← Back to Home
          </Link>
          <Link
            href="/#menu"
            style={{
              padding: '0.8rem 1.6rem',
              borderRadius: '8px',
              backgroundColor: '#292524',
              color: '#FFFFFF',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            View Food Menu
          </Link>
          <Link
            href="/outdoor-catering"
            style={{
              padding: '0.8rem 1.6rem',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#DE7843',
              border: '2px solid #DE7843',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            Outdoor Catering
          </Link>
          <Link
            href="/live-dosa-catering"
            style={{
              padding: '0.8rem 1.6rem',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#1C1917',
              border: '2px solid #D6D3D1',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            Live Dosa
          </Link>
        </div>
      </div>
    </main>
  );
}
