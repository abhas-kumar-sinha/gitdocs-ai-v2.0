"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { useTRPC } from "@/trpc/client"
import { FaGithub } from "react-icons/fa"
import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Repository } from "@/generated/prisma/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRepositoryContext } from "@/contexts/RepositoryContext"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { ChevronDown, Eye, Info, Lock, LucideIcon, Shield, Zap } from "lucide-react"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"

interface SidebarItemProp {
    Item: {
        icon: LucideIcon;
        label: string;
        href: string;
    };
    isSidebarOpen: boolean;
    setIsCommandOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarItem = ({Item, isSidebarOpen, setIsCommandOpen} : SidebarItemProp) => {

  const router = useRouter();

  const handleClick = (e : React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (Item.label === "Search") {
      setIsCommandOpen?.(true);
    } else {
      router.push(Item.href);
    }
  }

  return (
    <>
    {!isSidebarOpen ?
        <Tooltip>
        <TooltipTrigger asChild>
            <Button onClick={(e) => {handleClick(e)}} size="sm" variant="sidebarButton" className="w-full justify-start">
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
    <Button onClick={(e) => {handleClick(e)}} size="sm" variant="sidebarButton" className="w-full justify-start">
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

  const install = (permission: string) => {
    
    const popup = window.open(
      `/api/auth/github?permissions=${permission}`,
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
        sideOffset={4} 
        onClick={(e) => e.stopPropagation()} 
        className={cn("w-64", isSidebarOpen ? "ms-1" : "ms-[10px]")}
      >
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5">
          <div className="flex items-center gap-x-2">
            <div className="flex shrink-0 items-center justify-center p-0.5 rounded-md">
              <Image src={userInstallations[0].accountAvatarUrl as string} className="rounded-md cursor-pointer" alt="user" width={32} height={32} />
            </div>
            <div className="flex flex-col items-start">
              <span className="whitespace-nowrap text-sm text-foreground">
                {userInstallations[0].accountName || "No Name Configured"}
              </span>
              <span className="text-xs text-muted-foreground">
                Basic Plan • {userInstallations[0].permissions === "READ" ? "Read Only" : "Write Access"}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        
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
                  <p>Configure and use your own API keys with a custom provider.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Button className="h-7 border-primary bg-accent/30 hover:bg-accent/40 text-primary" >Request</Button>
          </div>
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
        
        <DropdownMenuItem onClick={() => install("write")} className="flex flex-col items-start gap-1 py-3 cursor-pointer">
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

        <DropdownMenuItem onClick={() => install("read")} className="flex flex-col items-start gap-1 py-3 cursor-pointer">
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