"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import SmoothTab from "./smooth-tab";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Repository } from "@/generated/prisma/client";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { TemplateId } from "../project/context-selection/TemplateList";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { ArrowRight, Book, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function AI_Prompt({ isActive } : { isActive: boolean }) {
  const [value, setValue] = useState("");
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("ai-gen");

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 62,
    maxHeight: 250,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setValue("");
      adjustHeight(true);
    }
  };

  return (
    <div className="relative flex flex-col">
      <div className="overflow-y-auto" style={{ maxHeight: "250px" }}>
        <Textarea
          className={cn(
            "w-full text-base! resize-none rounded-xl rounded-b-none border-none bg-black/5 dark:bg-white/5 px-4 py-3 placeholder:text-black/70 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white dark:placeholder:text-white/70",
            "min-h-[62px]"
          )}
          id="ai-input-15"
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder={"What can I do for you?"}
          ref={textareaRef}
          value={value}
        />
      </div>

      <div className="flex h-14 items-center rounded-b-xl bg-black/5 dark:bg-white/5">
        <div className="absolute right-3 bottom-3 left-3 flex w-[calc(100%-24px)] items-center justify-between">
          <div className="flex items-center gap-2">
            <SignedIn>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" className="flex h-8 items-center gap-1 rounded-md pr-2 pl-1 text-xs hover:bg-black/10 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 dark:text-white dark:hover:bg-white/10">
                    <Book className="h-3.5! w-3.5!" />
                    {selectedRepository && selectedTemplate && selectedTemplate !== "ai-gen" ? (
                      <span className="mx-1 flex items-center gap-1">
                        <span className="truncate max-w-[60px] md:max-w-[120px]">{selectedRepository.name}</span>
                        <span className="hidden md:block">•</span>
                        <span className="truncate hidden md:block md:max-w-[100px]">{selectedTemplate}</span>
                      </span>
                    ) : selectedRepository ? (
                      <span className="mx-1 truncate max-w-[60px] md:max-w-[200px]">{selectedRepository.name}</span>
                    ) : (
                      <span className="mx-1">Select Repository</span>
                    )}
                    <ChevronRight />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Documentation Setup</SheetTitle>
                  </SheetHeader>
                  <div className="flex h-full flex-col px-2 -mt-5">
                    <SmoothTab selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} selectedRepository={selectedRepository} setSelectedRepository={setSelectedRepository} />
                  </div>
                </SheetContent>
              </Sheet>
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal">
                <Button variant="secondary" className="flex h-8 items-center gap-1 rounded-md pr-2 pl-1 text-xs hover:bg-black/10 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 dark:text-white dark:hover:bg-white/10">
                  <Book className="h-3.5! w-3.5!" />
                  <span className="mx-1">
                    Select Repository
                  </span>
                  <ChevronRight />
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
          <button
            aria-label="Send message"
            className={cn(
              "rounded-lg bg-black/5 p-2 dark:bg-white/5",
              "hover:bg-black/10 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 dark:hover:bg-white/10"
            )}
            disabled={!value.trim()}
            type="button"
          >
            <ArrowRight
              className={cn(
                "h-4 w-4 transition-opacity duration-200 dark:text-white",
                value.trim() ? "opacity-100" : "opacity-30"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
