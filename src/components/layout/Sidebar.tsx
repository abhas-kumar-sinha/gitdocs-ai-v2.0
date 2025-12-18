"use client"

import { cn } from "@/lib/utils";
import { Blocks, Book, Box, House, Inbox, PanelRight, Search, Star } from "lucide-react";
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
import { UserButton } from "@clerk/nextjs";
import SidebarItem from "../common/SidebarItem";
import Link from "next/link";

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
    label: "All Projects",
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
    <>
    {/* Mobile View */}
    <header
      className='fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-3 md:hidden flex items-center justify-between'
    >
      <Button
        variant="sidebarButton"
        size="sm"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <PanelRight className="transition-transform duration-300 group-hover/button:scale-110" />
      </Button>

      <Link href="/" className="flex items-center space-x-2 flex-1 ms-4">
        <Image src={"/logo.png"} width={24} height={24} alt="logo" />
        <span className="text-lg font-semibold font-geist">GitDocs AI</span>
      </Link>

      <div className="flex items-center gap-x-2">
        <div
          className="ms-auto w-fit mt-1"
        >
          <Button variant="sidebarButton" size="sm" className="group/button">
            <Inbox className="transition-transform duration-300 group-hover/button:scale-110" />
          </Button>
        </div>
        <Button
          variant="sidebarButton"
          size="sm"
          className="py-5 px-2 transition-transform duration-300 ease-out"
        >
          <UserButton />
        </Button>
      </div>
    </header>

    <div
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className={cn(
        "h-screen group/sidebar py-3 hover:cursor-col-resize bg-linear-to-b from-sidebar to-sidebar/95 md:bg-sidebar/80 md:bg-none border-r border-neutral-200/50 dark:border-neutral-800/50 transition-all duration-300 flex flex-col gap-y-1 md:px-2.5 items-start overflow-hidden z-51 md:z-0 fixed md:relative",
        isSidebarOpen ? "w-68 px-2.5" : "w-0 md:w-14"
      )}
    >
      {/* Header */}
      <div onClick={(e) => e.stopPropagation()} className="flex items-center h-10 w-full">
        
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

      {/* TODO: Implement Github */}
      <DropdownMenu >
        <DropdownMenuTrigger>
          <Button onClick={(e) => e.stopPropagation()} size="sm" variant="sidebarButton" className="w-full my-2">
            M
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          hello
        </DropdownMenuContent>
      </DropdownMenu>

      {sidebarTopItems.map((Item, idx) => {
        return (
          <SidebarItem key={idx} Item={Item} isSidebarOpen={isSidebarOpen} />
        )
      })}

      <span className={cn("capitalize text-foreground/50 text-xs mt-6 mb-2 ms-2 invisible", isSidebarOpen && "visible")}>projects</span>

      {sidebarMedItems.map((Item, idx) => {
        return (
          <SidebarItem key={idx} Item={Item} isSidebarOpen={isSidebarOpen} />
        )
      })}

      <span className={cn("capitalize text-foreground/50 text-xs mt-6 mb-2 ms-2 invisible", isSidebarOpen && "visible")}>resources</span>

      {sidebarBottomItems.map((Item, idx) => {
        return (
          <SidebarItem key={idx} Item={Item} isSidebarOpen={isSidebarOpen} />
        )
      })}


      {/* Footer */}
      <div onClick={(e) => e.stopPropagation()} className={cn("shrink-0 mt-auto w-10 md:flex items-center justify-center transition-all duration-300 -ms-0.5 hidden", isSidebarOpen && "translate-y-11")}>
        <Button
          variant="sidebarButton"
          size="sm"
          className="py-5 px-2 transition-transform duration-300 ease-out"
        >
          <UserButton />
        </Button>
      </div>

      <div onClick={(e) => e.stopPropagation()} className="ms-auto w-fit mt-1 hidden md:block">
        <Button variant="sidebarButton" size="sm" className="group/button">
          <Inbox className="transition-transform duration-300 group-hover/button:scale-110" />
        </Button>
      </div>

    </div>
    </>
  )
}
export default Sidebar