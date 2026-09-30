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

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <TopFood />
      <Menu />
      <OrderOnline />
      <Catering />
      <WhyChooseUs />
      <FAQ />
      <Contact />
      <Reviews />
    </>
  );
}
