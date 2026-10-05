import LiveDosaContent from './LiveDosaContent';
import { getSiteContent } from '@/lib/firebaseService';
import { buildPageMetadata } from '@/lib/seoService';
import PageJsonLd from '@/components/PageJsonLd';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await getSiteContent();
  return buildPageMetadata('/live-dosa-catering', siteContent);
}

export default async function LiveDosaCatering() {
  const siteContent = await getSiteContent();
  return (
    <>
      <PageJsonLd route="/live-dosa-catering" siteContent={siteContent} />
      <LiveDosaContent siteContent={siteContent} />
    </>
  );
}
