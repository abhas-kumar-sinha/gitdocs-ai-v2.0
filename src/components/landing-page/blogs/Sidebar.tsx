import React from 'react';
import { Category } from '@/types/blogType';
import { CATEGORIES } from '@/types/blogType';

interface SidebarProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 space-y-8 md:px-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Blog</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Release notes curated by<br />Gitdocs AI Team
          </p>
        </div>

        <hr className='border-border w-20' />

        <nav className="flex flex-col space-y-1">
          {/* Use the CATEGORIES constant imported from data.ts instead of a hardcoded array */}
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat as Category)}
              className={`text-left py-1 transition-all duration-200 cursor-pointer ${
                selectedCategory === cat 
                ? 'text-foreground font-bold translate-x-1' 
                : 'text-muted-foreground hover:text-foreground hover:translate-x-1'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;