"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Blocks,
  Box,
  Gift,
  House,
  MessageSquareQuote,
  Star,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSidebarContext } from "@/contexts/SidebarContext";

export function CommandMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setIsFeedbackFormOpen } = useSidebarContext();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]); // <-- Add dependency array here

  const router = useRouter();

  return (
    <CommandDialog className="border-none" open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => router.push("/")}>
            <House className="mr-2 h-4 w-4" /> Home
          </CommandItem>
          <CommandItem onSelect={() => router.push("/projects")}>
            <Blocks className="mr-2 h-4 w-4" /> All Projects
          </CommandItem>
          <CommandItem onSelect={() => router.push("/projects?filter=starred")}>
            <Star className="mr-2 h-4 w-4" /> Starred Projects
          </CommandItem>
          <CommandItem onSelect={() => router.push("/templates")}>
            <Box className="mr-2 h-4 w-4" /> Templates
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Gitdocs AI">
          <CommandItem onSelect={() => setIsFeedbackFormOpen(true)}>
            <MessageSquareQuote className="mr-2 h-4 w-4" /> Feedback
          </CommandItem>
          <CommandItem>
            <Gift className="mr-2 h-4 w-4" /> Share With Friends
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
