"use client"

import { useState, useMemo } from 'react';
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { BlogPost, CATEGORIES, Category } from "@/types/blogType"
import { BLOG_POSTS } from '@/data/data';
import BlogCard from '@/components/landing-page/blogs/blogCard';
import BlogDetail from '@/components/landing-page/blogs/BlogDetail';
import Sidebar from '@/components/landing-page/blogs/Sidebar';


const BlogPage = () => {

  const [selectedCategory, setSelectedCategory] = useState<Category>('Latest');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'Latest') return BLOG_POSTS;
    return BLOG_POSTS.filter(post => post.category === selectedCategory);
  }, [selectedCategory]);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    setSelectedPost(null);
  };

  return (
    <>
      <Navbar />

      <main className="grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-12 md:mt-8">
          {selectedPost ? (
            <BlogDetail post={selectedPost} onBack={handleBackToGrid} />
          ) : (
            <div className="flex flex-col lg:flex-row gap-13 mt-14 min-h-screen">
              {/* Sticky Sidebar */}
              <Sidebar 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
              />

              {/* Main Content Area */}
              <div className="grow">
                {/* Mobile Category Selector (Optional enhancement) */}
                <div className="lg:hidden mb-8 overflow-x-auto whitespace-nowrap pb-4 no-scrollbar">
                  <div className="flex gap-4">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1 rounded-full border transition-all ${
                          selectedCategory === cat 
                          ? 'bg-primary text-white border-primary font-semibold' 
                          : 'bg-transparent text-muted-foreground border-border'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* The Blog Grid */}
                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                    {filteredPosts.map(post => (
                      <BlogCard 
                        key={post.id} 
                        post={post} 
                        onClick={handlePostClick} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground text-lg">
                      No posts found in this category yet. Check back soon!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};
export default BlogPage;
