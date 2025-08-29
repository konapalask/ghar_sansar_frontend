// src/pages/admin/ServicesAdmin.tsx
import React, { useState } from "react";
import { useServices, Service } from "../../context/ServiceContext";

const ServicesAdmin: React.FC = () => {
  const { services, addService, updateService, deleteService } = useServices();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const imageURL = image ? URL.createObjectURL(image) : "";

    if (editingId) {
      updateService(editingId, { title, description, price, image: imageURL });
      setEditingId(null);
    } else {
      addService({ title, description, price, image: imageURL, id: "" });
    }

    setTitle("");
    setDescription("");
    setPrice("");
    setImage(null);
  };

  const handleEdit = (id: string) => {
    const s = services.find((s) => s.id === id);
    if (!s) return;
    setEditingId(id);
    setTitle(s.title);
    setDescription(s.description);
    setPrice(s.price || "");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteService(id);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Services</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setImage(e.target.files[0])}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setDescription("");
              setPrice("");
              setImage(null);
            }}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Services</h2>
      <ul className="space-y-2">
        {services.map((s) => (
          <li key={s.id} className="p-3 bg-gray-100 rounded flex justify-between items-center">
            <div>
              {s.image && <img src={s.image} alt={s.title} className="w-20 h-20 object-cover rounded mr-2 inline-block" />}
              <strong>{s.title}</strong> - {s.price} <br /> {s.description}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(s.id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServicesAdmin;
