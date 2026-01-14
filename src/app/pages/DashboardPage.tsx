import { Suspense } from "react";
import { caller } from "@/trpc/server";
import Sidebar from "@/components/layout/Sidebar";
import { ChevronRight } from "lucide-react";
import AI_Prompt from "@/components/kokonutui/ai-prompt";
import ProjectList from "@/components/project/ProjectList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateList from "@/components/template/TemplateList";
import { templates } from "@/lib/constants/CONSTANTS";
import BgMain from "@/components/animated-backgrounds/bgMain";
import GitHubIcon from "@/components/common/Github";

async function ProjectsGrid() {
  const projects = await caller.project.list();

  return (
    <div className="grid md:px-20 lg:px-0 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <ProjectList projects={projects.slice(0, 10)} />
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
            <div className="flex flex-col gap-y-1 mt-1">
              <div className="h-4 w-30 rounded-xl bg-muted/50 animate-pulse" />
              <div className="h-4 w-40 rounded-xl bg-muted/50 animate-pulse" />
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
        <BgMain bgNumber={3} />
        <div className="h-screen max-h-[768px] flex items-center justify-center">
          <div className="flex flex-col gap-y-2 w-full -mt-14">
            <div className="mx-auto flex flex-col md:flex-row items-center gap-4">
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
            </div>

            <h3 className="text-center text-xl md:text-2xl lg:text-3xl font-bold mt-8 md:mt-6 max-w-9/10 mx-auto">
              What should we <span className="font-handwriting text-2xl md:text-3xl lg:text-4xl me-1">document</span> today?
            </h3>

            <div className="mx-auto relative w-9/10 max-w-2xl">
              <div className="py-4">
                <div className="rounded-3xl bg-black/5 p-1.5 dark:bg-white/5">
                  <AI_Prompt isActive={true} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-1/2 bg-sidebar p-6 rounded-2xl w-[94%] mx-auto -mt-14 mb-10 max-w-7xl">
          <Tabs defaultValue="projects" className="w-fulll">
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
              <div className="grid md:px-20 lg:px-0 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-3">
                <TemplateList templates={templates} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
