"use client";

import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import React, { useRef, useEffect, useState } from "react";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import { useScrollPosition } from "@/contexts/ScrollPositionContext";
import ShimmerText from "@/components/kokonutui/shimmer-text";

const MarkdownPreview = ({
  content,
  view = "max",
}: {
  content: string;
  view?: "max" | "min" | "min-max";
}) => {
  const { markdownScrollPosition, setMarkdownScrollPosition } =
    useScrollPosition();
  const [isReady, setIsReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hasRestoredRef = useRef(false);

  // Clean and preprocess content
  const cleanContent = content
    .replace(/\\n/g, "\n")
    .replace(/\\`\\`\\`/g, "```")
    .trim();

  // Explicitly save scroll position when component unmounts
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        const currentPos = containerRef.current.scrollTop;
        if (currentPos > 0) {
          setMarkdownScrollPosition(currentPos);
        }
      }
      hasRestoredRef.current = false;
      setIsReady(false);
    };
  }, [setMarkdownScrollPosition]);

  // Restore scroll position after content has rendered
  useEffect(() => {
    if (
      content &&
      containerRef.current &&
      !hasRestoredRef.current &&
      view === "max"
    ) {
      // Wait for markdown to render
      const timer = setTimeout(() => {
        if (containerRef.current && markdownScrollPosition > 0) {
          containerRef.current.scrollTop = markdownScrollPosition;
          hasRestoredRef.current = true;
        }

        // Mark as ready after scroll restoration
        setTimeout(() => {
          setIsReady(true);
        }, 50);
      }, 150);

      return () => clearTimeout(timer);
    } else if (content && !hasRestoredRef.current) {
      // If no scroll position to restore, mark ready faster
      setTimeout(() => {
        setIsReady(true);
        hasRestoredRef.current = true;
      }, 100);
    }
  }, [content, markdownScrollPosition, view]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newPosition = e.currentTarget.scrollTop;
    const difference = Math.abs(newPosition - markdownScrollPosition);

    if (difference > 20) {
      setMarkdownScrollPosition(newPosition);
    }
  };

  if (!content) {
    return (
      <div className="h-full flex flex-col gap-y-2 items-center justify-center bg-foreground/5">
        <PixelatedCanvas
          src="/logo.png"
          width={200}
          height={150}
          cellSize={4}
          dotScale={0.9}
          shape="square"
          backgroundColor=""
          dropoutStrength={0}
          interactive
          distortionStrength={0.1}
          distortionRadius={100}
          distortionMode="repel"
          followSpeed={0.2}
          jitterStrength={4}
          jitterSpeed={1}
          sampleAverage
        />
        <div className="flex items-center gap-x-2 text-foreground/70 -my-8">
          <ShimmerText
            text="Loading Project Preview..."
            className="text-xl -px-5 mt-8"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Loading overlay */}
      {!isReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-foreground/5">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-foreground/20 border-t-foreground/60 rounded-full animate-spin" />
            <p className="text-sm text-foreground/60">Preparing markdown...</p>
          </div>
        </div>
      )}

      {/* Markdown content - hidden until ready */}
      <div
        ref={containerRef}
        className={`h-full rounded-xl focus:outline-none w-full p-4 resize-none rounded-b-lg transition-opacity duration-300 ${
          isReady ? "opacity-100" : "opacity-0"
        } ${
          view === "max" || view === "min-max"
            ? `markdown-preview overflow-y-auto ${view === "min-max" ? "bg-muted" : "bg-transparent"}`
            : "markdown-preview-mini px-20! pt-6! bg-muted/80"
        }`}
        onScroll={handleScroll}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {cleanContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownPreview;
