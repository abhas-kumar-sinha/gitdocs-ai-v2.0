"use client"

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { useTRPC } from "@/trpc/client";
import { UserButton } from "@clerk/nextjs"
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import MarkdownPreview from "../project/tabs/PreviewPanel";
import { useRouter, useSearchParams } from "next/navigation";
import { ProjectWithChildren } from "@/modules/projects/server/procedures";

const timeAgo = (date: Date | string) => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return new Date(date).toLocaleDateString();
};

const ProjectList = ({projects: initialProjects} : {projects: ProjectWithChildren[]}) => {
  const trpc = useTRPC();
  const router = useRouter();

  const searchParams = useSearchParams();

  const isStarred = searchParams.get("filter") === "starred";
  
  // Local state to track projects
  const [projects, setProjects] = useState(initialProjects);

  // Sync local state when prop changes
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const updateProject = useMutation(trpc.project.updateStarred.mutationOptions({
    onError: () => {
      toast.error("Failed to update project");
    },
    onSuccess: ({ id, isStarred }) => {
      setProjects(prev => 
        prev.map(project => 
          project.id === id 
            ? { ...project, isStarred } 
            : project
        )
      );
      toast.success("Project updated successfully");
    }
  }));
  
  return (
    <>
    {(isStarred ? projects.filter(project => project.isStarred) : projects).map((project, idx) => {
      if (!project.messages[0]?.fragment?.readme) return null;
      
      return (
        <div key={idx} className="group relative flex flex-col gap-2 transition-all duration-200 cursor-pointer">

          <Button 
            disabled={updateProject.isPending} 
            onClick={() => updateProject.mutate({ id: project.id, isStarred: !project.isStarred })} 
            variant="outline" 
            size="icon-sm" 
            className={cn("absolute border-none top-2 right-2 z-10 transition-all duration-200", project.isStarred ? "" : "opacity-0 group-hover:opacity-100")}
          >
            {project.isStarred ? <Star fill="#EAB308" stroke="none" /> : <Star />}
          </Button>
          
          {/* Preview Box */}
          <div onClick={() => router.push(`/projects/${project.id}`)} className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted/10 border border-border/40 shadow-sm">
            <MarkdownPreview 
              content={project.messages?.[0]?.fragment?.readme || ""} 
              view="min"
            />
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 mt-1.5 pointer-events-none">
                <UserButton />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="truncate text-sm font-medium text-foreground/90 leading-tight">
                  {project.name}
                </p>
                <span className="text-[10px] text-muted-foreground truncate">
                  Last edited {timeAgo(project.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    })}
    </>
  )
}
export default ProjectList