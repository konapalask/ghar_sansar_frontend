// src/context/ProductContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

// Product interface
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  actualPrice: number;
  image: string;
  video?: string;
  category: string;
  subCategory: string;
}

// Context type
interface ProductContextType {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, p: Product) => void;
  deleteProduct: (id: string) => void;
}

// Create context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Hook for convenience
export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};

// ✅ Fix broken CloudFront URLs
const fixImageUrl = (url: string) => {
  if (!url) return "";
  return url
    .replace(/^https?:\/\/https?:\/\//, "https://")
    .replace(/([^:]\/)\/+/g, "$1");
};

// Provider component using Axios
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const API_BASE =
    import.meta.env.VITE_AWS_API_URL ||
    "https://backend.gharsansar.store/api/v1";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/storage/uploads/products`, {
          headers: { accept: "application/json" },
        });
        const data = res.data;

        const allProducts: Product[] = [];
        if (data?.categories && Array.isArray(data.categories)) {
          data.categories.forEach((category: any) => {
            if (category.subcategories && Array.isArray(category.subcategories)) {
              category.subcategories.forEach((sub: any) => {
                if (sub.images && Array.isArray(sub.images)) {
                  sub.images.forEach((img: any, index: number) => {
                    allProducts.push({
                      id: `${category.name}-${sub.name}-${index}`, // Unique ID
                      title: img.title || "Untitled Product",
                      description: img.description || "No description available",
                      price: img.price || 0,
                      actualPrice: img.actual_price || 0, // ✅ FIXED FIELD
                      image: fixImageUrl(img.image),
                      video: img.video || "",
                      category: category.name,
                      subCategory: sub.name,
                    });
                  });
                }
              });
            }
          });
        }
        setProducts(allProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Add Product
  const addProduct = (p: Product) =>
    setProducts((prev) => [...prev, { ...p, image: fixImageUrl(p.image) }]);

  // ✅ Update Product
  const updateProduct = (id: string, p: Product) =>
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...p, image: fixImageUrl(p.image) } : prod))
    );

  // ✅ Delete Product
  const deleteProduct = (id: string) =>
    setProducts((prev) => prev.filter((prod) => prod.id !== id));

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
