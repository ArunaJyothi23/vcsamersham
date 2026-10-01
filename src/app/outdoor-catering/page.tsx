import OutdoorCateringContent from './OutdoorCateringContent';
import { getSiteContent } from '@/lib/firebaseService';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await getSiteContent();
  const seo = siteContent?.seo?.outdoorCatering;
  const title = seo?.title || 'Outdoor Indian Catering Amersham & Buckinghamshire | VCS';
  const description =
    seo?.description ||
    'Authentic South Indian vegetarian catering for weddings, parties, corporate events, and celebrations across Buckinghamshire.';
  const keywords = seo?.keywords ? seo.keywords.split(',').map((k: string) => k.trim()) : undefined;
  const canonical = seo?.canonical || '/outdoor-catering';
  const ogImage = seo?.ogImage || '/images/3d/restaurant-feast-3d.jpg';

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
      url: 'https://vcsamersham.co.uk/outdoor-catering',
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

