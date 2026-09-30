export const metadata = {
  title: 'Disclaimer - VCS Amersham',
  description: 'Disclaimer for Veg Chennai Srilalitha Amersham.',
};

export default function Disclaimer() {
  return (
    <div style={{ padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem)', backgroundColor: '#fff', color: '#111', fontFamily: 'inherit', lineHeight: '1.8' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1.5rem', color: '#1a2f4c' }}>Disclaimer</h1>

        <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem', color: '#1a2f4c' }}>Food Safety and Allergies</h2>
        <p style={{ marginBottom: '2.5rem' }}>
          We are committed to maintaining high standards of food safety and hygiene in the preparation of all our dishes. However, as our kitchen handles a variety of ingredients, we cannot guarantee that any item is completely free from allergens. Customers with food allergies or specific dietary requirements must inform us clearly at the time of ordering so that we can take appropriate precautions.
        </p>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1.5rem', color: '#1a2f4c' }}>Accuracy of Information</h2>
        <p style={{ marginBottom: '2.5rem' }}>
          We make every effort to ensure that the information provided on our website, including menu descriptions, pricing, and availability, is accurate and up to date. Nevertheless, we reserve the right to make changes at any time without prior notice.
        </p>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1.5rem', color: '#1a2f4c' }}>Third-Party Links</h2>
        <p style={{ marginBottom: '2.5rem' }}>
          Our website may include links to external websites for your convenience. Please note that we do not control and are not responsible for the content, policies, or practices of any third-party sites.
        </p>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1.5rem', color: '#1a2f4c' }}>Limitation of Liability</h2>
        <p style={{ marginBottom: '2.5rem' }}>
          To the fullest extent permitted by law, Veg Chennai Srilalitha shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of our website, ordering services, or consumption of our food products.
        </p>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1.5rem', color: '#1a2f4c' }}>Preparation & Delivery Times</h2>
        <p style={{ marginBottom: '2.5rem' }}>
          All preparation and delivery times provided are estimates only. While we strive to meet these timeframes, delays may occur due to factors beyond our control, including but not limited to traffic conditions, weather, or high demand periods.
        </p>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1.5rem', color: '#1a2f4c' }}>Food Images Disclaimer</h2>
        <p style={{ marginBottom: '2.5rem' }}>
          Images of food displayed on our website, menus, or promotional materials are for illustrative purposes only. Actual dishes may vary in appearance, portion size, and presentation due to factors such as ingredient availability, preparation methods, and seasonal variations.
        </p>
      </div>
    </div>
  );
}
