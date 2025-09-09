// src/pages/admin/InteriorWorksAdmin.tsx
import React, { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Save, X } from "lucide-react";
import axios from "axios";

interface InteriorWork {
  id: string; // backend id
  title: string;
  category: string;
  subCategory: string;
  description: string;
  image?: string;
  file?: File; // for new uploads
}

const API_UPLOAD = "https://backend.gharsansar.store/api/v1/storage/uploads";

const InteriorWorksAdmin: React.FC = () => {
  const [works, setWorks] = useState<InteriorWork[]>([]);
  const [form, setForm] = useState<InteriorWork | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing works from backend
  const fetchWorks = async () => {
    try {
      const res = await axios.get(`${API_UPLOAD}/interior`);
      const data = res.data;
      const flatWorks: InteriorWork[] = data.categories
        .flatMap((cat: any) =>
          cat.subcategories.flatMap((sub: any) =>
            sub.images.map((imgObj: any) => ({
              id: imgObj.id,
              title: imgObj.title,
              category: cat.name,
              subCategory: sub.name,
              description: imgObj.description,
              image: imgObj.image,
            }))
          )
        );
      setWorks(flatWorks);
    } catch (err) {
      console.error("Failed to fetch works:", err);
      setWorks([]);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleAdd = () => {
    setForm({
      id: "",
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

  const handleDelete = async (id: string) => {
    const work = works.find(w => w.id === id);
    if (!work || !window.confirm("Delete this work?")) return;

    try {
      await axios.delete(`${API_UPLOAD}/interior`, {
        params: {
          category_type: "interior",
          category_name: work.category,
          subcategory_name: work.subCategory,
          id: work.id,
        },
      });
      fetchWorks();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm(prev => prev ? { ...prev, file: e.target.files![0] } : prev);
    }
  };

  const handleSave = async () => {
    if (!form || !form.title || !form.category || !form.subCategory) return alert("Fill all required fields");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("category_type", "interior");
      formData.append("category_name", form.category);
      formData.append("subcategory_name", form.subCategory);
      formData.append("title", form.title);
      formData.append("description", form.description || "");
      if (form.file) {
        formData.append("image", form.file);
      }

      await axios.post(API_UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm(null);
      fetchWorks();
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interior Works (Admin)</h1>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
          <Plus size={18} /> Add Interior Work
        </button>
      </div>

      {/* FORM */}
      {form && (
        <div className="border p-4 rounded-lg mb-6 bg-gray-50 shadow">
          <h2 className="text-lg font-semibold mb-3">{form.id ? "Edit Work" : "Add New Work"}</h2>

          <div className="grid gap-3">
            <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="border px-3 py-2 rounded-lg" />

            {/* Manual Category & Subcategory */}
            <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border px-3 py-2 rounded-lg" />
            <input type="text" placeholder="Subcategory" value={form.subCategory} onChange={e => setForm({ ...form, subCategory: e.target.value })} className="border px-3 py-2 rounded-lg" />

            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border px-3 py-2 rounded-lg" />

            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {form.file && <img src={URL.createObjectURL(form.file)} alt="Preview" className="w-40 h-28 object-cover rounded-lg mt-2" />}

            <div className="flex gap-3 mt-3">
              <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <Save size={16} /> {loading ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setForm(null)} className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map(work => (
          <div key={work.id} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
            {work.image && <img src={work.image} alt={work.title} className="w-full h-40 object-cover rounded-lg mb-3" />}
            <h2 className="text-lg font-semibold">{work.title}</h2>
            <p className="text-sm text-gray-500">{work.category} → {work.subCategory}</p>
            <p className="mt-2 text-gray-700">{work.description}</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => handleEdit(work)} className="flex items-center gap-1 px-3 py-1 border rounded-lg text-blue-600 hover:bg-blue-50">
                <Edit3 size={16} /> Edit
              </button>
              <button onClick={() => handleDelete(work.id)} className="flex items-center gap-1 px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteriorWorksAdmin;
