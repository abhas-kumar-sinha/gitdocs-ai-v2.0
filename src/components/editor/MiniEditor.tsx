"use client"

import React, { useState, useCallback } from 'react';
import MarkdownPreview from '../project/tabs/PreviewPanel';
import { MarkdownComponent } from '@/lib/constants/COMPONENTS';
import { Loader2, Sparkles, Check, Eye, Code, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';

interface MiniEditorProps {
  component: MarkdownComponent;
  onInsert: (markdown: string) => void;
  onClose: () => void;
}

const MiniEditor: React.FC<MiniEditorProps> = ({ component, onInsert, onClose }) => {
  const [instruction, setInstruction] = useState('');
  const [currentMarkdown, setCurrentMarkdown] = useState(component.template);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trpc = useTRPC();

  const getCustomComponent = useMutation(
    trpc.aiUsage.getCustomizedComponent.mutationOptions({
      onSuccess: ({ response }) => {
        setCurrentMarkdown(response);
        setIsGenerating(false);
      },
      onError: () => {
        setIsGenerating(false);
      }
    })
  )

  const handleGenerate = useCallback(async () => {
    if (!instruction.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      getCustomComponent.mutate({template: component.template, instruction});
    } catch (_) {
      setError('Failed to generate customization. Please check your API key.');
    }
  }, [component.template, instruction, getCustomComponent]);

  const applyAlignment = (align: 'left' | 'center' | 'right') => {
    let text = currentMarkdown.trim();
    
    // Regex to remove <div align="...">...</div>
    const alignRegex = /^<div align="(?:left|center|right)">([\s\S]*?)<\/div>$/i;
    const match = text.match(alignRegex);
    
    if (match) {
        text = match[1].trim();
    }
    
    if (align !== 'left') {
        text = `<div align="${align}">\n\n${text}\n\n</div>`;
    }
    
    setCurrentMarkdown(text);
  };

  return (
    <div className="mt-3 bg-card border border-border rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
      
      {/* Header / AI Section */}
      <div className="bg-muted/50 p-3 border-b border-border">
        <div className="flex flex-col gap-2">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">AI Modification</span>
              {error && <span className="text-red-500 text-[10px]">{error}</span>}
           </div>
           <div className="flex gap-2">
            <div className="relative flex-1">
                <Sparkles className="absolute left-2 top-2 w-3 h-3 text-primary" />
                <input
                    type="text"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder="Describe how to change this component..."
                    className="w-full bg-background border border-input rounded-md pl-7 pr-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground shadow-sm"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleGenerate();
                    }}
                />
            </div>
            <button
                onClick={handleGenerate}
                disabled={isGenerating || !instruction.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md rounded-md px-3 py-1 text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Generate'}
            </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 h-80 divide-y md:divide-y-0 md:divide-x divide-border">
        
        {/* Editor Column */}
        <div className="flex flex-col bg-background">
             <div className="h-8 flex items-center justify-between px-3 border-b border-border bg-muted">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Code className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase">Source</span>
                </div>
                {/* Formatting Toolbar */}
                <div className="flex items-center gap-0.5 bg-background rounded p-0.5 border border-border">
                    <button onClick={() => applyAlignment('left')} title="Align Left" className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-accent-foreground transition-colors">
                        <AlignLeft className="w-3 h-3"/>
                    </button>
                    <button onClick={() => applyAlignment('center')} title="Center" className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-accent-foreground transition-colors">
                        <AlignCenter className="w-3 h-3"/>
                    </button>
                    <button onClick={() => applyAlignment('right')} title="Align Right" className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-accent-foreground transition-colors">
                        <AlignRight className="w-3 h-3"/>
                    </button>
                </div>
             </div>
             <textarea
                value={currentMarkdown}
                onChange={(e) => setCurrentMarkdown(e.target.value)}
                className="flex-1 w-full bg-background p-3 text-xs font-mono text-foreground focus:outline-none resize-none leading-relaxed placeholder:text-muted-foreground"
                spellCheck={false}
             />
        </div>

        {/* Live Preview Column */}
        <div className="flex flex-col bg-background">
          <div className="h-8 flex items-center px-3 border-b border-border bg-muted">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase">Preview</span>
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <MarkdownPreview content={currentMarkdown} view='min' />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 bg-muted/40 border-t border-border flex justify-end gap-2">
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground px-4 py-1.5 text-xs font-medium rounded-md hover:bg-accent transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onInsert(currentMarkdown)}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all shadow-lg shadow-green-900/20"
        >
          <Check className="w-3.5 h-3.5" />
          Insert Component
        </button>
      </div>
    </div>
  );
};

export default MiniEditor;
