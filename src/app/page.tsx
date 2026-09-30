import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import Menu from '../components/Menu';
import OrderOnline from '../components/OrderOnline';
import Catering from '../components/Catering';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQ from '../components/FAQ';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <Menu />
      <OrderOnline />
      <Catering />
      <WhyChooseUs />
      <FAQ />
      <Reviews />
      <Contact />
    </>
  );
}
