"use client"

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { useTRPC } from "@/trpc/client";
import { CommandMenu } from "../common/CommandMenu";
import { useMutation } from "@tanstack/react-query";
import { UserButton, useUser } from "@clerk/nextjs";
import SmoothTab, { TabItem } from "../kokonutui/smooth-tab";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { BackgroundGradient } from "../ui/background-gradient";
import { AnswerValue, TypeformFeedback } from "../forms/TypeformFeedback";
import { SidebarItem, GithubConnectionItem } from "../common/SidebarItem";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Blocks, Box, House, Inbox, Mail, MessageSquareQuote, PanelRight, Search, Star } from "lucide-react";

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
  // {
  //   icon: Briefcase,
  //   label: "Learn",
  //   href: "/learn"
  // }
]

const Sidebar = () => {

  const trpc = useTRPC();
  const { user, isLoaded } = useUser();
  const [ isCommandOpen, setIsCommandOpen ] = useState(false);
  const { isSidebarOpen, setIsSidebarOpen } = useSidebarContext();
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const feedbackRewarded = user?.publicMetadata?.feedbackRewarded === true;

  const feedbackSubmission = useMutation(
    trpc.user.completeFeedbackForm.mutationOptions({
      onSuccess: async () => {
        toast.success("Thank you for your feedback. It has been recorded successfully.");
        await user?.reload();
      },
      onError: () => {
        toast.error("Something went wrong while submitting your feedback. Please try again.");
      },
    })
  );


  const handleFormSubmission = (answers: Record<string, AnswerValue>) => {
    
    feedbackSubmission.mutate({
      intent: answers.intent as string[],
      outcome: answers.outcome as "Yes, fully" | "Partially" | "Not really",
      outputQuality: answers.outputQuality as number,
      friction: answers.friction as string,
      insight: answers.insight as string,
      repoType: answers.repoType as string[],
      missingFeature: answers.missingFeature as string | undefined,
      nps: answers.nps as number | undefined,
    });
  };

  const items: TabItem[] = [
    {
      id: "Inbox",
      title: "Inbox",
      color: "bg-blue-500 hover:bg-blue-600",
      cardContent: (
        <div className="relative h-full">
          <div className="h-full w-full flex flex-col justify-center items-center gap-y-2">
            <Mail size={20} className="mb-4" />
            <p className="text-center font-semibold">No messages or invites pending</p>
            <span className="text-center text-sm">Messages, workspace and project invitations will appear here</span>
          </div>
        </div>
      ),
    },
    {
      id: "Catalog",
      title: "What's New",
      color: "bg-purple-500 hover:bg-purple-600",
      cardContent: (
        <div className="relative h-full">
          <div className="h-full w-full flex flex-col justify-center items-center gap-y-2">
            <Mail size={20} className="mb-4" />
            <p className="text-center font-semibold">No messages or invites pending</p>
            <span className="text-center text-sm">Messages, workspace and project invitations will appear here</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
    <CommandMenu open={isCommandOpen} setOpen={setIsCommandOpen} />
    {/* Mobile View */}
    <header
      className='fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-3 md:hidden flex items-center justify-between backdrop-blur-md'
    >
      <Button
        variant="sidebarButton"
        size="sm"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <PanelRight className="transition-transform duration-300 group-hover/button:scale-110" />
      </Button>

      <Link prefetch={true} href="/" className="flex items-center space-x-2 flex-1 ms-4">
        <Image src={"/logo.png"} width={24} height={24} alt="logo" />
        <span className="text-lg font-semibold font-geist">GitDocs AI</span>
      </Link>

      <div className="flex items-center gap-x-2">
        <div
          className="ms-auto w-fit mt-1"
        >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="sidebarButton" size="sm" className="group/button">
              <Inbox className="transition-transform duration-300 group-hover/button:scale-110" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" className="h-128 w-screen flex flex-col" align="center">
            <div className="my-2 px-2">
              <h3 >News & Updates</h3>
            </div>
            <div className="flex-1">
              <SmoothTab items={items} defaultTabId="Inbox" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
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

      <GithubConnectionItem isSidebarOpen={isSidebarOpen} />

      {sidebarTopItems.map((Item, idx) => {
        return (
          <SidebarItem key={idx} Item={Item} isSidebarOpen={isSidebarOpen} setIsCommandOpen={setIsCommandOpen} />
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

      <div className={cn("w-full flex-col gap-y-2 md:-mb-8 mt-auto invisible", isSidebarOpen && "flex visible")}>
        
        {isLoaded && <Dialog open={isFeedbackFormOpen} onOpenChange={setIsFeedbackFormOpen}>
          <DialogTrigger asChild>
            <div onClick={(e) => e.stopPropagation()}>
              <BackgroundGradient className="max-w-sm overflow-hidden cursor-pointer rounded-lg p-4 bg-background flex items-center shrink-0 hover:bg-background/80 border border-transparent hover:border-foreground/20 transition-colors duration-200">
                <div className="flex flex-col items-start shrink-0 gap-y-0.5 max-w-4/5">
                  <p className="text-foreground text-sm">
                    Feedback
                  </p>
                  <span className="text-foreground/70 text-xs">
                    {feedbackRewarded
                      ? "Thanks for your feedback — you can share more anytime"
                      : "Get 5 free credits for sharing feedback"}
                  </span>
                </div>

                <div className="h-9 w-9 ms-auto border border-border flex items-center justify-center rounded-full bg-muted shrink-0">
                  <MessageSquareQuote size="16" />
                </div>

              </BackgroundGradient>
            </div>
          </DialogTrigger>
          <DialogContent onClick={(e) => e.stopPropagation()} className="max-w-none! w-screen h-screen">
            <DialogHeader className="sr-only">
              <DialogTitle>Feedback Form</DialogTitle>
              <DialogDescription>
                Please answer a few questions to earn credits.
              </DialogDescription>
            </DialogHeader>
              {/* The Form */}
              <div className="overflow-y-scroll">
                <TypeformFeedback onComplete={(answers) => {
                  handleFormSubmission(answers)
                }} setIsFeedbackFormOpen={setIsFeedbackFormOpen} />
              </div>
          </DialogContent>
        </Dialog>}
        
        {/* <BackgroundGradient className="max-w-sm cursor-pointer rounded-lg p-4 bg-background flex items-center justify-between shrink-0 hover:bg-background/90 transition-colors duration-200">
          <div className="flex flex-col items-start shrink-0 gap-y-0.5">
            <p className="text-foreground text-sm">
              Share Gitdocs AI
            </p>
            <span className="text-foreground/70 text-xs">
              Get 10 credits each
            </span>
          </div>

          <div className="h-9 w-9 border border-border flex items-center justify-center rounded-full bg-muted shrink-0">
            <Gift size="16" />
          </div>

        </BackgroundGradient> */}
      </div>

      {/* Footer */}
      <div onClick={(e) => e.stopPropagation()} className={cn("shrink-0 relative z-10 w-10 md:flex items-center justify-center transition-all duration-300 -ms-0.5 hidden", isSidebarOpen && "translate-y-11")}>
        <Button
          variant="sidebarButton"
          size="sm"
          className="py-5 px-2 transition-transform duration-300 ease-out"
        >
          <UserButton />
        </Button>
      </div>

      <div onClick={(e) => e.stopPropagation()} className="ms-auto w-fit mt-1 hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="sidebarButton" size="sm" className="group/button">
              <Inbox className="transition-transform duration-300 group-hover/button:scale-110" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" sideOffset={15} className="h-148 w-102 pt-2" align="end">
            <SmoothTab items={items} defaultTabId="Inbox" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
    </>
  )
}
export default Sidebar