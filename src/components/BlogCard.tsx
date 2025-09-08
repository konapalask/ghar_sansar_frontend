// src/components/BlogCard.tsx
import React from "react";

export type BlogImage = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  video?: string; // YouTube / Instagram link
  price?: number;
  features?: string[];
};

interface BlogCardProps {
  blog: BlogImage;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, featured }) => {
  // Helpers to extract IDs for embeds
  const extractYouTubeId = (url?: string) => {
    if (!url) return "";
    const match = url.match(/(?:v=|youtu\.be\/)([\w-]+)/);
    return match ? match[1] : "";
  };

  const extractInstagramId = (url?: string) => {
    if (!url) return "";
    const match = url.match(/instagram\.com\/p\/([\w-]+)/);
    return match ? match[1] : "";
  };

  const isYouTube = blog.video?.includes("youtube") || blog.video?.includes("youtu.be");
  const isInstagram = blog.video?.includes("instagram.com");

  return (
    <div
      className={`rounded overflow-hidden shadow bg-white flex flex-col ${
        featured ? "lg:flex-row lg:h-96" : ""
      }`}
    >
      {/* Image / Video Section */}
      <div className={`${featured ? "lg:w-1/2" : ""}`}>
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className={`${featured ? "h-full object-cover w-full" : "h-64 w-full object-cover"}`}
          />
        )}

        {blog.video && isYouTube && (
          <iframe
            width="100%"
            height={featured ? 400 : 200}
            src={`https://www.youtube.com/embed/${extractYouTubeId(blog.video)}`}
            title="YouTube video"
            frameBorder="0"
            allowFullScreen
            className="mt-2 rounded"
          />
        )}

        {blog.video && isInstagram && (
          <iframe
            src={`https://www.instagram.com/p/${extractInstagramId(blog.video)}/embed`}
            width="100%"
            height={featured ? 480 : 200}
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            className="mt-2 rounded"
          ></iframe>
        )}
      </div>

      {/* Text Section */}
      <div className={`p-4 ${featured ? "lg:w-1/2 lg:flex lg:flex-col lg:justify-center" : ""}`}>
        <h3 className={`font-semibold ${featured ? "text-2xl" : "text-lg"} mb-2`}>
          {blog.title}
        </h3>
        {blog.description && <p className="text-gray-600">{blog.description}</p>}
      </div>
    </div>
  );
};

export default BlogCard;
