import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";
import { getSiteContent } from "@/lib/firebaseService";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

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

import { buildPageMetadata, buildSiteLevelJsonLd } from "@/lib/seoService";

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await getSiteContent();
  return buildPageMetadata('/', siteContent);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = await getSiteContent();
  const siteJsonLd = buildSiteLevelJsonLd(siteContent);

  return (
    <html lang="en" className={`${roboto.variable} ${plusJakartaSans.variable} ${playfairDisplay.variable}`}>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/migrated/vcs-authentic-south-indian-feast.jpeg"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
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
