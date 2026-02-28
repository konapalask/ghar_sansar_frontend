// src/context/ProductContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

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

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (p: Partial<Product> & { imageFile?: File }) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product> & { imageFile?: File }) => Promise<void>;
  deleteProduct: (id: string, category_type: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};

// Fix CloudFront / URL issues
const fixImageUrl = (url: string) => {
  if (!url) return "";
  let fixed = url.replace(/^https?:\/\/https?:\/\//, "https://").replace(/([^:]\/)\/+/g, "$1");
  // Add crossorigin attribute support for CloudFront CDN
  if (fixed.includes('cloudfront.net')) {
    // Ensure proper protocol
    if (!fixed.startsWith('http')) {
      fixed = 'https:' + fixed;
    }
  }
  return fixed;
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = import.meta.env.VITE_AWS_API_URL || "https://lx70r6zsef.execute-api.ap-south-1.amazonaws.com/prod/api";

  // Fetch all products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching products from local fallback");

      const res = await axios.get(`/products.json`, {
        headers: { accept: "application/json" },
      });

      console.log("API Response:", res.data);
      const data = res.data;

      const allProducts: Product[] = [];

      // Handle the new API structure with {status: true, data: Array(6)}
      // Or local JSON which is just an array
      const categories = Array.isArray(data) ? data : (data.data || data.categories || []);
      console.log("Categories found:", categories.length);
      console.log("First category:", categories[0]);
      console.log("First category subcategories:", categories[0]?.subcategories);
      console.log("First subcategory:", categories[0]?.subcategories?.[0]);
      console.log("First subcategory products:", categories[0]?.subcategories?.[0]?.products);

      categories?.forEach((category: any) => {
        category.subcategories?.forEach((sub: any) => {
          // Try both 'products' and 'images' fields
          const items = sub.products || sub.images || [];
          items.forEach((img: any, index: number) => {
            const imageUrl = fixImageUrl(img.image);
            if (index === 0 && allProducts.length === 0) {
              console.log("First product item:", img);
              console.log("Original image URL:", img.image);
              console.log("Fixed image URL:", imageUrl);
            }
            allProducts.push({
              id: img.id || `${category.name}-${sub.name}-${index}`,
              title: img.title || img.name || "Untitled Product",
              description: img.description || "",
              price: parseInt(img.price) || parseInt(img["act-price"]) || 0,
              actualPrice: parseInt(img["act-price"]) || parseInt(img.actual_price) || 0,
              image: imageUrl,
              video: img.video || "",
              category: category.name,
              subCategory: sub.name,
            });
          });
        });
      });

      console.log("Total products found:", allProducts.length);
      if (allProducts.length > 0) {
        console.log("First product sample:", allProducts[0]);
      }
      setProducts(allProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const addProduct = async (p: Partial<Product> & { imageFile?: File }) => {
    try {
      const formData = new FormData();
      formData.append("category_name", p.category || "");
      formData.append("subcategory_name", p.subCategory || "");
      formData.append("title", p.title || "");
      formData.append("price", (p.price ?? 0).toString());
      formData.append("actual_price", (p.actualPrice ?? 0).toString());
      formData.append("description", p.description || "");
      if (p.video) formData.append("video", p.video);

      if (p.imageFile) {
        formData.append("image", p.imageFile, p.imageFile.name.replace(/\s/g, "-"));
      }

      await axios.post(`${API_BASE}/storage/uploads/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Update product
  const updateProduct = async (id: string, p: Partial<Product> & { imageFile?: File }) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("category_name", p.category || "");
      formData.append("subcategory_name", p.subCategory || "");
      formData.append("title", p.title || "");
      formData.append("price", Math.floor(p.price ?? 0).toString());
      formData.append("actual_price", Math.floor(p.actualPrice ?? 0).toString());
      formData.append("description", p.description || "");
      if (p.video) formData.append("video", p.video);

      if (p.imageFile) {
        formData.append("image", p.imageFile, p.imageFile.name.replace(/\s/g, "-"));
      }

      await axios.put(`${API_BASE}/storage/uploads/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };



  // Delete product
  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/storage/uploads/products?id=${id}`);
      setProducts((prev) => prev.filter((prod) => prod.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, error, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
