// src/context/BlogContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

export type Blog = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  videoUrl?: string; // YouTube / Instagram link
  videoType?: "youtube" | "instagram"; // automatically detected
  price?: number;
  features?: string[];
};

interface BlogContextType {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  addBlog: (blog: Omit<Blog, "id">, file?: File) => Promise<void>;
  deleteBlog: (id: string) => void;
  refreshBlogs: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);
export const useBlogs = () => useContext(BlogContext);

const API_UPLOAD = "https://backend.gharsansar.store/api/v1/storage/uploads";
const API_FETCH = "https://backend.gharsansar.store/api/v1/storage/uploads/blog";

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper functions to detect video type
  const detectVideoType = (url: string) => {
    if (!url) return undefined;
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("instagram.com")) return "instagram";
    return undefined;
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(API_FETCH, { headers: { Accept: "application/json" } });

      // Flatten categories/subcategories/images
      const allBlogs: Blog[] = res.data.categories?.flatMap((cat: any) =>
        cat.subcategories?.flatMap((sub: any) =>
          sub.images?.map((img: any) => ({
            id: img.name,
            title: img.title,
            description: img.description,
            image: img.image,
            videoUrl: img.video || undefined,
            videoType: detectVideoType(img.video),
            price: img.price,
            features: img.features || [],
          }))
        ) || []
      ) || [];

      setBlogs(allBlogs);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const addBlog = async (blog: Omit<Blog, "id">, file?: File) => {
    if (!blog.title) throw new Error("Title is required");

    try {
      const formData = new FormData();
      formData.append("category_type", "blog");
      formData.append("category_name", blog.features?.[0] || "General");
      formData.append("title", blog.title);
      if (blog.description) formData.append("description", blog.description);
      if (blog.price) formData.append("price", blog.price.toString());

      // Image file upload
      if (file) formData.append("image", file);

      // Video link
      if (blog.videoUrl) {
        formData.append("videoUrl", blog.videoUrl);
        const type = detectVideoType(blog.videoUrl);
        if (type) formData.append("videoType", type);
      }

      await axios.post(API_UPLOAD, formData, { headers: { "Content-Type": "multipart/form-data" } });

      // Refresh blogs after upload
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      setError("Failed to add blog");
      throw err;
    }
  };

  const deleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
  };

  const refreshBlogs = async () => {
    await fetchBlogs();
  };

  return (
    <BlogContext.Provider value={{ blogs, loading, error, addBlog, deleteBlog, refreshBlogs }}>
      {children}
    </BlogContext.Provider>
  );
};
