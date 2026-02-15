"use client"

import { DocumentType } from "@/lib/db/indexedDB";
import { formatUpdatedAt, getAllDocuments } from "@/lib/db/documents";
import { ArrowRight, Cloud, LaptopMinimal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

const LocalProjectList = () => {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<DocumentType[]>([]);

  const [recentDocument, setRecentDocument] = useState<DocumentType | null>(null);

  useEffect(() => {
    const checkdocuments = async () => {
      const documents = await getAllDocuments();
      setDocuments(documents.slice(1, documents.length));
      setRecentDocument(documents[0]);
      setLoading(false);
    };

    checkdocuments();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        <span className="text-sm text-muted-foreground w-full border select-none border-dashed rounded h-20 flex items-center justify-center">Loading workspace...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      {documents.length > 0 
      ?
      <>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Last Updated</span>
        <Link href={`/editor/${recentDocument?.id}`} className="h-20 px-4 flex flex-col justify-center w-full bg-card border border-border rounded gap-1 group">
          <div className="flex items-center justify-between -mt-1">
            <div className="flex items-center gap-2">
              <Tooltip delayDuration={300}>
                <TooltipTrigger>
                  {recentDocument?.sync && recentDocument?.sync === "local" ? <LaptopMinimal className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
                </TooltipTrigger>
                <TooltipContent>
                  {recentDocument?.sync && recentDocument?.sync === "local" ? "Local" : "Synced"}
                </TooltipContent>
              </Tooltip>
              <span className="font-medium text-foreground">{recentDocument?.title}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all duration-200" />
          </div>
          <span className="text-xs text-muted-foreground">{formatUpdatedAt(recentDocument?.updatedAt ?? 0)}</span>
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Recent documents</span>
        <div className="flex flex-col gap-1 overflow-y-auto max-h-40">
        {
          documents.map((item) => (
            <Link href={`/editor/${item.id}`} key={item.id}>
              <div className="w-full flex items-center justify-between px-2 py-1 hover:bg-card">
                <div className="flex items-center gap-2">
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger>
                      {item.sync && item.sync === "local" ? <LaptopMinimal className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
                    </TooltipTrigger>
                    <TooltipContent>
                      {item.sync && item.sync === "local" ? "Local" : "Synced"}
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{formatUpdatedAt(item.updatedAt ?? 0)}</span>
              </div>
            </Link>
          ))
        }
        </div>
      </div>
      </>
      :
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground w-full border select-none border-dashed rounded h-20 flex items-center justify-center">No Documents</span>
      </div>
    }
    </div>
  )
}

export default LocalProjectList