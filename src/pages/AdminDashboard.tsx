import React, { useMemo, useState } from "react";
import {
  Plus,
  Save,
  X as Close,
  Edit3,
  Trash2,
  ImagePlus,
  ListFilter,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts, Product } from "../context/ProductContext";
import Papa from "papaparse";
// CSV parser

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(n);

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  category: "",
  subCategory: "",
  price: 0,
  image: "",
  description: "",
  stock: 0,
  rating: 0,
  isFresh: true,
  createdAt: Date.now(),
};

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth?.() || { isAdmin: true };
  const { products, setProducts } = useProducts();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "price-asc" | "price-desc">("new");

  // Show/hide product add forms and CSV upload panel
  const [showAdd, setShowAdd] = useState(true);
  const [activeTab, setActiveTab] = useState<"single" | "multi" | "csv">("single");

  // State for single add form
  const [addForm, setAddForm] = useState<Omit<Product, "id">>({ ...emptyProduct });

  // State for dynamic multiple product forms
  const [multiForms, setMultiForms] = useState<Omit<Product, "id">[]>([{ ...emptyProduct }]);

  // CSV import state
  const [csvData, setCsvData] = useState<Omit<Product, "id">[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Product | null>(null);

  const categorySuggestions = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort(),
    [products]
  );
  const subCategorySuggestions = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.subCategory && set.add(p.subCategory));
    return Array.from(set).sort();
  }, [products]);

  const visible = useMemo(() => {
    let list = products.filter((p) =>
      [p.name, p.category, p.subCategory, p.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    if (sort === "new") list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, query, sort]);

  // Single add
  const addProduct = () => {
    if (!addForm.name.trim()) return alert("Name is required");
    if (!addForm.image.trim()) return alert("Image (URL or file) is required");

    const now = Date.now();
    const newItem: Product = {
      id: String(now),
      ...addForm,
      price: Number(addForm.price) || 0,
      stock: Number(addForm.stock) || 0,
      rating: Number(addForm.rating) || 0,
      isFresh: true,
      createdAt: now,
    };

    setProducts([newItem, ...products]);
    setAddForm({ ...emptyProduct });
  };

  // Dynamic multiple forms handlers
  const addMultiForm = () => {
    setMultiForms((prev) => [...prev, { ...emptyProduct }]);
  };
  const removeMultiForm = (index: number) => {
    setMultiForms((prev) => prev.filter((_, i) => i !== index));
  };
  const updateMultiForm = (index: number, field: keyof Omit<Product, "id">, value: any) => {
    setMultiForms((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };
  const saveMultiProducts = () => {
    // Validate all forms: name and image required
    for (let form of multiForms) {
      if (!form.name.trim() || !form.image.trim()) {
        alert("Each product requires a name and an image.");
        return;
      }
    }
    const now = Date.now();
    const items: Product[] = multiForms.map((form, idx) => ({
      id: String(now + idx),
      ...form,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      rating: Number(form.rating) || 0,
      isFresh: true,
      createdAt: now + idx,
    }));
    setProducts((prev) => [...items, ...prev]);
    setMultiForms([{ ...emptyProduct }]);
  };

  // CSV upload handlers
  const handleCSVFile = (file?: File | null) => {
    if (!file) return;
    setCsvError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Basic validation: check required columns present
        const requiredCols = ["name", "category", "subCategory", "price", "image", "description", "stock", "rating"];
        const colsPresent = requiredCols.every(col => results.meta.fields?.includes(col));
        if (!colsPresent) {
          setCsvError(`CSV missing required columns: ${requiredCols.join(", ")}`);
          return;
        }
        const rows: Omit<Product, "id">[] = results.data.map((row: any) => ({
          name: row.name || "",
          category: row.category || "",
          subCategory: row.subCategory || "",
          price: Number(row.price) || 0,
          image: row.image || "",
          description: row.description || "",
          stock: Number(row.stock) || 0,
          rating: Number(row.rating) || 0,
          isFresh: true,
          createdAt: Date.now(),
        }));
        setCsvData(rows);
      },
      error: (error) => {
        setCsvError("Error parsing CSV: " + error.message);
      },
    });
  };
  const saveCSVProducts = () => {
    if (csvData.length === 0) {
      alert("No valid products in CSV to add.");
      return;
    }
    // Check all have name/image
    for (let p of csvData) {
      if (!p.name.trim() || !p.image.trim()) {
        alert("Each product requires a name and an image.");
        return;
      }
    }
    const now = Date.now();
    const items: Product[] = csvData.map((form, idx) => ({
      id: String(now + idx),
      ...form,
    }));
    setProducts((prev) => [...items, ...prev]);
    setCsvData([]);
  };

  // Editing handlers are unchanged from your original code:
  const startEdit = (p: Product) => {
    setEditId(p.id);
    setDraft({ ...p });
  };
  const cancelEdit = () => {
    setEditId(null);
    setDraft(null);
  };
  const saveEdit = () => {
    if (!draft) return;
    if (!draft.name.trim()) return alert("Name is required");
    if (!draft.image.trim()) return alert("Image is required");
    setProducts(
      products.map((p) => (p.id === draft.id ? { ...draft, price: Number(draft.price) || 0 } : p))
    );
    cancelEdit();
  };
  const remove = (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    setProducts(products.filter((p) => p.id !== id));
  };
  const onAddFile = async (file?: File | null) => {
    if (!file) return;
    const b64 = await fileToBase64(file);
    setAddForm((f) => ({ ...f, image: b64 }));
  };
  const onEditFile = async (file?: File | null) => {
    if (!file || !draft) return;
    const b64 = await fileToBase64(file);
    setDraft({ ...draft, image: b64 });
  };

  if (typeof isAdmin !== "undefined" && !isAdmin) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin – Products</h1>
          <div className="flex gap-2">
            <div className="relative">
              <input
                placeholder="Search by name/category…"
                className="border rounded-lg px-3 py-2 w-64"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="border rounded-lg px-3 py-2"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="new">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Tabs for add type */}
        <div className="flex gap-4 border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("single")}
            className={`py-2 px-4 ${
              activeTab === "single"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Single Product
          </button>
          <button
            onClick={() => setActiveTab("multi")}
            className={`py-2 px-4 ${
              activeTab === "multi"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Multiple Products
          </button>
          <button
            onClick={() => setActiveTab("csv")}
            className={`py-2 px-4 ${
              activeTab === "csv"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            CSV Upload
          </button>
        </div>

        {/* Add single product form */}
        {activeTab === "single" && (
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add New Product
              </h2>
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setShowAdd((v) => !v)}
              >
                {showAdd ? "Hide" : "Show"}
              </button>
            </div>

            {showAdd && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                {/* Your existing addForm inputs */}
                <div className="md:col-span-3">
                  <label className="text-sm text-gray-600">Name</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-sm text-gray-600">Category</label>
                  <input
                    list="category-options"
                    className="w-full border rounded-lg px-3 py-2"
                    value={addForm.category}
                    onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  />
                  <datalist id="category-options">
                    {categorySuggestions.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div className="md:col-span-3">
                  <label className="text-sm text-gray-600">Sub Category</label>
                  <input
                    list="subcategory-options"
                    className="w-full border rounded-lg px-3 py-2"
                    value={addForm.subCategory}
                    onChange={(e) => setAddForm({ ...addForm, subCategory: e.target.value })}
                  />
                  <datalist id="subcategory-options">
                    {subCategorySuggestions.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
                <div className="md:col-span-3">
                  <label className="text-sm text-gray-600">Price</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border rounded-lg px-3 py-2"
                    value={addForm.price}
                    onChange={(e) => setAddForm({ ...addForm, price: Number(e.target.value) })}
                  />
                </div>

                <div className="md:col-span-6">
                  <label className="text-sm text-gray-600">Image URL</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="https://… or leave blank and upload file"
                    value={addForm.image}
                    onChange={(e) => setAddForm({ ...addForm, image: e.target.value })}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                      <ImagePlus className="w-4 h-4" /> Upload File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onAddFile(e.target.files?.[0])}
                      />
                    </label>
                    {addForm.image && (
                      <img src={addForm.image} alt="preview" className="w-10 h-10 object-cover rounded" />
                    )}
                  </div>
                </div>

                <div className="md:col-span-6">
                  <label className="text-sm text-gray-600">Description</label>
                  <textarea
                    rows={2}
                    className="w-full border rounded-lg px-3 py-2"
                    value={addForm.description}
                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Stock</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border rounded-lg px-3 py-2"
                    value={addForm.stock}
                    onChange={(e) => setAddForm({ ...addForm, stock: Number(e.target.value) })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Rating</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    className="w-full border rounded-lg px-3 py-2"
                    value={addForm.rating}
                    onChange={(e) => setAddForm({ ...addForm, rating: Number(e.target.value) })}
                  />
                </div>

                <div className="md:col-span-12 flex gap-2">
                  <button
                    onClick={addProduct}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Product
                  </button>
                  <button
                    onClick={() =>
                      setAddForm({ ...emptyProduct, createdAt: Date.now() })
                    }
                    className="px-4 py-2 rounded-lg border"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Multiple products dynamic forms */}
        {activeTab === "multi" && (
          <div className="bg-white rounded-xl shadow p-5 space-y-6">
            <h2 className="text-xl font-semibold">Add Multiple Products</h2>
            {multiForms.map((form, i) => (
              <div key={i} className="border rounded p-4 relative">
                {multiForms.length > 1 && (
                  <button
                    onClick={() => removeMultiForm(i)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
                    title="Remove this product"
                  >
                    &times;
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-3">
                    <label className="text-sm text-gray-600">Name</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.name}
                      onChange={(e) => updateMultiForm(i, "name", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-sm text-gray-600">Category</label>
                    <input
                      list="category-options"
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.category}
                      onChange={(e) => updateMultiForm(i, "category", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-sm text-gray-600">Sub Category</label>
                    <input
                      list="subcategory-options"
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.subCategory}
                      onChange={(e) => updateMultiForm(i, "subCategory", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-sm text-gray-600">Price</label>
                    <input
                      type="number"
                      min={0}
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.price}
                      onChange={(e) => updateMultiForm(i, "price", Number(e.target.value))}
                    />
                  </div>

                  <div className="md:col-span-6">
                    <label className="text-sm text-gray-600">Image URL</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.image}
                      placeholder="https://..."
                      onChange={(e) => updateMultiForm(i, "image", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-6">
                    <label className="text-sm text-gray-600">Description</label>
                    <textarea
                      rows={2}
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.description}
                      onChange={(e) => updateMultiForm(i, "description", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600">Stock</label>
                    <input
                      type="number"
                      min={0}
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.stock}
                      onChange={(e) => updateMultiForm(i, "stock", Number(e.target.value))}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600">Rating</label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.rating}
                      onChange={(e) => updateMultiForm(i, "rating", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addMultiForm}
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <Plus className="w-5 h-5" /> Add Another Product
            </button>
            <div>
              <button
                onClick={saveMultiProducts}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save All Products
              </button>
            </div>
          </div>
        )}

        {/* CSV upload */}
        {activeTab === "csv" && (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Upload Products via CSV</h2>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => handleCSVFile(e.target.files?.[0])}
              className="mb-4"
            />
            {csvError && <p className="text-red-600 mb-3">{csvError}</p>}
            {csvData.length > 0 && (
              <div className="mb-4 max-h-64 overflow-auto border rounded p-3 bg-gray-50">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-200 sticky top-0">
                    <tr>
                      <th className="py-1 px-2">Name</th>
                      <th className="py-1 px-2">Category</th>
                      <th className="py-1 px-2">SubCategory</th>
                      <th className="py-1 px-2">Price</th>
                      <th className="py-1 px-2">Stock</th>
                      <th className="py-1 px-2">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.map((prod, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-1 px-2">{prod.name}</td>
                        <td className="py-1 px-2">{prod.category}</td>
                        <td className="py-1 px-2">{prod.subCategory}</td>
                        <td className="py-1 px-2">{prod.price}</td>
                        <td className="py-1 px-2">{prod.stock}</td>
                        <td className="py-1 px-2">{prod.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {csvData.length > 0 && (
              <button
                onClick={saveCSVProducts}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save All CSV Products
              </button>
            )}
          </div>
        )}

        {/* Products list (existing code) */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ListFilter className="w-5 h-5" /> Products ({visible.length})
            </h2>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-2">Image</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">SubCategory</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p.id} className="border-t align-top">
                    <td className="px-3 py-2">
                      {editId === p.id ? (
                        <div className="flex items-center gap-2">
                          <img src={draft?.image} className="w-10 h-10 object-cover rounded" />
                          <label className="text-xs inline-flex items-center gap-1 cursor-pointer">
                            <ImagePlus className="w-4 h-4" />
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => onEditFile(e.target.files?.[0])} />
                            Change
                          </label>
                        </div>
                      ) : (
                        <img src={p.image} className="w-12 h-12 object-cover rounded" />
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editId === p.id ? (
                        <input
                          className="border rounded px-2 py-1 w-56"
                          value={draft?.name || ""}
                          onChange={(e) => draft && setDraft({ ...draft, name: e.target.value })}
                        />
                      ) : (
                        <div>
                          <div className="font-medium">{p.name}</div>
                          {p.description && <div className="text-gray-500 line-clamp-2 text-xs">{p.description}</div>}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editId === p.id ? (
                        <input
                          list="category-options"
                          className="border rounded px-2 py-1 w-44"
                          value={draft?.category || ""}
                          onChange={(e) => draft && setDraft({ ...draft, category: e.target.value })}
                        />
                      ) : (
                        <span>{p.category}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editId === p.id ? (
                        <input
                          list="subcategory-options"
                          className="border rounded px-2 py-1 w-44"
                          value={draft?.subCategory || ""}
                          onChange={(e) => draft && setDraft({ ...draft, subCategory: e.target.value })}
                        />
                      ) : (
                        <span>{p.subCategory || "—"}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editId === p.id ? (
                        <input
                          type="number"
                          min={0}
                          className="border rounded px-2 py-1 w-28"
                          value={draft?.price ?? 0}
                          onChange={(e) => draft && setDraft({ ...draft, price: Number(e.target.value) })}
                        />
                      ) : (
                        <span>{formatINR(p.price)}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editId === p.id ? (
                        <input
                          type="number"
                          min={0}
                          className="border rounded px-2 py-1 w-20"
                          value={draft?.stock ?? 0}
                          onChange={(e) => draft && setDraft({ ...draft, stock: Number(e.target.value) })}
                        />
                      ) : (
                        <span>{p.stock ?? 0}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editId === p.id ? (
                        <div className="flex gap-2">
                          <button onClick={saveEdit} className="px-3 py-1 rounded bg-green-600 text-white text-xs inline-flex items-center gap-1">
                            <Save className="w-4 h-4" /> Save
                          </button>
                          <button onClick={cancelEdit} className="px-3 py-1 rounded border text-xs inline-flex items-center gap-1">
                            <Close className="w-4 h-4" /> Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(p)} className="px-3 py-1 rounded border text-xs inline-flex items-center gap-1">
                            <Edit3 className="w-4 h-4" /> Edit
                          </button>
                          <button onClick={() => remove(p.id)} className="px-3 py-1 rounded bg-red-600 text-white text-xs inline-flex items-center gap-1">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {visible.length === 0 && (
                  <tr>
                    <td className="px-3 py-8 text-center text-gray-500" colSpan={7}>
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <datalist id="category-options">
          {categorySuggestions.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <datalist id="subcategory-options">
          {subCategorySuggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>
    </div>
  );
};

export default AdminDashboard;
