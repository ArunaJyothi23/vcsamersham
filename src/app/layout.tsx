import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#C5926B",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://vcsamersham.co.uk"),
  title: "South Indian Vegetarian Restaurant Amersham | 100% Pure Veg",
  description: "South Indian Vegetarian Restaurant Amersham. Top-rated South-Indian Vegetarian Dining • 100% Pure Veg • Family-Friendly Dining • Authentic Dosa, Idli & Catering Services.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "South Indian Vegetarian Restaurant Amersham | 100% Pure Veg",
    description: "South Indian Vegetarian Restaurant Amersham. Top-rated South-Indian Vegetarian Dining • 100% Pure Veg • Family-Friendly Dining View Menu Order Online",
    url: "https://vcsamersham.co.uk/",
    siteName: "Veg Chennai Srilalitha Amersham",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://vcsamersham.co.uk/wp-content/uploads/2026/06/vcsr-logo.webp",
        width: 800,
        height: 600,
        alt: "Veg Chennai Srilalitha Amersham Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "South Indian Vegetarian Restaurant Amersham | 100% Pure Veg",
    description: "Top-rated South Indian Vegetarian Dining & Catering in Amersham. 100% Pure Veg.",
    images: ["https://vcsamersham.co.uk/wp-content/uploads/2026/06/vcsr-logo.webp"],
  },
  icons: {
    icon: "/icon.jpeg",
    apple: "/icon.jpeg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Restaurant",
      "@id": "https://vcsamersham.co.uk/#restaurant",
      "name": "Veg Chennai Srilalitha Restaurant Amersham",
      "image": "https://vcsamersham.co.uk/wp-content/uploads/2026/06/vcsr-logo.webp",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=2000&auto=format&fit=crop" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ margin: 0, fontFamily: 'Arial, Helvetica, sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, width: '100%', overflowX: 'clip' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
