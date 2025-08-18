import React, { useState, useMemo } from "react";
import { Search, Filter, Star, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { useProducts } from "../context/ProductContext";

const Products: React.FC = () => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedSub, setSelectedSub] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const { addToCart } = useCart();

  const categories = useMemo(() => {
    const setCat = new Set<string>(products.map((p) => p.category || "Uncategorized"));
    return ["all", ...Array.from(setCat)];
  }, [products]);

  const subCategories = useMemo(() => {
    const setSub = new Set<string>(
      products
        .filter((p) => selectedCat === "all" || p.category === selectedCat)
        .map((p) => p.subCategory || "General")
    );
    return ["all", ...Array.from(setSub)];
  }, [selectedCat, products]);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === "all" || p.category === selectedCat;
    const matchesSub = selectedSub === "all" || p.subCategory === selectedSub;
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "under-500" && p.price < 500) ||
      (priceRange === "500-1000" && p.price >= 500 && p.price <= 1000) ||
      (priceRange === "over-1000" && p.price > 1000);
    return matchesSearch && matchesCat && matchesSub && matchesPrice;
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Home Improvement Products</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Browse our fixed catalog of premium home products.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCat}
              onChange={(e) => {
                setSelectedCat(e.target.value);
                setSelectedSub("all");
              }}
              className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* SubCategory */}
          <select
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
            className="w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {subCategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub === "all" ? "All Sub-Categories" : sub}
              </option>
            ))}
          </select>

          {/* Price */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Prices</option>
            <option value="under-500">Under ₹500</option>
            <option value="500-1000">₹500 - ₹1,000</option>
            <option value="over-1000">Over ₹1,000</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() =>
                    addToCart({
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      image: p.image,
                    })
                  }
                  className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                >
                  <ShoppingCart className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{p.name}</h3>
                <p className="text-sm text-gray-500 my-1">
                  {p.category || "Uncategorized"}
                  {p.subCategory ? ` • ${p.subCategory}` : ""}
                </p>
                <p className="text-gray-600 mb-4">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(p.price)}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">{p.rating || "N/A"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-600">No products match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
