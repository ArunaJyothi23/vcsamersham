import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";
import { getSiteContent } from "@/lib/firebaseService";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#C5926B",
};

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await getSiteContent();
  const seo = siteContent?.seo?.home;
  const title = seo?.title || "South Indian Vegetarian Restaurant Amersham | 100% Pure Veg";
  const description =
    seo?.description ||
    "South Indian Vegetarian Restaurant Amersham Top-rated South-Indian Vegetarian Dining • 100% Pure Veg • Family-Friendly Dining View Menu Order Online";
  const keywords = seo?.keywords ? seo.keywords.split(',').map((k: string) => k.trim()) : undefined;
  const canonical = seo?.canonical || "/";
  const ogImage = seo?.ogImage || "/images/migrated/WhatsApp-Image-2025-11-01-at-15.41.07-2.jpeg";

  return {
    metadataBase: new URL("https://vcsamersham.co.uk"),
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: "https://vcsamersham.co.uk/",
      siteName: "Veg Chennai Srilalitha Amersham",
      locale: "en_GB",
      type: "website",
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
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: "/icon.jpeg",
      apple: "/icon.jpeg",
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Restaurant",
      "@id": "https://vcsamersham.co.uk/#restaurant",
      "name": "Veg Chennai Srilalitha Restaurant Amersham",
      "image": "/images/migrated/vcsr-logo.webp",
      "url": "https://vcsamersham.co.uk/",
      "telephone": "+44 1494 972550",
      "email": "vcsramersham@gmail.com",
      "priceRange": "££",
      "servesCuisine": ["South Indian", "Indian", "Vegetarian", "Vegan Friendly"],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "94 Sycamore Road",
        "addressLocality": "Amersham",
        "postalCode": "HP6 5EN",
        "addressCountry": "GB"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 51.6749,
        "longitude": -0.6074
      },
      "hasMenu": "https://vcsamersham.co.uk/#menu",
      "acceptsReservations": "True",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "12:00",
          "closes": "22:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday", "Sunday"],
          "opens": "11:00",
          "closes": "22:00"
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://vcsamersham.co.uk/#website",
      "url": "https://vcsamersham.co.uk/",
      "name": "Veg Chennai Srilalitha Amersham",
      "publisher": {
        "@id": "https://vcsamersham.co.uk/#restaurant"
      }
    }
  ]
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = await getSiteContent();

  return (
    <html lang="en" className={`${roboto.variable} ${plusJakartaSans.variable} ${playfairDisplay.variable}`}>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/migrated/WhatsApp-Image-2025-11-01-at-15.41.07-2.jpeg"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: 'var(--font-roboto), "Roboto", var(--font-sans), "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
          minHeight: '100vh',
          backgroundColor: '#FFFDF9',
        }}
      >
        <ClientLayout siteContent={siteContent}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
