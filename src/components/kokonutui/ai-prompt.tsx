"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SmoothTab, { TabItem } from "./smooth-tab";
import { Textarea } from "@/components/ui/textarea";
import { Repository } from "@/generated/prisma/client";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Book, ChevronRight, Loader2, Plus } from "lucide-react";
import RepositoryList from "../project/context-selection/RepositoryList";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import TemplateList, {
  TemplateId,
} from "../project/context-selection/TemplateList";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ShimmerText from "./shimmer-text";
import ConnectGithub from "../common/ConnectGithub";
import { useAiContext } from "@/contexts/AiContext";

export default function AI_Prompt({
  isActive,
  projectId,
  repository,
}: {
  isActive: boolean;
  projectId?: string;
  repository?: Repository;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");
  const { isGenerating, setIsGenerating } = useAiContext();
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>("ai-gen");
  const { data: userInstallations, isLoading } = useQuery(
    trpc.installation.list.queryOptions(),
  );
  const [selectedRepository, setSelectedRepository] =
    useState<Repository | null>(repository ? repository : null);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: isActive ? 50 : 80,
    maxHeight: 250,
  });

  const items: TabItem[] = [
    {
      id: "Repositories",
      title: "Repositories",
      color: "bg-blue-500 hover:bg-blue-600",
      cardContent: (
        <div className="relative h-full">
          <RepositoryList
            selected={selectedRepository}
            setSelected={setSelectedRepository}
            userInstallations={userInstallations}
          />
        </div>
      ),
    },
    {
      id: "Templates",
      title: "Templates",
      color: "bg-purple-500 hover:bg-purple-600",
      cardContent: (
        <div className="relative h-full">
          <TemplateList
            selected={selectedTemplate}
            setSelected={setSelectedTemplate}
          />
        </div>
      ),
    },
  ];

  const createProject = useMutation(
    trpc.project.create.mutationOptions({
      onError: () => {
        setIsGenerating(false);
        toast.error("Failed to create project");
      },
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
      },
    }),
  );

  const createMessage = useMutation(
    trpc.message.create.mutationOptions({
      onError: () => {
        setIsGenerating(false);
        toast.error("Failed to send message");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [["message", "getMany"], { input: { projectId } }],
        });
      },
    }),
  );

  const { data: aiUsage, isLoading: isAiUsageLoading } = useQuery(
    trpc.aiUsage.getUsage.queryOptions(),
  );

  const handleCreateMessage = () => {
    if (
      !value.trim() ||
      !isActive ||
      !projectId ||
      isGenerating ||
      isAiUsageLoading
    )
      return;

    if (!aiUsage || aiUsage.maxCount - aiUsage.count <= 0) {
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-medium text-base">
            You’re all set for today
          </span>
          <span className="text-sm text-muted-foreground">
            You’ve reached today’s usage limit.
          </span>
          <span className="text-sm text-muted-foreground">
            New credits will be available tomorrow.
          </span>
          <span className="text-sm text-muted-foreground">
            Take a break — we’ll be ready when you’re back 🙂
          </span>
        </div>,
      );

      return;
    }

    setIsGenerating(true);

    createMessage.mutate({
      value: value,
      projectId: projectId,
    });

    setValue("");
    adjustHeight(true);
  };

  const handleCreateProject = () => {
    if (!value.trim() || !isActive || isGenerating || isAiUsageLoading) return;

    if (!selectedRepository) {
      toast.error("Please select a repository");
      return;
    }

    if (!aiUsage || aiUsage.maxCount - aiUsage.count <= 0) {
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-medium text-base">
            You’re all set for today
          </span>
          <span className="text-sm text-muted-foreground">
            You’ve reached today’s usage limit.
          </span>
          <span className="text-sm text-muted-foreground">
            New credits will be available tomorrow.
          </span>
          <span className="text-sm text-muted-foreground">
            Take a break — we’ll be ready when you’re back 🙂
          </span>
        </div>,
      );

      return;
    }

    setIsGenerating(true);

    createProject.mutate({
      name: selectedRepository.name,
      prompt: value,
      repositoryId: selectedRepository.id,
      template: selectedTemplate,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!value.trim() || isGenerating || isAiUsageLoading) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (projectId) {
        handleCreateMessage();
      } else {
        handleCreateProject();
      }
    }
  };

  return (
    <div className="relative flex flex-col bg-sidebar rounded-3xl pt-4">
      <div className="overflow-y-auto px-2" style={{ maxHeight: "250px" }}>
        <Textarea
          className={cn(
            "w-full text-base! resize-none rounded-xl bg-transparent! rounded-b-none border-none pt-0! -mt-1.5 placeholder-shown:pt-1! placeholder:text-black/70 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white dark:placeholder:text-white/60",
            isActive ? "min-h-[50px]" : "min-h-[80px]",
          )}
          id="ai-input-15"
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder={"Ask Gitdocs to Generate a new Readme..."}
          ref={textareaRef}
          value={value}
        />
      </div>

      <div className="flex h-14 items-center rounded-b-xl">
        <div className="absolute right-3 bottom-3 left-3 flex w-[calc(100%-24px)] items-center justify-between">
          <div className="flex items-center gap-2">
            <SignedIn>
              {!isLoading ? (
                userInstallations?.length === 0 ? (
                  <ConnectGithub isSidebarOpen={true}>
                    <Button
                      disabled={!!projectId}
                      variant="outline"
                      className="flex h-8 items-center gap-1 rounded-full ps-4! pe-3! ms-1 text-xs hover:bg-black/10 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 dark:text-white dark:hover:bg-white/10"
                    >
                      <Plus />
                      <span>Connect GitHub</span>
                      <ChevronRight />
                    </Button>
                  </ConnectGithub>
                ) : (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        disabled={!!projectId}
                        variant="outline"
                        className="flex h-8 items-center gap-1 rounded-full ps-4! pe-3! ms-1 text-xs hover:bg-black/10 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 dark:text-white dark:hover:bg-white/10"
                      >
                        <Book className="h-3.5! w-3.5!" />
                        {selectedRepository &&
                        selectedTemplate &&
                        selectedTemplate !== "ai-gen" ? (
                          <span className="mx-1 flex items-center gap-1">
                            <span className="truncate max-w-[60px] md:max-w-[120px]">
                              {selectedRepository.name}
                            </span>
                            <span className="hidden md:block">•</span>
                            <span className="truncate hidden md:block md:max-w-[100px]">
                              {selectedTemplate}
                            </span>
                          </span>
                        ) : selectedRepository ? (
                          <span className="mx-1 truncate max-w-[60px] md:max-w-[200px]">
                            {selectedRepository.name}
                          </span>
                        ) : (
                          <>{<span className="mx-1">Select Repository</span>}</>
                        )}
                        <ChevronRight />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="bg-sidebar">
                      <SheetHeader>
                        <SheetTitle>Documentation Setup</SheetTitle>
                      </SheetHeader>
                      <div className="flex h-full flex-col px-2 -mt-5">
                        <SmoothTab items={items} defaultTabId="Repositories" />
                      </div>
                    </SheetContent>
                  </Sheet>
                )
              ) : (
                <Button
                  disabled={!!projectId}
                  variant="outline"
                  className="flex h-8 items-center gap-1 rounded-full ps-4! pe-3! ms-1 text-xs hover:bg-black/10 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 dark:text-white dark:hover:bg-white/10"
                >
                  <Loader2 className="animate-spin" />
                  <ShimmerText
                    text="Authenticating..."
                    className="text-xs -px-5"
                  />
                  <ChevronRight />
                </Button>
              )}
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal">
                <Button
                  variant="outline"
                  className="flex h-8 items-center gap-1 rounded-full ps-4! pe-3! ms-1 text-xs hover:bg-black/10 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 dark:text-white dark:hover:bg-white/10"
                >
                  <Book className="h-3.5! w-3.5!" />
                  <span className="mx-1">Select Repository</span>
                  <ChevronRight />
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
          <button
            aria-label="Send message"
            onClick={projectId ? handleCreateMessage : handleCreateProject}
            className={cn(
              "rounded-full bg-black/5 p-2 dark:bg-white/5",
              "hover:bg-black/10 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 dark:hover:bg-white/10",
              !value.trim()
                ? "opacity-30 cursor-not-allowed"
                : "cursor-pointer",
            )}
            disabled={!value.trim() || isGenerating || isAiUsageLoading || !isActive}
            type="button"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight
                className={cn(
                  "h-4 w-4 transition-opacity duration-200 dark:text-white",
                  value.trim() ? "opacity-100" : "opacity-30",
                )}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
