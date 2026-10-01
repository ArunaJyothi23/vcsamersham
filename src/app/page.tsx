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
import { getSiteContent, getMenuData } from '@/lib/firebaseService';

// Force dynamic SSR so edits saved in Admin Studio appear immediately on page reload
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [siteContent, menuData] = await Promise.all([
    getSiteContent(),
    getMenuData(),
  ]);

  return (
    <>
      <Hero content={siteContent?.hero} />
      <AboutSection content={siteContent?.about} restaurant={siteContent?.restaurant} />
      <TopFood content={siteContent?.topFood} />
      <Menu menuConfig={menuData} />
      <OrderOnline />
      <Catering content={siteContent?.catering} />
      <WhyChooseUs content={siteContent?.whyChooseUs} />
      <FAQ faqs={siteContent?.faqs} />
      <Contact restaurant={siteContent?.restaurant} />
      <Reviews testimonials={siteContent?.testimonials} />
    </>
  );
}
