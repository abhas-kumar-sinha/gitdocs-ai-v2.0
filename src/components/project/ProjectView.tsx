"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Button } from "../ui/button"
import { ChevronDown, ChevronLeft, Github, GitPullRequestArrow, History } from "lucide-react"
import AI_Prompt from "../kokonutui/ai-prompt"
import MessageContainer from "./MessageContainer"
import Toolbar from "../kokonutui/toolbar"
import { useRouter } from "next/navigation"

const ProjectView = ({projectId} : {projectId : string}) => {

    const router = useRouter();

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="h-screen relative flex flex-col" defaultSize={33} minSize={33}>
                <div className="flex items-center justify-between px-2 absolute w-full top-0 h-12">
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-x-2">
                                <Button variant="ghost" size="sm">
                                    <Image src="/logo.png" alt="logo" height={24} width={24} />
                                    <span>staggered-text-blur</span>
                                    <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => router.push("/")}>
                                    <ChevronLeft />
                                    Back To Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs text-foreground/70">
                                    Usage
                                </DropdownMenuLabel>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <Button variant="ghost" size="icon-sm">
                        <History />
                    </Button>
                </div>
                <div className="flex flex-1 w-full mt-14 mb-32 px-6 overflow-y-scroll">
                    <MessageContainer />
                </div>
                <div className="absolute bottom-2 w-[98%] mx-auto ms-1">
                    <AI_Prompt />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="h-screen relative flex flex-col" defaultSize={67} minSize={50}>
                <div className="flex items-center justify-between px-4 absolute w-full top-0 h-12">
                    
                    <Toolbar />

                    <div className="flex items-center gap-x-2">
                        <Button variant="outline" size="icon-sm">
                            <Github />
                        </Button>

                        <Button variant="default" size="sm">
                            <GitPullRequestArrow /> 
                            Commit
                        </Button>
                    </div>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
export default ProjectView