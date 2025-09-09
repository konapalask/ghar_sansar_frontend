// src/pages/Blog.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BlogCard, { BlogImage } from "../components/BlogCard";

const API_URL = "https://backend.gharsansar.store/api/v1/storage/uploads/blog";

// Sanitize image or video URLs
const sanitizeUrl = (url?: string) => {
  if (!url) return "";
  url = url.trim();
  url = url.replace(/^https?:\/\/https?:\/\//, "https://"); // remove double https
  const httpsIndex = url.indexOf("://");
  if (httpsIndex !== -1) {
    let [prefix, path] = [url.slice(0, httpsIndex + 3), url.slice(httpsIndex + 3)];
    path = path.replace(/\/{2,}/g, "/"); // remove duplicate slashes
    url = prefix + path;
  }
  return url;
};

// Extract YouTube ID
const extractYouTubeId = (url: string) => {
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]+)/);
  return match ? match[1] : "";
};

// Extract Instagram ID
const extractInstagramId = (url: string) => {
  const match = url.match(/instagram\.com\/p\/([\w-]+)/);
  return match ? match[1] : "";
};

// Types
type Subcategory = { name: string; images: BlogImage[] };
type Category = { name: string; subcategories: Subcategory[] };
type ApiResponse = { category_type: string; categories: Category[] };

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        const blogImages: BlogImage[] = data.categories
          .flatMap((cat) => cat.subcategories.flatMap((sub) => sub.images))
          .map((imgObj) => ({
            ...imgObj,
            image: sanitizeUrl(imgObj.image),
            videoUrl: sanitizeUrl(imgObj.video),
          }));
        setBlogs(blogImages);
        setLoading(false);
      })
      .catch(() => {
        setBlogs([]);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.title)))];
  const filteredPosts =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((post) => post.title === selectedCategory);

  if (loading) return <div className="text-center p-10 text-gray-500">Loading blog posts...</div>;
  if (!blogs.length) return <div className="text-center p-10 text-gray-500">No blog posts available.</div>;

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Design Inspiration & Tips
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover the latest trends, expert tips, and creative ideas to transform your home into a beautiful sanctuary.
          </motion.p>
        </div>

        {/* Category Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category, idx) => (
            <button
              key={`category-${category}-${idx}`}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={`post-${post.title}-${idx}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white rounded-xl shadow p-4 space-y-4"
            >
              <h3 className="text-xl font-semibold">{post.title}</h3>
              {post.description && <p className="text-gray-600">{post.description}</p>}

              {/* Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded"
                />
              )}

              {/* YouTube */}
              {post.videoUrl?.includes("youtube") || post.videoUrl?.includes("youtu.be") ? (
                <iframe
                  width="100%"
                  height="180"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(post.videoUrl!)}`}
                  title="YouTube video"
                  frameBorder="0"
                  allowFullScreen
                  className="rounded"
                />
              ) : null}

              {/* Instagram */}
              {post.videoUrl?.includes("instagram.com") ? (
                <iframe
                  src={`https://www.instagram.com/p/${extractInstagramId(post.videoUrl!)}/embed`}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="rounded"
                />
              ) : null}

              {/* Direct video file */}
              {post.videoUrl &&
                !post.videoUrl.includes("youtube") &&
                !post.videoUrl.includes("instagram.com") && (
                  <video width="100%" controls className="rounded">
                    <source src={post.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
