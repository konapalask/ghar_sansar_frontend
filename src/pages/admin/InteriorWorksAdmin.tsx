// src/pages/admin/InteriorWorksAdmin.tsx
import React, { useState } from "react";
import { Plus, Edit3, Trash2, Save, X } from "lucide-react";
import { useInterior, InteriorWork } from "../../context/InteriorContext";

const categories: Record<string, string[]> = {
  wallpapers: ["Floral", "Geometric", "Abstract", "Textured"],
  curtains: ["Sheer", "Blackout", "Thermal", "Patterned"],
  lighting: ["Chandeliers", "Pendant Lights", "Wall Sconces", "Table Lamps"],
  furniture: ["Sofas", "Chairs", "Tables", "Storage"],
  decor: ["Vases", "Clocks", "Mirrors", "Plants"],
};

const InteriorWorksAdmin: React.FC = () => {
  const { works = [], addWork, updateWork, deleteWork } = useInterior(); // ✅ safe default
  const [form, setForm] = useState<InteriorWork | null>(null);

  const handleAdd = () => {
    setForm({
      id: Date.now(),
      title: "",
      category: "",
      subCategory: "",
      description: "",
      image: "",
    });
  };

  const handleEdit = (work: InteriorWork) => {
    setForm(work);
  };

  const handleSave = () => {
    if (!form) return;

    if (!form.category || !form.subCategory || !form.image) {
      alert("Category, Subcategory, and Image are required!");
      return;
    }

    if (works.some((w) => w.id === form.id)) {
      updateWork(form); // update existing
    } else {
      addWork(form); // add new
    }
    setForm(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) =>
          prev ? { ...prev, image: reader.result as string } : prev
        );
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interior Works (Admin)</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <Plus size={18} /> Add Interior Work
        </button>
      </div>

      {/* FORM */}
      {form && (
        <div className="border p-4 rounded-lg mb-6 bg-gray-50 shadow">
          <h2 className="text-lg font-semibold mb-3">
            {works.some((w) => w.id === form.id) ? "Edit Work" : "Add New Work"}
          </h2>

          <div className="grid gap-3">
            <input
              type="text"
              placeholder="Title (optional)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border px-3 py-2 rounded-lg"
            />

            {/* Category Dropdown */}
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                  subCategory: "", // reset subcategory
                })
              }
              className="border px-3 py-2 rounded-lg"
              required
            >
              <option value="">Select Category *</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* SubCategory Dropdown */}
            {form.category && (
              <select
                value={form.subCategory}
                onChange={(e) =>
                  setForm({ ...form, subCategory: e.target.value })
                }
                className="border px-3 py-2 rounded-lg"
                required
              >
                <option value="">Select Subcategory *</option>
                {categories[form.category]?.map((sub) => ( // ✅ safe with optional chaining
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}

            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border px-3 py-2 rounded-lg"
            />

            <input type="file" accept="image/*" onChange={handleImageUpload} />

            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="w-40 h-28 object-cover rounded-lg mt-2"
              />
            )}

            <div className="flex gap-3 mt-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Save size={16} /> Save
              </button>
              <button
                onClick={() => setForm(null)}
                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.length > 0 ? (
          works.map((work) => (
            <div
              key={work.id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              {work.image && (
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h2 className="text-lg font-semibold">
                {work.title || "(No Title)"}
              </h2>
              <p className="text-sm text-gray-500">
                {work.category} → {work.subCategory}
              </p>
              <p className="mt-2 text-gray-700">{work.description}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(work)}
                  className="flex items-center gap-1 px-3 py-1 border rounded-lg text-blue-600 hover:bg-blue-50"
                >
                  <Edit3 size={16} /> Edit
                </button>
                <button
                  onClick={() => deleteWork(work.id)}
                  className="flex items-center gap-1 px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No interior works added yet.</p>
        )}
      </div>
    </div>
  );
};

export default InteriorWorksAdmin;
