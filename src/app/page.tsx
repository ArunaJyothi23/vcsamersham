import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import Highlights from '../components/Highlights';
import TopFood from '../components/TopFood';
import Menu from '../components/Menu';
import Catering from '../components/Catering';
import OrderOnline from '../components/OrderOnline';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <Highlights />
      <TopFood />
      <Menu />
      <Catering />
      <OrderOnline />
      <WhyChooseUs />
      <FAQ />
      <Contact />
    </>
  );
}
