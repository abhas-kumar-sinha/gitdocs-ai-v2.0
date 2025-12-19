import Sidebar from "@/components/layout/Sidebar";
import AuraBackground from "@/components/animated-backgrounds/AuraBackground";
import AI_Prompt from "@/components/kokonutui/ai-prompt";
import { ChevronRight, Heart } from "lucide-react";
import Anthropic from "@/components/kokonutui/anthropic";
import AnthropicDark from "@/components/kokonutui/anthropic-dark";

const DashboardPage = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="relative flex-1 overflow-y-scroll overflow-x-hidden">
        <AuraBackground source="landing" />
        <div className="h-screen max-h-[768px] flex items-center justify-center">
          <div className="flex flex-col gap-y-4 w-full">
            <span className="mx-auto text-sm text-foreground/70 border border-foreground/10 ps-4 pe-3 py-1 rounded-full bg-background/90 flex items-center gap-x-2 cursor-pointer group transition-colors duration-300 hover:scale-102 animate-all hover:text-foreground hover:border-foreground/30">
                <Heart size={13} />

                <span>Introducing GitDocs AI v2.0</span>

                <ChevronRight className="opacity-0 size-0 translate-x-[-4px] transition-all duration-300 group-hover:opacity-100 group-hover:size-3.5 group-hover:translate-x-0" />
            </span>

            <h3 className="text-center text-xl md:text-2xl lg:text-3xl font-bold mt-8 md:mt-6 max-w-9/10 mx-auto">
                What should we document today?
            </h3>

            <div className="mx-auto relative w-9/10 max-w-2xl">
              
            <div className="py-4">
              <div className="rounded-2xl bg-black/5 p-1.5 pt-4 dark:bg-white/5">
                <div className="mx-2 mb-2.5 flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    <Anthropic className="h-3.5 w-3.5 text-black dark:hidden" />
                    <AnthropicDark className="hidden h-3.5 w-3.5 dark:block" />
                    <h3 className="text-black text-xs tracking-tighter dark:text-white/90">
                      is free this weekend!
                    </h3>
                  </div>
                  <p className="text-black text-xs tracking-tighter dark:text-white/90">
                    Ship Now!
                  </p>
                </div>
                  <AI_Prompt isActive={true} />
                </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
