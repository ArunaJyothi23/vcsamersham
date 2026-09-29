import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "South Indian Vegetarian Restaurant Amersham | 100% Pure Veg",
  description: "South Indian Vegetarian Restaurant Amersham Top-rated South-Indian Vegetarian Dining • 100% Pure Veg • Family-Friendly Dining View Menu Order Online",
  alternates: {
    canonical: 'https://vcsamersham.co.uk/',
  },
  openGraph: {
    title: 'South Indian Vegetarian Restaurant Amersham | 100% Pure Veg',
    description: 'South Indian Vegetarian Restaurant Amersham Top-rated South-Indian Vegetarian Dining • 100% Pure Veg • Family-Friendly Dining View Menu Order Online',
    url: 'https://vcsamersham.co.uk/',
    siteName: 'vcsamersham',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
