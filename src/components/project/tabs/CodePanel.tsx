"use client";

import { useTheme } from "next-themes";
import { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useScrollPosition } from "@/contexts/ScrollPositionContext";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import ShimmerText from "@/components/kokonutui/shimmer-text";

const RawPreview = ({ content }: { content: string }) => {
  const { rawScrollPosition, setRawScrollPosition } = useScrollPosition();
  const { theme, resolvedTheme } = useTheme();
  const [isReady, setIsReady] = useState(false);
  
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const hasRestoredRef = useRef(false);
  const scrollListenerRef = useRef<Monaco.IDisposable | null>(null);

  const handleEditorDidMount = (editorInstance: Monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;

    // Wait for editor to be fully rendered and scroll position to be restored
    setTimeout(() => {
      if (editorRef.current && rawScrollPosition > 0 && !hasRestoredRef.current) {
        editorRef.current.setScrollTop(rawScrollPosition);
        hasRestoredRef.current = true;
      }

      // Mark as ready after scroll is restored
      setTimeout(() => {
        setIsReady(true);
      }, 50);
    }, 100);

    // Add scroll listener with throttling to save position
    scrollListenerRef.current = editorInstance.onDidScrollChange(
      (e: { scrollTop: number; scrollLeft: number; scrollWidth: number; scrollHeight: number }) => {
        const newPosition = e.scrollTop;
        const difference = Math.abs(newPosition - rawScrollPosition);

        if (difference > 20 || newPosition === 0) {
          setRawScrollPosition(newPosition);
        }
      }
    );
  };

  // Save scroll position when component unmounts
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        const currentPos = editorRef.current.getScrollTop();
        if (currentPos > 0) {
          setRawScrollPosition(currentPos);
        }
      }

      // Clean up scroll listener
      if (scrollListenerRef.current) {
        scrollListenerRef.current.dispose();
      }

      // Reset states
      hasRestoredRef.current = false;
      setIsReady(false);
    };
  }, [setRawScrollPosition]);


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
          <ShimmerText text="Loading Project Preview..." className="text-xl -px-5 mt-8" />
        </div>
      </div>
    );
  }

  const currentTheme = resolvedTheme || theme;

  return (
    <div className="relative h-full">
      {/* Loading overlay */}
      {!isReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-foreground/5">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-foreground/20 border-t-foreground/60 rounded-full animate-spin" />
            <p className="text-sm text-foreground/60">Preparing preview...</p>
          </div>
        </div>
      )}
      
      {/* Editor - hidden until ready */}
      <div className={`h-full transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <Editor
          height="calc(100vh - 2rem)"
          defaultLanguage="markdown"
          value={content
            .replace(/\\n/g, "\n")
            .replace(/\\`\\`\\`/g, "```")
            .trim()}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            roundedSelection: false,
            wordWrap: "on",
            theme: currentTheme === "light" ? "light" : "vs-dark",
          }}
        />
      </div>
    </div>
  );
};

export default RawPreview;