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

const ProductsPage: React.FC = () => {
  const { products } = useProducts();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const itemsPerPage = 12;

  // Simulate loading with vertical spin animation for logo
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5s loading
    return () => clearTimeout(timer);
  }, []);

  // Filter products by title based on search string
  const filtered = useMemo(() => {
    return products.filter((p) =>
      search ? p.title.toLowerCase().includes(search.toLowerCase()) : true
    );
  }, [products, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentProducts = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <img
          src="/images/logo.png" // Replace with your actual logo path
          alt="Loading..."
          className="h-40 w-34 animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-white min-h-screen">
      <h1 className="text-2xl md:text-4xl font-bold mb-6">Products</h1>

      {/* Search */}
      <div className="flex items-center border rounded px-3 py-2 w-full md:max-w-xs bg-white mb-6">
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
              <h2 className="text-lg font-semibold mt-2">{p.title || "Untitled"}</h2>
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
