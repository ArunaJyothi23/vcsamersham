import OutdoorCateringContent from './OutdoorCateringContent';
import { getSiteContent } from '@/lib/firebaseService';
import { buildPageMetadata } from '@/lib/seoService';
import PageJsonLd from '@/components/PageJsonLd';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await getSiteContent();
  return buildPageMetadata('/outdoor-catering', siteContent);
}

export default async function OutdoorCateringPage() {
  const siteContent = await getSiteContent();
  return (
    <>
      <PageJsonLd route="/outdoor-catering" siteContent={siteContent} />
      <OutdoorCateringContent siteContent={siteContent} />
    </>
  );
}
