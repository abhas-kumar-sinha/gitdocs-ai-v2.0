import BgMain from "@/components/animated-backgrounds/bgMain";
import AI_Prompt from "@/components/kokonutui/ai-prompt";
import BentoGrid from "@/components/kokonutui/bento-grid";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { ChevronRight } from "lucide-react";
import GitHubIcon from "@/components/common/Github";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <BgMain bgNumber={3} />
      <div role="main" className="h-screen max-h-[768px] flex items-center justify-center mt-14 md:mt-10">
        <div className="flex flex-col gap-y-4 md:gap-y-6 w-full">
          <div className="mx-auto flex flex-col-reverse md:flex-row items-center gap-4">
            <a
              href="https://github.com/abhas-kumar-sinha/gitdocs-ai-v2.0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="mx-auto text-sm text-foreground border border-foreground/10 ps-4 pe-3 py-3 rounded-full bg-white/5 backdrop-blur-lg flex items-center gap-x-2 cursor-pointer group transition-colors duration-300 hover:scale-102 animate-all hover:text-foreground hover:border-foreground/30">
                <span className="scale-120"><GitHubIcon className="h-4.5 w-4.5" /></span>

                <span>Star Us · Loved by early builders</span>

                <ChevronRight className="opacity-0 size-0 translate-x-[-4px] transition-all duration-300 group-hover:opacity-100 group-hover:size-4 group-hover:translate-x-0"/>
              </span>
            </a>
            <span className="mx-auto text-sm text-foreground border border-foreground/10 ps-4 pe-3 py-3 rounded-full bg-white/5 backdrop-blur-lg flex items-center gap-x-2 cursor-pointer group transition-colors duration-300 hover:scale-102 animate-all hover:text-foreground hover:border-foreground/30">
              <span className="scale-120">💖</span>

              <span>Introducing GitDocs AI v2.0</span>

              <ChevronRight className="opacity-0 size-0 translate-x-[-4px] transition-all duration-300 group-hover:opacity-100 group-hover:size-4 group-hover:translate-x-0"/>
            </span>
          </div>

          <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-semibold mt-2 max-w-9/10 mx-auto text-accent-foreground">
            Make <span className="font-handwriting text-4xl md:text-5xl lg:text-6xl">repository</span> explain itself
          </h1>
          <p className="text-accent-foreground/80 font-semibold text-xs -mt-4 md:text-base lg:text-lg text-center max-w-2/3 mx-auto">
            Generate github README files chatting with AI
          </p>
          <div className="mx-auto relative w-9/10 max-w-3xl">
            <div className="py-4">
              <div className="rounded-3xl bg-black/5 p-1.5 dark:bg-white/5">
                <AI_Prompt isActive={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div role="region" className="lg:px-14 flex flex-col gap-y-2">
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-center text-accent-foreground">
          Built for the modern stack
        </h2>
        <p className="text-center text-accent-foreground/80 text-xs md:text-base max-w-2/3 mx-auto">
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
