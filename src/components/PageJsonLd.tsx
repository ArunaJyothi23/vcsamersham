import React from 'react';
import { buildPageJsonLd } from '@/lib/seoService';

interface PageJsonLdProps {
  route: string;
  siteContent?: any;
}

export default function PageJsonLd({ route, siteContent }: PageJsonLdProps) {
  const jsonLd = buildPageJsonLd(route, siteContent);

  if (!jsonLd || Object.keys(jsonLd).length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
