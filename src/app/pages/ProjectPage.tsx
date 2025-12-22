"use client";

import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { useState, useMemo, Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import ProjectList from "@/components/project/ProjectList";
import { Search, Plus, ChevronDown, Check } from "lucide-react";
import {InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

function ProjectsSkeleton() {
  return (
    <div className="grid md:px-20 lg:px-0 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col gap-y-2">
          <div className="h-48 w-full rounded-xl bg-muted/50 animate-pulse" />
          
          <div className="flex gap-x-2">
            <div className="h-10 w-10 rounded-full bg-muted/50 animate-pulse" />
            <div className="flex flex-col gap-y-1">
              <div className="h-5 w-30 rounded-xl bg-muted/50 animate-pulse" />
              <div className="h-5 w-40 rounded-xl bg-muted/50 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const ProjectBoard = () => {

  const trpc = useTRPC();

  const { data: initialProjects } = useSuspenseQuery(trpc.project.list.queryOptions());

  const [searchQuery, setSearchQuery] = useState("");
  
  // Sort State: Default to 'updatedAt' and 'desc' (Newest first)
  const [sortBy, setSortBy] = useState<"updatedAt" | "createdAt" | "name">("updatedAt");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");

  const { isSidebarOpen } = useSidebarContext();

  const filteredProjects = useMemo(() => {
    let data = [...initialProjects];

    if (searchQuery) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    data.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "updatedAt" || sortBy === "createdAt") {
        valA = new Date(valA as Date).getTime().toString();
        valB = new Date(valB as Date).getTime().toString();
      } else {
        valA = (valA as string).toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return orderBy === "asc" ? -1 : 1;
      if (valA > valB) return orderBy === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [initialProjects, searchQuery, sortBy, orderBy]);

  return (
    <div className="w-full px-4 md:px-13 py-10">
      
      {/* Header & Controls */}
      <h2 className="text-xl font-semibold mb-12 px-1 invisible md:visible">Projects</h2>
      <div className="flex mb-8 gap-4 justify-between">
          {/* Search Bar */}
          <InputGroup className="max-w-72">
            <InputGroupInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search projects..." />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              {searchQuery && `${filteredProjects.length} results`}
            </InputGroupAddon>
          </InputGroup>

          <div className="flex items-center gap-x-4">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-40 flex items-center justify-between ps-3!">
                  {sortBy === "updatedAt" ? "Last Edited" : sortBy === "createdAt" ? "Date Created" : "Alphabetical"}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" className="-ms-3 min-w-37">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => {e.preventDefault(); setSortBy("updatedAt")}} >
                  Last Edited
                  {sortBy === "updatedAt" && <Check className="ms-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {e.preventDefault(); setSortBy("createdAt")}}>
                  Date Created
                  {sortBy === "createdAt" && <Check className="ms-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {e.preventDefault(); setSortBy("name")}}>
                  Alphabetical
                  {sortBy === "name" && <Check className="ms-auto" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Order</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => {e.preventDefault(); setOrderBy("desc")}}>
                  Newest First
                  {orderBy === "desc" && <Check className="ms-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {e.preventDefault(); setOrderBy("asc")}}>
                  Oldest First
                  {orderBy === "asc" && <Check className="ms-auto" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
      </div>

      {/* Content Area */}
      <div className="min-h-1/2 bg-background rounded-2xl w-full mx-auto mb-10">
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative lg:px-0", isSidebarOpen ? "md:px-25" : "")}>
          
          {/* 1. Add New Project Card (Always first in Grid) */}
          <Link href="/">
            <div className="group aspect-video mb-4 w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-gray-500 group-hover:text-primary" />
              </div>
            </div>
            <span className="font-medium text-gray-600 dark:text-gray-400">Create a new project</span>
          </Link>

          {/* 2. Project List */}
          <Suspense fallback={<ProjectsSkeleton />}>
            <ProjectList projects={filteredProjects} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProjectBoard;