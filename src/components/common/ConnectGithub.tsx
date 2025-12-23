"use client"

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useEffect, ReactNode } from "react";
import { Eye, Lock, Shield } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"

const ConnectGithub = ({ children, isSidebarOpen }: { children: ReactNode, isSidebarOpen: boolean }) => {

  const trpc = useTRPC();
  const queryClient = useQueryClient();
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full outline-none focus:outline-none focus-visible:outline-none">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        sideOffset={4} 
        onClick={(e) => e.stopPropagation()} 
        className={cn("w-64", isSidebarOpen ? "ms-1" : "ms-[10px]")}
        side="bottom"
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
  )
}
export default ConnectGithub