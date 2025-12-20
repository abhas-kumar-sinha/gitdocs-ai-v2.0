"use client"

import { UserButton } from "@clerk/nextjs"
import MarkdownPreview from "../project/tabs/PreviewPanel"
import { ProjectWithChildren } from "@/modules/projects/server/procedures";
import { Button } from "../ui/button";
import { Star } from "lucide-react";

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

const ProjectMiniPreview = ({ project }: { project: ProjectWithChildren }) => {
  const readmeContent = project.messages?.[0]?.fragment?.readme || "";

  return (
    <div className="group relative flex flex-col gap-2 transition-all duration-200 cursor-pointer">

      <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <Star />
      </Button>
      
      {/* Preview Box */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted/10 border border-border/40 shadow-sm">
        <MarkdownPreview 
          content={readmeContent} 
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
}

export default ProjectMiniPreview