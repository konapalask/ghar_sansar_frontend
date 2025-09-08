import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useProducts, Product } from "../context/ProductContext";

// Pagination helper
function getPageNumbers(current: number, total: number, delta = 1): (number | string)[] {
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }
  for (let i of range) {
    if (l !== undefined) {
      if (typeof i === "number" && i - l === 2) rangeWithDots.push(l + 1);
      else if (typeof i === "number" && i - l > 2) rangeWithDots.push("...");
    }
    rangeWithDots.push(i);
    l = typeof i === "number" ? i : l;
  }
  return rangeWithDots;
}

// Helper to format names nicely
const formatName = (name: string) => {
  if (!name) return "";
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// Handwriting font for subcategories
const handwritingStyle = "font-bold italic font-cursive"; // Replace font-cursive with actual font in Tailwind config

const ProductsPage: React.FC = () => {
  const { products } = useProducts();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [subCategoryFilter, setSubCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const itemsPerPage = 12;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...cats];
  }, [products]);

  // Dynamic subcategories based on selected category
  const subCategories = useMemo(() => {
    if (categoryFilter === "All") {
      const subs = Array.from(new Set(products.map((p) => p.subCategory)));
      return ["All", ...subs];
    }
    const subs = Array.from(
      new Set(products.filter((p) => p.category === categoryFilter).map((p) => p.subCategory))
    );
    return ["All", ...subs];
  }, [products, categoryFilter]);

  // Filter products by search, category, subcategory
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = search
        ? p.title.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesCategory =
        categoryFilter === "All" ? true : p.category === categoryFilter;
      const matchesSubCategory =
        subCategoryFilter === "All" ? true : p.subCategory === subCategoryFilter;
      return matchesSearch && matchesCategory && matchesSubCategory;
    });
  }, [products, search, categoryFilter, subCategoryFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentProducts = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <img
          src="/images/logo.png"
          alt="Loading..."
          className="h-40 w-40 animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-white min-h-screen font-sans">
  <h1 className="text-3xl md:text-5xl font-bold italic font-cursive mb-6">
    Products by Gharsansar
  </h1>


      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
        {/* Search */}
        <div className="flex items-center border rounded px-3 py-2 w-full md:max-w-xs bg-white">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="search"
            placeholder="Search products..."
            className="flex-grow bg-transparent outline-none text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Category Filter */}
        <select
          className="border rounded px-3 py-2 text-sm font-serif italic"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setSubCategoryFilter("All"); // reset subcategory when category changes
            setPage(1);
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {formatName(cat)}
            </option>
          ))}
        </select>

        {/* Subcategory Filter */}
        <select
          className={`border rounded px-3 py-2 text-sm ${handwritingStyle}`}
          value={subCategoryFilter}
          onChange={(e) => {
            setSubCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          {subCategories.map((sub) => (
            <option key={sub} value={sub}>
              {formatName(sub)}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {currentProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {currentProducts.map((p: Product) => (
            <div
              key={p.id}
              className="border rounded-lg shadow hover:shadow-lg transition p-3 cursor-pointer"
              onClick={() => navigate(`/product/${encodeURIComponent(p.id)}`, { state: p })}
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-60 sm:h-72 md:h-80 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-60 sm:h-72 md:h-80 bg-gray-200 flex items-center justify-center rounded-lg">
                  No Image
                </div>
              )}
              <h2 className="text-lg font-semibold mt-2">{formatName(p.title || "Untitled")}</h2>
              <p className="text-sm text-gray-500 font-bold italic font-cursive">
                {formatName(p.category)} / {formatName(p.subCategory)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex flex-wrap justify-center gap-2 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white transition"
          >
            &lt; Previous
          </button>

          {getPageNumbers(page, totalPages, 1).map((p, idx) =>
            p === "..." ? (
              <span key={"dot" + idx} className="px-3 py-2">
                …
              </span>
            ) : (
              <button
                key={`page-${p}`}
                onClick={() => setPage(Number(p))}
                className={`px-4 py-2 border rounded hover:bg-blue-600 hover:text-white transition ${
                  page === p ? "bg-blue-600 text-white border-blue-600" : ""
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white transition"
          >
            Next &gt;
          </button>
        </nav>
      )}
    </div>
  );
};

export default ProductsPage;
