import { BlogPost } from "@/types/blogType";
import Image from "next/image";

interface BlogCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  return (
    <div 
      className="group cursor-pointer flex flex-col space-y-4"
      onClick={() => onClick(post)}
    >
      <div className="overflow-hidden rounded-2xl bg-muted aspect-video relative">
        <Image
          width={500}
          height={500} 
          src={post.image} 
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linesr-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
          {post.category}
        </span>
        <h3 className="text-2xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-muted-foreground text-sm">
          {post.date}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
