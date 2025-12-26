"use client";
import { useTRPC } from "@/trpc/client";
import MessageCard from "./MessageCard";
import { Suspense, useEffect, useRef } from "react";
import { Fragment } from "@/generated/prisma/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProgressTracker } from "./ProgressTracker";

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
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef<number>(0); // Track previous count

  const { data: messages } = useSuspenseQuery(
    trpc.message.getMany.queryOptions({
      projectId,
    })
  );

  // Only scroll when message count increases (new message added)
  useEffect(() => {
    const currentCount = messages?.length || 0;
    
    if (currentCount > previousMessageCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    
    previousMessageCountRef.current = currentCount;
  }, [messages]);

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
      className="flex flex-col flex-1 w-full mt-14 mb-34 px-6 overflow-y-auto overflow-x-hidden pb-4 scroll-smooth"
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
      {messages[messages.length - 1].role === "USER" && 
      <ProgressTracker projectId={projectId} />
      }

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageContainer;