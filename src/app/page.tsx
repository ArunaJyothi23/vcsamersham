import Hero from '../components/Hero';
import Menu from '../components/Menu';
import OrderOnline from '../components/OrderOnline';
import Catering from '../components/Catering';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Menu />
      <OrderOnline />
      <Catering />
      <WhyChooseUs />
      <FAQ />
      <Contact />
    </>
  );
}
