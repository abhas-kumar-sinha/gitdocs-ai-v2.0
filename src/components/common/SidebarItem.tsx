"use client"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { ChevronDown, Eye, Github, Lock, LucideIcon, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { Status } from "@/generated/prisma/enums"
import { useEffect } from "react"


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

  const { data: userInstallations, isLoading } = useQuery(trpc.installation.list.queryOptions());

  const updateInstallProcessMutation = useMutation(
    trpc.installationProcess.update.mutationOptions()
  );

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
        updateInstallProcessMutation.mutate({ status: Status.FAILED })
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
      <DropdownMenuTrigger className="w-full outline-none focus:outline-none focus-visible:outline-none">
        <button onClick={(e) => {e.stopPropagation()}} className="cursor-pointer w-full my-1.5 py-1 px-[4.5px] border border-neutral-700/50 group/button rounded-md bg-background hover:bg-neutral-300/50 dark:hover:bg-neutral-700/50 flex items-center text-foreground hover:text-foreground/90">
          <div className="flex shrink-0 items-center justify-center bg-accent py-1 px-[5px] rounded-md">
            <Image src={userInstallations[0].accountAvatarUrl as string} alt="user" width={15} height={15} />
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
      <DropdownMenuTrigger className="w-full outline-none focus:outline-none focus-visible:outline-none">
        <button onClick={(e) => {e.stopPropagation()}} className="cursor-pointer w-full my-1.5 py-1 px-[4.5px] border border-neutral-700/50 group/button rounded-md bg-background hover:bg-neutral-300/50 dark:hover:bg-neutral-700/50 flex items-center text-foreground hover:text-foreground/90">
          <div className="flex items-center justify-center bg-accent py-1 px-[5px] rounded-md">
            <Github size={15} />
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