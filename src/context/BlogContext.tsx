import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface Blog {
  id: string;
  title: string;
  description?: string;
  image?: string;
  video?: string;
  author?: string;
  features?: string[];
}

interface BlogContextType {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
}

const BlogContext = createContext<BlogContextType>({
  blogs: [],
  loading: false,
  error: null,
});

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("https://backend.gharsansar.store/api/v1/storage/uploads/blog");
        setBlogs(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, loading, error }}>
      {children}
    </BlogContext.Provider>
  );
};

// ✅ This is the missing hook!
export const useBlogs = () => useContext(BlogContext);
