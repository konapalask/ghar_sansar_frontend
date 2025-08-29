import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Blog type
export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string; // e.g., "5 min read"
}

interface BlogContextType {
  blogs: Blog[];
  addBlog: (blog: Blog) => void;
  deleteBlog: (id: string) => void;
  updateBlog: (id: string, updatedBlog: Blog) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>(() => {
    const stored = localStorage.getItem("blogs");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("blogs", JSON.stringify(blogs));
  }, [blogs]);

  const addBlog = (blog: Blog) => {
    setBlogs((prev) => [...prev, blog]);
  };

  const deleteBlog = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBlog = (id: string, updatedBlog: Blog) => {
    setBlogs((prev) => prev.map((b) => (b.id === id ? updatedBlog : b)));
  };

  return (
    <BlogContext.Provider value={{ blogs, addBlog, deleteBlog, updateBlog }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogs must be used within a BlogProvider");
  }
  return context;
};
