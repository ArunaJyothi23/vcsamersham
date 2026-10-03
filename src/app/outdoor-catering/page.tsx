import OutdoorCateringContent from './OutdoorCateringContent';
import { getSiteContent } from '@/lib/firebaseService';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await getSiteContent();
  const seo = siteContent?.seo?.outdoorCatering;
  const title = seo?.title || 'Outdoor Catering | Veg Chennai Srilalitha Amersham';
  const description =
    seo?.description ||
    'Authentic 100% Pure Vegetarian Catering Authentic 100% vegetarian catering in UK, backed by 21+ years of experience. Proud to have catered to all the VIPs and VVIPs of Indian origin across the UK.';
  const keywords = seo?.keywords ? seo.keywords.split(',').map((k: string) => k.trim()) : undefined;
  const canonical = seo?.canonical || 'https://vcsamersham.co.uk/outdoor-catering/';
  const ogImage = seo?.ogImage || '/images/migrated/WhatsApp-Image-2025-11-01-at-15.41.07-2.jpeg';

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: 'https://vcsamersham.co.uk/outdoor-catering/',
      siteName: 'Veg Chennai Srilalitha Amersham',
      locale: 'en_GB',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function OutdoorCateringPage() {
  const siteContent = await getSiteContent();
  return <OutdoorCateringContent siteContent={siteContent} />;
}

