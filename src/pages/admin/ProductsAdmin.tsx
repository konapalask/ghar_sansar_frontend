// src/pages/admin/ProductsAdmin.tsx
import React, { useState, useEffect } from "react";
import { Save, Edit3, Trash2, ImagePlus } from "lucide-react";

// Product type
interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  actual_price?: string;
  image: string;
  video?: string;
  category: string;
  subCategory: string;
  features?: string[];
}

// Fix broken CloudFront / S3 URLs or create object URL for File type images
const fixImageUrl = (url: string | File) => {
  if (!url) return "";
  if (url instanceof File) return URL.createObjectURL(url);
  return url
    .replace(/^https?:\/\/https?:\/\//, "https://") // remove double https://
    .replace(/([^:]\/)\/+/g, "$1"); // remove duplicate slashes
};

const ProductsAdmin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "" as string | File,
    category: "showcase_items", // ✅ keep consistent
    subCategory: "general",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const API_BASE =
    import.meta.env.VITE_AWS_API_URL ||
    "https://backend.gharsansar.store/api/v1";

  // ✅ Fetch products and flatten nested structure
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/storage/uploads/products`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
      const data = await res.json();

      const allProducts: Product[] = [];
      if (data?.categories && Array.isArray(data.categories)) {
        data.categories.forEach((category: any) => {
          if (category.subcategories && Array.isArray(category.subcategories)) {
            category.subcategories.forEach((sub: any) => {
              if (sub.images && Array.isArray(sub.images)) {
                sub.images.forEach((img: any, index: number) => {
                  allProducts.push({
                    id: `${category.name}-${sub.name}-${index}`,
                    title: img.title || "Untitled Product",
                    description: img.description || "No description",
                    price: img.price?.toString() || "0",
                    actual_price: img.actual_price?.toString() || "0",
                    image: fixImageUrl(img.image),
                    video: img.video || "",
                    category: category.name,
                    subCategory: sub.name,
                    features: img.features || [],
                  });
                });
              }
            });
          }
        });
      }

      setProducts(allProducts);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle image file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setForm({ ...form, image: file });
    }
  };

  // Add or update product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.image) {
      alert("Title, price, and image are required.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("category_type", "showcase_items"); // ✅ fixed
      formData.append("category_name", form.category);
      formData.append("subcategory_name", form.subCategory);
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("features", "Customizable");
      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      const res = await fetch(`${API_BASE}/storage/uploads`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Upload failed: ${errText}`);
      }
      await fetchProducts();
      setForm({
        title: "",
        description: "",
        price: "",
        image: "",
        category: "showcase_items",
        subCategory: "general",
      });
      setPreview(null);
      setEditingId(null);
    } catch (err) {
      console.error("❌ Error uploading product:", err);
      alert("Upload failed. Check console.");
    }
  };

  // Edit product
  const handleEdit = (id: string) => {
    const p = products.find((p) => p.id === id);
    if (!p) return;
    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
      subCategory: p.subCategory,
    });
    setPreview(fixImageUrl(p.image));
    setEditingId(id);
  };

  // Delete product (local only)
  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin: Manage Products</h1>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded-md">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 w-full"
        />
        <div>
          <label className="block font-medium mb-1">Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <div className="aspect-video w-full bg-gray-100 rounded overflow-hidden mt-2">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
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

      {/* Existing Products */}
      <h2 className="text-xl font-semibold">Existing Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded p-3 shadow-sm">
            {p.image && (
              <div className="aspect-video w-full bg-gray-100 rounded overflow-hidden mb-2">
                <img
                  src={fixImageUrl(p.image)}
                  alt={p.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            {p.video && (
              <video
                controls
                className="aspect-video w-full rounded mb-2 bg-black"
              >
                <source src={fixImageUrl(p.video)} />
                Your browser does not support the video tag.
              </video>
            )}
            <h3 className="font-bold">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.description}</p>
            <p className="text-lg font-semibold">₹{p.price}</p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleEdit(p.id)}
                className="bg-yellow-500 text-white px-2 py-1 rounded flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
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
