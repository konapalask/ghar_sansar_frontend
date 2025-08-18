import React, { useState } from "react";
import { useBlog } from "../context/BlogContext";
import { Save, Trash2, Edit3, Plus } from "lucide-react";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  image: "",
  author: "",
  date: new Date().toISOString().slice(0,10), // yyyy-mm-dd
  readTime: "",
  category: "",
  tags: "",
};

const BlogAdmin: React.FC = () => {
  const { posts, addPost, updatePost, deletePost } = useBlog();
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    if (!form.title || !form.content) return alert("Title and Content are required.");
    const tagsArr = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
    const newPost = {
      ...form,
      id: editingId || String(Date.now()),
      tags: tagsArr,
      excerpt: form.excerpt || form.content.slice(0,100),
    };
    if (editingId) {
      updatePost(newPost);
    } else {
      addPost(newPost);
    }
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  const startEdit = (post: any) => {
    setForm({ ...post, tags: post.tags ? post.tags.join(", ") : "" });
    setEditingId(post.id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Blog Admin (Add/Edit/Delete)</h1>
      <div className="space-y-2 mb-8 bg-white p-4 rounded">
        <input className="border w-full p-2 mb-2" placeholder="Title" value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <input className="border w-full p-2 mb-2" placeholder="Excerpt" value={form.excerpt}
          onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
        <input className="border w-full p-2 mb-2" placeholder="Image URL" value={form.image}
          onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
        <input className="border w-full p-2 mb-2" placeholder="Author" value={form.author}
          onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
        <input type="date" className="border p-2 mb-2" value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
        <input className="border w-full p-2 mb-2" placeholder="Read Time (e.g. '5 min read')" value={form.readTime}
          onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))} />
        <input className="border w-full p-2 mb-2" placeholder="Category" value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
        <input className="border w-full p-2 mb-2" placeholder="Tags (comma separated)" value={form.tags}
          onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
        <textarea className="border w-full p-2 mb-2" placeholder="HTML or Markdown Content"
          value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-2 flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {editingId ? "Update" : "Save Post"}
        </button>
        {editingId && (
          <button
            onClick={() => { setForm({ ...emptyForm }); setEditingId(null); }}
            className="border px-4 py-2 rounded"
          >Cancel</button>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-2">All Posts</h2>
      <div className="space-y-2">
        {posts.map(post => (
          <div key={post.id} className="bg-gray-50 rounded border p-3 flex justify-between items-center">
            <div>
              <b>{post.title}</b><br/>
              <span className="text-xs">{post.category}</span> | <span className="text-xs">{post.author}</span>
            </div>
            <span>
              <button className="text-blue-600 mr-2" onClick={() => startEdit(post)}><Edit3 /></button>
              <button className="text-red-600" onClick={() => deletePost(post.id)}><Trash2 /></button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogAdmin;
