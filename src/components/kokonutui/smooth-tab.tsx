"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Repository } from "@/generated/prisma/client";
import { AnimatePresence, motion, Transition } from "motion/react";
import RepositoryList from "../project/context-selection/RepositoryList";
import TemplateList, { TemplateId } from "../project/context-selection/TemplateList";

interface TabItem {
  id: string;
  title: string;
  icon?: LucideIcon;
  content?: React.ReactNode;
  cardContent?: React.ReactNode;
  color: string;
}

interface SmoothTabProps {
  selectedTemplate: TemplateId;
  setSelectedTemplate: (template: TemplateId) => void;
  selectedRepository: Repository | null;
  setSelectedRepository: (repository: Repository | null) => void;
  defaultTabId?: string;
  className?: string;
  activeColor?: string;
  onChange?: (tabId: string) => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    filter: "blur(8px)",
    scale: 0.95,
    position: "absolute" as const,
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    position: "absolute" as const,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    filter: "blur(8px)",
    scale: 0.95,
    position: "absolute" as const,
  }),
};

const transition = {
  duration: 0.4,
  ease: [0.32, 0.72, 0, 1],
};

export default function SmoothTab({
  selectedTemplate,
  setSelectedTemplate,
  selectedRepository,
  setSelectedRepository,
  defaultTabId = "Repositories",
  className,
  activeColor = "bg-[#1F9CFE]",
  onChange,
}: SmoothTabProps) {
  const [selected, setSelected] = React.useState<string>(defaultTabId);
  const [direction, setDirection] = React.useState(0);
  const [dimensions, setDimensions] = React.useState({ width: 0, left: 0 });

  const items: TabItem[] = [
    {
      id: "Repositories",
      title: "Repositories",
      color: "bg-blue-500 hover:bg-blue-600",
      cardContent: (
        <div className="relative h-full">
          <RepositoryList selected={selectedRepository} setSelected={setSelectedRepository} />
        </div>
      ),
    },
    {
      id: "Templates",
      title: "Templates",
      color: "bg-purple-500 hover:bg-purple-600",
      cardContent: (
        <div className="relative h-full">
          <TemplateList selected={selectedTemplate} setSelected={setSelectedTemplate} />
        </div>
      ),
    },
  ];

  // Reference for the selected button
  const buttonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Update dimensions whenever selected tab changes or on mount
  React.useLayoutEffect(() => {
    const updateDimensions = () => {
      const selectedButton = buttonRefs.current.get(selected);
      const container = containerRef.current;

      if (selectedButton && container) {
        const rect = selectedButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setDimensions({
          width: rect.width,
          left: rect.left - containerRect.left,
        });
      }
    };

    // Initial update
    requestAnimationFrame(() => {
      updateDimensions();
    });

    // Update on resize
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [selected]);

  const handleTabClick = (tabId: string) => {
    const currentIndex = items.findIndex((item) => item.id === selected);
    const newIndex = items.findIndex((item) => item.id === tabId);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setSelected(tabId);
    onChange?.(tabId);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    tabId: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTabClick(tabId);
    }
  };

  const selectedItem = items.find((item) => item.id === selected);

  return (
    <div className="flex h-full flex-col">

      {/* Toolbar */}
      <div
        aria-label="Smooth tabs"
        className={cn(
          "relative mb-4 flex items-center justify-between gap-1 py-1",
          "mx-auto w-full bg-background",
          "rounded-xl border",
          "transition-all duration-200",
          className
        )}
        ref={containerRef}
        role="tablist"
      >
        {/* Sliding Background */}
        <motion.div
          animate={{
            width: dimensions.width - 8,
            x: dimensions.left + 4,
            opacity: 1,
          }}
          className={cn(
            "absolute z-1 rounded-lg",
            selectedItem?.color || activeColor
          )}
          initial={false}
          style={{ height: "calc(100% - 8px)", top: "4px" }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />

        <div className="relative z-2 grid w-full grid-cols-2 gap-1">
          {items.map((item) => {
            const isSelected = selected === item.id;
            return (
              <motion.button
                aria-controls={`panel-${item.id}`}
                aria-selected={isSelected}
                className={cn(
                  "relative flex items-center justify-center gap-0.5 rounded-lg px-2 py-1.5",
                  "font-medium text-sm transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "truncate",
                  isSelected
                    ? "text-white"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                id={`tab-${item.id}`}
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                ref={(el) => {
                  if (el) buttonRefs.current.set(item.id, el);
                  else buttonRefs.current.delete(item.id);
                }}
                role="tab"
                tabIndex={isSelected ? 0 : -1}
                type="button"
              >
                <span className="truncate">{item.title}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
      {/* Card Content Area */}
      <div className="relative mb-4 flex-1">
        <div className="relative h-full w-full rounded-lg border bg-card">
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <AnimatePresence
              custom={direction}
              initial={false}
              mode="popLayout"
            >
              <motion.div
                animate="center"
                className="absolute inset-0 h-full w-full bg-card will-change-transform"
                custom={direction}
                exit="exit"
                initial="enter"
                key={`card-${selected}`}
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                transition={transition as unknown as Transition}
                variants={slideVariants}
              >
                {selectedItem?.cardContent}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
