"use client"

import { cn } from "@/lib/utils";
import { Blocks, Book, Box, House, PanelRight, Search, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react"
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const sidebarTopItems = [
  {
    icon: House,
    label: "Home",
    href: "/"
  },
  {
    icon: Search,
    label: "Search",
    href: "/search"
  }
]

const sidebarMedItems = [
  {
    icon: Blocks,
    label: "Projects",
    href: "/projects"
  },
  {
    icon: Star,
    label: "Starred",
    href: "/projects?filter=starred"
  }
]

const sidebarBottomItems = [
  {
    icon: Box,
    label: "Templates",
    href: "/templates"
  },
  {
    icon: Book,
    label: "Learn",
    href: "/learn"
  }
]

const Sidebar = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  return (
    <div
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className={cn(
        "h-screen group/sidebar py-3 hover:cursor-col-resize bg-sidebar border-r border-neutral-200/50 dark:border-neutral-800/50 transition-all duration-300 flex flex-col gap-y-1 px-2.5 items-start overflow-hidden",
        isSidebarOpen ? "w-68" : "w-14"
      )}
    >
      {/* Header */}
      <div className="flex items-center h-10 w-full">
        
        {/* LEFT — fixed, never moves */}
        <div className="shrink-0 w-10 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={25}
            height={25}
            className={cn("transition-opacity duration-200 cursor-pointer", isSidebarOpen ? "" : "group-hover/sidebar:hidden -ms-1")}
          />
          <Button
            variant="sidebarButton"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn("group/button hidden", isSidebarOpen ? "" : "group-hover/sidebar:block -ms-1")}
          >
            <PanelRight className="transition-transform duration-300 group-hover/button:scale-110" />
          </Button>
        </div>

        {/* RIGHT — collapsible */}
        <div
          className={cn(
            "flex items-center justify-end flex-1 overflow-hidden transition-all duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            variant="sidebarButton"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <PanelRight className="transition-transform duration-300 group-hover/button:scale-110" />
          </Button>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button size="sm" variant="sidebarButton" className="w-full my-2">
            M
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          hello
        </DropdownMenuContent>
      </DropdownMenu>

      {sidebarTopItems.map((Item, idx) => {
        return (
        <Button key={idx} size="sm" variant="sidebarButton" className="w-full justify-start">
          <Item.icon className="group-hover/button:scale-110" />
          <span className={cn("ms-1", isSidebarOpen ? "" : "hidden")}>
            {Item.label}
          </span>
        </Button>
        )
      })}

      <span className={cn("capitalize text-foreground/50 text-xs mt-6 mb-2 ms-2 invisible", isSidebarOpen && "visible")}>projects</span>

      {sidebarMedItems.map((Item, idx) => {
        return (
        <Button key={idx} size="sm" variant="sidebarButton" className="w-full justify-start">
          <Item.icon className="group-hover/button:scale-110" />
          <span className={cn("ms-1", isSidebarOpen ? "" : "hidden")}>
            {Item.label}
          </span>
        </Button>
        )
      })}

      <span className={cn("capitalize text-foreground/50 text-xs mt-6 mb-2 ms-2 invisible", isSidebarOpen && "visible")}>resources</span>

      {sidebarBottomItems.map((Item, idx) => {
        return (
        <Button key={idx} size="sm" variant="sidebarButton" className="w-full justify-start">
          <Item.icon className="group-hover/button:scale-110" />
          <span className={cn("ms-1", isSidebarOpen ? "" : "hidden")}>
            {Item.label}
          </span>
        </Button>
        )
      })}


      {/* Footer */}
      <div className="flex items-center h-10 w-full mt-auto">
        
        {/* LEFT — fixed, never moves */}
        <div className="shrink-0 w-10 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={25}
            height={25}
            className={cn("transition-opacity duration-200 cursor-pointer")}
          />
        </div>

        {/* RIGHT — collapsible */}
        <div
          className={cn(
            "flex items-center justify-end flex-1 overflow-hidden transition-all duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            variant="sidebarButton"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <PanelRight className="transition-transform duration-300 group-hover/button:scale-110" />
          </Button>
        </div>
      </div>

    </div>

  )
}
export default Sidebar