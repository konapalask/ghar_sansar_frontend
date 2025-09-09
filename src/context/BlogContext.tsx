import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

export type Blog = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  video?: string; // Unified video field name
  videoType?: "youtube" | "instagram"; // Automatically detected
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

  // Detect video type for YouTube or Instagram
  const detectVideoType = (url: string) => {
    if (!url) return undefined;
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("instagram.com")) return "instagram";
    return undefined;
  };

  // Fetch blogs and flatten categories
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(API_FETCH, { headers: { Accept: "application/json" } });

      const allBlogs: Blog[] = res.data.categories?.flatMap((cat: any) =>
        cat.subcategories?.flatMap((sub: any) =>
          sub.images?.map((img: any) => ({
            id: img.id || img.name, // Use real backend UUID 'id' or fallback to 'name'
            title: img.title,
            description: img.description,
            image: img.image,
            video: img.video || undefined,
            videoType: detectVideoType(img.video),
            price: img.price,
            features: img.features || [],
          })) || []
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

  // Add a new blog post with optional image upload
  const addBlog = async (blog: Omit<Blog, "id">, file?: File) => {
    if (!blog.title) throw new Error("Title is required");

    try {
      const formData = new FormData();
      formData.append("category_type", "blog");
      formData.append("category_name", blog.features?.[0] || "general");
      formData.append("title", blog.title);
      if (blog.description) formData.append("description", blog.description);
      if (blog.price) formData.append("price", blog.price.toString());

      if (file) formData.append("image", file);

      if (blog.video) {
        formData.append("video", blog.video);
        const type = detectVideoType(blog.video);
        if (type) formData.append("videoType", type);
      }

      await axios.post(API_UPLOAD, formData, { headers: { "Content-Type": "multipart/form-data" } });
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      setError("Failed to add blog");
      throw err;
    }
  };

  // Remove a blog by its unique id
  const deleteBlog = async (id: string) => {
    try {
      await axios.delete(API_UPLOAD, {
        params: {
          category_type: "blog",
          category_name: "general",
          subcategory_name: "general",
          id, // Pass the actual blog UUID here
        },
      });
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Delete blog failed", err);
      throw err;
    }
  };

  // Refresh blog list
  const refreshBlogs = async () => {
    await fetchBlogs();
  };

  return (
    <BlogContext.Provider value={{ blogs, loading, error, addBlog, deleteBlog, refreshBlogs }}>
      {children}
    </BlogContext.Provider>
  );
};
