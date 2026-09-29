import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AskKodee from "../components/AskKodee";

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
  icons: {
    icon: 'https://vcsamersham.co.uk/wp-content/uploads/2026/06/vcsr-logo.webp',
  },
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
      </head>
      <body style={{ margin: 0, fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
        <AskKodee />
      </body>
    </html>
  );
}
