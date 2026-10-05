import { Metadata } from 'next';
import migratedContent from '../data/migrated_content.json';

export interface PageSEO {
  id: string; // Identifier key, e.g. "home", "outdoor-catering", or route
  route: string; // Route path, e.g. "/", "/outdoor-catering"
  pageName: string; // Human readable name
  
  // Basic SEO
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string;
  canonicalUrl?: string;

  // Robots
  robotsIndex?: boolean; // default true
  robotsFollow?: boolean; // default true

  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'restaurant' | 'profile';
  ogUrl?: string;

  // Twitter / X
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';

  // Structured Data
  schemaType?: 'None' | 'WebPage' | 'Restaurant' | 'LocalBusiness' | 'Organization' | 'Article' | 'Service' | 'FAQPage' | 'BreadcrumbList' | 'Custom';
  customSchemaJson?: string;

  // Primary H1 Headline Reference
  h1?: string;

  // Last modified timestamp
  updatedAt?: string;

  // Legacy field support
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  url?: string;
}

export interface RedirectRule {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302;
  createdAt: string;
}

export interface GlobalSEO {
  siteName: string;
  siteUrl: string;
  titleSeparator: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage: string;
  faviconUrl: string;
  defaultRobotsIndex: boolean;
  defaultRobotsFollow: boolean;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  organization?: {
    name?: string;
    type?: string;
    logo?: string;
    phone?: string;
    email?: string;
    address?: string;
    priceRange?: string;
  };
  socialProfiles?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export type MetaStatus = 'Good' | 'Warning' | 'Critical';

export interface SEOValidationIssue {
  field: string;
  severity: 'error' | 'warning' | 'info';
  status?: MetaStatus;
  message: string;
}

export interface PageSEOEvaluation {
  status: 'Complete' | 'Needs Attention' | 'Missing';
  issues: SEOValidationIssue[];
  titleLength: number;
  descriptionLength: number;
  titleStatus: MetaStatus;
  descriptionStatus: MetaStatus;
  canonicalStatus: MetaStatus;
  robotsStatus: MetaStatus;
  schemaStatus: MetaStatus;
  effectiveTitle: string;
  effectiveDescription: string;
  effectiveCanonical: string;
  effectiveOgImage: string;
  effectiveTwitterImage: string;
  effectiveTwitterDescription: string;
  robotsSummary: string;
}

export interface ImageAuditResult {
  url: string;
  altText: string;
  source: string;
  status: 'Good' | 'Warning' | 'Critical';
  issues: string[];
  dimensions?: string;
  format?: string;
}

export interface WebsiteImageAudit {
  totalScanned: number;
  goodCount: number;
  warningCount: number;
  criticalCount: number;
  images: ImageAuditResult[];
}

export interface RedirectProblem {
  type: 'self' | 'loop' | 'chain' | 'invalid_source' | 'invalid_target';
  severity: 'error' | 'warning';
  message: string;
  fromPath: string;
  toPath: string;
}

export interface SEODashboardStats {
  totalPages: number;
  completePages: number;
  needsAttentionPages: number;
  missingPages: number;

  // Specific diagnostic listings
  missingTitles: { route: string; pageName: string }[];
  missingDescriptions: { route: string; pageName: string }[];
  duplicateTitles: { title: string; pages: string[] }[];
  duplicateDescriptions: { description: string; pages: string[] }[];
  missingOrInvalidCanonicals: { route: string; pageName: string; reason: string }[];
  missingOgImages: { route: string; pageName: string }[];
  invalidJsonLdPages: { route: string; pageName: string; error: string }[];
  noindexPages: { route: string; pageName: string; isCorePage: boolean }[];
  orphanPages: { route: string; pageName: string }[];
  brokenOr404Urls: { route: string; reason: string }[];
  redirectProblems: RedirectProblem[];
  sitemapProblems: string[];
  robotsProblems: string[];

  // Counts & stats
  noindexPagesCount: number;
  missingCanonicalCount: number;
  missingOgImageCount: number;
  orphanPagesCount: number;
  redirectCount: number;
  imageAudit: WebsiteImageAudit;
}

/**
 * Standard known routes for the website.
 */
export const CORE_PAGES: Array<{ id: string; route: string; pageName: string; defaultSchema: PageSEO['schemaType'] }> = [
  { id: 'home', route: '/', pageName: 'Home', defaultSchema: 'Restaurant' },
  { id: 'outdoorCatering', route: '/outdoor-catering', pageName: 'Outdoor Catering', defaultSchema: 'Service' },
  { id: 'liveDosaCatering', route: '/live-dosa-catering', pageName: 'Live Dosa Catering', defaultSchema: 'Service' },
  { id: 'privacyPolicy', route: '/privacy-policy', pageName: 'Privacy Policy', defaultSchema: 'WebPage' },
  { id: 'cookiesPolicy', route: '/cookies-policy', pageName: 'Cookies Policy', defaultSchema: 'WebPage' },
  { id: 'disclaimer', route: '/disclaimer', pageName: 'Disclaimer', defaultSchema: 'WebPage' },
];

/**
 * Known navigation links from Header and Footer
 */
export const MAIN_NAV_LINKS = new Set([
  '/',
  '/#menu',
  '/#contact',
  '/#about',
  '/outdoor-catering',
  '/live-dosa-catering',
  '/privacy-policy',
  '/cookies-policy',
  '/disclaimer',
]);

/**
 * Normalizes canonical URLs:
 * - Ensures absolute URL format with correct scheme
 * - Strips query parameters and URL hash fragments
 * - Enforces consistent non-trailing slash convention (except root /)
 */
export function normalizeCanonicalUrl(url: string, baseUrl: string): string {
  const cleanBase = (baseUrl || '').trim().replace(/\/+$/, '');
  if (!url || !url.trim()) return cleanBase;
  let target = url.trim();

  // If relative path
  if (target.startsWith('/')) {
    target = target === '/' ? cleanBase : `${cleanBase}${target}`;
  }

  try {
    const parsed = new URL(target);
    parsed.search = '';
    parsed.hash = '';
    let pathname = parsed.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.replace(/\/+$/, '');
    }
    parsed.pathname = pathname;
    // Next.js standard URL convention does not use trailing slashes on routes or domain root
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return target.replace(/\/+$/, '');
  }
}

/**
 * Discover all public routes in the website dynamically.
 */
export function getDiscoveredPages(siteContent?: any): Array<{ id: string; route: string; pageName: string; defaultSchema: PageSEO['schemaType'] }> {
  const pages = [...CORE_PAGES];
  const knownRoutes = new Set(pages.map(p => p.route));

  // Check migrated content pages if available
  try {
    const data = migratedContent as any;
    if (Array.isArray(data?.pages)) {
      for (const pg of data.pages) {
        const route = `/${pg.slug}`;
        // Avoid duplicate routes or home aliases
        if (
          !knownRoutes.has(route) &&
          !['/home', '/hom', '/home2', '/home-2'].includes(route) &&
          pg.slug
        ) {
          pages.push({
            id: pg.slug,
            route,
            pageName: pg.title || pg.slug,
            defaultSchema: 'Article',
          });
          knownRoutes.add(route);
        }
      }
    }
  } catch {
    // Non-blocking fallback
  }

  // Also include any custom pages saved in siteContent.seo or siteContent.seoPages
  const seoSource = siteContent?.seo || siteContent?.seoPages || {};
  for (const key of Object.keys(seoSource)) {
    const item = seoSource[key];
    const route = item?.route || (key.startsWith('/') ? key : undefined);
    if (route && !knownRoutes.has(route)) {
      pages.push({
        id: key,
        route,
        pageName: item.pageName || key,
        defaultSchema: item.schemaType || 'WebPage',
      });
      knownRoutes.add(route);
    }
  }

  return pages;
}

/**
 * Returns generic global SEO defaults combined with site content.
 */
export function getGlobalSeo(siteContent?: any): GlobalSEO {
  const existingGlobal = siteContent?.globalSeo || {};
  const restaurant = siteContent?.restaurant || {};

  const siteName =
    existingGlobal.siteName ||
    restaurant.name ||
    'Veg Chennai Srilalitha';

  const siteUrl =
    existingGlobal.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://vcsamersham.co.uk';

  return {
    siteName,
    siteUrl: siteUrl.replace(/\/$/, ''),
    titleSeparator: existingGlobal.titleSeparator || ' | ',
    defaultTitle:
      existingGlobal.defaultTitle ||
      `${siteName} | South Indian Vegetarian Restaurant Amersham`,
    defaultDescription:
      existingGlobal.defaultDescription ||
      restaurant.tagline ||
      'Top-rated South Indian Vegetarian Dining in Amersham. Authentic Dosas, Thalis & Premier Outdoor Catering.',
    defaultOgImage:
      existingGlobal.defaultOgImage ||
      '/images/migrated/vcs-authentic-south-indian-feast.jpeg',
    faviconUrl: existingGlobal.faviconUrl || '/icon.jpeg',
    defaultRobotsIndex:
      existingGlobal.defaultRobotsIndex !== undefined
        ? existingGlobal.defaultRobotsIndex
        : true,
    defaultRobotsFollow:
      existingGlobal.defaultRobotsFollow !== undefined
        ? existingGlobal.defaultRobotsFollow
        : true,
    googleSiteVerification: existingGlobal.googleSiteVerification || '',
    bingSiteVerification: existingGlobal.bingSiteVerification || '',
    organization: {
      name: existingGlobal.organization?.name || siteName,
      type: existingGlobal.organization?.type || 'Organization',
      logo:
        existingGlobal.organization?.logo ||
        '/images/migrated/vcs-amersham-round-logo.webp',
      phone: existingGlobal.organization?.phone || restaurant.phone || '+44 1494 972550',
      email: existingGlobal.organization?.email || restaurant.email || 'vcsramersham@gmail.com',
      address:
        existingGlobal.organization?.address ||
        restaurant.address ||
        '94 Sycamore Road, Amersham, HP6 5EN, UK',
      priceRange: existingGlobal.organization?.priceRange || '££',
    },
    socialProfiles: {
      facebook: existingGlobal.socialProfiles?.facebook || '',
      instagram: existingGlobal.socialProfiles?.instagram || '',
      twitter: existingGlobal.socialProfiles?.twitter || '',
      youtube: existingGlobal.socialProfiles?.youtube || '',
      linkedin: existingGlobal.socialProfiles?.linkedin || '',
    },
  };
}

/**
 * Normalizes page key or route into standard lookup keys
 */
export function getLookupKeys(routeOrId: string): string[] {
  const clean = routeOrId.trim();
  const keys = [clean];
  if (clean === '/' || clean === 'home') {
    keys.push('home', '/');
  } else if (clean.startsWith('/')) {
    const withoutSlash = clean.slice(1);
    keys.push(withoutSlash);
    // Camel case variant (e.g. "outdoor-catering" -> "outdoorCatering")
    const camel = withoutSlash.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
    keys.push(camel);
  } else {
    keys.push(`/${clean}`);
    const kebab = clean.replace(/([A-Z])/g, '-$1').toLowerCase();
    keys.push(kebab, `/${kebab}`);
  }
  return Array.from(new Set(keys));
}

/**
 * Retrieves effective SEO for a specific page route or id.
 */
export function getPageSeo(routeOrId: string, siteContent?: any): PageSEO {
  const globalSeo = getGlobalSeo(siteContent);
  const seoSource = siteContent?.seo || siteContent?.seoPages || {};
  const lookupKeys = getLookupKeys(routeOrId);

  let rawPageData: any = null;
  for (const k of lookupKeys) {
    if (seoSource[k]) {
      rawPageData = seoSource[k];
      break;
    }
  }

  // Find discovered page info for canonical & name defaults
  const allDiscovered = getDiscoveredPages(siteContent);
  const discovered = allDiscovered.find(
    (p) => p.id === routeOrId || p.route === routeOrId || lookupKeys.includes(p.id) || lookupKeys.includes(p.route)
  );

  const route = rawPageData?.route || discovered?.route || (routeOrId.startsWith('/') ? routeOrId : `/${routeOrId}`);
  const id = discovered?.id || routeOrId;
  const pageName = rawPageData?.pageName || discovered?.pageName || id;

  // Title with legacy fallback
  const seoTitle = rawPageData?.seoTitle || rawPageData?.title || '';
  // Description with legacy fallback
  const metaDescription = rawPageData?.metaDescription || rawPageData?.description || '';
  // Keywords
  const focusKeyword = rawPageData?.focusKeyword || '';
  const secondaryKeywords = rawPageData?.secondaryKeywords || rawPageData?.keywords || '';
  
  // Canonical URL normalized
  const rawCanonical = rawPageData?.canonicalUrl || rawPageData?.canonical;
  const canonicalUrl = normalizeCanonicalUrl(
    rawCanonical || `${globalSeo.siteUrl}${route === '/' ? '' : route}`,
    globalSeo.siteUrl
  );

  // Robots
  const robotsIndex =
    rawPageData?.robotsIndex !== undefined
      ? Boolean(rawPageData.robotsIndex)
      : globalSeo.defaultRobotsIndex;

  const robotsFollow =
    rawPageData?.robotsFollow !== undefined
      ? Boolean(rawPageData.robotsFollow)
      : globalSeo.defaultRobotsFollow;

  // Open Graph
  const ogTitle = rawPageData?.ogTitle || seoTitle || globalSeo.defaultTitle;
  const ogDescription = rawPageData?.ogDescription || metaDescription || globalSeo.defaultDescription;
  const ogImage = rawPageData?.ogImage || globalSeo.defaultOgImage;
  const ogType = rawPageData?.ogType || 'website';
  const ogUrl = rawPageData?.ogUrl ? normalizeCanonicalUrl(rawPageData.ogUrl, globalSeo.siteUrl) : canonicalUrl;

  // Twitter
  const twitterTitle = rawPageData?.twitterTitle || ogTitle;
  const twitterDescription = rawPageData?.twitterDescription || ogDescription;
  const twitterImage = rawPageData?.twitterImage || ogImage;
  const twitterCard = rawPageData?.twitterCard || 'summary_large_image';

  // Structured Data
  const schemaType = rawPageData?.schemaType || discovered?.defaultSchema || 'WebPage';
  const customSchemaJson = rawPageData?.customSchemaJson || '';
  const h1 = rawPageData?.h1 || '';
  const updatedAt = rawPageData?.updatedAt || siteContent?.updatedAt || undefined;

  return {
    id,
    route,
    pageName,
    seoTitle,
    metaDescription,
    focusKeyword,
    secondaryKeywords,
    canonicalUrl,
    robotsIndex,
    robotsFollow,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    ogUrl,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterCard,
    schemaType,
    customSchemaJson,
    h1,
    updatedAt,
    // Keep legacy aliases for seamless backward compatibility
    title: seoTitle,
    description: metaDescription,
    keywords: secondaryKeywords,
    canonical: canonicalUrl,
    url: route,
  };
}

/**
 * Audits all prominent images used across website content for SEO best practices:
 * Meaningful alt text, WebP/AVIF modern compression, dimension suitability, and OG sizing.
 */
export function auditWebsiteImages(siteContent?: any): WebsiteImageAudit {
  const images: ImageAuditResult[] = [];
  const scannedUrls = new Set<string>();

  function registerImage(url: string | undefined, alt: string | undefined, source: string, expectedDimensions?: string) {
    if (!url || typeof url !== 'string' || !url.trim() || scannedUrls.has(url.trim())) return;
    const cleanUrl = url.trim();
    scannedUrls.add(cleanUrl);

    const issues: string[] = [];
    let status: MetaStatus = 'Good';

    // 1. Alt Text Assessment
    const cleanAlt = (alt || '').trim();
    if (!cleanAlt) {
      status = 'Critical';
      issues.push('Missing Alt Text — search engines and screen readers cannot discern image content.');
    } else if (cleanAlt.length < 4 || /^(image|photo|pic|img|banner|untitled|dsc_)/i.test(cleanAlt)) {
      status = 'Warning';
      issues.push(`Generic Alt Text ("${cleanAlt}") — provide descriptive, context-specific description.`);
    }

    // 2. Format Assessment
    const ext = cleanUrl.split('?')[0].split('.').pop()?.toLowerCase();
    const isModern = ext === 'webp' || ext === 'avif' || ext === 'svg';
    if (!isModern && (ext === 'jpg' || ext === 'jpeg' || ext === 'png')) {
      if (status === 'Good') status = 'Warning';
      issues.push(`Legacy Format (.${ext}) — converting to WebP or AVIF improves page load speed and Core Web Vitals.`);
    }

    // 3. Recommended Dimensions
    if (expectedDimensions) {
      issues.push(`Recommended Target Dimensions: ${expectedDimensions}`);
    }

    images.push({
      url: cleanUrl,
      altText: cleanAlt,
      source,
      status,
      issues,
      format: ext ? ext.toUpperCase() : 'UNKNOWN',
      dimensions: expectedDimensions,
    });
  }

  // Hero & Brand assets
  const globalSeo = siteContent?.globalSeo || {};
  registerImage(globalSeo.defaultOgImage, 'Social Share Card Preview', 'Global SEO Default Open Graph Image', '1200 x 630 px');
  registerImage(globalSeo.organization?.logo, globalSeo.siteName || 'Brand Logo', 'Organization Identity Logo', '512 x 512 px');
  registerImage(siteContent?.hero?.backgroundImage, siteContent?.hero?.title || 'Hero Background Feast', 'Homepage Hero Banner', '1920 x 1080 px');
  registerImage(siteContent?.about?.image, 'About Restaurant Dining Atmosphere', 'About Section Image', '800 x 600 px');
  registerImage(siteContent?.catering?.outdoorImage, 'Premier Outdoor Catering Display', 'Outdoor Catering Banner', '1200 x 800 px');
  registerImage(siteContent?.catering?.liveDosaImage, 'Fresh Live Dosa Catering Station', 'Live Dosa Banner', '1200 x 800 px');

  // Menu Category Dishes
  const categories = siteContent?.menu?.categories || [];
  for (const cat of categories) {
    for (const item of cat.items || []) {
      if (item.image) {
        registerImage(item.image, item.name, `Menu Dish: ${item.name}`, '600 x 600 px');
      }
    }
  }

  let goodCount = 0;
  let warningCount = 0;
  let criticalCount = 0;

  for (const img of images) {
    if (img.status === 'Good') goodCount++;
    else if (img.status === 'Warning') warningCount++;
    else criticalCount++;
  }

  return {
    totalScanned: images.length,
    goodCount,
    warningCount,
    criticalCount,
    images,
  };
}

/**
 * Analyzes existing redirect rules to prevent self-redirects, infinite loops, and redirect chains.
 */
export function detectRedirectProblems(rules: RedirectRule[]): RedirectProblem[] {
  const problems: RedirectProblem[] = [];
  const ruleMap = new Map<string, RedirectRule>();

  for (const r of rules) {
    const from = r.fromPath.trim().replace(/\/$/, '') || '/';
    const to = r.toPath.trim().replace(/\/$/, '') || '/';

    // 1. Invalid path formats
    if (!r.fromPath.startsWith('/')) {
      problems.push({
        type: 'invalid_source',
        severity: 'error',
        message: `Invalid source URL "${r.fromPath}": Must start with a forward slash (/).`,
        fromPath: r.fromPath,
        toPath: r.toPath,
      });
    }

    if (!r.toPath.startsWith('/') && !r.toPath.startsWith('http://') && !r.toPath.startsWith('https://')) {
      problems.push({
        type: 'invalid_target',
        severity: 'error',
        message: `Invalid target URL "${r.toPath}": Must begin with / or https://.`,
        fromPath: r.fromPath,
        toPath: r.toPath,
      });
    }

    // 2. Self redirect
    if (from === to) {
      problems.push({
        type: 'self',
        severity: 'error',
        message: `Self-redirect detected: "${from}" redirects to itself.`,
        fromPath: r.fromPath,
        toPath: r.toPath,
      });
    }

    // 3. Direct circular loop (A -> B and B -> A)
    const existing = ruleMap.get(to);
    if (existing && existing.toPath.trim().replace(/\/$/, '') === from) {
      problems.push({
        type: 'loop',
        severity: 'error',
        message: `Circular redirect loop detected: "${from}" <-> "${to}".`,
        fromPath: r.fromPath,
        toPath: r.toPath,
      });
    }

    // 4. Redirect chain (A -> B where B -> C already exists)
    const chainTarget = ruleMap.get(to);
    if (chainTarget) {
      problems.push({
        type: 'chain',
        severity: 'warning',
        message: `Redirect chain detected: "${from}" -> "${to}" -> "${chainTarget.toPath}". Point directly to "${chainTarget.toPath}" to eliminate extra hops.`,
        fromPath: r.fromPath,
        toPath: r.toPath,
      });
    }

    ruleMap.set(from, r);
  }

  return problems;
}

/**
 * Validates a single page's SEO configuration and compares with all pages for duplicate checks.
 * Uses Good / Warning / Critical status tiers.
 * Character length counts are treated as recommendations, not hard requirements that make a page incomplete.
 */
export function evaluatePageSeo(page: PageSEO, allPages: PageSEO[] = []): PageSEOEvaluation {
  const issues: SEOValidationIssue[] = [];
  const title = (page.seoTitle || page.title || '').trim();
  const desc = (page.metaDescription || page.description || '').trim();
  const canonical = (page.canonicalUrl || page.canonical || '').trim();
  const focus = (page.focusKeyword || '').trim().toLowerCase();
  const ogImage = (page.ogImage || '').trim();
  const twitterImage = (page.twitterImage || ogImage).trim();
  const twitterDesc = (page.twitterDescription || desc).trim();

  let titleStatus: MetaStatus = 'Good';
  let descriptionStatus: MetaStatus = 'Good';
  let canonicalStatus: MetaStatus = 'Good';
  let robotsStatus: MetaStatus = 'Good';
  let schemaStatus: MetaStatus = 'Good';

  // 1. Title Checks
  const titleLength = title.length;
  if (!title) {
    titleStatus = 'Critical';
    issues.push({
      field: 'seoTitle',
      severity: 'error',
      status: 'Critical',
      message: 'Page is missing an SEO title. Search engines may generate an arbitrary title.',
    });
  } else if (titleLength < 25) {
    titleStatus = 'Warning';
    issues.push({
      field: 'seoTitle',
      severity: 'info',
      status: 'Warning',
      message: `SEO title is short (${titleLength} chars). 50–60 characters is recommended as a general guideline.`,
    });
  } else if (titleLength > 70) {
    titleStatus = 'Warning';
    issues.push({
      field: 'seoTitle',
      severity: 'info',
      status: 'Warning',
      message: `SEO title is ${titleLength} characters. Google desktop SERPs generally display ~60 characters.`,
    });
  } else {
    titleStatus = 'Good';
  }

  // 2. Meta Description Checks (150–160 chars recommended guideline)
  const descriptionLength = desc.length;
  if (!desc) {
    descriptionStatus = 'Critical';
    issues.push({
      field: 'metaDescription',
      severity: 'error',
      status: 'Critical',
      message: 'Page is missing a meta description. Search engines will pull random page body snippets.',
    });
  } else if (descriptionLength < 70) {
    descriptionStatus = 'Warning';
    issues.push({
      field: 'metaDescription',
      severity: 'info',
      status: 'Warning',
      message: `Meta description is short (${descriptionLength} chars). 120–160 characters is recommended for optimal search snippets.`,
    });
  } else if (descriptionLength > 175) {
    descriptionStatus = 'Warning';
    issues.push({
      field: 'metaDescription',
      severity: 'info',
      status: 'Warning',
      message: `Meta description is ${descriptionLength} characters. Google search snippets typically truncate after ~160 characters.`,
    });
  } else {
    descriptionStatus = 'Good';
  }

  // 3. Focus Keyword checks
  if (focus) {
    if (!title.toLowerCase().includes(focus)) {
      issues.push({
        field: 'focusKeyword',
        severity: 'info',
        status: 'Warning',
        message: `Focus keyword "${page.focusKeyword}" is not included in the SEO title.`,
      });
    }
    if (!desc.toLowerCase().includes(focus)) {
      issues.push({
        field: 'focusKeyword',
        severity: 'info',
        status: 'Warning',
        message: `Focus keyword "${page.focusKeyword}" is not included in the meta description.`,
      });
    }
  }

  // 4. Canonical URL Checks
  if (!canonical) {
    canonicalStatus = 'Critical';
    issues.push({
      field: 'canonicalUrl',
      severity: 'error',
      status: 'Critical',
      message: 'Canonical URL is missing. A valid canonical tag is required to prevent duplicate content indexing.',
    });
  } else if (!canonical.startsWith('http://') && !canonical.startsWith('https://')) {
    canonicalStatus = 'Critical';
    issues.push({
      field: 'canonicalUrl',
      severity: 'error',
      status: 'Critical',
      message: 'Canonical URL must be an absolute URL starting with https://.',
    });
  } else if (canonical.length > 8 && canonical.endsWith('/')) {
    issues.push({
      field: 'canonicalUrl',
      severity: 'warning',
      status: 'Warning',
      message: 'Canonical URL has a trailing slash (/). Next.js standard URL convention does not use trailing slashes.',
    });
  } else {
    canonicalStatus = 'Good';
  }

  // Detect inappropriate cross-page canonical
  if (canonical && allPages.length > 0) {
    const dupCanonicalPages = allPages.filter(
      (p) => p.route !== page.route && (p.canonicalUrl || p.canonical || '').trim().toLowerCase() === canonical.toLowerCase()
    );
    if (dupCanonicalPages.length > 0 && page.route !== '/') {
      issues.push({
        field: 'canonicalUrl',
        severity: 'warning',
        status: 'Warning',
        message: `Shared Canonical: Pointing to the same canonical URL as ${dupCanonicalPages.map(p => p.route).join(', ')}. Confirm this is intentional consolidation.`,
      });
    }
  }

  // 5. Open Graph Image & Twitter
  if (!ogImage) {
    issues.push({
      field: 'ogImage',
      severity: 'warning',
      status: 'Warning',
      message: 'Missing Open Graph (social share) image. Recommended size: 1200 x 630 pixels.',
    });
  }

  // 6. Robots / Indexing Controls & Accidental Noindex Protection
  const isCorePage = CORE_PAGES.some((c) => c.route === page.route) || page.route === '/';
  if (page.robotsIndex === false) {
    if (isCorePage) {
      robotsStatus = 'Critical';
      issues.push({
        field: 'robotsIndex',
        severity: 'error',
        status: 'Critical',
        message: `CRITICAL ACCIDENTAL NOINDEX: Core public route (${page.route}) is set to NOINDEX! This blocks Google from indexing this page in search results.`,
      });
    } else {
      robotsStatus = 'Warning';
      issues.push({
        field: 'robotsIndex',
        severity: 'warning',
        status: 'Warning',
        message: 'Robots is set to NOINDEX. This page is blocked from search engine indexing.',
      });
    }
  } else {
    robotsStatus = 'Good';
  }

  // 7. Duplicate Checks Against Other Pages
  if (title && allPages.length > 0) {
    const dupTitlePages = allPages.filter(
      (p) => p.route !== page.route && (p.seoTitle || p.title || '').trim().toLowerCase() === title.toLowerCase()
    );
    if (dupTitlePages.length > 0) {
      titleStatus = 'Critical';
      issues.push({
        field: 'seoTitle',
        severity: 'error',
        status: 'Critical',
        message: `Duplicate SEO Title! Identical title is used on: ${dupTitlePages.map(p => p.route).join(', ')}.`,
      });
    }
  }

  if (desc && allPages.length > 0) {
    const dupDescPages = allPages.filter(
      (p) => p.route !== page.route && (p.metaDescription || p.description || '').trim().toLowerCase() === desc.toLowerCase()
    );
    if (dupDescPages.length > 0) {
      issues.push({
        field: 'metaDescription',
        severity: 'warning',
        status: 'Warning',
        message: `Duplicate Meta Description! Shared with: ${dupDescPages.map(p => p.route).join(', ')}.`,
      });
    }
  }

  // 8. Structured Data Validation
  if (page.schemaType === 'Organization') {
    schemaStatus = 'Warning';
    issues.push({
      field: 'schemaType',
      severity: 'warning',
      status: 'Warning',
      message: 'Organization schema is already emitted globally in layout.tsx. Use WebPage, Restaurant, or Service on page level.',
    });
  } else if (page.schemaType === 'Custom' && page.customSchemaJson && page.customSchemaJson.trim()) {
    try {
      const parsed = JSON.parse(page.customSchemaJson.trim());
      if (!parsed['@context'] || !parsed['@type']) {
        schemaStatus = 'Warning';
        issues.push({
          field: 'customSchemaJson',
          severity: 'warning',
          status: 'Warning',
          message: 'Custom JSON-LD schema is missing standard "@context" or "@type" attributes.',
        });
      } else {
        schemaStatus = 'Good';
      }
    } catch {
      schemaStatus = 'Critical';
      issues.push({
        field: 'customSchemaJson',
        severity: 'error',
        status: 'Critical',
        message: 'Custom JSON-LD schema contains invalid JSON syntax. Search engines will reject this schema.',
      });
    }
  } else {
    schemaStatus = 'Good';
  }

  // Determine SEO Status:
  // Character count guidelines (50-60 title, 150-160 desc) alone DO NOT make a page incomplete.
  // Only genuine Critical/Error issues (missing title/desc, invalid canonical, accidental noindex, duplicate title, broken schema) require attention.
  const hasCriticalIssue =
    !title ||
    !desc ||
    canonicalStatus === 'Critical' ||
    robotsStatus === 'Critical' ||
    schemaStatus === 'Critical' ||
    issues.some((i) => i.severity === 'error');

  let status: 'Complete' | 'Needs Attention' | 'Missing' = 'Complete';
  if (!title && !desc) {
    status = 'Missing';
  } else if (hasCriticalIssue) {
    status = 'Needs Attention';
  } else {
    status = 'Complete';
  }

  const robotsSummary = `${page.robotsIndex !== false ? 'Index' : 'Noindex'}, ${page.robotsFollow !== false ? 'Follow' : 'Nofollow'}`;

  return {
    status,
    issues,
    titleLength,
    descriptionLength,
    titleStatus,
    descriptionStatus,
    canonicalStatus,
    robotsStatus,
    schemaStatus,
    effectiveTitle: title || 'Title Not Configured',
    effectiveDescription: desc || 'Description Not Configured',
    effectiveCanonical: canonical,
    effectiveOgImage: ogImage,
    effectiveTwitterImage: twitterImage,
    effectiveTwitterDescription: twitterDesc,
    robotsSummary,
  };
}

/**
 * Calculates global SEO dashboard statistics across all pages, including comprehensive issue audits.
 */
export function calculateSeoDashboard(allPages: PageSEO[], siteContent?: any): SEODashboardStats {
  let completePages = 0;
  let needsAttentionPages = 0;
  let missingPages = 0;
  let noindexCount = 0;
  let missingCanonicalCount = 0;
  let missingOgImageCount = 0;

  const missingTitles: { route: string; pageName: string }[] = [];
  const missingDescriptions: { route: string; pageName: string }[] = [];
  const missingOrInvalidCanonicals: { route: string; pageName: string; reason: string }[] = [];
  const missingOgImages: { route: string; pageName: string }[] = [];
  const invalidJsonLdPages: { route: string; pageName: string; error: string }[] = [];
  const noindexPages: { route: string; pageName: string; isCorePage: boolean }[] = [];
  const orphanPages: { route: string; pageName: string }[] = [];
  const brokenOr404Urls: { route: string; reason: string }[] = [];

  const titleMap = new Map<string, string[]>();
  const descMap = new Map<string, string[]>();

  for (const page of allPages) {
    const evaluation = evaluatePageSeo(page, allPages);
    if (evaluation.status === 'Complete') completePages++;
    else if (evaluation.status === 'Needs Attention') needsAttentionPages++;
    else missingPages++;

    const t = (page.seoTitle || page.title || '').trim();
    if (!t) {
      missingTitles.push({ route: page.route, pageName: page.pageName });
    } else {
      const existing = titleMap.get(t.toLowerCase()) || [];
      existing.push(page.route || page.id);
      titleMap.set(t.toLowerCase(), existing);
    }

    const d = (page.metaDescription || page.description || '').trim();
    if (!d) {
      missingDescriptions.push({ route: page.route, pageName: page.pageName });
    } else {
      const existing = descMap.get(d.toLowerCase()) || [];
      existing.push(page.route || page.id);
      descMap.set(d.toLowerCase(), existing);
    }

    // Canonical
    const c = (page.canonicalUrl || page.canonical || '').trim();
    if (!c) {
      missingCanonicalCount++;
      missingOrInvalidCanonicals.push({ route: page.route, pageName: page.pageName, reason: 'Missing canonical URL' });
    } else if (!c.startsWith('https://') && !c.startsWith('http://')) {
      missingCanonicalCount++;
      missingOrInvalidCanonicals.push({ route: page.route, pageName: page.pageName, reason: 'Relative or invalid URL scheme' });
    }

    // OG Image
    if (!page.ogImage) {
      missingOgImageCount++;
      missingOgImages.push({ route: page.route, pageName: page.pageName });
    }

    // JSON-LD validation
    if (page.schemaType === 'Custom' && page.customSchemaJson && page.customSchemaJson.trim()) {
      try {
        JSON.parse(page.customSchemaJson.trim());
      } catch (err: any) {
        invalidJsonLdPages.push({ route: page.route, pageName: page.pageName, error: err.message });
      }
    }

    // Noindex
    if (page.robotsIndex === false) {
      noindexCount++;
      const isCore = CORE_PAGES.some((cp) => cp.route === page.route) || page.route === '/';
      noindexPages.push({ route: page.route, pageName: page.pageName, isCorePage: isCore });
    }

    // Orphan detection: check if route has incoming main navigation link
    if (!MAIN_NAV_LINKS.has(page.route) && page.route !== '/') {
      orphanPages.push({ route: page.route, pageName: page.pageName });
    }
  }

  const duplicateTitles: { title: string; pages: string[] }[] = [];
  titleMap.forEach((routes, key) => {
    if (routes.length > 1) {
      duplicateTitles.push({ title: key, pages: routes });
    }
  });

  const duplicateDescriptions: { description: string; pages: string[] }[] = [];
  descMap.forEach((routes, key) => {
    if (routes.length > 1) {
      duplicateDescriptions.push({ description: key, pages: routes });
    }
  });

  // Redirect validation
  const rawRedirects = Array.isArray(siteContent?.redirects) ? siteContent.redirects : [];
  const redirectProblems = detectRedirectProblems(rawRedirects);

  // Check if any redirect target is a broken route
  const registeredRoutes = new Set(allPages.map((p) => p.route));
  for (const r of rawRedirects) {
    if (r.toPath.startsWith('/') && !registeredRoutes.has(r.toPath.replace(/\/$/, '') || '/')) {
      brokenOr404Urls.push({ route: r.toPath, reason: `Redirect target from "${r.fromPath}" does not match any registered public page.` });
    }
  }

  // Sitemap Diagnostics
  const sitemapProblems: string[] = [];
  if (allPages.length === 0) {
    sitemapProblems.push('No public pages discovered for sitemap generation.');
  }

  // Robots.txt Diagnostics
  const robotsProblems: string[] = [];
  const globalSeo = getGlobalSeo(siteContent);
  if (!globalSeo.siteUrl || !globalSeo.siteUrl.startsWith('https://')) {
    robotsProblems.push('Site Canonical URL is not HTTPS. Search engines require secure hosts.');
  }

  // Image SEO Audit
  const imageAudit = auditWebsiteImages(siteContent);

  return {
    totalPages: allPages.length,
    completePages,
    needsAttentionPages,
    missingPages,
    missingTitles,
    missingDescriptions,
    duplicateTitles,
    duplicateDescriptions,
    missingOrInvalidCanonicals,
    missingOgImages,
    invalidJsonLdPages,
    noindexPages,
    orphanPages,
    brokenOr404Urls,
    redirectProblems,
    sitemapProblems,
    robotsProblems,
    noindexPagesCount: noindexCount,
    missingCanonicalCount,
    missingOgImageCount,
    orphanPagesCount: orphanPages.length,
    redirectCount: rawRedirects.length,
    imageAudit,
  };
}

/**
 * Validates a new redirect rule to prevent self-redirects, duplicates, and infinite loops.
 */
export function validateRedirectRule(
  fromPath: string,
  toPath: string,
  existingRules: RedirectRule[]
): { valid: boolean; error?: string } {
  const cleanFrom = fromPath.trim().replace(/\/$/, '') || '/';
  const cleanTo = toPath.trim().replace(/\/$/, '') || '/';

  if (!cleanFrom.startsWith('/')) {
    return { valid: false, error: 'Source URL must begin with a forward slash (/)' };
  }
  if (!cleanTo.startsWith('/') && !cleanTo.startsWith('http://') && !cleanTo.startsWith('https://')) {
    return { valid: false, error: 'Destination URL must begin with a forward slash (/) or https://' };
  }
  if (cleanFrom === cleanTo) {
    return { valid: false, error: 'Self-redirect detected! Source and destination cannot be the same URL.' };
  }

  // Check if destination redirects back to source (circular loop: A -> B and B -> A)
  const circular = existingRules.find(
    (r) => r.fromPath.replace(/\/$/, '') === cleanTo && r.toPath.replace(/\/$/, '') === cleanFrom
  );
  if (circular) {
    return { valid: false, error: `Circular redirect loop detected with existing rule: ${cleanTo} -> ${cleanFrom}` };
  }

  // Check for redirect chain (A -> B where B -> C already exists)
  const chainTarget = existingRules.find((r) => r.fromPath.replace(/\/$/, '') === cleanTo);
  if (chainTarget) {
    return {
      valid: true,
      error: `Warning: This creates a redirect chain (${cleanFrom} -> ${cleanTo} -> ${chainTarget.toPath}). Consider setting target directly to ${chainTarget.toPath}.`,
    };
  }

  return { valid: true };
}

/**
 * Generates Next.js App Router Metadata for any page.
 */
export function buildPageMetadata(routeOrId: string, siteContent?: any): Metadata {
  const globalSeo = getGlobalSeo(siteContent);
  const pageSeo = getPageSeo(routeOrId, siteContent);

  const title = pageSeo.seoTitle || pageSeo.title || globalSeo.defaultTitle;
  const description = pageSeo.metaDescription || pageSeo.description || globalSeo.defaultDescription;
  const canonical = normalizeCanonicalUrl(
    pageSeo.canonicalUrl || `${globalSeo.siteUrl}${pageSeo.route === '/' ? '' : pageSeo.route}`,
    globalSeo.siteUrl
  );
  const ogImage = pageSeo.ogImage || globalSeo.defaultOgImage;
  const ogType = pageSeo.ogType || 'website';

  const keywords = pageSeo.secondaryKeywords || pageSeo.keywords
    ? (pageSeo.secondaryKeywords || pageSeo.keywords || '')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
    : undefined;

  // Clean absolute image URL
  const absoluteOgImage = ogImage.startsWith('http')
    ? ogImage
    : `${globalSeo.siteUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

  const isIndex = pageSeo.robotsIndex !== false && globalSeo.defaultRobotsIndex !== false;
  const isFollow = pageSeo.robotsFollow !== false && globalSeo.defaultRobotsFollow !== false;

  return {
    metadataBase: new URL(globalSeo.siteUrl),
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots: {
      index: isIndex,
      follow: isFollow,
      googleBot: {
        index: isIndex,
        follow: isFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: pageSeo.ogTitle || title,
      description: pageSeo.ogDescription || description,
      url: pageSeo.ogUrl || canonical,
      siteName: globalSeo.siteName,
      locale: 'en_GB',
      type: ogType as any,
      images: [
        {
          url: absoluteOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: pageSeo.twitterCard || 'summary_large_image',
      title: pageSeo.twitterTitle || pageSeo.ogTitle || title,
      description: pageSeo.twitterDescription || pageSeo.ogDescription || description,
      images: [
        pageSeo.twitterImage
          ? pageSeo.twitterImage.startsWith('http')
            ? pageSeo.twitterImage
            : `${globalSeo.siteUrl}${pageSeo.twitterImage.startsWith('/') ? '' : '/'}${pageSeo.twitterImage}`
          : absoluteOgImage,
      ],
    },
    icons: {
      icon: globalSeo.faviconUrl,
      apple: globalSeo.faviconUrl,
    },
    verification: {
      google: globalSeo.googleSiteVerification ? globalSeo.googleSiteVerification : undefined,
      other: globalSeo.bingSiteVerification
        ? { 'msvalidate.01': globalSeo.bingSiteVerification }
        : undefined,
    },
  };
}

/**
 * Builds site-level JSON-LD (WebSite and Organization).
 * Rendered ONCE in layout.tsx to represent the website identity without duplication.
 */
export function buildSiteLevelJsonLd(siteContent?: any): Record<string, any> {
  const globalSeo = getGlobalSeo(siteContent);
  const org = globalSeo.organization;
  const sameAs = Object.values(globalSeo.socialProfiles || {}).filter(Boolean);

  const orgLogo = org?.logo
    ? org.logo.startsWith('http')
      ? org.logo
      : `${globalSeo.siteUrl}${org.logo.startsWith('/') ? '' : '/'}${org.logo}`
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${globalSeo.siteUrl}/#website`,
        url: globalSeo.siteUrl,
        name: globalSeo.siteName,
        publisher: {
          '@id': `${globalSeo.siteUrl}/#organization`,
        },
      },
      {
        '@type': org?.type || 'Organization',
        '@id': `${globalSeo.siteUrl}/#organization`,
        name: org?.name || globalSeo.siteName,
        url: globalSeo.siteUrl,
        logo: orgLogo,
        telephone: org?.phone || undefined,
        email: org?.email || undefined,
        address: org?.address
          ? {
              '@type': 'PostalAddress',
              streetAddress: org.address,
              addressLocality: 'Amersham',
              postalCode: 'HP6 5EN',
              addressCountry: 'GB',
            }
          : undefined,
        sameAs: sameAs.length > 0 ? sameAs : undefined,
      },
    ],
  };
}

/**
 * Generates page-specific Schema.org Structured Data (JSON-LD).
 * Rendered by PageJsonLd on specific pages (e.g. Service on catering pages, Restaurant on Home).
 * Automatically generates BreadcrumbList structured data for all subpages.
 */
export function buildPageJsonLd(routeOrId: string, siteContent?: any): Record<string, any> | null {
  const globalSeo = getGlobalSeo(siteContent);
  const pageSeo = getPageSeo(routeOrId, siteContent);

  if (pageSeo.schemaType === 'None') {
    return null;
  }

  // If administrator supplied custom JSON-LD, attempt parsing safely
  if (pageSeo.schemaType === 'Custom' && pageSeo.customSchemaJson && pageSeo.customSchemaJson.trim()) {
    try {
      return JSON.parse(pageSeo.customSchemaJson.trim());
    } catch {
      return null;
    }
  }

  const pageUrl = normalizeCanonicalUrl(
    pageSeo.canonicalUrl || `${globalSeo.siteUrl}${pageSeo.route === '/' ? '' : pageSeo.route}`,
    globalSeo.siteUrl
  );
  const org = globalSeo.organization;

  let mainEntity: Record<string, any> | null = null;

  switch (pageSeo.schemaType) {
    case 'Restaurant':
    case 'LocalBusiness': {
      mainEntity = {
        '@type': 'Restaurant',
        '@id': `${globalSeo.siteUrl}/#restaurant`,
        name: org?.name || globalSeo.siteName,
        image: pageSeo.ogImage || globalSeo.defaultOgImage,
        url: globalSeo.siteUrl,
        telephone: org?.phone || '+44 1494 972550',
        email: org?.email || 'vcsramersham@gmail.com',
        priceRange: org?.priceRange || '££',
        servesCuisine: ['South Indian', 'Indian', 'Vegetarian', 'Vegan Friendly'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: org?.address || '94 Sycamore Road',
          addressLocality: 'Amersham',
          postalCode: 'HP6 5EN',
          addressCountry: 'GB',
        },
        hasMenu: `${globalSeo.siteUrl}/#menu`,
        acceptsReservations: 'True',
        parentOrganization: {
          '@id': `${globalSeo.siteUrl}/#organization`,
        },
      };
      break;
    }

    case 'Service': {
      mainEntity = {
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        name: pageSeo.seoTitle || pageSeo.pageName,
        description: pageSeo.metaDescription,
        provider: {
          '@id': `${globalSeo.siteUrl}/#organization`,
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Buckinghamshire & Greater London, United Kingdom',
        },
        url: pageUrl,
      };
      break;
    }

    case 'Article': {
      mainEntity = {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: pageSeo.seoTitle || pageSeo.pageName,
        description: pageSeo.metaDescription,
        image: pageSeo.ogImage || globalSeo.defaultOgImage,
        url: pageUrl,
        publisher: {
          '@id': `${globalSeo.siteUrl}/#organization`,
        },
      };
      break;
    }

    case 'Organization': {
      mainEntity = {
        '@type': 'Organization',
        '@id': `${globalSeo.siteUrl}/#organization`,
        name: org?.name || globalSeo.siteName,
        url: globalSeo.siteUrl,
        logo: org?.logo,
      };
      break;
    }

    case 'BreadcrumbList': {
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: globalSeo.siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: pageSeo.pageName,
            item: pageUrl,
          },
        ],
      };
    }

    case 'FAQPage': {
      const faqs = siteContent?.faqs?.items || [];
      if (!faqs.length) return null;
      mainEntity = {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f: any) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      };
      break;
    }

    case 'WebPage':
    default: {
      mainEntity = {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageSeo.seoTitle || pageSeo.pageName,
        description: pageSeo.metaDescription,
        isPartOf: {
          '@id': `${globalSeo.siteUrl}/#website`,
        },
      };
      break;
    }
  }

  if (!mainEntity) return null;

  // For all subpages (not root /), automatically append BreadcrumbList schema in a unified @graph
  if (pageSeo.route !== '/' && pageSeo.route !== 'home') {
    const breadcrumbSchema = {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: globalSeo.siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: pageSeo.pageName,
          item: pageUrl,
        },
      ],
    };

    return {
      '@context': 'https://schema.org',
      '@graph': [
        mainEntity,
        breadcrumbSchema,
      ],
    };
  }

  return {
    '@context': 'https://schema.org',
    ...mainEntity,
  };
}
