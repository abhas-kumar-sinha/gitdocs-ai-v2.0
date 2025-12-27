"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { useTRPC } from "@/trpc/client";
import { useTheme } from "next-themes";
import CodePanel from "./tabs/CodePanel";
import { Progress } from "../ui/progress";
import Toolbar from "../kokonutui/toolbar";
import { useRouter } from "next/navigation";
import DesignPanel from "./tabs/DesignPanel";
import AI_Prompt from "../kokonutui/ai-prompt";
import ContextPanel from "./tabs/ContextPanel";
import PreviewPanel from "./tabs/PreviewPanel";
import MessageContainer from "./MessageContainer";
import { useMemo, useState } from "react";
import { Fragment } from "@/generated/prisma/client";
import { GithubConnectionItem } from "../common/SidebarItem";
import ProjectNameChangeForm from "../forms/projectNameChange";
import { DropdownMenuSub } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  ChevronDown,
  ChevronLeft,
  CodeXml,
  Form,
  Globe,
  History,
  LaptopMinimal,
  LucideIcon,
  Palette,
  SquarePen,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const ProjectView = ({ projectId }: { projectId: string }) => {
  const trpc = useTRPC();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>("preview");
  const [fragmentIds, setFragmentIds] = useState<(string | undefined)[]>([]);
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [isOpenNameChangeForm, setIsOpenNameChangeForm] =
    useState<boolean>(false);
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  // Changed from useSuspenseQuery to useQuery for better loading performance
  const { data: project, isLoading: isProjectLoading } = useQuery(
    trpc.project.getById.queryOptions({
      id: projectId,
    }),
  );

  const updateProjectStar = useMutation(
    trpc.project.updateStarred.mutationOptions({
      onError: () => {
        toast.error("Failed to update project");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [["project", "getById"], { input: { id: projectId } }],
        });
        toast.success("Project updated successfully");
      },
    }),
  );

  const { data: aiUsage, isLoading: isAiUsageLoading } = useQuery(
    trpc.aiUsage.getUsage.queryOptions(),
  );

  // Derive state directly from project data to avoid cascading renders
  const [projectName, setProjectName] = useState<string>(project?.name || "");
  const [localContextFiles, setLocalContextFiles] = useState<string[]>([]);

  // ✅ Adjust state during rendering (React-recommended pattern)
  // Store previous contextFiles to detect changes
  const [prevContextFiles, setPrevContextFiles] = useState<string[]>([]);

  if (project?.contextFiles && project.contextFiles !== prevContextFiles) {
    // Update when project.contextFiles changes
    setPrevContextFiles(project.contextFiles);
    setLocalContextFiles(project.contextFiles);
  }

  const isSaveContextChange = useMemo(() => {
    if (!project) return false;

    const current = [...localContextFiles].sort();
    const original = [...project.contextFiles].sort();

    if (current.length !== original.length) return true;

    return current.some((file, index) => file !== original[index]);
  }, [localContextFiles, project]);

  return (
    <ResizablePanelGroup direction="horizontal" id="project-view-panels">
      <ResizablePanel
        id="left-panel"
        className="h-screen relative flex flex-col"
        defaultSize={33}
        minSize={33}
      >
        <div className="flex items-center justify-between px-2 absolute w-full top-0 h-12">
          <div className="flex items-center">
            {isProjectLoading || !project ? (
              <div className="h-9 w-48 bg-muted animate-pulse rounded-md" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="flex items-center gap-x-2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-transparent!"
                    suppressHydrationWarning
                  >
                    <span className="uppercase px-1.5 py-1 rounded-md bg-accent text-xs tracking-tighter">
                      {project.name.slice(0, 2)}
                    </span>
                    <span>{project.name}</span>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-72"
                  align="start"
                  alignOffset={8}
                >
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
                      {isAiUsageLoading ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span>Credits</span>
                            <span className="text-foreground/70 h-4 w-16 rounded-full animate-pulse bg-muted" />
                          </div>
                          <div className="my-3 h-3 animate-pulse rounded-full bg-accent/50" />
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <span>Credits</span>
                            <span className="text-foreground/70">
                              {(aiUsage?.maxCount || 5) - (aiUsage?.count || 0)}{" "}
                              left
                            </span>
                          </div>
                          <Progress
                            value={
                              (((aiUsage?.maxCount || 5) -
                                (aiUsage?.count || 0)) /
                                (aiUsage?.maxCount || 5)) *
                              100
                            }
                            className="my-3 h-3"
                          />
                        </>
                      )}
                      <div className="flex items-center gap-x-2">
                        <div className="h-1.5 w-1.5 bg-foreground rounded-full" />
                        <span className="text-xs text-foreground/70">
                          Daily credits reset at midnight UTC
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-foreground/70 mb-1">
                    Project
                  </DropdownMenuLabel>
                  <ProjectNameChangeForm
                    isOpenNameChangeForm={isOpenNameChangeForm}
                    setIsOpenNameChangeForm={setIsOpenNameChangeForm}
                    value={projectName}
                    setValue={setProjectName}
                    projectId={projectId}
                  >
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpenNameChangeForm(true);
                      }}
                    >
                      <SquarePen />
                      Rename Project
                    </DropdownMenuItem>
                  </ProjectNameChangeForm>
                  <DropdownMenuItem
                    onClick={() =>
                      updateProjectStar.mutate({
                        id: project.id,
                        isStarred: !project.isStarred,
                      })
                    }
                  >
                    {project.isStarred ? (
                      <>
                        <Star fill="#ededed" stroke="none" />
                        Unstar Project
                      </>
                    ) : (
                      <>
                        <Star />
                        Star Project
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <LaptopMinimal />
                      Appearance
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent sideOffset={4}>
                        <DropdownMenuRadioGroup
                          value={theme}
                          onValueChange={setTheme}
                        >
                          <DropdownMenuRadioItem value="light">
                            <span>Light</span>
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="dark">
                            <span>Dark</span>
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="system">
                            <span>System</span>
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Button variant="ghost" size="icon-sm">
            <History />
          </Button>
        </div>

        <MessageContainer
          projectId={projectId}
          activeFragment={activeFragment}
          setActiveFragment={setActiveFragment}
          fragmentIds={fragmentIds}
          setFragmentIds={setFragmentIds}
        />

        <div className="absolute bottom-2 w-[98%] ms-2.5">
          <AI_Prompt
            isActive={true}
            projectId={projectId}
            repository={project?.repository ? project.repository : undefined}
          />
        </div>
      </ResizablePanel>

      <ResizableHandle
        id="panel-resize"
        className="hover:bg-accent bg-transparent"
      />

      <ResizablePanel
        id="right-panel"
        className="h-screen relative flex flex-col"
        defaultSize={67}
        minSize={50}
      >
        <div className="flex items-center justify-between px-4 absolute w-full top-0 h-12">
          <Toolbar
            selected={activeTab}
            setSelected={setActiveTab}
            toolbarItems={toolbarItems}
          />
          <div className="flex items-center gap-x-2">
            {isSaveContextChange && (
              <Button variant="outline" size="sm" className="h-7">
                Save Changes
              </Button>
            )}

            <GithubConnectionItem
              isSidebarOpen={false}
              showCommitButton
              activeFragmentId={activeFragment?.id}
              fragmentIds={fragmentIds}
              project={project}
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 relative mt-12 bg-foreground/5 rounded-xl my-2 mx-3 overflow-hidden">
          {activeTab === "preview" && (
            <PreviewPanel
              content={activeFragment?.readme ? activeFragment?.readme : ""}
            />
          )}
          {activeTab === "design" && (
            <DesignPanel
              content={activeFragment?.readme ? activeFragment?.readme : ""}
            />
          )}
          {activeTab === "code" && (
            <CodePanel
              content={activeFragment?.readme ? activeFragment?.readme : ""}
            />
          )}
          {activeTab === "context" && project && (
            <ContextPanel
              initialContextFiles={project.contextFiles}
              contextFiles={localContextFiles}
              setContextFiles={setLocalContextFiles}
              allFiles={project.allFiles}
            />
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
export default ProjectView;
