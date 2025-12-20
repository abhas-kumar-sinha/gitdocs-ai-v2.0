import { useState, useEffect } from "react";
import { Check, ChevronRight, Copy, ThumbsDown, ThumbsUp } from "lucide-react"
import { Fragment, Message, MessageType } from "@/generated/prisma/client"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

function formatCreatedAt(date: Date | string) {
  const d = new Date(date);

  const datePart = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const timePart = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart}\nat ${timePart}`;
}

// Helper to fix escaped newlines
const preprocessText = (text: string) => {
  if (!text) return "";
  // 1. Replace literal "\\n" with real newlines
  // 2. Ensure double newlines for proper paragraph spacing if needed
  return text.replace(/\\n/g, '\n');
};

const UserMessage = ({timeStamp, content} : {timeStamp : Date, content : string}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 400; 
  const shouldTruncate = content.length > MAX_LENGTH;
  const [copied, setCopied] = useState(false);

  const cleanContent = preprocessText(content)
  // Helper to slice text without breaking markdown too badly (visual only)
  const displayContent = shouldTruncate && !isExpanded 
      ? cleanContent.slice(0, MAX_LENGTH) + '...'
      : cleanContent;


  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [copied])

  return (
    <>
    <div className="text-center text-xs text-foreground/50">{formatCreatedAt(timeStamp)}</div>
    <div className="ms-auto flex flex-col gap-y-1 items-end group mt-3">
      <Card className="py-2 px-4 bg-muted rounded-xl max-w-[76%] w-fit min-w-24 border-none shadow-none overflow-hidden">
        
        <div className="message-content -ms-0.5">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {displayContent}
          </ReactMarkdown>
        </div>

        {shouldTruncate && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm cursor-pointer text-foreground/50 hover:text-foreground/70 text-start mt-2 font-medium"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </Card>

      <div className="flex items-center gap-x-2 invisible group-hover:visible">        
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              className="cursor-pointer p-2 rounded-md hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
              onClick={() => {
                navigator.clipboard.writeText(content);
                setCopied(true);
              }}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {copied ? 'Copied' : 'Copy'}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
    </>
  )
}

const AssistantMessage = ({
  content, 
  type, 
  fragment, 
  activeFragment, 
  setActiveFragment
} : {
  content : string, 
  type : MessageType, 
  fragment : Fragment | null, 
  activeFragment : Fragment | null, 
  setActiveFragment : (fragment : Fragment) => void
}) => {

  const [copied, setCopied] = useState(false);
  const [ishelpful, setIsHelpful] = useState<boolean | null>(null);

  // Process the content before rendering
  const cleanContent = preprocessText(content);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [copied]) 

  return (
    <div className="flex flex-col gap-y-2 items-start mb-4">
      <div className={cn("pe-4 max-w-full w-fit message-content", type === "ERROR" ? "text-red-500/80" : "")}>
        {type === "RESULT" ? (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkBreaks]}
          >
            {cleanContent}
          </ReactMarkdown>
        ) : (
          "Something went wrong please try again"
        )}
      </div>
      
      {/* ... Rest of your buttons (Copy, Thumbs up/down) ... */}
      <div className="flex items-center gap-x-1">

        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              className="cursor-pointer p-2 rounded-md hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
              onClick={() => {setIsHelpful((prev) => (prev === true ? null : true))}}
            >
              {ishelpful === true ? <ThumbsUp fill="white" stroke="none" size={10} /> : <ThumbsUp size={10} />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Helpful
          </TooltipContent>
        </Tooltip>
         
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              className="cursor-pointer p-2 rounded-md hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
              onClick={() => {setIsHelpful((prev) => (prev === false ? null : false))}}
            >
              {ishelpful === false ? <ThumbsDown fill="white" stroke="none" size={10} /> : <ThumbsDown size={10} />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Not helpful
          </TooltipContent>
        </Tooltip>

         <Tooltip>
          <TooltipTrigger asChild>
            <button 
              className="cursor-pointer p-2 rounded-md hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
              onClick={() => {
                navigator.clipboard.writeText(content); // Copy original raw content, or cleanContent if preferred
                setCopied(true);
              }}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {copied ? 'Copied' : 'Copy'}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* ... Fragment Card ... */}
      {type === "RESULT" && fragment && 
      <Card onClick={() => {setActiveFragment(fragment)}} className={cn("px-5 py-2.5 mt-4 w-3/4 max-w-[260px] transition-colors", fragment.id === activeFragment?.id ? "bg-accent/25 border-accent" : "hover:bg-foreground/20")}>
        <div className="whitespace-pre-wrap flex flex-col items-start gap-y-1 cursor-pointer">
          <div className="flex items-center justify-between w-full">
            <span>Fragment Title</span>
            <ChevronRight size={16} />
          </div>
          <span className="text-sm text-foreground/50">{fragment.id === activeFragment?.id ? "Active Edit" : "Preview this version"}</span>
        </div>
      </Card>}
    </div>
  )
}

const MessageCard = ({message, fragment, activeFragment, setActiveFragment} : {message : Message, fragment : Fragment | null, activeFragment : Fragment | null, setActiveFragment : (fragment : Fragment) => void}) => {
  if (message.role === "ASSISTANT") {
    return (
      <AssistantMessage content={message.content} type={message.type} fragment={fragment} activeFragment={activeFragment} setActiveFragment={setActiveFragment}/>
    )
  }

  return (
    <UserMessage timeStamp={message.createdAt} content={message.content}/>
  )
}
export default MessageCard