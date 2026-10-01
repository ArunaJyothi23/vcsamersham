import LiveDosaContent from './LiveDosaContent';
import { getSiteContent } from '@/lib/firebaseService';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await getSiteContent();
  const seo = siteContent?.seo?.liveDosaCatering;
  const title = seo?.title || 'Live Dosa Catering Buckinghamshire | Theatrical Live Stations';
  const description =
    seo?.description ||
    'Live Dosa catering counters with skilled chefs preparing fresh crispy dosas and vadas right in front of your guests.';
  const keywords = seo?.keywords ? seo.keywords.split(',').map((k: string) => k.trim()) : undefined;
  const canonical = seo?.canonical || '/live-dosa-catering';
  const ogImage = seo?.ogImage || '/images/long-dosa-feast.png';

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
      url: 'https://vcsamersham.co.uk/live-dosa-catering',
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

export default async function LiveDosaCatering() {
  const siteContent = await getSiteContent();
  return <LiveDosaContent siteContent={siteContent} />;
}

