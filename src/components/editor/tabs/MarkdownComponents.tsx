import React, { useState, useMemo } from 'react';
import { LayoutTemplate, ListChecks, Code2, Info, Table, MousePointerClick, Search, Box, Layers, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Replace these with your actual UI component imports
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils'; // Standard shadcn utility

// Keep your constants import
import { COMPONENT_LIBRARY, MarkdownComponent } from '@/lib/constants/COMPONENTS';
import MiniEditor from '../MiniEditor';

interface MarkdownComponentsProps {
  onInsertComponent: (markdown: string) => void;
}

// Enhanced Icon Map with colors/styles if needed
const iconMap: Record<string, React.ReactNode> = {
  LayoutTemplate: <LayoutTemplate className="w-4 h-4" />,
  ListChecks: <ListChecks className="w-4 h-4" />,
  Code2: <Code2 className="w-4 h-4" />,
  Info: <Info className="w-4 h-4" />,
  Table: <Table className="w-4 h-4" />,
  MousePointerClick: <MousePointerClick className="w-4 h-4" />,
};

// Map categories to icons for better visuals
const categoryIcons: Record<string, React.ReactNode> = {
  Structure: <Box className="w-4 h-4" />,
  Content: <Layers className="w-4 h-4" />,
  Advanced: <Sparkles className="w-4 h-4" />,
};

const MarkdownComponents: React.FC<MarkdownComponentsProps> = ({ onInsertComponent }) => {
  const [activeComponentId, setActiveComponentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Group components by category
  const groupedComponents = useMemo(() => {
    const groups: Record<string, MarkdownComponent[]> = {};
    
    COMPONENT_LIBRARY.forEach(comp => {
      // Filter based on search
      if (searchQuery && 
          !comp.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !comp.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }

      if (!groups[comp.category]) {
        groups[comp.category] = [];
      }
      groups[comp.category].push(comp);
    });

    return groups;
  }, [searchQuery]);

  const categoryOrder = ['Structure', 'Content', 'Advanced'];
  // Default all open
  const defaultValues = categoryOrder; 

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-border shadow-sm w-full overflow-auto">
      {/* Header Section */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Library</h2>
          <Badge variant="outline" className="text-[10px] font-normal">
            {COMPONENT_LIBRARY.length} Items
          </Badge>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search components..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/40 focus-visible:bg-background transition-all h-9 text-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <Separator />
      
      {/* List Section */}
      <ScrollArea className="flex-1 px-4">
        {Object.keys(groupedComponents).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-2">
            <Search className="w-8 h-8 opacity-20" />
            <p className="text-sm">No components found.</p>
          </div>
        ) : (
          <Accordion type="multiple" defaultValue={defaultValues} className="w-full pb-6">
            {categoryOrder.map(category => {
              const components = groupedComponents[category];
              if (!components || components.length === 0) return null;

              return (
                <AccordionItem value={category} key={category} className="border-b-0 mb-2">
                  <AccordionTrigger className="py-3 hover:no-underline hover:bg-muted/50 px-2 rounded-md group">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                        {categoryIcons[category]}
                      </span>
                      <span className="text-sm font-medium">{category}</span>
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5 min-w-[20px] justify-center text-[10px]">
                        {components.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="pt-1 pb-2">
                    <div className="grid gap-1 pl-2 border-l border-border/50 ml-4">
                      {components.map((comp) => {
                        const isActive = activeComponentId === comp.id;
                        
                        return (
                          <div key={comp.id} className="relative">
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              size="sm"
                              onClick={() => setActiveComponentId(isActive ? null : comp.id)}
                              className={cn(
                                "w-full justify-start h-auto py-2 px-3 text-left font-normal mb-1",
                                isActive && "bg-secondary text-secondary-foreground shadow-sm ring-1 ring-border"
                              )}
                            >
                              <div className={cn(
                                "mr-3 p-1 rounded-md transition-colors",
                                isActive ? "bg-background text-primary" : "bg-muted text-muted-foreground"
                              )}>
                                {iconMap[comp.iconName]}
                              </div>
                              <div className="flex flex-col items-start gap-0.5 overflow-hidden">
                                <span className="text-xs font-medium truncate w-full">{comp.name}</span>
                                <span className="text-[10px] text-muted-foreground truncate w-full opacity-80">
                                  {comp.description}
                                </span>
                              </div>
                            </Button>

                            {/* Configuration Panel (MiniEditor) */}
                            <AnimatePresence>
                              {isActive && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mx-1 mb-3 mt-1 p-3 bg-muted/30 rounded-lg border border-border shadow-inner">
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Configure
                                      </span>
                                    </div>
                                    <MiniEditor 
                                      component={comp}
                                      onInsert={(mk) => {
                                        onInsertComponent(mk);
                                        setActiveComponentId(null);
                                      }}
                                      onClose={() => setActiveComponentId(null)}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </ScrollArea>
    </div>
  );
};

export default MarkdownComponents;
