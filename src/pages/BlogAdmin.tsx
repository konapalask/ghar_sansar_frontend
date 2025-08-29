import React, { useState } from "react";
import { useBlog } from "../context/BlogContext";
import { Save, Trash2, Edit3 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

const emptyForm: Omit<BlogPost, "id"> & { tags: string } = {
  title: "",
  excerpt: "",
  content: "",
  image: "",
  author: "",
  date: new Date().toISOString().slice(0, 10),
  readTime: "",
  category: "",
  tags: "",
};

const BlogAdmin: React.FC = () => {
  const { posts, addPost, updatePost, deletePost } = useBlog();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) {
      return alert("Title and Content are required.");
    }

    const tagsArr = form.tags
      ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const newPost: BlogPost = {
      id: editingId || String(Date.now()),
      title: form.title,
      excerpt: form.excerpt || form.content.slice(0, 100),
      content: form.content,
      image: form.image, // ✅ make sure this is saved
      author: form.author,
      date: form.date,
      readTime: form.readTime,
      category: form.category,
      tags: tagsArr,
    };

    if (editingId) {
      updatePost(newPost);
    } else {
      addPost(newPost);
    }

    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (post: BlogPost) => {
    setForm({
      ...post,
      tags: post.tags.join(", "), // ✅ convert array back to string
    });
    setEditingId(post.id);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Blog Admin (Add/Edit/Delete)</h1>
      <div className="space-y-2 mb-8 bg-white p-4 rounded shadow">
        <input
          className="border w-full p-2 mb-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <input
          className="border w-full p-2 mb-2"
          placeholder="Excerpt"
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
        />
        <input
          className="border w-full p-2 mb-2"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
        />

        {/* ✅ Preview image */}
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="w-32 h-32 object-cover rounded mb-2"
          />
        )}

        <input
          className="border w-full p-2 mb-2"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
        />
        <input
          type="date"
          className="border p-2 mb-2"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
        />
        <input
          className="border w-full p-2 mb-2"
          placeholder="Read Time"
          value={form.readTime}
          onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))}
        />
        <input
          className="border w-full p-2 mb-2"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        />
        <input
          className="border w-full p-2 mb-2"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
        />
        <textarea
          className="border w-full p-2 mb-2"
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          rows={8}
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-2 flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {editingId ? "Update" : "Save Post"}
        </button>
        {editingId && (
          <button onClick={handleCancel} className="border px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">All Posts</h2>
      <div className="space-y-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-50 rounded border p-3 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <b>{post.title}</b>
                <br />
                <span className="text-xs">{post.category}</span> |{" "}
                <span className="text-xs">{post.author}</span>
              </div>
            </div>
            <span>
              <button
                className="text-blue-600 mr-2"
                onClick={() => startEdit(post)}
              >
                <Edit3 />
              </button>
              <button
                className="text-red-600"
                onClick={() => deletePost(post.id)}
              >
                <Trash2 />
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogAdmin;
