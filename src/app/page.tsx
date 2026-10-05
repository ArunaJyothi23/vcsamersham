import type { Metadata } from 'next';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import TopFood from '../components/TopFood';
import Menu from '../components/Menu';
import OrderOnline from '../components/OrderOnline';
import Catering from '../components/Catering';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Reviews from '../components/Reviews';
import PageJsonLd from '@/components/PageJsonLd';
import { getSiteContent, getMenuData } from '@/lib/firebaseService';
import { buildPageMetadata } from '@/lib/seoService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await getSiteContent();
  return buildPageMetadata('/', siteContent);
}

export default async function Home() {
  const [siteContent, menuData] = await Promise.all([
    getSiteContent(),
    getMenuData(),
  ]);

  return (
    <>
      <PageJsonLd route="/" siteContent={siteContent} />
      <Hero content={siteContent?.hero} />
      <AboutSection content={siteContent?.about} restaurant={siteContent?.restaurant} />
      <TopFood content={siteContent?.topFood} />
      <Menu menuConfig={menuData} spotlightData={siteContent?.menuSpotlight} />
      <OrderOnline deliveryPlatforms={siteContent?.deliveryPlatforms} />
      <Catering content={siteContent?.catering} />
      <WhyChooseUs content={siteContent?.whyChooseUs} />
      <FAQ faqs={siteContent?.faqs} />
      <Contact restaurant={siteContent?.restaurant} siteContent={siteContent} />
      <Reviews testimonials={siteContent?.testimonials} />
    </>
  );
}
