import { getSiteContent } from '@/lib/firebaseService';
import { buildPageMetadata } from '@/lib/seoService';
import PageJsonLd from '@/components/PageJsonLd';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const siteContent = await getSiteContent();
  return buildPageMetadata('/privacy-policy', siteContent);
}

export default async function PrivacyPolicy() {
  const siteContent = await getSiteContent();
  const privacy = siteContent?.legalPolicies?.privacyPolicy;
  const restaurant = siteContent?.restaurant;

  return (
    <div style={{ padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem)', backgroundColor: '#FFFDF9', color: '#111', fontFamily: 'inherit', lineHeight: '1.8' }}>
      <PageJsonLd route="/privacy-policy" siteContent={siteContent} />
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1rem', color: '#1a2f4c' }}>
          {privacy?.title || 'Privacy Policy'}
        </h1>
        <p style={{ fontWeight: 'bold', marginBottom: '2rem', color: '#DE7843' }}>
          Effective Date: {privacy?.effectiveDate || '01/01/2027'}
        </p>

        <p style={{ marginBottom: '2.5rem', fontSize: '1.05rem', color: '#444' }}>
          {privacy?.intro ||
            'At Veg chennai Srilalitha, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you visit our website or place an order with us.'}
        </p>

        <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 600, marginTop: '2.5rem', marginBottom: '1rem', color: '#1a2f4c' }}>Information We Collect</h2>
        <p style={{ marginBottom: '1.5rem', color: '#444' }}>
          {privacy?.infoCollected || 'Website usage data (IP address, browser type), personal contact details (name, phone, email, delivery address), payment information processed securely, order history and preferences.'}
        </p>

        <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 600, marginTop: '2.5rem', marginBottom: '1rem', color: '#1a2f4c' }}>How We Use Your Information</h2>
        <p style={{ marginBottom: '1.5rem', color: '#444' }}>
          {privacy?.howWeUse || 'We use your information to process and deliver orders, communicate regarding inquiries, improve our website and services, and send promotional offers if opted in.'}
        </p>

        <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 600, marginTop: '2.5rem', marginBottom: '1rem', color: '#1a2f4c' }}>Sharing Your Information</h2>
        <p style={{ marginBottom: '1.5rem', color: '#444' }}>
          {privacy?.sharing || 'We do not sell or rent your personal data. We only share details with trusted delivery drivers and payment processors strictly for completing your orders.'}
        </p>

        <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 600, marginTop: '2.5rem', marginBottom: '1rem', color: '#1a2f4c' }}>Data Security</h2>
        <p style={{ marginBottom: '1.5rem', color: '#444' }}>
          {privacy?.security || 'We take appropriate technical and organizational measures to protect your personal information from unauthorized access, misuse, or disclosure.'}
        </p>

        <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 600, marginTop: '2.5rem', marginBottom: '1rem', color: '#1a2f4c' }}>Cookies &amp; Tracking</h2>
        <p style={{ marginBottom: '1.5rem', color: '#444' }}>
          {privacy?.cookies || 'Our website uses essential cookies to enhance your browsing experience, analyze traffic, and personalize content.'}
        </p>

        <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 600, marginTop: '2.5rem', marginBottom: '1rem', color: '#1a2f4c' }}>Your Rights</h2>
        <p style={{ marginBottom: '1.5rem', color: '#444' }}>
          {privacy?.rights || 'You retain full rights to request access, correction, or deletion of your personal records by contacting our team.'}
        </p>

        <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 600, marginTop: '2.5rem', marginBottom: '1rem', color: '#1a2f4c' }}>Contact Us</h2>
        <p style={{ marginBottom: '0.5rem', color: '#444' }}>If you have any questions about this Privacy Policy or how your data is handled, please contact us at:</p>
        <p style={{ marginBottom: '0.2rem' }}><strong>Email:</strong> {restaurant?.email || 'vcsramersham@gmail.com'}</p>
        <p style={{ marginBottom: '0.2rem' }}><strong>Phone:</strong> {restaurant?.phone || '+0149 497 2550'}</p>
        <p style={{ marginBottom: '2.5rem' }}><strong>Address:</strong> {restaurant?.address || '94, sycamore Road, Amersham, HP6 5EN.'}</p>
      </div>
    </div>
  );
}
