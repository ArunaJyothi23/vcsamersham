import { getSiteContent } from '@/lib/firebaseService';
import { buildPageMetadata } from '@/lib/seoService';
import PageJsonLd from '@/components/PageJsonLd';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const siteContent = await getSiteContent();
  return buildPageMetadata('/disclaimer', siteContent);
}

export default async function Disclaimer() {
  const siteContent = await getSiteContent();
  const disclaimer = siteContent?.legalPolicies?.disclaimer;

  return (
    <div style={{ padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem)', backgroundColor: '#FFFDF9', color: '#111', fontFamily: 'inherit', lineHeight: '1.8' }}>
      <PageJsonLd route="/disclaimer" siteContent={siteContent} />
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1.5rem', color: '#1a2f4c' }}>
          {disclaimer?.title || 'Disclaimer'}
        </h1>

        <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem', color: '#1a2f4c' }}>
          Food Safety and Allergies
        </h2>
        <p style={{ marginBottom: '2.5rem', color: '#444' }}>
          {disclaimer?.foodSafety ||
            'We are committed to maintaining high standards of food safety and hygiene in the preparation of all our dishes. However, as our kitchen handles a variety of ingredients, we cannot guarantee that any item is completely free from allergens. Customers with food allergies or specific dietary requirements must inform us clearly at the time of ordering so that we can take appropriate precautions.'}
        </p>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1.5rem', color: '#1a2f4c' }}>
          Accuracy of Information
        </h2>
        <p style={{ marginBottom: '2.5rem', color: '#444' }}>
          {disclaimer?.accuracy ||
            'We make every effort to ensure that the information provided on our website, including menu descriptions, pricing, and availability, is accurate and up to date. Nevertheless, we reserve the right to make changes at any time without prior notice.'}
        </p>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1.5rem', color: '#1a2f4c' }}>
          Limitation of Liability
        </h2>
        <p style={{ marginBottom: '2.5rem', color: '#444' }}>
          {disclaimer?.liability ||
            'To the fullest extent permitted by law, Veg Chennai Srilalitha shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of our website, ordering services, or consumption of our food products.'}
        </p>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1.5rem', color: '#1a2f4c' }}>
          Preparation &amp; Delivery Times
        </h2>
        <p style={{ marginBottom: '2.5rem', color: '#444' }}>
          {disclaimer?.timings ||
            'All preparation and delivery times provided are estimates only. While we strive to meet these timeframes, delays may occur due to factors beyond our control, including but not limited to traffic conditions, weather, or high demand periods.'}
        </p>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1.5rem', color: '#1a2f4c' }}>
          Food Images Disclaimer
        </h2>
        <p style={{ marginBottom: '2.5rem', color: '#444' }}>
          {disclaimer?.foodImages ||
            'Images of food displayed on our website, menus, or promotional materials are for illustrative purposes only. Actual dishes may vary in appearance, portion size, and presentation due to factors such as ingredient availability, preparation methods, and seasonal variations.'}
        </p>
      </div>
    </div>
  );
}
