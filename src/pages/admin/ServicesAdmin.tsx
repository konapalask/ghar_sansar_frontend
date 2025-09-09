// src/pages/admin/ServicesAdmin.tsx
import React, { useState, useEffect } from "react";
import { useServices, Service } from "../../context/ServiceContext";

const fixImageUrl = (url: string | undefined) => {
  if (!url) return "";
  return url.replace(/^https?:\/\/https?:\/\//, "https://").replace(/\s/g, "%20").replace(/([^:]\/)\/+/g, "$1");
};

const ServicesAdmin: React.FC = () => {
  const { services, addService, updateService, deleteService, refreshServices } = useServices();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setImage(null);
    setPreview(null);
    setEditingService(null);
  };

  const handleFileChange = (file: File) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Only JPG, JPEG, PNG, and WEBP images are supported.");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || (!image && !editingService)) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    try {
      const serviceData: Partial<Service> = {
        title,
        description,
        price,
        features: ["Customizable", "High Quality"],
        category: editingService?.category || "general",
        subCategory: editingService?.subCategory || "general",
      };

      if (image) serviceData.image = image;

      if (editingService) {
        await updateService(editingService.id, { ...serviceData, image: editingService.image });
      } else {
        await addService(serviceData as Omit<Service, "id">);
      }

      await refreshServices();
      resetForm();
    } catch (err) {
      console.error("❌ Error saving service:", err);
      alert("Failed to save service. Check console.");
    }
  };

  const handleEdit = (id: string) => {
    const s = services.find((s) => s.id === id);
    if (!s) return;
    setEditingService(s);
    setTitle(s.title);
    setDescription(s.description);
    setPrice(s.price?.toString() || "");
    setPreview(fixImageUrl(s.image));
    setImage(null);
  };

  const handleDelete = async (id: string) => {
    const s = services.find((s) => s.id === id);
    if (!s) return;
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteService(s.id, s);
      await refreshServices();
    }
  };

  useEffect(() => {
    refreshServices();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Services</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-3 p-4 bg-gray-50 rounded-lg shadow-md">
        <input className="w-full border p-2 rounded" placeholder="Service Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <textarea className="w-full border p-2 rounded" placeholder="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} />
        {preview && (
          <div className="aspect-video w-full bg-gray-100 rounded overflow-hidden mt-2">
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
          </div>
        )}
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">{editingService ? "Update" : "Add"}</button>
          {editingService && <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Cancel</button>}
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Services</h2>
      <ul className="space-y-3">
        {services.length ? services.map((s) => (
          <li key={s.id} className="p-4 bg-white rounded-lg shadow flex justify-between items-center hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              {s.image && (
                <div className="aspect-video w-32 bg-gray-100 rounded overflow-hidden">
                  <img src={fixImageUrl(s.image)} alt={s.title} className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <strong className="block text-lg">{s.title}</strong>
                {s.price && <span className="text-blue-600 font-medium">₹{s.price}</span>}
                <p className="text-gray-600 text-sm mt-1">{s.description}</p>
              </div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(s.id)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">Edit</button>
              <button onClick={() => handleDelete(s.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Delete</button>
            </div>
          </li>
        )) : <p className="text-gray-500 italic">No services added yet.</p>}
      </ul>
    </div>
  );
};

export default ServicesAdmin;
