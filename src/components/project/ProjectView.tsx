"use client"

import { useState } from "react";
import { Button } from "../ui/button"
import { useTRPC } from "@/trpc/client"
import Toolbar from "../kokonutui/toolbar"
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation"
import AI_Prompt from "../kokonutui/ai-prompt"
import MessageContainer from "./MessageContainer"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ChevronDown, ChevronLeft, CodeXml, Form, GitPullRequestArrow, Globe, History, LucideIcon, Palette } from "lucide-react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Fragment } from "@/generated/prisma/client";
import PreviewPanel from "./tabs/PreviewPanel";
import DesignPanel from "./tabs/DesignPanel";
import CodePanel from "./tabs/CodePanel";
import ContextPanel from "./tabs/ContextPanel";
import { TemplateId } from "./context-selection/TemplateList";

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
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push("/")}>
                    <ChevronLeft />
                    Back To Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-foreground/70">
                    Usage
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button variant="ghost" size="icon-sm">
              <History />
          </Button>
        </div>

        <MessageContainer projectId={projectId} activeFragment={activeFragment} setActiveFragment={setActiveFragment} />

        <div className="absolute bottom-2 w-[98%] mx-auto ms-1">
          <AI_Prompt isActive={true} projectId={projectId} repository={project.repository ? project.repository : undefined} templateId={project.template ? project.template as TemplateId : "ai-gen"} />
        </div>
      </ResizablePanel>

      <ResizableHandle id="panel-resize" className="hover:bg-accent bg-transparent" />

      <ResizablePanel id="right-panel" className="h-screen relative flex flex-col" defaultSize={67} minSize={50}>
        <div className="flex items-center justify-between px-4 absolute w-full top-0 h-12">
          <Toolbar selected={activeTab} setSelected={setActiveTab} toolbarItems={toolbarItems}/>
          <div className="flex items-center gap-x-2">
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
          {activeTab === "preview" && <PreviewPanel content={activeFragment?.readme ? activeFragment?.readme : ""}/>}
          {activeTab === "design" && <DesignPanel projectId={projectId}/>}
          {activeTab === "code" && <CodePanel content={activeFragment?.readme ? activeFragment?.readme : ""}/>}
          {activeTab === "context" && <ContextPanel projectId={projectId}/>}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
export default ProjectView;