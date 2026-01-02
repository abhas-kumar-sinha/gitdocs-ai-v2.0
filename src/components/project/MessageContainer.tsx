"use client";
import { useTRPC } from "@/trpc/client";
import MessageCard from "./MessageCard";
import { ProgressTracker } from "./ProgressTracker";
import { Fragment } from "@/generated/prisma/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useRef } from "react";

const MessageContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
  fragmentIds,
  setFragmentIds,
}: {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment) => void;
  fragmentIds: (string | undefined)[];
  setFragmentIds: (fragments: (string | undefined)[]) => void;
}) => {
  const trpc = useTRPC();

  const bottomRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef<number>(0);

  const { data: messages } = useSuspenseQuery(
    trpc.message.getMany.queryOptions({
      projectId,
    }),
  );

  // Create array of fragment IDs from messages
  useEffect(() => {
    setFragmentIds(
      messages?.map((message) => message.fragment?.id).filter(Boolean) || [],
    );
  }, [messages, setFragmentIds]);

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
    <div className="flex flex-col flex-1 w-full mt-14 mb-34 px-6 overflow-y-auto overflow-x-auto pb-2 scroll-smooth">
      <Suspense
        fallback={
          <p className="text-center text-gray-500 mt-4">Loading Messages...</p>
        }
      >
        {messages?.map((message) => {
          const fragmentVersion = message.fragment?.id
            ? fragmentIds.indexOf(message.fragment.id) + 1
            : -1;

          return (
            <MessageCard
              key={message.id}
              message={message}
              images={message.images}
              fragment={message.fragment}
              fragmentVersion={fragmentVersion}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          );
        })}
      </Suspense>
      {messages[messages.length - 1].role === "USER" && (
        <ProgressTracker projectId={projectId} />
      )}

      <div className="mt-12" ref={bottomRef} />
    </div>
  );
};

export default MessageContainer;
