"use client"

import GitHubIcon from "@/components/common/Github";
import { Kbd } from "@/components/ui/kbd";
import { createDocument } from "@/lib/db/documents";
import { FilePlusCorner } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CreateProject = () => {

  const router = useRouter();

  const handleNewDoc = async () => {
    const doc = await createDocument();
    router.push(`/editor/${doc.id}`);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        handleNewDoc();
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  });

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 h-28 w-full">
      <div onClick={handleNewDoc} className="bg-card cursor-pointer h-full border border-border rounded p-4 flex flex-col">
        <div className="flex items-center justify-between">
          <FilePlusCorner className="w-4 h-4" />
          <Kbd>Ctrl + J</Kbd>
        </div>
        <span className="text-sm font-medium text-foreground mt-auto">New Document</span>
      </div>
      <div className="bg-card cursor-pointer h-full border border-border rounded p-4 flex flex-col">
        <div className="flex items-center justify-between">
          <GitHubIcon className="w-4 h-4" />
          <Kbd>Ctrl + I</Kbd>
        </div>
        <span className="text-sm font-medium text-foreground mt-auto">Import Markdown</span>
      </div>
    </div>
    )
}

export default CreateProject;