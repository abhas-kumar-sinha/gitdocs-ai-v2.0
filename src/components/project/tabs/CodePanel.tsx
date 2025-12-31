"use client";

import { useTheme } from "next-themes";
import { useRef, useEffect, useState, useMemo } from "react";
import Editor from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useScrollPosition } from "@/contexts/ScrollPositionContext";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import ShimmerText from "@/components/kokonutui/shimmer-text";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, FileCodeCorner, FileText, ImageIcon, X, Scale, GitPullRequest, Copy, Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Image as ImageType } from "@/generated/prisma/client";
import { toast } from "sonner";

// File type definitions
type FileType = "markdown" | "image" | "unknown";

interface FileItem {
  id: string;
  name: string;
  displayName: string;
  type: FileType;
  content?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface FolderItem {
  id: string;
  name: string;
  isOpen: boolean;
  files: FileItem[];
  icon: React.ComponentType<{ className?: string }>;
}

interface RawPreviewProps {
  content: string;
  images?: ImageType[];
  setActiveTab: (tab: string) => void;
  contributing?: string;
  license?: string;
}

const RawPreview = ({ content, images, setActiveTab, contributing, license }: RawPreviewProps) => {
  const { rawScrollPosition, setRawScrollPosition } = useScrollPosition();
  const { theme, resolvedTheme } = useTheme();
  const [isReady, setIsReady] = useState<boolean>(false);

  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const hasRestoredRef = useRef<boolean>(false);
  const scrollListenerRef = useRef<Monaco.IDisposable | null>(null);
  const [openedFiles, setOpenedFiles] = useState<string[]>(["README.md"]);
  const [openedFile, setOpenedFile] = useState<string | null>("README.md");
  const [copied, setCopied] = useState<boolean>(false);
  const [folderStates, setFolderStates] = useState<Record<string, boolean>>({
    assets: (images && images.length > 0) || false,
  });

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  const copyFileContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadFile = async () => {

    if (!currentFile) {
      toast.error("No file selected.");
      return;
    }

    if (currentFile.type === "image") {
      const currentImage = getImageByFileId(currentFile.id)
      
      const res = await fetch(currentImage?.url || "");
      if (!res.ok) throw new Error("Failed to fetch image");

      const blob = await res.blob();
      downloadBlob(blob, currentImage?.name || "Image");
    }
    if (currentFile.type === "markdown") {
      const blob = new Blob([currentFile.content || ""], { type: "text/markdown" });
      downloadBlob(blob, currentFile.name || "README.md");
    }
  }

  useEffect(() => {
    setIsReady(false);
    hasRestoredRef.current = false;
  }, [openedFile]);

  // Use useMemo to compute folder structure instead of useEffect to avoid setState warning
  const folders = useMemo<FolderItem[]>(() => {
    const imageFiles: FileItem[] =
      images?.map((image) => ({
        id: image.publicId,
        name: image.name,
        displayName: image.name,
        type: "image" as FileType,
        icon: ImageIcon,
      })) || [];

    return [
      {
        id: "assets",
        name: "Assets",
        isOpen: folderStates.assets ?? (images && images.length > 0),
        files: imageFiles,
        icon: ImageIcon,
      },
    ];
  }, [images, folderStates.assets]);

  // Compute root files using useMemo
  const rootFiles = useMemo<FileItem[]>(() => {
    const files: FileItem[] = [
      {
        id: "README.md",
        name: "README.md",
        displayName: "README.md",
        type: "markdown",
        icon: FileText,
      },
    ];

    if (contributing) {
      files.push({
        id: "CONTRIBUTING.md",
        name: "CONTRIBUTING.md",
        displayName: "CONTRIBUTING.md",
        type: "markdown",
        icon: GitPullRequest,
      });
    }

    if (license) {
      files.push({
        id: "LICENSE",
        name: "LICENSE",
        displayName: "LICENSE",
        type: "markdown",
        icon: Scale,
      });
    }

    return files;
  }, [contributing, license]);

  const handleEditorDidMount = (
    editorInstance: Monaco.editor.IStandaloneCodeEditor,
  ) => {
    editorRef.current = editorInstance;

    // Wait for editor to be fully rendered and scroll position to be restored
    setTimeout(() => {
      if (
        editorRef.current &&
        rawScrollPosition > 0 &&
        !hasRestoredRef.current
      ) {
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
      (e: {
        scrollTop: number;
        scrollLeft: number;
        scrollWidth: number;
        scrollHeight: number;
      }) => {
        const newPosition = e.scrollTop;
        const difference = Math.abs(newPosition - rawScrollPosition);

        if (difference > 20 || newPosition === 0) {
          setRawScrollPosition(newPosition);
        }
      },
    );
  };

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        const currentPos = editorRef.current.getScrollTop();
        if (currentPos > 0) {
          setRawScrollPosition(currentPos);
        }
      }

      if (scrollListenerRef.current) {
        scrollListenerRef.current.dispose();
      }

      hasRestoredRef.current = false;
      setIsReady(false);
    };
  }, [setRawScrollPosition]);

  const toggleFolder = (folderId: string) => {
    setFolderStates((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const addToOpenedFiles = (fileId: string) => {
    setOpenedFiles((prev) => {
      if (prev.includes(fileId)) return prev;
      return [...prev, fileId];
    });
    setOpenedFile(fileId);
  };

  const removeFromOpenedFiles = (fileId: string) => {
    
    if (openedFiles.length === 1) {
      setActiveTab("preview");
      return;
    }
    
    setOpenedFiles((prev) => prev.filter((f) => f !== fileId));
    if (openedFile === fileId) {
      const remainingFiles = openedFiles.filter((f) => f !== fileId);
      setOpenedFile(remainingFiles.length > 0 ? remainingFiles[0] : null);
    }
  };

  const getFileById = (fileId: string): FileItem | null => {
    // Check markdown files
    if (fileId === "README.md") {
      return {
        id: "README.md",
        name: "README.md",
        displayName: "README.md",
        type: "markdown",
        content: content,
        icon: FileText,
      };
    }

    if (fileId === "CONTRIBUTING.md" && contributing) {
      return {
        id: "CONTRIBUTING.md",
        name: "CONTRIBUTING.md",
        displayName: "CONTRIBUTING.md",
        type: "markdown",
        content: contributing,
        icon: GitPullRequest,
      };
    }

    if (fileId === "LICENSE" && license) {
      return {
        id: "LICENSE",
        name: "LICENSE",
        displayName: "LICENSE",
        type: "markdown",
        content: license,
        icon: Scale,
      };
    }

    // Check in folders
    for (const folder of folders) {
      const file = folder.files.find((f) => f.id === fileId);
      if (file) return file;
    }

    return null;
  };

  const getImageByFileId = (fileId: string): ImageType | null => {
    return images?.find((img) => img.publicId === fileId) || null;
  };

  const currentFile = openedFile ? getFileById(openedFile) : null;
  const currentImage = currentFile?.type === "image" ? getImageByFileId(currentFile.id) : null;

  const isViewingImage = currentFile?.type === "image";
  const showLoadingOverlay = !isReady && !isViewingImage;

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

  const currentTheme = resolvedTheme || theme;

  return (
    <div className="relative h-full">
      <div className="h-full">
        <ResizablePanelGroup direction="horizontal" id="files-view-panels">
          <ResizablePanel
            id="left-file-panel"
            className="h-screen relative"
            defaultSize={25}
            minSize={15}
          >
            <div className="flex flex-col gap-y-4 bg-background h-full w-full p-3">
              <Button variant="outline" className="bg-accent text-accent-foreground">
                <FileCodeCorner />
                Files
              </Button>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Folders */}
                {folders.map((folder) => {
                  const FolderIcon = folder.icon;
                  return (
                    <div key={folder.id}>
                      <div
                        onClick={() => toggleFolder(folder.id)}
                        className="p-2 flex items-center gap-x-2 w-full hover:bg-accent cursor-pointer select-none"
                      >
                        {folder.isOpen ? (
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                        <FolderIcon className="h-4 w-4 shrink-0" />
                        <span className="text-sm">{folder.name}</span>
                      </div>

                      {folder.isOpen && (
                        <div>
                          {folder.files.length > 0 ? (
                            folder.files.map((file) => {
                              const FileIcon = file.icon;
                              return (
                                <div
                                  key={file.id}
                                  onClick={() => addToOpenedFiles(file.id)}
                                  className={cn("p-2 pl-8 flex items-center gap-x-2 w-full cursor-pointer", 
                                    openedFile === file.id ? "bg-primary/50" : "hover:bg-accent"
                                  )}
                                >
                                  <FileIcon className="h-4 w-4 shrink-0" />
                                  <span className="text-sm truncate">{file.displayName}</span>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-2 pl-8 text-xs text-muted-foreground">
                              Empty folder
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Root level markdown files */}
                {rootFiles.map((file) => {
                  const IconComponent = file.icon;
                  return (
                    <div
                      key={file.id}
                      onClick={() => addToOpenedFiles(file.id)}
                      className={cn("p-2 flex items-center gap-x-2 w-full cursor-pointer", 
                        openedFile === file.id ? "bg-primary/50" : "hover:bg-accent"
                      )}
                    >
                      <IconComponent className="h-4 w-4 shrink-0" />
                      <span className="text-sm">{file.displayName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle
            id="file-panel-resize"
            className="hover:bg-accent bg-transparent"
          />

          <ResizablePanel
            id="right-file-panel"
            className="h-screen relative"
            defaultSize={75}
            minSize={50}
          >
            {/* Tab bar */}
            <div className="w-full h-8 bg-background flex items-center">
              <div className="h-full flex-1 flex items-center overflow-x-auto overflow-y-hidden border-b border-border scrollbar-hide">
                {openedFiles.map((fileId) => {
                  const file = getFileById(fileId);
                  if (!file) return null;

                  const FileIcon = file.icon;
                  return (
                    <div
                      key={fileId}
                      onClick={() => setOpenedFile(fileId)}
                      className={cn(
                        "h-full flex items-center gap-x-2 ps-3 pe-2 cursor-pointer border-r border-border",
                        openedFile === fileId
                          ? "bg-accent"
                          : "hover:bg-accent/50 transition-colors duration-200"
                      )}
                    >
                      <FileIcon className="h-3 w-3 shrink-0" />
                      <span className="text-sm text-foreground/70 whitespace-nowrap">
                        {file.displayName}
                      </span>
                      <X
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromOpenedFiles(fileId);
                        }}
                        className="h-3 w-3 ml-2 cursor-pointer hover:text-foreground"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="h-full flex items-center gap-x-1 ps-1 pe-2">
                <Button onClick={() => copyFileContent()} disabled={!currentFile || currentFile.type === "image"} variant="ghost" className="bg-accent text-accent-foreground h-6 w-6">
                  {copied ? <Check className="h-2.5! w-2.5!" /> : <Copy className="h-2.5! w-2.5!" />}
                </Button>
                <Button onClick={() => downloadFile()} disabled={!currentFile} variant="ghost" className="bg-accent text-accent-foreground h-6 w-6">
                  <Download className="h-2.5! w-2.5!" />
                </Button>
              </div>
            </div>
            {/* Content area */}
            <div className="relative h-[calc(100%-2rem)]">
              {/* Loading overlay - only shown for markdown files */}
              {showLoadingOverlay && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
                  <div className="flex flex-col items-center gap-3 -mt-8">
                    <div className="w-8 h-8 border-4 border-foreground/20 border-t-foreground/60 rounded-full animate-spin" />
                    <p className="text-sm text-foreground/60">Preparing preview...</p>
                  </div>
                </div>
              )}

              {currentFile?.type === "image" && currentImage ? (
                <div className="h-full w-full flex flex-col bg-background">
                  <div className="w-full h-10 bg-background flex items-center px-4 gap-x-2 border-b border-border">
                    <ImageIcon className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium truncate">{currentImage.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto shrink-0">
                      {currentImage.width && currentImage.height
                        ? `${currentImage.width} × ${currentImage.height}`
                        : ""}
                    </span>
                  </div>
                  <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
                    <Image
                      height={currentImage.height || 1000}
                      width={currentImage.width || 1000}
                      src={currentImage.url}
                      alt={currentImage.name}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>
                </div>
              ) : currentFile?.type === "markdown" ? (
                <div 
                  className={cn(
                    "h-full transition-opacity duration-300",
                    isReady ? "opacity-100" : "opacity-0"
                  )}
                >
                  <Editor
                    height="calc(86.45vh)"
                    defaultLanguage="markdown"
                    value={(currentFile.content || "")
                      .replace(/\\n/g, "\n")
                      .replace(/\\`\\`\\`/g, "```")
                      .trim()}
                    onMount={handleEditorDidMount}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      lineNumbers: "on",
                      roundedSelection: false,
                      wordWrap: "off",
                      readOnly: false,
                      theme: currentTheme === "light" ? "light" : "vs-dark",
                    }}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>No file selected</p>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default RawPreview;