import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import axios from "axios";

const itemsPerPage = 12;
const placeholderImage = "/images/placeholder.jpg";
const API_URL = "https://backend.gharsansar.store/api/v1/storage/uploads/interor";

// Interfaces
interface Subcategory {
  name: string;
  image?: string;
  video?: string;
}
interface Category {
  name: string;
  image?: string;
  features?: string[];
  subcategories: Subcategory[];
}

const InteriorDesignPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlCategory = params.get("category");

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [subCatPage, setSubCatPage] = useState(1);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeDesign, setActiveDesign] = useState<Subcategory | null>(null);
  const [designForEnquiry, setDesignForEnquiry] = useState<Subcategory | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPropertyName, setFormPropertyName] = useState("");
  const [formWhatsAppUpdates, setFormWhatsAppUpdates] = useState(false);

  // Fetch categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(API_URL);
        const data = res.data;
        // Normalize backend data
        const apiCategories: Category[] = data.categories.map((cat: any) => ({
          name: cat.name,
          image: cat.image || "", // optional, assign default if needed
          features: cat.features || [],
          subcategories: (cat.subcategories || []).map((sub: any) => ({
            name: sub.name,
            image: sub.images?.[0]?.image,
            video: sub.images?.[0]?.video,
          })),
        }));
        setCategories(apiCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // URL category param
  useEffect(() => {
    if (urlCategory && categories.length) {
      const match = categories.find(
        (c) => c.name.toLowerCase() === urlCategory.toLowerCase()
      );
      if (match) {
        setSelectedCategory(match.name);
        setActiveCategory(null);
      }
    }
  }, [urlCategory, categories]);

  // Search/filter logic
  const filteredCategories = useMemo(() => {
    let filtered = categories;
    if (selectedCategory !== "All Categories")
      filtered = filtered.filter((c) => c.name === selectedCategory);
    if (search.trim())
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    return filtered;
  }, [categories, selectedCategory, search]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredCategories, currentPage]);

  const currentCat = categories.find((c) => c.name === activeCategory);
  const subcategories = currentCat?.subcategories ?? [];
  const subCatTotalPages = Math.ceil(subcategories.length / itemsPerPage);
  const paginatedSubCategories = useMemo(() => {
    const startIdx = (subCatPage - 1) * itemsPerPage;
    return subcategories.slice(startIdx, startIdx + itemsPerPage);
  }, [subcategories, subCatPage]);

  useEffect(() => {
    setSubCatPage(1);
    setActiveDesign(null);
    setDesignForEnquiry(null);
  }, [activeCategory]);

  // Handlers
  function onSelectCategory(catName: string) {
    setActiveCategory(catName);
    setSelectedCategory(catName);
    setCurrentPage(1);
    setSubCatPage(1);
    setActiveDesign(null);
    setDesignForEnquiry(null);
  }
  function handleEnquiryOpen(subcategory: Subcategory) {
    setDesignForEnquiry(subcategory);
    setBookingOpen(true);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormPropertyName("");
    setFormWhatsAppUpdates(false);
  }
  function handleEnquiryClose() {
    setBookingOpen(false);
    setDesignForEnquiry(null);
  }
  function handleEnquirySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formName || !formEmail || !formPhone) {
      alert("Please fill all required fields");
      return;
    }
    const newEnquiry = {
      id: Date.now().toString(),
      name: formName,
      email: formEmail,
      phone: formPhone,
      propertyName: formPropertyName,
      sendWhatsAppUpdates: formWhatsAppUpdates,
      subcategory: designForEnquiry?.name || "",
      image: designForEnquiry?.image || "",
      date: new Date().toISOString(),
    };
    const storedEnquiries = JSON.parse(sessionStorage.getItem("enquiries") || "[]");
    storedEnquiries.push(newEnquiry);
    sessionStorage.setItem("enquiries", JSON.stringify(storedEnquiries));
    alert("Enquiry submitted! Our team will contact you soon.");
    handleEnquiryClose();
  }

  // Loading/error screens
  if (loading) return <div className="p-6 text-gray-500">Loading interior designs...</div>;
  if (!categories.length) return <div className="p-6 text-gray-500">No categories found.</div>;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      {/* HEADER + SEARCH */}
      <header className="max-w-7xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-semibold mb-4">Interior Design Solutions</h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Browse our industry's finest collections for all your interior design needs.
        </p>
        <p className="text-red-600 max-w-6xl mx-auto">
          WE PROVIDE SERVICES IN ANDHRAPRADESH AND TELANGANA
        </p>
        <div className="flex justify-center mt-6 space-x-4 max-w-3xl mx-auto">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-lg pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <select
            className="border border-gray-300 rounded-lg py-2 px-3"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
              if (e.target.value === "All Categories") {
                setActiveCategory(null);
              } else {
                setActiveCategory(e.target.value);
              }
            }}
          >
            <option>All Categories</option>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* CATEGORIES GRID */}
      {!activeCategory ? (
        <>
          <section className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {paginatedCategories.map((cat) => (
              <article
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className="cursor-pointer rounded-lg shadow-md bg-white overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={cat.image || placeholderImage}
                  alt={cat.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="font-semibold text-lg">{cat.name}</h2>
                  <p className="mt-2 text-sm text-gray-600">{cat.features?.join(", ")}</p>
                  <p className="mt-1 text-gray-600">{cat.subcategories.length} Designs</p>
                </div>
              </article>
            ))}
          </section>

          {/* Paginate categories if needed */}
          {paginatedCategories.length > 0 && (
            <nav className="flex justify-center mt-10 space-x-3">
              <button
                onClick={() => {
                  setCurrentPage(Math.max(currentPage - 1, 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-200"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`px-4 py-2 rounded border ${
                    currentPage === page ? "bg-red-600 text-white border-red-600" : "hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => {
                  setCurrentPage(Math.min(currentPage + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-200"
              >
                Next
              </button>
            </nav>
          )}
        </>
      ) : (
        <>
          <section className="max-w-7xl mx-auto">
            <button
              className="mb-6 inline-flex items-center px-5 py-2 bg-white border border-red-500 text-red-600 rounded shadow hover:bg-red-50 transition font-medium text-base gap-2"
              onClick={() => {
                setActiveCategory(null);
                setSelectedCategory("All Categories");
                setCurrentPage(1);
                setSubCatPage(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span className="text-xl">←</span>
              <span>Back to Categories</span>
            </button>
            <h2 className="text-2xl font-semibold mb-6">{activeCategory} Designs</h2>
            {/* Subcategory Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {paginatedSubCategories.length > 0 ? (
                paginatedSubCategories.map((sub, idx) => (
                  <div
                    key={sub.name + idx}
                    className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                  >
                    {sub.video ? (
                      <video
                        src={sub.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={sub.image || placeholderImage}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform bg-gray-100 cursor-pointer"
                        onClick={() => setActiveDesign(sub)}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={sub.image || placeholderImage}
                        alt={sub.name}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform bg-gray-100 cursor-pointer"
                        onClick={() => setActiveDesign(sub)}
                      />
                    )}
                    <button
                      className="mt-4 mx-4 mb-4 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                      onClick={() => handleEnquiryOpen(sub)}
                    >
                      Book an Enquiry
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center w-full py-14 text-gray-500">No designs available.</p>
              )}
            </div>
            {/* Subcategory pagination */}
            {subcategories.length > itemsPerPage && (
              <nav className="flex justify-center mt-10 space-x-3">
                <button
                  onClick={() => {
                    setSubCatPage(Math.max(subCatPage - 1, 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={subCatPage === 1}
                  className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-200"
                >
                  Prev
                </button>
                {Array.from({ length: subCatTotalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setSubCatPage(page);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`px-4 py-2 rounded border ${
                      subCatPage === page ? "bg-red-600 text-white border-red-600" : "hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSubCatPage(Math.min(subCatPage + 1, subCatTotalPages));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={subCatPage === subCatTotalPages}
                  className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-200"
                >
                  Next
                </button>
              </nav>
            )}
          </section>
        </>
      )}

      {/* Design Details Modal */}
      {activeDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative shadow-md">
            <button
              onClick={() => setActiveDesign(null)}
              className="absolute top-1 right-1 text-2xl font-bold hover:text-red-600"
              aria-label="Close"
            >
              ×
            </button>
            {activeDesign.video ? (
              <video
                src={activeDesign.video}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-[400px] object-cover mb-4 rounded mx-auto"
              />
            ) : (
              <img
                src={activeDesign.image || placeholderImage}
                alt={activeDesign.name}
                className="w-full h-[400px] object-cover mb-4 rounded mx-auto"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg mb-2">Contact for this Design</h3>
              <p><strong>Phone 1:</strong> +91 81211 35980</p>
              <p><strong>Phone 2:</strong> +91 92483 44434</p>
              <p><strong>Email:</strong> <a href="mailto:gharsansar@gmail.com" className="text-red-600 underline">gharsansar@gmail.com</a></p>
              <p><strong>Address:</strong> 27-14-60, Rajagopalachari St, near Buckinghampet Post Office, Governor Peta, Vijayawada, Andhra Pradesh 520002.</p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={handleEnquiryClose}
              className="absolute top-2 right-4 text-2xl font-bold hover:text-red-600"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Book an Enquiry</h2>
            {designForEnquiry && (
              <div className="mb-4 bg-gray-50 p-2 rounded">
                <img
                  src={designForEnquiry.image || placeholderImage}
                  alt={designForEnquiry.name}
                  className="w-full h-32 object-cover mb-2 rounded"
                />
                <p className="font-semibold text-center">{designForEnquiry.name}</p>
              </div>
            )}
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="tel"
                placeholder="Phone"
                required
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formWhatsAppUpdates}
                  onChange={(e) => setFormWhatsAppUpdates(e.target.checked)}
                />
                <span>Send me updates on WhatsApp</span>
              </label>
              <input
                type="text"
                placeholder="Property Name"
                value={formPropertyName}
                onChange={(e) => setFormPropertyName(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="w-full py-3 bg-red-500 text-white rounded hover:bg-red-600"
              >
                BOOK ENQUIRY
              </button>
              <p className="mt-4 text-center text-xs text-gray-500">
                By submitting you agree to our{" "}
                <a href="#" className="underline text-red-600">privacy policy</a> &amp;{" "}
                <a href="#" className="underline text-red-600">terms and conditions</a>.
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default InteriorDesignPage;
