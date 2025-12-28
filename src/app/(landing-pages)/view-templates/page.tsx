import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { CircleCheckBig } from "lucide-react";

const LandingPage = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center pt-40">
        <div className="xl:w-7/10 w-9/10 h-20 flex flex-col gap-y-4 lg:flex-row items-start justify-between">
          <h1 className="lg:w-1/2 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold xl:leading-[0.9]">
            The gold standard of documentation.
          </h1>

          <p className="lg:w-2/5 text-foreground text-sm md:text-base">
            Gitdocs AI generates high-fidelity READMEs by analyzing your codebase architecture. Pick a structural base and let our models do the heavy lifting.
          </p>
        </div>

        <div className="w-9/10 bg-sidebar min-h-screen mt-40 mb-20 flex flex-col rounded-3xl p-8 text-sidebar-foreground">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl">Gitdocs Release History</h2>
              <p className="text-sidebar-foreground/50">Complete release history with detailed change tracking</p>
            </div>
            <div className="flex items-center gap-x-2 text-xs py-1 px-2 rounded-md bg-primary/20 text-primary font-thin font-mono">
              <CircleCheckBig size={10} />
              2.0.0
            </div>
          </div>

          <hr className="mt-6 mb-10 border-border" />


          <hr className="my-6 border-border mt-auto" />

          <div className="flex flex-col md:flex-row gap-y-6 item-center justify-between md:px-8 py-2">
            <div className="flex flex-col items-start">
              <span>Abhas Kumar Sinha</span>
              <span className="text-xs text-foreground">Creater of Gitdocs AI</span>
            </div>

            <div className="text-xs my-auto">
              <span>Last Updated: </span>
              <span> December 28, 2025</span>
            </div>
          </div>
        </div>
        
      </div>

      <Footer />
    </>
  );
};
export default LandingPage;
