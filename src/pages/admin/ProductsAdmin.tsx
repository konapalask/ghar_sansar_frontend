// src/pages/admin/ProductsAdmin.tsx
import React, { useState } from "react";
import { useProducts } from "../../context/ProductContext"; 
import { Save, Edit3, Trash2, ImagePlus } from "lucide-react";

const ProductsAdmin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: "",
    subCategory: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);
      setForm({ ...form, image: imageURL });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Only check required fields
    if (!form.image || !form.category || !form.subCategory) {
      alert("Image, Category, and Sub Category are required.");
      return;
    }

    if (editingId) {
      updateProduct(editingId, {
        ...form,
        price: form.price ? parseFloat(form.price) : undefined, // optional
      });
      setEditingId(null);
    } else {
      addProduct({
        id: "",
        title: form.title || "", // optional
        description: form.description || "",
        price: form.price ? parseFloat(form.price) : 0, // default 0 if not set
        image: form.image,
        category: form.category,
        subCategory: form.subCategory,
      });
    }

    setForm({ title: "", description: "", price: "", image: "", category: "", subCategory: "" });
    setPreview(null);
  };

  const handleEdit = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setForm({
      title: product.title,
      description: product.description || "",
      price: product.price?.toString() || "",
      image: product.image || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
    });
    setPreview(product.image || null);
    setEditingId(id);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin: Manage Products</h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded-md">
        <input
          type="text"
          placeholder="Title (optional)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Price (optional)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 w-full"
        />

        {/* ✅ Image (required) */}
        <div>
          <label className="block font-medium mb-1 text-red-600">* Product Image (required)</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-40 h-40 object-cover rounded border"
            />
          )}
        </div>

        <input
          type="text"
          placeholder="* Category (required)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="* Sub Category (required)"
          value={form.subCategory}
          onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          {editingId ? (
            <>
              <Save className="w-4 h-4 mr-2" /> Update Product
            </>
          ) : (
            <>
              <ImagePlus className="w-4 h-4 mr-2" /> Add Product
            </>
          )}
        </button>
      </form>

      {/* Product List */}
      <h2 className="text-xl font-semibold">Existing Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded p-3 shadow-sm">
            {p.image && (
              <img src={p.image} alt={p.title} className="w-full h-40 object-cover rounded mb-2" />
            )}
            <h3 className="font-bold">{p.title || "Untitled"}</h3>
            <p className="text-sm text-gray-600">{p.description || "No description"}</p>
            <p className="text-lg font-semibold">
              {p.price ? `₹${p.price}` : "Price not set"}
            </p>
            <p className="text-sm">Category: {p.category}</p>
            <p className="text-sm">Sub: {p.subCategory}</p>

            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleEdit(p.id)}
                className="bg-yellow-500 text-white px-2 py-1 rounded flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-1" /> Edit
              </button>
              <button
                onClick={() => deleteProduct(p.id)}
                className="bg-red-500 text-white px-2 py-1 rounded flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsAdmin;
