import type { MetadataRoute } from 'next';
import { getSiteContent } from '@/lib/firebaseService';
import { getDiscoveredPages, getGlobalSeo, getPageSeo, normalizeCanonicalUrl } from '@/lib/seoService';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Refresh sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const siteContent = await getSiteContent();
    const globalSeo = getGlobalSeo(siteContent);
    const baseUrl = globalSeo.siteUrl.replace(/\/$/, '');

    // Determine actual baseline modification date from content storage
    const contentDate = siteContent?.updatedAt
      ? new Date(siteContent.updatedAt)
      : new Date('2026-10-05T00:00:00.000Z');

    // Discover all pages (core + dynamic + custom)
    const discovered = getDiscoveredPages(siteContent);
    const entries: MetadataRoute.Sitemap = [];

    for (const page of discovered) {
      const pageSeo = getPageSeo(page.route, siteContent);

      // Exclude pages explicitly marked as NOINDEX or private
      if (pageSeo.robotsIndex === false) {
        continue;
      }
      if (page.route.startsWith('/admin') || page.route.startsWith('/api')) {
        continue;
      }

      // Priority and change frequency based on route importance
      let priority = 0.8;
      let changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly';

      if (page.route === '/') {
        priority = 1.0;
        changeFrequency = 'daily';
      } else if (page.route === '/outdoor-catering' || page.route === '/live-dosa-catering') {
        priority = 0.9;
        changeFrequency = 'weekly';
      } else if (page.route.includes('policy') || page.route.includes('disclaimer')) {
        priority = 0.3;
        changeFrequency = 'monthly';
      }

      const fullUrl = normalizeCanonicalUrl(`${baseUrl}${page.route === '/' ? '' : page.route}`, baseUrl);

      // Real lastModified date from page or content version
      const lastModified = pageSeo.updatedAt ? new Date(pageSeo.updatedAt) : contentDate;

      entries.push({
        url: fullUrl,
        lastModified,
        changeFrequency,
        priority,
      });
    }

    return entries;
  } catch (error) {
    console.error('Dynamic sitemap generation error:', error);
    const fallbackBase = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vcsamersham.co.uk').replace(/\/+$/, '');
    const fallbackDate = new Date('2026-10-05T00:00:00.000Z');
    return [
      { url: fallbackBase, lastModified: fallbackDate, priority: 1.0, changeFrequency: 'daily' },
      { url: `${fallbackBase}/outdoor-catering`, lastModified: fallbackDate, priority: 0.9, changeFrequency: 'weekly' },
      { url: `${fallbackBase}/live-dosa-catering`, lastModified: fallbackDate, priority: 0.9, changeFrequency: 'weekly' },
    ];
  }
}
