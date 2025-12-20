"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { useTRPC } from "@/trpc/client"
import { FaGithub } from "react-icons/fa"
import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Repository } from "@/generated/prisma/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRepositoryContext } from "@/contexts/RepositoryContext"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { ChevronDown, Eye, Lock, LucideIcon, Shield } from "lucide-react"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"

interface SidebarItemProp {
    Item: {
        icon: LucideIcon;
        label: string;
        href: string;
    };
    isSidebarOpen: boolean;
}

const SidebarItem = ({Item, isSidebarOpen} : SidebarItemProp) => {

  const router = useRouter();

  return (
    <>
    {!isSidebarOpen ?
        <Tooltip>
        <TooltipTrigger asChild>
            <Button onClick={(e) => {e.stopPropagation(); router.push(Item.href)}} size="sm" variant="sidebarButton" className="w-full justify-start">
            <Item.icon className="group-hover/button:scale-110" />
            <span className={cn("ms-1", isSidebarOpen ? "" : "hidden")}>
                {Item.label}
            </span>
            </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
            {Item.label}
        </TooltipContent>
    </Tooltip>
    :
    <Button onClick={(e) => {e.stopPropagation(); router.push(Item.href)}} size="sm" variant="sidebarButton" className="w-full justify-start">
        <Item.icon className="group-hover/button:scale-110" />
        <span className={cn("ms-1", isSidebarOpen ? "" : "hidden")}>
            {Item.label}
        </span>
    </Button>
    }
    </>
  )
}

const GithubConnectionItem = ({ isSidebarOpen } : {isSidebarOpen : boolean}) => {

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { repositories, setRepositories, setIsLoading } = useRepositoryContext();

  const { data: userInstallations, isLoading } = useQuery(trpc.installation.list.queryOptions());

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const computedRepos = useMemo(() => {
    if (!userInstallations || userInstallations.length === 0) return [] as Repository[];

    const allRepos = userInstallations.flatMap((inst) => inst.repositories ?? []);

    const map = new Map<string | number, Repository>();
    for (const r of allRepos) {
      map.set(r.id, r);
    }
    const arr = Array.from(map.values());

    arr.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return arr;
  }, [userInstallations]);

  useEffect(() => {
    const a = repositories ?? [];
    const b = computedRepos;

    const same =
      a.length === b.length &&
      a.every((ar, i) => {
        const br = b[i];
        const aTime = typeof ar.updatedAt === "string" ? new Date(ar.updatedAt).getTime() : ar.updatedAt.getTime();
        const bTime = typeof br.updatedAt === "string" ? new Date(br.updatedAt).getTime() : br.updatedAt.getTime();
        return ar.id === br.id && aTime === bTime;
      });

    if (!same) {
      setRepositories(b);
    }
  }, [computedRepos, repositories, setRepositories]);

  const install = () => {
    
    const popup = window.open(
      "/api/auth/github",
      "github-install",
      "width=850,height=500,top=100,left=100,resizable=yes,scrollbars=yes"
    );

    if (!popup) return;

    const timer = setInterval(async () => {
      if (popup.closed) {
        clearInterval(timer);
      }
    }, 500);

  };

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.origin) return;

      if (event.data?.type === "GITHUB_INSTALL_SUCCESS") {
        queryClient.invalidateQueries(trpc.installation.list.queryOptions());
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  });

  return (
    <>
    {!isLoading && userInstallations && userInstallations?.length > 0 
    ?
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full outline-none focus:outline-none focus-visible:outline-none">
        <button onClick={(e) => {e.stopPropagation()}} className="cursor-pointer w-full my-1.5 py-1 px-[4.5px] border border-neutral-700/50 group/button rounded-md bg-background hover:bg-neutral-300/50 dark:hover:bg-neutral-700/50 flex items-center text-foreground hover:text-foreground/90">
          <div className="flex shrink-0 items-center justify-center p-0.5 rounded-md">
            <Image src={userInstallations[0].accountAvatarUrl as string} className="rounded-md" alt="user" width={21} height={21} />
          </div>
          <span className={cn("ms-2 whitespace-nowrap text-sm", isSidebarOpen ? "" : "hidden")}>
            {userInstallations[0].accountName || "No Name Configured"}
          </span>
          <ChevronDown className="ms-auto me-2" size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        sideOffset={-1} 
        onClick={(e) => e.stopPropagation()} 
        className={cn("w-64", isSidebarOpen ? "ms-1" : "ms-[10px]")}
      >
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5">
          Permission Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={install} className="flex flex-col items-start gap-1 py-3 cursor-pointer">
          <div className="flex items-center gap-2 w-full">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">With Commit Access</p>
              <p className="text-xs text-muted-foreground">
                Can push commits and merge pull requests
              </p>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={install} className="flex flex-col items-start gap-1 py-3 cursor-pointer">
          <div className="flex items-center gap-2 w-full">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Without Commit Access</p>
              <p className="text-xs text-muted-foreground">
                Read-only access to repository content
              </p>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <div className="px-3 py-2.5 bg-muted/50">
          <div className="flex items-start gap-2">
            <Shield className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gitdocs AI never pushes directly to your main branch. All changes are made via pull requests that you review and merge.
            </p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
    :
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full outline-none focus:outline-none focus-visible:outline-none">
        <button onClick={(e) => {e.stopPropagation()}} className="cursor-pointer w-full my-1.5 py-1 px-[4.5px] border border-neutral-700/50 group/button rounded-md bg-background hover:bg-neutral-300/50 dark:hover:bg-neutral-700/50 flex items-center text-foreground hover:text-foreground/90">
          <div className="flex items-center justify-center bg-accent py-1 px-[5px] rounded-md">
            <FaGithub size={15} />
          </div>
          <span className={cn("ms-2 whitespace-nowrap text-sm font-semibold", isSidebarOpen ? "" : "hidden")}>
            Connect Github
          </span>
          <ChevronDown className="ms-auto me-2" size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        sideOffset={-1} 
        onClick={(e) => e.stopPropagation()} 
        className={cn("w-64", isSidebarOpen ? "ms-1" : "ms-[10px]")}
      >
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5">
          Permission Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={install} className="flex flex-col items-start gap-1 py-3 cursor-pointer">
          <div className="flex items-center gap-2 w-full">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">With Commit Access</p>
              <p className="text-xs text-muted-foreground">
                Can push commits and merge pull requests
              </p>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={install} className="flex flex-col items-start gap-1 py-3 cursor-pointer">
          <div className="flex items-center gap-2 w-full">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Without Commit Access</p>
              <p className="text-xs text-muted-foreground">
                Read-only access to repository content
              </p>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <div className="px-3 py-2.5 bg-muted/50">
          <div className="flex items-start gap-2">
            <Shield className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gitdocs AI never pushes directly to your main branch. All changes are made via pull requests that you review and merge.
            </p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  }
    </>
  )
}

export { SidebarItem, GithubConnectionItem }