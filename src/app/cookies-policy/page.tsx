import { getSiteContent } from '@/lib/firebaseService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const siteContent = await getSiteContent();
  const cookies = siteContent?.legalPolicies?.cookiesPolicy;
  const seo = siteContent?.seo?.cookiesPolicy;
  const title = seo?.title || 'Cookies Policy - vcsamersham';
  const description =
    seo?.description ||
    cookies?.intro ||
    'Cookie Policy Effective Date: 01/01/2027 This Cookie Policy explains how Veg Chennai Srilalitha uses cookies and similar technologies when you visit our website.';
  const keywords = seo?.keywords ? seo.keywords.split(',').map((k: string) => k.trim()) : undefined;
  const canonical = seo?.canonical || 'https://vcsamersham.co.uk/cookies-policy/';
  const ogImage = seo?.ogImage || '/images/migrated/WhatsApp-Image-2025-11-01-at-15.41.07-2.jpeg';

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: 'https://vcsamersham.co.uk/cookies-policy/',
      siteName: 'Veg Chennai Srilalitha Amersham',
      locale: 'en_GB',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CookiePolicy() {
  const siteContent = await getSiteContent();
  const cookies = siteContent?.legalPolicies?.cookiesPolicy;
  const restaurant = siteContent?.restaurant;

  return (
    <div style={{ padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem)', backgroundColor: '#FFFDF9', color: '#111', fontFamily: 'inherit', lineHeight: '1.8' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1rem', color: '#1a2f4c' }}>
          {cookies?.title || 'Cookie Policy'}
        </h1>
        <p style={{ fontWeight: 'bold', marginBottom: '2rem', color: '#DE7843' }}>
          Effective Date: {cookies?.effectiveDate || '01/01/2027'}
        </p>

        <p style={{ marginBottom: '2.5rem', fontSize: '1.05rem', color: '#444' }}>
          {cookies?.intro ||
            'This Cookie Policy explains how Veg Chennai Srilalitha uses cookies and similar technologies when you visit our website.'}
        </p>

        <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 600, marginTop: '2.5rem', marginBottom: '1rem', color: '#1a2f4c' }}>What Are Cookies?</h2>
        <p style={{ marginBottom: '2.5rem', color: '#444' }}>
          {cookies?.whatAreCookies ||
            'Cookies are small text files stored securely on your browser to keep track of your cart, preferences, and session smoothly.'}
        </p>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '3rem', marginBottom: '1.5rem', color: '#1a2f4c' }}>How We Use Cookies</h2>
        <p style={{ marginBottom: '2.5rem', color: '#444' }}>
          {cookies?.howWeUse ||
            'Ensure core site security, remember your favorites, speed up page loading, and analyze traffic patterns.'}
        </p>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '3rem', marginBottom: '1.5rem', color: '#1a2f4c' }}>Types of Cookies We Use</h2>
        <p style={{ marginBottom: '2.5rem', color: '#444' }}>
          {cookies?.types ||
            'Essential Functionality Cookies, Performance & Analytics Cookies, and Customer Preference Cookies.'}
        </p>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '3rem', marginBottom: '1.5rem', color: '#1a2f4c' }}>Managing Cookies</h2>
        <p style={{ marginBottom: '2.5rem', color: '#444' }}>
          {cookies?.managing ||
            'You can adjust, block, or delete cookies at any time directly within your web browser settings.'}
        </p>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '3rem', marginBottom: '1.5rem', color: '#1a2f4c' }}>Contact Us</h2>
        <p style={{ marginBottom: '0.5rem', color: '#444' }}>If you have any questions about our Cookie Policy, please contact us at:</p>
        <p style={{ marginBottom: '0.2rem' }}><strong>Email:</strong> {restaurant?.email || 'vcsramersham@gmail.com'}</p>
        <p style={{ marginBottom: '0.2rem' }}><strong>Phone:</strong> {restaurant?.phone || '+0149 497 2550'}</p>
        <p style={{ marginBottom: '2.5rem' }}><strong>Address:</strong> {restaurant?.address || '94, sycamore Road, Amersham, HP6 5EN.'}</p>
      </div>
    </div>
  );
}
