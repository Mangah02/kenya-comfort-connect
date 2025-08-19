import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RoomsPreview from "@/components/RoomsPreview";
import DiningPreview from "@/components/DiningPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <RoomsPreview />
      <DiningPreview />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
