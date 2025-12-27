"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ToolbarItem } from "../project/ProjectView";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  AnimatePresence,
  motion,
  TransitionWithValueOverrides,
} from "motion/react";

interface ToolbarProps {
  selected: string | null;
  setSelected: (value: string | null) => void;
  className?: string;
  activeColor?: string;
  onSearch?: (value: string) => void;
  toolbarItems: ToolbarItem[];
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? ".5rem" : ".5rem",
    paddingRight: isSelected ? ".5rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { type: "spring", bounce: 0, duration: 0.4 };

export function Toolbar({
  selected,
  setSelected,
  toolbarItems,
  className,
}: ToolbarProps) {
  const outsideClickRef = React.useRef(null);

  const handleItemClick = (itemId: string) => {
    setSelected(itemId);
  };

  return (
    <div className="space-y-2">
      <div
        ref={outsideClickRef}
        className={cn(
          "flex items-center gap-3 relative",
          "bg-transparent",
          "transition-all duration-200",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          {toolbarItems.map((item) => (
            <motion.button
              key={item.id}
              variants={buttonVariants}
              initial={false}
              animate="animate"
              custom={selected === item.id}
              onClick={() => handleItemClick(item.id)}
              transition={
                transition as TransitionWithValueOverrides<
                  "width" | "height" | "left" | "right" | "top" | "bottom"
                >
              }
              className={cn(
                "relative flex items-center rounded-lg py-1.5",
                "text-xs font-medium transition-colors duration-300 cursor-pointer",
                selected === item.id
                  ? "bg-primary/30 border border-primary/50 text-foreground rounded-lg"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {selected !== item.id ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <item.icon
                      size={14}
                      className={cn(selected === item.id && "text-foreground")}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{item.title}</TooltipContent>
                </Tooltip>
              ) : (
                <item.icon
                  size={14}
                  className={cn(selected === item.id && "text-foreground")}
                />
              )}
              <AnimatePresence initial={false}>
                {selected === item.id && (
                  <motion.span
                    variants={spanVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={
                      transition as TransitionWithValueOverrides<
                        "width" | "height" | "left" | "right" | "top" | "bottom"
                      >
                    }
                    className="overflow-hidden"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
