import React, { useState } from "react";
import { useBlogs, Blog } from "../../context/BlogContext";
import axios from "axios";

const API_DELETE = "https://lx70r6zsef.execute-api.ap-south-1.amazonaws.com/prod/api/storage/uploads/blog";

const BlogAdmin: React.FC = () => {
  const { blogs, addBlog, refreshBlogs } = useBlogs()!;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Title required");

    try {
      await addBlog(
        { title, description, price: Number(price) || undefined, video },
        image || undefined
      );
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setVideo("");
      setPreview(null);
      await refreshBlogs();
    } catch (err) {
      console.error(err);
      alert("Failed to add blog");
    }
  };

  // ---- FIX: use blog.id (the UUID) for deletion query ----
  const handleDelete = async (blog: Blog) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(API_DELETE, {
        params: {
          category_type: "blog",
          category_name: blog.features?.[0] || "general",
          subcategory_name: "general",
          id: blog.id, // MUST use UUID returned as "id" from backend JSON
        },
      });
      await refreshBlogs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    }
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : "";
  };

  const extractInstagramId = (url: string) => {
    const match = url.match(/instagram\.com\/p\/([\w-]+)/);
    return match ? match[1] : "";
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin: Blogs</h1>

      {/* Add Blog Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-gray-50 rounded space-y-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="YouTube/Instagram URL"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded mt-2"
          />
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Blog
        </button>
      </form>

      {/* Existing Blogs */}
      <h2 className="text-xl font-semibold">Existing Blogs</h2>
      <ul className="space-y-4">
        {blogs.map((b) => {
          const isYouTube = b.video?.includes("youtube") || b.video?.includes("youtu.be");
          const isInstagram = b.video?.includes("instagram.com");

          return (
            <li key={b.id} className="p-4 bg-white rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{b.title}</span>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(b)}
                >
                  Delete
                </button>
              </div>
              {b.description && <p>{b.description}</p>}

              {/* Image */}
              {b.image && (
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-48 h-48 object-cover rounded"
                />
              )}

              {/* YouTube Video */}
              {b.video && isYouTube && (
                <iframe
                  width="320"
                  height="180"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(b.video)}`}
                  title="YouTube video"
                  frameBorder="0"
                  allowFullScreen
                  className="mt-2 rounded"
                />
              )}

              {/* Instagram Video */}
              {b.video && isInstagram && (
                <iframe
                  src={`https://www.instagram.com/p/${extractInstagramId(b.video)}/embed`}
                  width="320"
                  height="400"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="mt-2 rounded"
                ></iframe>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BlogAdmin;
