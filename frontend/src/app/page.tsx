import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-juragan-darker">
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <Services />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}
