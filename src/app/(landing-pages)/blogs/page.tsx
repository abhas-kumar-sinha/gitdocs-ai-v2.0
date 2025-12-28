import BentoGrid from "@/components/kokonutui/bento-grid";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const LandingPage = () => {
  return (
    <>
      <Navbar />

      <div className="lg:px-14 flex flex-col gap-y-4 mt-20">
        <h3 className="text-2xl md:text-3xl lg:text-4xl text-center text-primary-foreground">
          Built for the modern stack
        </h3>
        <p className="text-center text-foreground text-xs md:text-base max-w-2/3 mx-auto">
          Everything you need to maintain comprehensive documentation without
          leaving your terminal.
        </p>
        <BentoGrid />
      </div>

      <Footer />
    </>
  );
};
export default LandingPage;
