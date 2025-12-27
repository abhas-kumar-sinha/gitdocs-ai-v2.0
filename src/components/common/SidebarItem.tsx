"use client";

import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useTRPC } from "@/trpc/client";
import { FaGithub } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ConnectGithub from "./ConnectGithub";
import { Progress } from "@/components/ui/progress";
import { Repository } from "@/generated/prisma/client";
import { useRepositoryContext } from "@/contexts/RepositoryContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertCircle,
  ChevronDown,
  CircleFadingArrowUp,
  Files,
  GitBranch,
  GitPullRequestArrow,
  Info,
  LucideIcon,
  MessageSquare,
  Settings,
  Shield,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectWithChildren } from "@/modules/projects/server/procedures";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SidebarItemProp {
  Item: {
    icon: LucideIcon;
    label: string;
    href: string;
  };
  isSidebarOpen: boolean;
  setIsCommandOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarItem = ({
  Item,
  isSidebarOpen,
  setIsCommandOpen,
}: SidebarItemProp) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (Item.label === "Search") {
      setIsCommandOpen?.(true);
    } else {
      router.push(Item.href);
    }
  };

  return (
    <>
      {!isSidebarOpen ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={(e) => {
                handleClick(e);
              }}
              size="sm"
              variant="sidebarButton"
              className="w-full justify-start"
            >
              <Item.icon className="group-hover/button:scale-110" />
              <span className={cn("ms-1", isSidebarOpen ? "" : "hidden")}>
                {Item.label}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{Item.label}</TooltipContent>
        </Tooltip>
      ) : (
        <Button
          onClick={(e) => {
            handleClick(e);
          }}
          size="sm"
          variant="sidebarButton"
          className="w-full justify-start"
        >
          <Item.icon />
          <span className={cn("ms-1", isSidebarOpen ? "" : "hidden")}>
            {Item.label}
          </span>
        </Button>
      )}
    </>
  );
};

const GithubConnectionItem = ({
  isSidebarOpen,
  showCommitButton,
  fragmentIds,
  activeFragmentId,
  project,
}: {
  isSidebarOpen: boolean;
  showCommitButton?: boolean;
  fragmentIds?: (string | undefined)[];
  activeFragmentId?: string;
  project?: ProjectWithChildren;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { repositories, setRepositories, setIsLoading } =
    useRepositoryContext();
  const [branchName, setBranchName] = useState<string>("");
  const [commitMessage, setCommitMessage] = useState<string>("");
  const [commitVersion, setCommitVersion] = useState<string>(
    activeFragmentId || "",
  );

  const { data: userInstallations, isLoading } = useQuery(
    trpc.installation.list.queryOptions(),
  );
  const { data: aiUsage, isLoading: isAiUsageLoading } = useQuery(
    trpc.aiUsage.getUsage.queryOptions(),
  );

  const updateInstallation = useMutation(
    trpc.installation.updateInstallationAccess.mutationOptions({
      onError: () => {
        toast.error("App Access Update Failed!");
      },
      onSuccess: () => {
        toast.success("App Access Updated Successfully");
        queryClient.invalidateQueries({
          queryKey: [["installation", "list"]],
        });
      },
    }),
  );

  const syncRepositories = useMutation(
    trpc.installation.syncRepositories.mutationOptions({
      onSuccess: () => {
        toast.success("Repository sync in progress");
      },
      onError: () => {
        toast.error("Failed to sync repository");
      },
    }),
  );

  const createPr = useMutation(
    trpc.project.createPr.mutationOptions({
      onSuccess: () => {
        toast.success("Job in Progress");
      },
      onError: () => {
        toast.error("Job failed");
      },
    }),
  );

  const handleCreatePr = () => {
    if (!project || !commitMessage || !commitVersion || !branchName) {
      toast.error("Please fill all the details");
      return;
    }

    createPr.mutate({
      id: project.id,
      commitMessage,
      commitBranch: branchName,
      fragmentId: commitVersion,
    });
  };

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const computedRepos = useMemo(() => {
    if (!userInstallations || userInstallations.length === 0)
      return [] as Repository[];

    const allRepos = userInstallations.flatMap(
      (inst) => inst.repositories ?? [],
    );

    const map = new Map<string | number, Repository>();
    for (const r of allRepos) {
      map.set(r.id, r);
    }
    const arr = Array.from(map.values());

    arr.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    return arr;
  }, [userInstallations]);

  useEffect(() => {
    const a = repositories ?? [];
    const b = computedRepos;

    const same =
      a.length === b.length &&
      a.every((ar, i) => {
        const br = b[i];
        const aTime =
          typeof ar.updatedAt === "string"
            ? new Date(ar.updatedAt).getTime()
            : ar.updatedAt.getTime();
        const bTime =
          typeof br.updatedAt === "string"
            ? new Date(br.updatedAt).getTime()
            : br.updatedAt.getTime();
        return ar.id === br.id && aTime === bTime;
      });

    if (!same) {
      setRepositories(b);
    }
  }, [computedRepos, repositories, setRepositories]);

  return (
    <>
      {!isLoading && userInstallations && userInstallations?.length > 0 ? (
        <div className="flex items-center w-full">
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="w-full outline-none focus:outline-none focus-visible:outline-none"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="cursor-pointer w-full my-1.5 py-1 px-[4.5px] border border-neutral-700/50 group/button rounded-md bg-background hover:bg-neutral-300/50 dark:hover:bg-neutral-700/50 flex items-center text-foreground hover:text-foreground/90"
              >
                <div className="flex shrink-0 items-center justify-center p-0.5 rounded-md">
                  <Image
                    src={userInstallations[0].accountAvatarUrl as string}
                    className="rounded-md"
                    alt="user"
                    width={21}
                    height={21}
                  />
                </div>
                <span
                  className={cn(
                    "ms-2 whitespace-nowrap text-sm",
                    isSidebarOpen ? "" : "hidden",
                  )}
                >
                  {userInstallations[0].accountName || "No Name Configured"}
                </span>
                <ChevronDown
                  className={cn("ms-auto me-2", isSidebarOpen ? "" : "hidden")}
                  size={18}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              sideOffset={4}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-64 bg-secondary",
                isSidebarOpen ? "ms-1" : "ms-[10px]",
              )}
            >
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                <div className="flex items-center gap-x-2">
                  <div className="flex shrink-0 items-center justify-center p-0.5 rounded-md">
                    <Image
                      src={userInstallations[0].accountAvatarUrl as string}
                      className="rounded-md cursor-pointer"
                      alt="user"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="whitespace-nowrap text-sm text-foreground">
                      {userInstallations[0].accountName || "No Name Configured"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Basic Plan •{" "}
                      {userInstallations[0].permissions === "READ"
                        ? "Read Only"
                        : "Write Access"}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <div className="flex items-center gap-x-2 my-2 px-1">
                <Button
                  onClick={() =>
                    updateInstallation.mutate({
                      installationId: userInstallations[0].id,
                    })
                  }
                  variant="outline"
                  size="sm"
                  className="flex-1 border-none text-xs h-7"
                >
                  <Settings className="h-3.5! w-3.5!" />
                  Update Access
                </Button>
                <Button
                  onClick={() =>
                    syncRepositories.mutate({
                      installationId: userInstallations[0].id,
                    })
                  }
                  variant="outline"
                  size="sm"
                  className="w-24 border-none text-xs h-7"
                >
                  <CircleFadingArrowUp className="h-3.5! w-3.5!" />
                  Sync
                </Button>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>
                <div className="flex items-center justify-between bg-background/70 rounded-md p-3 -mx-1.5">
                  <div className="flex items-center gap-x-2">
                    <Zap size={18} fill="white" />
                    <span>Go Pro</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-2.5 w-2.5 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>
                          Configure and use your own API keys with a custom
                          provider.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Button className="h-7 border-primary bg-accent/30 hover:bg-accent/40 text-primary">
                    Request
                  </Button>
                </div>
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
                          (((aiUsage?.maxCount || 5) - (aiUsage?.count || 0)) /
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

              <div className="px-3 py-2.5 bg-muted/50">
                <div className="flex items-start gap-2">
                  <Shield className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Gitdocs AI never pushes directly to your main branch. All
                    changes are made via pull requests that you review and
                    merge.
                  </p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                disabled={userInstallations[0].permissions === "READ"}
                variant="default"
                size="sm"
                className={cn(
                  "h-7",
                  showCommitButton ? "visible ms-2" : "hidden",
                )}
              >
                <GitPullRequestArrow />
                Commit Changes
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Commit Changes</SheetTitle>
                <SheetDescription>
                  Update documentation for {project?.repository?.fullName}
                </SheetDescription>
              </SheetHeader>
              <div className="h-px w-full bg-foreground/10 -mt-4" />
              <div className="px-4 gap-y-6 flex flex-col overflow-y-scroll">
                {/* Alerts Section */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-200">
                      New Branch Required
                    </p>
                    <p className="text-xs text-amber-200/70 mt-0.5">
                      Direct commits to{" "}
                      <code className="bg-amber-500/20 px-1 rounded">
                        {project?.repository?.defaultBranch}
                      </code>{" "}
                      are restricted. This action will create a new branch and
                      open a Pull Request.
                    </p>
                  </div>
                </div>

                {/* Repository Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    <Info className="w-3.5 h-3.5" />
                    Repository Context
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400 shrink-0">
                        Target Repo
                      </span>
                      <span className="text-zinc-100 font-mono text-end ms-2">
                        {project?.repository?.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Base Branch</span>
                      <span className="text-zinc-100 font-mono text-end ms-2">
                        {project?.repository?.defaultBranch}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Branch Name */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    <GitBranch className="w-3.5 h-3.5" />
                    New Branch Name
                  </label>
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="e.g. docs/update-readme"
                    required
                  />
                </div>

                {/* README Version Selection */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    <Files className="w-3.5 h-3.5" />
                    Select Version to Commit
                  </label>
                  <Select
                    value={commitVersion}
                    onValueChange={setCommitVersion}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Readme version" />
                    </SelectTrigger>

                    <SelectContent>
                      {fragmentIds?.map((id, idx) => (
                        <SelectItem key={id} value={id ?? ""}>
                          Readme Version: {idx + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Commit Message */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Commit Message
                  </label>
                  <textarea
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all min-h-[100px] resize-none"
                    placeholder="Describe the changes..."
                    required
                  />
                </div>

                {/* Actions */}
                <div className="-mt-2 mb-10 flex gap-x-2">
                  <Button
                    onClick={handleCreatePr}
                    disabled={createPr.isPending}
                    className={`bg-blue-600 flex-1 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2`}
                  >
                    {createPr.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Committing...
                      </>
                    ) : (
                      "Confirm & Create Pull Request"
                    )}
                  </Button>
                  <SheetClose asChild>
                    <Button className="bg-transparent border border-white/10 hover:bg-white/5 text-zinc-300 font-medium rounded-lg transition-all">
                      Cancel
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <ConnectGithub isSidebarOpen={isSidebarOpen}>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="cursor-pointer w-full my-1.5 py-1 px-[4.5px] border border-neutral-700/50 group/button rounded-md bg-background hover:bg-neutral-300/50 dark:hover:bg-neutral-700/50 flex items-center text-foreground hover:text-foreground/90"
          >
            <div className="flex items-center justify-center bg-accent py-1 px-[5px] rounded-md">
              <FaGithub size={15} />
            </div>
            <span
              className={cn(
                "ms-2 whitespace-nowrap text-sm font-semibold",
                isSidebarOpen ? "" : "hidden",
              )}
            >
              Connect Github
            </span>
            <ChevronDown
              className={cn("ms-auto me-2", isSidebarOpen ? "" : "hidden")}
              size={18}
            />
          </button>
        </ConnectGithub>
      )}
    </>
  );
};

export { SidebarItem, GithubConnectionItem };
