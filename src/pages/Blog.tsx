// src/pages/Blog.tsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://backend.gharsansar.store/api/v1/storage/uploads/blog";
const YOUTUBE_LINK = "https://www.youtube.com/@gharsansar_shop";

// Sanitize URLs for images/videos
const sanitizeUrl = (url?: string) => {
  if (!url) return "";
  url = url.trim().replace(/^https?:\/\/https?:\/\//, "https://");
  const httpsIndex = url.indexOf("://");
  if (httpsIndex !== -1) {
    let [prefix, path] = [url.slice(0, httpsIndex + 3), url.slice(httpsIndex + 3)];
    path = path.replace(/\/{2,}/g, "/");
    url = prefix + path;
  }
  return url;
};

type BlogImage = {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  video?: string;
  videoUrl?: string;
};

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVidIdx, setCurrentVidIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBlog, setModalBlog] = useState<BlogImage | null>(null);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Fetch blog posts
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const blogImages: BlogImage[] = data.categories
          .flatMap((cat: any) => cat.subcategories.flatMap((sub: any) => sub.images))
          .map((imgObj: BlogImage) => ({
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

  const videoPosts = blogs.filter((p) => p.video || (p.video && /\.(mp4|webm|ogg)(\?|$)/i.test(p.video)));
  const imagePosts = blogs.filter((p) => !videoPosts.includes(p) && p.image && !p.video);

  // Auto-play current video in reel
  useEffect(() => {
    if (videoPosts.length > 0 && videoRefs.current[currentVidIdx]) {
      videoRefs.current[currentVidIdx]?.play();
      document
        .getElementById(`video-card-${currentVidIdx}`)
        ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "center" });
    }
  }, [currentVidIdx, videoPosts.length]);

  const handleVideoEnd = () => {
    if (currentVidIdx < videoPosts.length - 1) {
      setCurrentVidIdx((prev) => prev + 1);
    }
  };

  const handleSubscribe = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(YOUTUBE_LINK, "_blank", "noopener noreferrer");
  };

  const handleOpenModal = (post: BlogImage) => {
    setModalBlog(post);
    setModalOpen(true);
  };

  if (loading)
    return <div className="text-center p-10 text-gray-500">Loading blog posts...</div>;
  if (!blogs.length)
    return <div className="text-center p-10 text-gray-500">No blog posts available.</div>;

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">
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

        {/* Subscribe Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-full bg-red-100 border border-gray-200 flex items-center justify-center text-3xl font-bold text-white shadow">
              <span className="bg-red-500 w-12 h-12 flex items-center justify-center rounded-full text-white">G</span>
            </div>
            <div>
              <div className="font-bold text-2xl text-gray-900">ghar_sansar</div>
              <div className="text-sm text-gray-500">Latest on our Social</div>
            </div>
          </div>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded text-base font-semibold shadow"
            onClick={handleSubscribe}
          >
            Subscribe
          </button>
        </div>

        {/* Video Reel */}
        {videoPosts.length > 0 && (
          <div className="flex space-x-8 overflow-x-auto pb-8 no-scrollbar">
            {videoPosts.map((post, idx) => (
              <motion.div
                key={`video-card-${idx}`}
                id={`video-card-${idx}`}
                className="flex-shrink-0 bg-white rounded-xl shadow p-3 transition-transform cursor-pointer hover:scale-105 w-[280px] md:w-[350px]"
                style={{ scrollSnapAlign: "center" }}
                onClick={() => handleOpenModal(post)}
              >
                <video
                  ref={(el) => (videoRefs.current[idx] = el)}
                  src={post.video || post.videoUrl}
                  autoPlay={idx === currentVidIdx}
                  muted
                  playsInline
                  loop={false}
                  onEnded={handleVideoEnd}
                  controls={false}
                  className="w-full h-[440px] md:h-[500px] object-cover rounded"
                  style={{ outline: "none", border: "none", userSelect: "none" }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {modalOpen && modalBlog && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.96 }}
                className="bg-white rounded-xl flex flex-col md:flex-row p-6 max-w-3xl w-full shadow-xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {modalBlog.videoUrl || modalBlog.video ? (
                  <video
                    src={modalBlog.videoUrl || modalBlog.video}
                    controls
                    autoPlay
                    className="w-full md:w-96 h-96 object-cover rounded"
                  />
                ) : modalBlog.image ? (
                  <img
                    src={modalBlog.image}
                    alt={modalBlog.title}
                    className="w-full md:w-96 h-96 object-cover rounded"
                  />
                ) : null}
                <div className="flex-1 px-4 mt-4 md:mt-0">
                  <div className="font-bold text-lg mb-2">{modalBlog.title}</div>
                  <div className="whitespace-pre-line text-gray-700">{modalBlog.description}</div>
                  <button
                    className="absolute right-2 top-1 text-2xl text-gray-500 hover:text-gray-800"
                    onClick={() => setModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Posts */}
        {imagePosts.length > 0 && (
          <>
            <div className="text-xl font-bold mt-8 mb-4">Photos and Images</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {imagePosts.map((post, idx) => (
                <div key={`img-card-${idx}`} className="bg-white shadow rounded-xl p-4 flex flex-col items-center">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded"
                  />
                  <div className="mt-3 font-semibold text-base text-center">{post.title}</div>
                  {post.description && (
                    <div className="text-gray-600 text-sm mt-1 text-center">{post.description}</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
