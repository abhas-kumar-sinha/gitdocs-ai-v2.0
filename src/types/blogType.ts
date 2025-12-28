export type Category = 'Latest' | 'Announcements' | 'Tutorials' | 'Engineering';

export type BlogSection = {
  id: string;
  title: string;
  html: string;
};

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  sections: BlogSection[];
  category: string;
  date: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
}

export const CATEGORIES: Category[] = [
  'Latest',
  'Announcements',
  'Tutorials',
  'Engineering'
];