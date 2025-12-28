
import React, { useState } from 'react';
import { BlogPost } from '@/types/blogType';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ post, onBack }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Main Article Content */}
      <div className={`transition-all duration-500 ease-in-out ${isNavOpen ? 'pr-0 lg:pr-80' : 'pr-0'}`}>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-0">
          <button 
            onClick={onBack}
            className="group cursor-pointer mb-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
            Back to blog
          </button>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold uppercase tracking-widest text-primary">
                  {post.category}
                </span>
                <button 
                  onClick={() => setIsNavOpen(!isNavOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold hover:bg-accent hover:text-foreground transition-all cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  5 min read
                </button>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-4 py-4">
                <Image
                  width={10}
                  height={10} 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="h-10 w-10 rounded-full object-cover grayscale"
                />
                <div>
                  <p className="text-sm font-bold">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">{post.date}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden bg-muted aspect-video shadow-xl">
              <Image
                width={500}
                height={500}
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <article className="prose prose-lg max-w-none pt-8" >
              {post.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className='mb-4 mt-8 text-2xl'>{section.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: section.html }} />
                </section>
              ))}
            </article>
          </div>
        </div>
      </div>

      {/* Slide-in Navigation Panel */}
      <div 
        className={`fixed top-19 right-0 bottom-0 w-full lg:w-80 bg-background border-l border-border z-40 transform transition-transform duration-500 ease-in-out shadow-2xl ${isNavOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col p-8 overflow-y-auto">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              5 min read
            </div>
            <button 
              onClick={() => setIsNavOpen(false)}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <h3 className="text-lg font-bold text-foreground mb-8 leading-tight">
            {post.title}
          </h3>

          <div className="space-y-6 grow">
            <nav className="space-y-4">
              {post.sections.map((section, idx) => (
                <a 
                  key={idx} 
                  href={`#${section.id}`}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors border-l-2 border-transparent hover:border-primary pl-4 py-1"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-auto pt-8 border-t border-border">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Share this</p>
            <div className="grid grid-cols-3 gap-2">
              {['Twitter', 'LinkedIn', 'Copy'].map(social => (
                <button key={social} className="flex items-center justify-center p-2 rounded-lg bg-muted hover:bg-accent transition-all">
                  <span className="text-[10px] font-bold">{social}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile to close the panel when clicking outside */}
      {isNavOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-30 lg:hidden"
          onClick={() => setIsNavOpen(false)}
        />
      )}
    </div>
  );
};

export default BlogDetail;
