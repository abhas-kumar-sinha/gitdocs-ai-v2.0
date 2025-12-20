"use client";
import { Suspense, useEffect, useRef } from "react";
import { useTRPC } from "@/trpc/client";
import MessageCard from "./MessageCard";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment } from "@/generated/prisma/client";

const MessageContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment) => void;
}) => {
  const trpc = useTRPC();
  
  // 1. Create a reference for the bottom of the list
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages } = useSuspenseQuery(
    trpc.message.getMany.queryOptions({
      projectId,
    })
  );

  // 2. Auto-scroll effect: Runs whenever 'messages' changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Existing Logic for setting active fragment
  useEffect(() => {
    if (messages && messages.length > 0) {
      const lastAssistantMessage = [...messages]
        .reverse()
        .find((message) => message.role === "ASSISTANT" && message.fragment);

      if (lastAssistantMessage && lastAssistantMessage.fragment) {
        setActiveFragment(lastAssistantMessage.fragment);
      }
    }
  }, [messages, setActiveFragment]);

  return (
    <div 
      // Updated ClassName:
      // 1. overflow-y-auto: Only shows scrollbar when needed
      // 2. h-full: Ensures it fills parent height (crucial for scrolling)
      // 3. custom-scrollbar: Optional, but good for chat UIs
      className="flex flex-col flex-1 w-full mt-14 mb-32 px-6 overflow-y-auto overflow-x-hidden pb-4 scroll-smooth"
    >
      <Suspense fallback={<p className="text-center text-gray-500 mt-4">Loading Messages...</p>}>
        {messages?.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            fragment={message.fragment}
            activeFragment={activeFragment}
            setActiveFragment={setActiveFragment}
          />
        ))}
      </Suspense>

      {/* 3. Invisible element at the bottom to scroll to */}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageContainer;