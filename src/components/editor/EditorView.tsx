"use client";

import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import NotFound from "@/app/not-found";
import Toolbar from "../kokonutui/toolbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentType } from "@/lib/db/indexedDB";
import CodePanel from "../project/tabs/CodePanel";
import LoadingScreen from "../common/LoadingScreen";
import { deleteDocument, getDocumentById } from "@/lib/db/documents";
import PreviewPanel from "../project/tabs/PreviewPanel";
import { DropdownMenuSub } from "@radix-ui/react-dropdown-menu";
import DocumentNameChangeForm from "../forms/DocumentNameChange";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChevronDown, ChevronLeft, CodeXml, History, LaptopMinimal, LucideIcon, Palette, SquarePen, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import MarkdownComponents from "./tabs/MarkdownComponents";
import { DocumentDeleteForm } from "../forms/DocumentDelete";

export interface ToolbarItem {
  id: string;
  title: string;
  icon: LucideIcon;
  type?: never;
}

const editorToolbarItems: ToolbarItem[] = [
  { id: "editor", title: "Editor", icon: CodeXml },
  { id: "components", title: "Components", icon: Palette },
  { id: "history", title: "History", icon: History },
];

const EditorView = ({ documentId }: { documentId: string }) => {

  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [document, setDocument] = useState<DocumentType | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("editor");
  const [documentName, setDocumentName] = useState<string>(document?.title ?? "");
  const [documentContent, setDocumentContent] = useState<string>(document?.content ?? "");
  const [isOpenNameChangeForm, setIsOpenNameChangeForm] = useState<boolean>(false);
  const [isDeleteFormOpen, setIsDeleteFormOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchDoc = async () => {
      const doc = await getDocumentById(documentId);
      setDocument(doc ?? null);
      setDocumentName(doc?.title ?? "");
      setDocumentContent(doc?.content ?? "");
      setLoading(false);
    };

    fetchDoc();
  }, [documentId]);

  if (loading) {
    return (
      <LoadingScreen
        title="Loading Document"
        subtitle="Please wait while we load your document"
      />
    )
  }

  if (!document) {
    return <NotFound backHref="/editor" />
  }

  const handleDeleteDocument = () => {
    deleteDocument(documentId);
    router.push("/editor");
  };

  return (  
    <ResizablePanelGroup direction="horizontal" id="project-view-panels">
      <ResizablePanel
        id="left-panel"
        className="h-screen relative flex flex-col"
        defaultSize={48}
        minSize={33}
      >
        <div className="flex items-center justify-between px-2 absolute w-full top-0 h-12">
          <div className="flex items-center">
            {!documentId ? (
              <div className="h-9 w-48 bg-muted animate-pulse rounded-md" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="flex items-center gap-x-2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-transparent!"
                    suppressHydrationWarning
                  >
                    <span className="uppercase px-1.5 py-1 rounded-md bg-sidebar-primary text-xs tracking-tighter">
                      {documentName.slice(0, 2)}
                    </span>
                    <span>{documentName}</span>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-72"
                  align="start"
                  alignOffset={8}
                >
                  <DropdownMenuItem onClick={() => router.push("/editor")}>
                    <ChevronLeft />
                    Back To Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-foreground/70 mb-1">
                    Usage
                  </DropdownMenuLabel>
                  <DropdownMenuLabel>
                    <div className="flex flex-col bg-background/70 rounded-md p-3 -mx-1.5 -mt-2">
                      <div className="flex items-center gap-x-2">
                        <div className="h-1.5 w-1.5 bg-foreground rounded-full" />
                        <span className="text-xs text-foreground/70">
                          Daily credits reset at midnight UTC
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-foreground/70 mb-1">
                    Document
                  </DropdownMenuLabel>
                  <DocumentNameChangeForm
                    isOpenNameChangeForm={isOpenNameChangeForm}
                    setIsOpenNameChangeForm={setIsOpenNameChangeForm}
                    value={documentName}
                    setValue={setDocumentName}
                    documentId={documentId}
                  >
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpenNameChangeForm(true);
                      }}
                    >
                      <SquarePen />
                      Rename Document
                    </DropdownMenuItem>
                  </DocumentNameChangeForm>
                  <DocumentDeleteForm isOpen={isDeleteFormOpen} setIsOpen={setIsDeleteFormOpen} handleDeleteDocument={handleDeleteDocument}>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        setIsDeleteFormOpen(true);
                      }}
                    >
                      <Trash2 />
                      Delete Document
                    </DropdownMenuItem>
                  </DocumentDeleteForm>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <LaptopMinimal />
                      Appearance
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent sideOffset={4}>
                        <DropdownMenuRadioGroup
                          value={theme}
                          onValueChange={setTheme}
                        >
                          <DropdownMenuRadioItem value="light">
                            <span>Light</span>
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="dark">
                            <span>Dark</span>
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="system">
                            <span>System</span>
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <Toolbar
            selected={activeTab}
            setSelected={setActiveTab}
            toolbarItems={editorToolbarItems}
          />
        </div>

        <div className="flex flex-col flex-1 relative mt-12 rounded-xl my-2 ms-3 overflow-hidden">
          {activeTab === "editor" && <CodePanel content={documentContent} setContent={setDocumentContent} setActiveTab={setActiveTab} onlyEditor />}
          {activeTab === "components" && <MarkdownComponents onInsertComponent={() => {}} />}
        </div>
      </ResizablePanel>

      <ResizableHandle
        id="panel-resize"
        className="hover:bg-accent bg-transparent"
      />

      <ResizablePanel
        id="right-panel"
        className="h-screen relative flex flex-col"
        defaultSize={52}
        minSize={45}
      >
        <div className="flex flex-col flex-1 relative mt-12 bg-foreground/5 rounded-xl my-2 mx-3 overflow-hidden border border-border">
          <PreviewPanel
            content={documentContent}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
export default EditorView;
