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
  image: string | File;
  video?: string;
  category: string;
  subCategory: string;
  features?: string[];
}

// Category type
interface Category {
  name: string;
  subcategories: { name: string }[];
}

// Fix CloudFront/S3 URLs or create object URL for File type images
const fixImageUrl = (url: string | File) => {
  if (!url) return "";
  if (url instanceof File) return URL.createObjectURL(url);
  return url.replace(/^https?:\/\/https?:\/\//, "https://").replace(/([^:]\/)\/+/g, "$1");
};

const ProductsAdmin: React.FC = () => {
  const API_BASE =
    import.meta.env.VITE_AWS_API_URL || "https://backend.gharsansar.store/api/v1";

  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    actual_price: "",
    image: "" as string | File,
    category: "products", // default
    subCategory: "general",
    features: [] as string[],
  });

  // Fetch products + categories
  const fetchCategoriesAndProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/storage/uploads/products`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
      const data = await res.json();

      // Categories
      setCategoriesData(
        Array.isArray(data.categories)
          ? data.categories.map((cat: any) => ({
              name: cat.name,
              subcategories: Array.isArray(cat.subcategories)
                ? cat.subcategories.map((sub: any) => ({ name: sub.name }))
                : [],
            }))
          : []
      );

      // Products
      const allProducts: Product[] = [];
      data?.categories?.forEach((category: any) => {
        category.subcategories?.forEach((sub: any) => {
          sub.images?.forEach((img: any, index: number) => {
            allProducts.push({
              id: img.id || `${category.name}-${sub.name}-${index}`,
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
        });
      });

      setProducts(allProducts);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  // Image change
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
      formData.append("category_type", "products");
      formData.append("category_name", form.category);
      formData.append("subcategory_name", form.subCategory);
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("actual_price", form.actual_price || "0");
      formData.append("description", form.description);
      formData.append("features", form.features?.join(",") || "");
      if (form.image instanceof File) formData.append("image", form.image);

      const res = await fetch(`${API_BASE}/storage/uploads`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Upload failed: ${errText}`);
      }

      await fetchCategoriesAndProducts();
      setForm({
        title: "",
        description: "",
        price: "",
        actual_price: "",
        image: "",
        category: categoriesData[0]?.name || "products",
        subCategory: categoriesData[0]?.subcategories[0]?.name || "general",
        features: [],
      });
      setPreview(null);
      setEditingId(null);
    } catch (err) {
      console.error("❌ Error uploading product:", err);
      alert("Upload failed. Check console.");
    }
  };

  // Edit
  const handleEdit = (id: string) => {
    const p = products.find((p) => p.id === id);
    if (!p) return;
    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
      actual_price: p.actual_price || "",
      image: p.image,
      category: p.category,
      subCategory: p.subCategory,
      features: p.features || [],
    });
    setPreview(fixImageUrl(p.image));
    setEditingId(id);
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    // Find product to get category and subcategory for API call
    const product = products.find((p) => p.id === id);
    if (!product) return;

    try {
      const query = new URLSearchParams({
        category_name: product.category,
        subcategory_name: product.subCategory,
        id: id,
      }).toString();

      const res = await fetch(`${API_BASE}/storage/uploads/products?${query}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Delete failed: ${errText}`);
      }

      // Refetch products after deletion
      await fetchCategoriesAndProducts();
    } catch (err) {
      alert("Delete failed. Check console for details.");
      console.error("❌ Error deleting product:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin: Manage Products</h1>

      {/* Form */}
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
        <input
          type="text"
          placeholder="Actual Price"
          value={form.actual_price}
          onChange={(e) => setForm({ ...form, actual_price: e.target.value })}
          className="border p-2 w-full"
        />

        {/* Category & Subcategory dropdowns */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block font-medium mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                  subCategory:
                    categoriesData.find((c) => c.name === e.target.value)
                      ?.subcategories[0]?.name || "",
                })
              }
              className="border p-2 w-full"
            >
              {categoriesData.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Subcategory</label>
            <select
              value={form.subCategory}
              onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
              className="border p-2 w-full"
            >
              {categoriesData
                .find((c) => c.name === form.category)
                ?.subcategories.map((sub) => (
                  <option key={sub.name} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block font-medium mb-1">Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <div className="aspect-video w-full bg-gray-100 rounded overflow-hidden mt-2">
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
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

      {/* Products */}
      <h2 className="text-xl font-semibold">Existing Products</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : Array.isArray(products) && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border rounded p-3 shadow-sm">
              {p.image && (
                <div className="aspect-video w-full bg-gray-100 rounded overflow-hidden mb-2">
                  <img src={fixImageUrl(p.image)} alt={p.title} className="w-full h-full object-contain" />
                </div>
              )}
              {p.video && (
                <video controls className="aspect-video w-full rounded mb-2 bg-black">
                  <source src={fixImageUrl(p.video)} />
                </video>
              )}
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.description}</p>
              <p className="text-lg font-semibold">₹{p.price}</p>
              <div className="flex space-x-2 mt-2">
                <button onClick={() => handleEdit(p.id)} className="bg-yellow-500 text-white px-2 py-1 rounded flex items-center">
                  <Edit3 className="w-4 h-4 mr-1" /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2 py-1 rounded flex items-center">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );
};

export default ProductsAdmin;
