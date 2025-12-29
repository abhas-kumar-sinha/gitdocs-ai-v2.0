"use client";

import "@/styles/markdown.css"
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import React, { useRef, useEffect, useState, useMemo } from "react";
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
  const scrollPositionRef = useRef(markdownScrollPosition);
  const rafRef = useRef<number | null>(null);

  // Clean and preprocess content
  const cleanContent = useMemo(
    () =>
      content
        .replace(/\\n/g, "\n")
        .replace(/\\`\\`\\`/g, "```")
        .trim(),
    [content]
  );

  // Memoize the ReactMarkdown component to prevent unnecessary re-renders
  const memoizedMarkdown = useMemo(
    () => (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {cleanContent}
      </ReactMarkdown>
    ),
    [cleanContent]
  );

  // Explicitly save scroll position when component unmounts
  useEffect(() => {
    return () => {
      // Cancel any pending RAF
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Save current scroll position
      if (scrollPositionRef.current > 0) {
        setMarkdownScrollPosition(scrollPositionRef.current);
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
          scrollPositionRef.current = markdownScrollPosition;
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

  // Optimized scroll handler using refs and RAF
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newPosition = e.currentTarget.scrollTop;
    scrollPositionRef.current = newPosition;

    // Cancel previous RAF if it exists
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    // Throttle updates to context - only update if difference is significant
    const difference = Math.abs(newPosition - markdownScrollPosition);
    if (difference > 20) {
      rafRef.current = requestAnimationFrame(() => {
        setMarkdownScrollPosition(newPosition);
        rafRef.current = null;
      });
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
        className={`h-full w-full rounded-xl focus:outline-none p-4 md:px-10! resize-none rounded-b-lg transition-opacity duration-300 ${
          isReady ? "opacity-100" : "opacity-0"
        } ${
          view === "max" || view === "min-max"
            ? `markdown-preview overflow-auto`
            : "markdown-preview-mini px-20! pt-6! bg-sidebar-accent"
        }`}
        onScroll={handleScroll}
      >
        {memoizedMarkdown}
      </div>
    </div>
  );
};

export default MarkdownPreview;