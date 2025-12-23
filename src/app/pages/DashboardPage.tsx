import { Suspense } from "react";
import { caller } from "@/trpc/server";
import Sidebar from "@/components/layout/Sidebar";
import { ChevronRight, Heart } from "lucide-react";
import Anthropic from "@/components/kokonutui/anthropic";
import AI_Prompt from "@/components/kokonutui/ai-prompt";
import ProjectList from "@/components/project/ProjectList";
import AnthropicDark from "@/components/kokonutui/anthropic-dark";
import AuraBackground from "@/components/animated-backgrounds/AuraBackground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function ProjectsGrid() {
  const projects = await caller.project.list();

  return (
    <div className="grid md:px-20 lg:px-0 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <Suspense fallback={null}>
        <ProjectList projects={projects} />
      </Suspense>
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="grid md:px-20 lg:px-0 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col gap-y-2">
          <div className="h-48 w-full rounded-xl bg-muted/50 animate-pulse" />
          
          <div className="flex gap-x-2">
            <div className="h-10 w-10 rounded-full bg-muted/50 animate-pulse" />
            <div className="flex flex-col gap-y-1">
              <div className="h-5 w-30 rounded-xl bg-muted/50 animate-pulse" />
              <div className="h-5 w-40 rounded-xl bg-muted/50 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const DashboardPage = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="relative flex-1 overflow-y-scroll overflow-x-hidden">
        <AuraBackground source="landing" />
        <div className="h-screen max-h-[768px] flex items-center justify-center">
          <div className="flex flex-col gap-y-2 w-full -mt-14">
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

        <div className="min-h-1/2 bg-background/60 p-6 rounded-2xl w-[94%] mx-auto -mt-24 mb-10">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="h-9 bg-transparent">
              <TabsTrigger value="projects" className="w-30">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="templates" className="w-30">
                Templates
              </TabsTrigger>
            </TabsList>
            <TabsContent className="mt-3" value="projects">
              <Suspense fallback={<ProjectsSkeleton />}>
                <ProjectsGrid />
              </Suspense>
            </TabsContent>
            <TabsContent value="templates">
              Change your password here.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;