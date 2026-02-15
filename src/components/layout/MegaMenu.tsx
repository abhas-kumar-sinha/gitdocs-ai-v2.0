import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Zap
} from 'lucide-react';
import Link from 'next/link';

// Utility for class merging
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// --- Skeletons ---

// 1. Autopilot: Chat with AI (Left) -> Create Readme (Right)
const AutopilotSkeleton = () => {
  return (
    <div className="w-full h-full bg-muted/30 flex relative overflow-hidden font-sans border border-border rounded-lg">
      
      {/* Left Pane: Chat Interface */}
      <div className="w-[45%] flex flex-col bg-background border-r border-border">
        
        {/* Chat Header */}
        <div className="p-1.5 border-b border-border flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
             <div className="h-1 w-10 bg-muted rounded-full" />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-2 space-y-2.5 overflow-hidden">
            {/* AI Message */}
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary/10 shrink-0 flex items-center justify-center">
                    <Sparkles className="w-1.5 h-1.5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                     <div className="h-1 w-full bg-muted rounded-full" />
                     <div className="h-1 w-2/3 bg-muted rounded-full" />
                </div>
            </div>

            {/* User Message */}
            <div className="flex gap-1.5 flex-row-reverse">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/20 shrink-0" />
                <div className="bg-muted rounded-lg p-1.5 max-w-[85%]">
                     <div className="h-1 w-12 bg-muted-foreground/30 rounded-full" />
                </div>
            </div>
            
             {/* AI Typing */}
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary/10 shrink-0 flex items-center justify-center">
                    <Sparkles className="w-1.5 h-1.5 text-primary" />
                </div>
                <div className="flex gap-0.5 mt-1">
                     <div className="w-0.5 h-0.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                     <div className="w-0.5 h-0.5 bg-muted-foreground/40 rounded-full animate-bounce delay-75" />
                     <div className="w-0.5 h-0.5 bg-muted-foreground/40 rounded-full animate-bounce delay-150" />
                </div>
            </div>
        </div>

        {/* Chat Input */}
        <div className="p-1.5 border-t border-border">
             <div className="h-4 w-full bg-muted/20 border border-border rounded-md flex items-center px-1.5">
                  <div className="h-1 w-16 bg-muted rounded-full" />
                  <div className="ml-auto w-2 h-2 bg-primary rounded-full opacity-20" />
             </div>
        </div>
      </div>

      {/* Right Pane: Readme Preview */}
      <div className="flex-1 bg-muted/10 p-2 flex flex-col items-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[8px_8px] opacity-30" />

        {/* Generated Content Container */}
        <div className="w-[90%] bg-background shadow-sm border border-border rounded-md p-2 mt-2 flex flex-col items-center gap-1.5 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Logo */}
            <div className="w-6 h-6 rounded bg-linear-to-br from-primary/60 to-primary/30 shadow-sm" />
            
            {/* Title */}
            <div className="h-1.5 w-16 bg-foreground/80 rounded-full" />
            
            {/* Badges */}
            <div className="flex gap-0.5 mb-1">
                <div className="h-1 w-4 bg-muted rounded-sm" />
                <div className="h-1 w-5 bg-muted rounded-sm" />
                <div className="h-1 w-3 bg-muted rounded-sm" />
            </div>

            {/* Text Content */}
            <div className="w-full space-y-1">
                <div className="h-0.5 w-full bg-muted-foreground/20 rounded-full" />
                <div className="h-0.5 w-[90%] bg-muted-foreground/20 rounded-full" />
                <div className="h-0.5 w-[95%] bg-muted-foreground/20 rounded-full" />
            </div>
        </div>
      </div>

    </div>
  );
};

// 2. Augmented Canvas: AI Components (Left) + Canvas Edit (Right) - 50/50 Split
const AugmentedCanvasSkeleton = () => {
  return (
    <div className="w-full h-full bg-muted/30 flex relative overflow-hidden font-sans border border-border rounded-lg">
        
      {/* Left Pane: AI Component Suggestions */}
      <div className="w-1/2 h-full border-r border-border bg-background p-2 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-0.5">
            <div className="h-1.5 w-12 bg-muted rounded-full" />
            <Sparkles className="w-2 h-2 text-amber-500" />
        </div>
        {/* Component Blocks */}
        {[1, 2, 3].map((i) => (
            <div key={i} className="w-full p-1.5 rounded border border-border bg-card hover:border-amber-200 transition-colors group/item cursor-pointer">
                <div className="flex gap-1.5">
                    <div className="w-4 h-4 rounded bg-muted group-hover/item:bg-amber-100 transition-colors" />
                    <div className="flex-1 space-y-1">
                        <div className="h-1 w-8 bg-muted rounded-full" />
                        <div className="h-0.5 w-12 bg-muted/50 rounded-full" />
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Right Pane: Canvas Editing */}
      <div className="w-1/2 h-full bg-muted/10 relative flex items-center justify-center">
         <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[8px_8px] opacity-40" />
         
         {/* Selected Component being edited */}
         <div className="relative w-20 h-16 bg-background rounded shadow-sm border border-amber-500/50 z-10 flex flex-col p-1.5 gap-1 group-hover:scale-105 transition-transform">
             <div className="h-1.5 w-10 bg-amber-100 rounded-full" />
             <div className="h-1 w-full bg-muted rounded-full" />
             <div className="h-1 w-2/3 bg-muted rounded-full" />
             
             {/* Edit Handles */}
             <div className="absolute -top-0.5 -left-0.5 w-1 h-1 bg-amber-500 rounded-full" />
             <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-amber-500 rounded-full" />
             <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-amber-500 rounded-full" />
             <div className="absolute -bottom-0.5 -right-0.5 w-1 h-1 bg-amber-500 rounded-full" />
         </div>
      </div>

    </div>
  );
};

// 3. Studio Editor: Markdown (Left) + Preview (Right) - 50/50 Split
const StudioEditorSkeleton = () => {
  return (
    <div className="w-full h-full bg-background flex text-[6px] overflow-hidden border border-border rounded-lg">
      
      {/* Left Pane: Markdown Editor */}
      <div className="w-1/2 h-full p-2 flex flex-col gap-1.5 border-r border-border bg-muted/20">
        {/* Tab Bar */}
        <div className="flex gap-1 mb-0.5">
            <div className="px-1.5 py-0.5 bg-background rounded-t text-muted-foreground border border-b-0 border-border font-medium">README.md</div>
        </div>
        {/* Code Lines */}
        <div className="space-y-1">
            <div className="flex gap-1.5">
                <span className="text-muted-foreground/50 w-2 text-right">1</span>
                <div className="w-12 h-1 bg-blue-400/60 rounded-sm" /> {/* # Heading */}
            </div>
            <div className="flex gap-1.5">
                <span className="text-muted-foreground/50 w-2 text-right">2</span>
                <div className="w-full h-1 bg-transparent" />
            </div>
            <div className="flex gap-1.5">
                <span className="text-muted-foreground/50 w-2 text-right">3</span>
                <div className="w-20 h-1 bg-purple-400/60 rounded-sm" /> {/* Badge code */}
            </div>
            <div className="flex gap-1.5">
                <span className="text-muted-foreground/50 w-2 text-right">4</span>
                <div className="w-full h-1 bg-transparent" />
            </div>
            <div className="flex gap-1.5">
                <span className="text-muted-foreground/50 w-2 text-right">5</span>
                <div className="w-16 h-1 bg-muted-foreground/40 rounded-sm" /> {/* Text */}
            </div>
             <div className="flex gap-1.5">
                <span className="text-muted-foreground/50 w-2 text-right">6</span>
                <div className="w-10 h-1 bg-muted-foreground/40 rounded-sm" /> {/* Text */}
            </div>
        </div>
      </div>

      {/* Right Pane: Live Preview */}
      <div className="w-1/2 h-full bg-background p-2 flex flex-col items-start gap-2 relative">
         <div className="absolute top-1 right-1">
             <div className="flex gap-0.5">
                 <div className="w-1 h-1 rounded-full bg-muted" />
                 <div className="w-1 h-1 rounded-full bg-muted" />
                 <div className="w-1 h-1 rounded-full bg-muted" />
             </div>
         </div>

         {/* Rendered Heading */}
         <div className="h-1.5 w-16 bg-foreground rounded-sm mt-1" />
         
         {/* Rendered Badges */}
         <div className="flex gap-0.5">
             <div className="h-1 w-6 bg-green-500/20 rounded-sm border border-green-500/30" />
             <div className="h-1 w-8 bg-blue-500/20 rounded-sm border border-blue-500/30" />
         </div>

         {/* Rendered Text */}
         <div className="space-y-1 w-full mt-1">
             <div className="h-0.5 w-full bg-muted-foreground/30 rounded-full" />
             <div className="h-0.5 w-[90%] bg-muted-foreground/30 rounded-full" />
             <div className="h-0.5 w-[60%] bg-muted-foreground/30 rounded-full" />
         </div>
      </div>

    </div>
  );
};


// --- Components ---

const MegaMenu: React.FC = () => {
  return (
    <div className="w-[900px] bg-card text-card-foreground rounded-lg shadow-xl shadow-border/20 border border-border overflow-hidden font-sans">
      <div className="p-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">How do you want to build?</h3>
            <p className="text-sm text-muted-foreground mb-1.5 font-medium">Choose the workflow that fits your expertise.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 border border-border rounded-full">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-xs font-semibold text-muted-foreground">Gitdocs AI v2.0</span>
          </div>
        </div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-3 gap-6">

          <FeatureCard 
            color="purple"
            title="Autopilot"
            href="/"
            description="Chat with AI to generate a complete README in seconds. Best for starting from scratch."
            Skeleton={AutopilotSkeleton}
          />

          <FeatureCard 
            color="yellow"
            title="Augmented Canvas"
            href="/"
            description="Select AI-generated components and refine them visually. Great for rapid assembly."
            Skeleton={AugmentedCanvasSkeleton}
          />

          <FeatureCard 
            color="blue"
            title="Studio Editor"
            href="/markdown-editor"
            description="Professional Markdown editor with generic components. Full control for power users."
            Skeleton={StudioEditorSkeleton}
          />

        </div>
      </div>
      
      {/* Footer / Status bar */}
      <div className="bg-muted/30 border-t border-border px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Zero-config integration active</span>
        </div>
        <Link href="/changelog" className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 group">
          View Changelog 
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

    </div>
  );
};

// --- Sub Components ---

interface FeatureCardProps {
  color: 'purple' | 'yellow' | 'blue';
  title: string;
  href: string;
  description: string;
  Skeleton: React.ComponentType;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  color, 
  title, 
  href, 
  description,
  Skeleton
}) => {

  const colorStyles = {
    purple: {
      bg: 'bg-indigo-500/5 hover:bg-indigo-500/10',
      border: 'border-indigo-500/10 group-hover:border-indigo-500/20',
      icon: 'text-indigo-600 dark:text-indigo-400',
      glow: 'shadow-indigo-500/10',
      highlight: 'bg-indigo-500'
    },
    yellow: {
      bg: 'bg-amber-500/5 hover:bg-amber-500/10',
      border: 'border-amber-500/10 group-hover:border-amber-500/20',
      icon: 'text-amber-600 dark:text-amber-400',
      glow: 'shadow-amber-500/10',
      highlight: 'bg-amber-500'
    },
    blue: {
      bg: 'bg-blue-500/5 hover:bg-blue-500/10',
      border: 'border-blue-500/10 group-hover:border-blue-500/20',
      icon: 'text-blue-600 dark:text-blue-400',
      glow: 'shadow-blue-500/10',
      highlight: 'bg-blue-500'
    }
  };

  const styles = colorStyles[color];

  return (
    <Link href={href}  className="flex flex-col gap-4 group relative outline-none rounded-xl transition-all duration-300">
      
      {/* Visual Container */}
      <div className={cn(
        'relative w-full h-40 rounded-xl border transition-all duration-300 overflow-hidden',
        styles.bg,
        styles.border
      )}>
        
        {/* Animated Background Blob */}
        <div className={cn(
          "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700",
          styles.highlight
        )} />

        {/* The Mini Screen (Skeleton Container) */}
        <div className={cn(
          'absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-2 w-[85%] h-[82%] bg-card rounded-t-lg shadow-xl border border-border transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:shadow-2xl overflow-hidden',
          styles.glow
        )}>
           <Skeleton />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col px-1">
        <div className="flex items-center gap-2 text-card-foreground group-hover:text-foreground transition-colors mb-1">
          <h3 className="text-base font-bold tracking-tight">{title}</h3>
          <ArrowRight className={cn(
            "w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300",
            "group-hover:opacity-100 group-hover:translate-x-0",
            styles.icon
          )} />
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground font-medium group-hover:text-foreground/80 transition-colors">{description}</p>
      </div>
    </Link>
  );
};

export default MegaMenu;
