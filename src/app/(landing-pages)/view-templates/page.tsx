import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import TemplateList from "@/components/template/TemplateList";
import { templates } from "@/lib/constants/CONSTANTS";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "README Templates – Gitdocs AI",
  description:
    "Browse professionally designed README templates for open-source and SaaS projects.",
  alternates: {
    canonical: "https://www.gitdocs.space/view-templates",
  },
};


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
              <h2 className="text-xl">All Templates</h2>
              <p className="text-sidebar-foreground/50">Browse ready-to-use templates for every workflow</p>
            </div>
          </div>

          <hr className="my-6 border-border" />

          <div className="grid md:px-20 lg:px-0 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-3">
            <TemplateList templates={templates} />
          </div>

          <hr className="my-6 border-border" />

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
