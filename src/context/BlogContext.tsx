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
export const useBlogs = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogs must be used within a BlogProvider");
  }
  return context;
};

const API_FETCH = import.meta.env.VITE_AWS_API_URL 
  ? `${import.meta.env.VITE_AWS_API_URL}/storage/upload/blog`
  : "https://lx70r6zsef.execute-api.ap-south-1.amazonaws.com/prod/api/storage/upload/blog";

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
      
      const data = res.data.data || [];
      
      // Check if data is flat array or nested structure
      let allBlogs: Blog[] = [];
      
      // If first item has subcategories, it's nested structure
      if (data.length > 0 && data[0].subcategories) {
        // Handle nested structure: categories -> subcategories -> images
        allBlogs = data.flatMap((cat: any) =>
          cat.subcategories?.flatMap((sub: any) =>
            sub.images?.map((img: any) => ({
              id: img.id || img.name,
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
      } else {
        // Handle flat structure: direct array of blog items
        allBlogs = data.map((item: any) => ({
          id: item.id || item.name,
          title: item.title,
          description: item.description,
          image: item.image,
          video: item.video || undefined,
          videoType: detectVideoType(item.video),
          price: item.price,
          features: item.features || [],
        }));
      }

      setBlogs(allBlogs);
      console.log("Blogs fetched:", allBlogs.length);
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
      formData.append("category_name", blog.features?.[0] || "general");
      formData.append("title", blog.title);
      if (blog.description) formData.append("description", blog.description);
      if (blog.price !== undefined && blog.price !== null)
        formData.append("price", String(blog.price));
      if (blog.video) {
        formData.append("video", blog.video);
        const type = detectVideoType(blog.video);
        if (type) formData.append("videoType", type);
      }
      if (file) {
        formData.append("file", file);
      }

      await axios.post(API_FETCH, formData, { headers: { "Content-Type": "multipart/form-data" } });
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
      await axios.delete(API_FETCH, {
        params: {
          id,
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
