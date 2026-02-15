"use client"

import { Check, Copy } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark, materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language, code, view } : {language: string; code: string; view: "max" | "min" | "min-max"}) => {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <SyntaxHighlighter
        style={resolvedTheme === "dark" ? materialDark : materialLight}
        language={language}
        PreTag="div"
      >
        {code}
      </SyntaxHighlighter>
      {view !== "min" && <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 cursor-pointer rounded bg-accent opacity-0 group-hover:opacity-100 transition-all"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>}
    </div>
  );
};

export default CodeBlock;