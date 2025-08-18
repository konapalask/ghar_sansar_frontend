import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Edit this structure as needed for your app
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string; // ISO string
  readTime: string;
  category: string;
  tags?: string[];
}

interface BlogContextType {
  posts: BlogPost[];
  setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  addPost: (post: BlogPost) => void;
  updatePost: (post: BlogPost) => void;
  deletePost: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const STORAGE_KEY = "blog-posts";

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  // Functions for CRUD
  const addPost = (post: BlogPost) => setPosts((prev) => [post, ...prev]);
  const updatePost = (post: BlogPost) =>
    setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
  const deletePost = (id: string) =>
    setPosts((prev) => prev.filter((p) => p.id !== id));

  return (
    <BlogContext.Provider value={{ posts, setPosts, addPost, updatePost, deletePost }}>
      {children}
    </BlogContext.Provider>
  );
};

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used within BlogProvider");
  return ctx;
}
