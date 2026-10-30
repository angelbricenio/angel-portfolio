import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Work from './components/Work';
import Software from './components/Software';
import Awards from './components/Awards';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Marquee />
        <About />
        <Work />
        <Software />
        <Awards />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
