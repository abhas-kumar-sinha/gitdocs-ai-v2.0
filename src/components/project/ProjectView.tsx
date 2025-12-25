"use client"

import { useMemo, useState } from "react";
import { Button } from "../ui/button"
import { useTRPC } from "@/trpc/client"
import CodePanel from "./tabs/CodePanel";
import Toolbar from "../kokonutui/toolbar"
import { Progress } from "../ui/progress";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import DesignPanel from "./tabs/DesignPanel";
import AI_Prompt from "../kokonutui/ai-prompt";
import ContextPanel from "./tabs/ContextPanel";
import PreviewPanel from "./tabs/PreviewPanel";
import MessageContainer from "./MessageContainer"
import { Fragment } from "@/generated/prisma/client";
import { useSuspenseQuery } from "@tanstack/react-query"
import { DropdownMenuSub } from "@radix-ui/react-dropdown-menu";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Check, ChevronDown, ChevronLeft, CodeXml, Form, GitPullRequestArrow, Globe, History, LaptopMinimal, LucideIcon, Palette, SquarePen, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface ToolbarItem {
    id: string;
    title: string;
    icon: LucideIcon;
    type?: never;
}

const toolbarItems: ToolbarItem[] = [
    { id: "preview", title: "Preview", icon: Globe },
    { id: "design", title: "Design", icon: Palette },
    { id: "code", title: "Code", icon: CodeXml },
    { id: "context", title: "Context", icon: Form },
];

const ProjectView = ({projectId} : {projectId : string}) => {

  const trpc = useTRPC();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>("preview");
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  
  const { data: project } = useSuspenseQuery(trpc.project.getById.queryOptions({
    id: projectId
  }));
  
  const [contextFiles, setContextFiles] = useState<string[]>(project.contextFiles);

  const isSaveContextChange = useMemo(() => {
    const current = [...contextFiles].sort();
    const original = [...project.contextFiles].sort();

    if (current.length !== original.length) return true;

    return current.some((file, index) => file !== original[index]);
  }, [contextFiles, project.contextFiles]);

  return (
    <ResizablePanelGroup direction="horizontal" id="project-view-panels">
      <ResizablePanel id="left-panel" className="h-screen relative flex flex-col" defaultSize={33} minSize={33}>
        <div className="flex items-center justify-between px-2 absolute w-full top-0 h-12">
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="flex items-center gap-x-2">
                <Button variant="ghost" size="sm" className="hover:bg-transparent!" suppressHydrationWarning>
                  <span className="uppercase px-1.5 py-1 rounded-md bg-accent text-xs">{project?.name.slice(0, 2)}</span>
                  <span>{project?.name}</span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="start" alignOffset={8}>
                <DropdownMenuItem onClick={() => router.push("/")}>
                  <ChevronLeft />
                  Back To Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-foreground/70 mb-1">
                  Usage
                </DropdownMenuLabel>
                <DropdownMenuLabel>
                  <div className="flex flex-col bg-background/70 rounded-md p-3 -mx-1.5 -mt-2">
                    <div className="flex items-center justify-between">
                      <span>Credits</span>
                      <span className="text-foreground/70">5 left</span>
                    </div>
                    <Progress value={100} className="my-3 h-3" />
                    <div className="flex items-center gap-x-2">
                      <div className="h-1.5 w-1.5 bg-foreground rounded-full" />
                      <span className="text-xs text-foreground/70">Daily credits reset at midnight UTC</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-foreground/70 mb-1">
                  Project
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <SquarePen />
                  Rename Project
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star />
                  Star Project
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <LaptopMinimal />
                    Appearance
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent sideOffset={4}>
                    <DropdownMenuItem>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      System 
                      <Check className="ms-auto" />
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button variant="ghost" size="icon-sm">
              <History />
          </Button>
        </div>

        <MessageContainer projectId={projectId} activeFragment={activeFragment} setActiveFragment={setActiveFragment} />

        <div className="absolute bottom-2 w-[98%] mx-auto ms-1">
          <AI_Prompt isActive={true} projectId={projectId} repository={project.repository ? project.repository : undefined} />
        </div>
      </ResizablePanel>

      <ResizableHandle id="panel-resize" className="hover:bg-accent bg-transparent" />

      <ResizablePanel id="right-panel" className="h-screen relative flex flex-col" defaultSize={67} minSize={50}>
        <div className="flex items-center justify-between px-4 absolute w-full top-0 h-12">
          <Toolbar selected={activeTab} setSelected={setActiveTab} toolbarItems={toolbarItems}/>
          <div className="flex items-center gap-x-2">
            {isSaveContextChange && 
            <Button variant="outline" size="sm" className="h-7">
              Save Changes
            </Button>}
            
            <Button variant="outline" size="icon-sm" className="h-7 w-7">
              <FaGithub />
            </Button>

            <Button variant="default" size="sm" className="h-7">
              <GitPullRequestArrow /> 
              Commit Changes
            </Button>
          </div>
        </div>

        <div className="flex flex-col flex-1 relative mt-12 bg-foreground/5 rounded-xl my-2 mx-3 overflow-hidden">
          {activeTab === "preview" && <PreviewPanel content={activeFragment?.readme ? activeFragment?.readme : ""} />}
          {activeTab === "design" && <DesignPanel content={activeFragment?.readme ? activeFragment?.readme : ""} />}
          {activeTab === "code" && <CodePanel content={activeFragment?.readme ? activeFragment?.readme : ""} />}
          {activeTab === "context" && <ContextPanel initialContextFiles={project.contextFiles} contextFiles={contextFiles} setContextFiles={setContextFiles} allFiles={project.allFiles} />}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
export default ProjectView;