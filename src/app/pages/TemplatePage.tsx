"use client";

import { cn } from "@/lib/utils";
import TemplateList from "@/components/template/TemplateList";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { TemplateId } from "@/components/project/context-selection/TemplateList";
import { templates } from "@/lib/constants/CONSTANTS";

export interface Template {
  id: TemplateId
  title: string
  description: string
  content: string
  tags: string[]
}

const TemplatePage = () => {
  const { isSidebarOpen } = useSidebarContext();                                                                                                                                                                            

  return (
    <div className="w-full px-4 md:px-13 py-10">
      {/* Header & Controls */}
      <h2 className="text-xl font-semibold px-1 mb-2 invisible md:visible">Templates</h2>
      <p className="mb-12 ms-1 text-foreground/70">Templates are pre-built project configurations that you can use to create new projects.</p>

      {/* Content Area */}
      <div className="min-h-1/2 bg-background rounded-2xl w-full mx-auto mb-10">
        {/* Show skeleton while loading */}

        <div className={cn("grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative lg:px-0", isSidebarOpen ? "md:px-25" : "")}>
          {/* Project List */}
          <TemplateList templates={templates} />
        </div>
      </div>
    </div>
  );
};

export default TemplatePage;