import type { MetadataRoute } from 'next';
import { getSiteContent } from '@/lib/firebaseService';
import { getGlobalSeo } from '@/lib/seoService';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let baseUrl = 'https://vcsamersham.co.uk';
  let defaultIndex = true;

  try {
    const siteContent = await getSiteContent();
    const globalSeo = getGlobalSeo(siteContent);
    baseUrl = globalSeo.siteUrl.replace(/\/$/, '');
    defaultIndex = globalSeo.defaultRobotsIndex !== false;
  } catch (err) {
    console.error('Robots generation error:', err);
  }

  // If entire site defaultRobotsIndex is turned off by admin
  if (!defaultIndex) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
      sitemap: `${baseUrl}/sitemap.xml`,
      host: baseUrl,
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Protect private admin and backend APIs; do NOT block /_next/ so crawlers can render CSS & JS
        disallow: ['/admin', '/admin/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
