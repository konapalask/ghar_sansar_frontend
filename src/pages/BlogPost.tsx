import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useBlogs } from "../context/BlogContext";


const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { posts } = useBlog();

  // Find post by id from context; fallback: show not found if no post
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>Oops! The blog post doesn’t exist or has been removed.</p>
        <Link to="/blog" className="text-blue-600 underline">
          Go back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header Image */}
          <div className="relative h-96">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                {post.category}
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>
            </div>
          </div>

          {/* Metadata */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime}</span>
              </div>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-8 lg:p-12">
            <div
              className="prose prose-lg prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-800 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex justify-center items-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{post.author}</h3>
                <p className="text-gray-600">
                  Interior design expert with over 10 years of experience creating beautiful,
                  functional spaces that reflect each client's unique style and needs.
                </p>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Related Posts */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For simplicity, show first two posts excluding current */}
            {posts
              .filter(p => p.id !== post.id)
              .slice(0, 2)
              .map((related) => (
                <div key={related.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl">
                  <img src={related.image} alt={related.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mb-3">
                      {related.category}
                    </span>
                    <h3 className="text-xl font-semibold mb-3">{related.title}</h3>
                    <Link to={`/blog/${related.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;
