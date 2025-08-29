import React, { useState } from "react";
import Papa from "papaparse";
import { Save, Edit3, Trash2 } from "lucide-react";
import { useBlogs } from "../../context/BlogContext";


const BlogAdmin: React.FC = () => {
  const { blogs, addBlog, deleteBlog, updateBlog } = useBlogs();

  const [newBlog, setNewBlog] = useState<Blog>({
    id: "",
    title: "",
    content: "",
    excerpt: "",
    category: "",
    author: "",
    date: new Date().toLocaleDateString(),
    image: "",
    readTime: "",
  });

  const [editId, setEditId] = useState<string | null>(null);

  const handleAddBlog = () => {
    if (!newBlog.title || !newBlog.content) return;
    addBlog({ ...newBlog, id: Date.now().toString() });
    setNewBlog({
      id: "",
      title: "",
      content: "",
      excerpt: "",
      category: "",
      author: "",
      date: new Date().toLocaleDateString(),
      image: "",
      readTime: "",
    });
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    Papa.parse(e.target.files[0], {
      header: true,
      complete: (result) => {
        (result.data as Blog[]).forEach((b) =>
          addBlog({ ...b, id: Date.now().toString() })
        );
      },
    });
  };

  const handleEditSave = (id: string) => {
    updateBlog(id, newBlog);
    setEditId(null);
    setNewBlog({
      id: "",
      title: "",
      content: "",
      excerpt: "",
      category: "",
      author: "",
      date: new Date().toLocaleDateString(),
      image: "",
      readTime: "",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin: Manage Blog Posts</h2>

      {/* Add Blog Form */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newBlog.title}
          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={newBlog.category}
          onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Author"
          value={newBlog.author}
          onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Read Time (e.g., 5 min read)"
          value={newBlog.readTime}
          onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newBlog.image}
          onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
          className="border p-2 rounded col-span-2"
        />
        <textarea
          placeholder="Excerpt (short summary)"
          value={newBlog.excerpt}
          onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
          className="border p-2 rounded col-span-2 h-20"
        />
        <textarea
          placeholder="Content (full blog)"
          value={newBlog.content}
          onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
          className="border p-2 rounded col-span-2 h-28"
        />
      </div>

      <button
        onClick={handleAddBlog}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Add Blog
      </button>

      {/* Upload CSV */}
      <div className="mb-6">
        <p className="font-semibold mb-2">Upload CSV</p>
        <input type="file" accept=".csv" onChange={handleCSVUpload} />
      </div>

      {/* Existing Blogs */}
      <h3 className="text-lg font-bold mb-2">Existing Blogs</h3>
      <div className="space-y-4">
        {blogs.map((b) => (
          <div
            key={b.id}
            className="flex items-start justify-between border p-3 rounded shadow-sm"
          >
            <div className="flex items-start gap-4">
              {b.image && (
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div>
                <p className="font-semibold text-lg">{b.title}</p>
                <p className="text-sm text-gray-600">
                  {b.category} • {b.author} • {b.date}
                </p>
                <p className="text-gray-800 mt-1 text-sm line-clamp-2">
                  {b.excerpt}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {editId === b.id ? (
                <button
                  onClick={() => handleEditSave(b.id)}
                  className="flex items-center gap-1 text-green-600"
                >
                  <Save size={16} /> Save
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditId(b.id);
                    setNewBlog(b);
                  }}
                  className="flex items-center gap-1 text-blue-600"
                >
                  <Edit3 size={16} /> Edit
                </button>
              )}
              <button
                onClick={() => deleteBlog(b.id)}
                className="flex items-center gap-1 text-red-600"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogAdmin;
