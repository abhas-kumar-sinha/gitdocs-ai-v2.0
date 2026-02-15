import React from 'react';
import { Github, Heart, ChevronRight, Users, MessageSquareQuote } from 'lucide-react';

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  isLast?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, onClick, isLast }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        group cursor-pointer flex items-center w-full px-4 py-3 text-left transition-all duration-200
        hover:bg-muted/60 active:bg-muted
        ${!isLast ? 'border-b border-border/60' : ''}
      `}
    >
      <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-md bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground transition-colors shadow-sm ring-1 ring-border/50">
        <Icon className="w-4 h-4" />
      </div>
      <span className="flex-1 text-sm font-medium text-card-foreground group-hover:text-foreground">
        {label}
      </span>
      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
    </button>
  );
};

const SupportMenu: React.FC = () => {
  return (
    <div className="w-[420px] flex items-stretch gap-x-2 h-fit font-sans select-none">
      {/* Left Side - Navigation List */}
      <div className='flex flex-col w-[58%] bg-card text-card-foreground border border-border rounded-xl shadow-lg shadow-border/10 overflow-hidden'>
        <div className="flex flex-col h-full">
          <MenuItem 
            icon={Github} 
            label="Star us on GitHub" 
            onClick={() => window.open("https://github.com/abhas-kumar-sinha/gitdocs-ai-v2.0", "_blank")}
          />
          <MenuItem 
            icon={MessageSquareQuote} 
            label="Give Feedback" 
            onClick={() => window.open("https://github.com/sponsors/abhas-kumar-sinha", "_blank")}
          />
          <MenuItem 
            icon={Heart} 
            label="Support Me" 
            onClick={() => window.open("https://github.com/sponsors/abhas-kumar-sinha", "_blank")}
          />
          <MenuItem 
            icon={Users} 
            label="Join Community" 
            isLast
            onClick={() => window.open("https://github.com/abhas-kumar-sinha/gitdocs-ai-v2.0", "_blank")}
          />
        </div>
      </div>

      {/* Right Side - Featured Card */}
      <div onClick={() => window.open("/changelog", "_self")} className='flex flex-col w-[42%] bg-card text-card-foreground border border-border rounded-xl shadow-lg shadow-border/10 overflow-hidden group cursor-pointer relative transition-all hover:ring-2 hover:ring-ring/20'>
        {/* Image/Gradient Background Area */}
        <div className="flex-1 relative bg-linear-to-br from-indigo-500 via-purple-600 to-pink-500 overflow-hidden">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            
            {/* Icon Illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-white/20 blur-xl rounded-full" />
                </div>
            </div>
        </div>

        {/* Bottom Content Area */}
        <div className="p-3 bg-card border-t border-border/60 z-10 relative">
          <div className="mb-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            New Features
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-card-foreground leading-tight">
                Check What's New
            </span>
            <ChevronRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportMenu;
