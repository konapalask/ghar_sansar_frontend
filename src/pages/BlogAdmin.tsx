// src/pages/admin/BlogAdmin.tsx
import React, { useState } from "react";
import { useBlogs, Blog } from "../../context/BlogContext";
import axios from "axios";

const API_DELETE = "https://backend.gharsansar.store/api/v1/storage/uploads/blog";

// Sanitize URLs to fix double https, missing colon, or duplicate slashes
const sanitizeUrl = (url?: string) => {
  if (!url) return "";
  url = url.trim();

  // Fix missing colon after https
  if (url.startsWith("https//")) url = url.replace("https//", "https://");

  // Fix double https
  if (url.startsWith("https://https://")) url = url.replace("https://https://", "https://");

  // Remove duplicate slashes after domain
  const parts = url.split("://");
  if (parts.length === 2) {
    const protocol = parts[0] + "://";
    let path = parts[1];
    path = path.replace(/\/{2,}/g, "/");
    url = protocol + path;
  }

  return url;
};

const extractYouTubeId = (url: string) => {
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]+)/);
  return match ? match[1] : "";
};

const extractInstagramId = (url: string) => {
  const match = url.match(/instagram\.com\/p\/([\w-]+)/);
  return match ? match[1] : "";
};

const BlogAdmin: React.FC = () => {
  const { blogs, addBlog, refreshBlogs } = useBlogs()!;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
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
        { title, description, price: Number(price) || undefined, videoUrl },
        image || undefined
      );
      setTitle(""); setDescription(""); setPrice(""); setImage(null); setVideoUrl(""); setPreview(null);
      await refreshBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (blog: Blog) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    if (!blog.image) return alert("Cannot delete blog without an image URL.");

    try {
      await axios.delete(API_DELETE, {
        params: {
          category_type: "blog",
          category_name: blog.features?.[0] || "General",
          subcategory_name: "General",
          image_url: blog.image,
        },
      });
      await refreshBlogs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog. Check console for details.");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin: Blogs</h1>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded space-y-2">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 w-full"/>
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 w-full"/>
        <input type="text" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="border p-2 w-full"/>
        <input type="text" placeholder="YouTube/Instagram URL" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="border p-2 w-full"/>
        <input type="file" accept="image/*" onChange={e => e.target.files && handleFileChange(e.target.files[0])}/>
        {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded mt-2"/>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Blog</button>
      </form>

      <h2 className="text-xl font-semibold">Existing Blogs</h2>
      <ul className="space-y-4">
        {blogs.map(b => (
          <li key={b.id} className="p-4 bg-white rounded shadow space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{b.title}</span>
              <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(b)}>Delete</button>
            </div>
            {b.description && <p>{b.description}</p>}
            {b.image && <img src={sanitizeUrl(b.image)} alt={b.title} className="w-48 h-48 object-cover rounded"/>}

            {b.videoUrl && (b.videoUrl.includes("youtube") || b.videoUrl.includes("youtu.be")) && (
              <iframe
                width="320"
                height="180"
                src={`https://www.youtube.com/embed/${extractYouTubeId(sanitizeUrl(b.videoUrl))}`}
                title="YouTube video"
                frameBorder="0"
                allowFullScreen
                className="rounded"
              />
            )}

            {b.videoUrl && b.videoUrl.includes("instagram.com") && (
              <iframe
                src={`https://www.instagram.com/p/${extractInstagramId(sanitizeUrl(b.videoUrl))}/embed`}
                width="320"
                height="400"
                frameBorder="0"
                scrolling="no"
                allowTransparency={true}
                className="rounded"
              />
            )}

            {b.videoUrl && !b.videoUrl.includes("youtube") && !b.videoUrl.includes("instagram.com") && (
              <video width="320" height="180" controls className="rounded">
                <source src={sanitizeUrl(b.videoUrl)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogAdmin;
