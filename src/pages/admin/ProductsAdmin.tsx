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
  cat_id: string;
  name: string;
  subcategories: { sub_id: string; name: string }[];
}

// Fix CloudFront/S3 URLs or create object URL for File type images
const fixImageUrl = (url: string | File) => {
  if (!url) return "";
  if (url instanceof File) return URL.createObjectURL(url);
  return url.replace(/^https?:\/\/https?:\/\//, "https://").replace(/([^:]\/)\/+/g, "$1");
};

const ProductsAdmin: React.FC = () => {
  const API_BASE =
    import.meta.env.VITE_AWS_API_URL ||
    "https://lx70r6zsef.execute-api.ap-south-1.amazonaws.com/prod/api";

  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    actual_price: "",
    image: "" as string | File,
    category: "Idols", // default
    subCategory: "Premium Line",
    features: [] as string[],
  });

  // Fetch categories and products
  const fetchCategoriesAndProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/storage/upload/products`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
      const data = await res.json();

      const categories = data.data || [];

      // Store categories
      setCategoriesData(
        categories.map((cat: any) => ({
          cat_id: cat.cat_id,
          name: cat.name,
          subcategories: (cat.subcategories || []).map((sub: any) => ({
            sub_id: sub.sub_id,
            name: sub.name,
          })),
        }))
      );

      // Flatten all products
      const allProducts: Product[] = [];
      categories.forEach((category: any) => {
        category.subcategories?.forEach((sub: any) => {
          sub.products?.forEach((p: any) => {
            allProducts.push({
              id: p.prod_id,
              title: p.title || "Untitled Product",
              description: p.description || "No description",
              price: p.price?.toString() || "0",
              actual_price: p["act-price"]?.toString() || "0",
              image: fixImageUrl(p.image),
              category: category.name,
              subCategory: sub.name,
            });
          });
        });
      });

      setProducts(allProducts);
      console.log("✅ Loaded products:", allProducts.length);
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

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setForm({ ...form, image: file });
      setExistingImageUrl(null);
    }
  };

  // Handle form submit (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || (!form.image && !existingImageUrl)) {
      alert("Title, price, and image are required.");
      return;
    }

    try {
      let res: Response;

      // 🟢 UPDATE PRODUCT
      if (editingId) {
        console.log("Updating product ID:", editingId);
        const params = new URLSearchParams();
        params.append("id", editingId);
        params.append("title", form.title);
        params.append("price", form.price);
        params.append("actual_price", form.actual_price || "0");
        params.append("description", form.description);
        params.append("category_name", form.category);
        params.append("subcategory_name", form.subCategory);

        res = await fetch(`${API_BASE}/storage/upload/products`, {
          method: "PUT",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
      } 
      
      // 🟣 CREATE PRODUCT
      else {
        const formData = new FormData();
        formData.append("category_type", "products");
        formData.append("category_name", form.category);
        formData.append("subcategory_name", form.subCategory);
        formData.append("title", form.title);
        formData.append("price", form.price);
        formData.append("actual_price", form.actual_price || "0");
        formData.append("description", form.description);
        if (form.image instanceof File) {
          formData.append("image", form.image);
        }

        res = await fetch(`${API_BASE}/storage/upload`, {
          method: "POST",
          body: formData,
        });
      }

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      await fetchCategoriesAndProducts();
      alert(editingId ? "✅ Product updated!" : "✅ Product added!");

      // Reset form
      setForm({
        title: "",
        description: "",
        price: "",
        actual_price: "",
        image: "",
        category: categoriesData[0]?.name || "Idols",
        subCategory: categoriesData[0]?.subcategories[0]?.name || "Premium Line",
        features: [],
      });
      setPreview(null);
      setExistingImageUrl(null);
      setEditingId(null);
    } catch (err) {
      console.error("❌ Error uploading product:", err);
      alert("Upload failed. Check console for details.");
    }
  };

  // Edit Product
  const handleEdit = (id: string) => {
    const p = products.find((p) => p.id === id);
    if (!p) {
      alert("Product not found!");
      return;
    }

    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
      actual_price: p.actual_price || "",
      image: "",
      category: p.category,
      subCategory: p.subCategory,
      features: p.features || [],
    });
    setPreview(null);
    setExistingImageUrl(fixImageUrl(p.image));
    setEditingId(id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${API_BASE}/storage/uploads/products?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      alert("🗑️ Product deleted successfully!");
      await fetchCategoriesAndProducts();
    } catch (err) {
      console.error("❌ Error deleting product:", err);
      alert("Delete failed. Check console for details.");
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
                <option key={cat.cat_id} value={cat.name}>
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
                  <option key={sub.sub_id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-auto mt-2 rounded" />
          ) : existingImageUrl ? (
            <img src={existingImageUrl} alt="Existing" className="w-full h-auto mt-2 rounded" />
          ) : null}
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

      {/* Product Grid */}
      <h2 className="text-xl font-semibold">Existing Products</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border rounded p-3 shadow-sm">
              <img src={fixImageUrl(p.image)} alt={p.title} className="rounded mb-2 w-full" />
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.description}</p>
              <p className="text-lg font-semibold">₹{p.price}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(p.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center"
                >
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
