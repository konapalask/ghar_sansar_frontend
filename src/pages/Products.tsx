import React, { useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "../context/ProductContext";

// Helper for query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Formatting helper
function formatName(name) {
  if (!name) return "";
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Example font style, adjust as needed for Tailwind config
const handwritingStyle = "font-bold italic font-cursive";

const ProductsPage = () => {
  const { products, loading, error } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();
  const query = useQuery();

  const itemsPerPage = 12;
  const page = Number(query.get("page") || 1);
  const categoryFilter = query.get("category") || "All";
  const subCategoryFilter = query.get("subCategory") || "All";
  const search = query.get("search") || "";

  // Scroll to top when page or filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, categoryFilter, subCategoryFilter, search]);

  // Precompute lists
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...cats];
  }, [products]);

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

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = search ? p.title.toLowerCase().includes(search.toLowerCase()) : true;
      const matchesCategory = categoryFilter === "All" ? true : p.category === categoryFilter;
      const matchesSubCategory = subCategoryFilter === "All" ? true : p.subCategory === subCategoryFilter;
      return matchesSearch && matchesCategory && matchesSubCategory;
    });
  }, [products, search, categoryFilter, subCategoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentProducts = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Helper: build query string from object
  function buildQuery(params) {
    const baseParams = Object.fromEntries(query.entries());
    const merged = { ...baseParams, ...params };
    Object.keys(merged).forEach((k) => {
      if (!merged[k] || merged[k] === "All") delete merged[k];
    });
    return new URLSearchParams(merged).toString();
  }

  // Update query string in URL
  function updateQuery(params) {
    navigate(`?${buildQuery(params)}`);
  }

  // Pagination logic with "..." ellipsis, delta = 1
  function getPageNumbers(current, total, delta = 1) {
    const range = [];
    const rangeWithDots = [];
    let l;
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

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-white min-h-screen font-sans">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-5xl font-bold italic font-cursive mb-6"
      >
        Products by Gharsansar
      </motion.h1>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6"
      >
        {/* Search */}
        <div className="flex items-center border rounded px-3 py-2 w-full md:max-w-xs bg-white shadow-sm hover:shadow-md transition-shadow">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="search"
            placeholder="Search products..."
            className="flex-grow bg-transparent outline-none text-sm"
            value={search}
            onChange={(e) => updateQuery({ search: e.target.value, page: 1 })}
          />
        </div>

        {/* Category Filter */}
        <select
          className="border rounded px-3 py-2 text-sm font-serif italic hover:shadow-md transition-shadow cursor-pointer"
          value={categoryFilter}
          onChange={(e) => updateQuery({ category: e.target.value, subCategory: "All", page: 1 })}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {formatName(cat)}
            </option>
          ))}
        </select>

        {/* Subcategory Filter */}
        <select
          className={`border rounded px-3 py-2 text-sm ${handwritingStyle} hover:shadow-md transition-shadow cursor-pointer`}
          value={subCategoryFilter}
          onChange={(e) => updateQuery({ subCategory: e.target.value, page: 1 })}
        >
          {subCategories.map((sub) => (
            <option key={sub} value={sub}>
              {formatName(sub)}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="text-xl text-red-600 mb-2">Error loading products</div>
          <div className="text-sm text-gray-500">{error}</div>
        </div>
      ) : currentProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {currentProducts.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="border rounded-lg shadow hover:shadow-xl transition-all duration-300 p-3 cursor-pointer bg-white group overflow-hidden"
              onClick={() => navigate(`/product/${encodeURIComponent(p.id)}?${location.search}`)}
            >
              <div className="relative overflow-hidden rounded-lg">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-48 sm:h-60 md:h-72 object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 sm:h-60 md:h-72 bg-gray-200 flex items-center justify-center rounded-lg">
                    No Image
                  </div>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-semibold mt-2 line-clamp-2">{formatName(p.title || "Untitled")}</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-bold italic font-cursive">
                {formatName(p.category)} / {formatName(p.subCategory)}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-600"
        >
          No products found.
        </motion.p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.nav 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mt-8"
        >
          <motion.button
            disabled={page === 1}
            onClick={() => updateQuery({ page: page - 1 })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white transition-all font-semibold"
          >
            &lt; Previous
          </motion.button>

          {getPageNumbers(page, totalPages, 1).map((p, idx) =>
            p === "..." ? (
              <span key={"dot" + idx} className="px-3 py-2">
                …
              </span>
            ) : (
              <motion.button
                key={`page-${p}`}
                onClick={() => updateQuery({ page: p })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 border rounded hover:bg-blue-600 hover:text-white transition-all font-semibold ${
                  page === p ? "bg-blue-600 text-white border-blue-600" : ""
                }`}
              >
                {p}
              </motion.button>
            )
          )}

          <motion.button
            disabled={page === totalPages}
            onClick={() => updateQuery({ page: page + 1 })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white transition-all font-semibold"
          >
            Next &gt;
          </motion.button>
        </motion.nav>
      )}
    </div>
  );
};

export default ProductsPage;
