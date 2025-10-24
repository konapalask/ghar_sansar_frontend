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
  addProduct: (p: Partial<Product> & { imageFile?: File }) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product> & { imageFile?: File }) => Promise<void>;
  deleteProduct: (id: string, category: string, subCategory: string) => Promise<void>;
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
  return url.replace(/^https?:\/\/https?:\/\//, "https://").replace(/([^:]\/)\/+/g, "$1");
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const API_BASE = import.meta.env.VITE_AWS_API_URL || "https://lx70r6zsef.execute-api.ap-south-1.amazonaws.com/prod/api";

  // Fetch all products from backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/storage/uploads/products`, {
        headers: { accept: "application/json" },
      });
      const data = res.data;

      const allProducts: Product[] = [];
      data.categories?.forEach((category: any) => {
        category.subcategories?.forEach((sub: any) => {
          sub.images?.forEach((img: any, index: number) => {
            allProducts.push({
              id: img.id || `${category.name}-${sub.name}-${index}`,
              title: img.title || "Untitled Product",
              description: img.description || "",
              price: img.price || 0,
              actualPrice: img.actual_price || 0,
              image: fixImageUrl(img.image),
              video: img.video || "",
              category: category.name,
              subCategory: sub.name,
            });
          });
        });
      });

      setProducts(allProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const addProduct = async (p: Partial<Product> & { imageFile?: File }) => {
    try {
      const formData = new FormData();
      formData.append("category_type", "products");
      formData.append("category_name", p.category!);
      formData.append("subcategory_name", p.subCategory!);
      formData.append("title", p.title!);
      formData.append("price", (p.price ?? 0).toString());
      formData.append("actual_price", (p.actualPrice ?? 0).toString());
      formData.append("description", p.description ?? "");
      formData.append("features", "");

      if (p.imageFile) formData.append("image", p.imageFile, p.imageFile.name.replace(/\s/g, "-"));

      await axios.post(`${API_BASE}/storage/uploads`, formData);
      await fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Update product
  const updateProduct = async (id: string, p: Partial<Product> & { imageFile?: File }) => {
    try {
      const formData = new FormData();
      formData.append("category_type", "products");
      formData.append("id", id);
      formData.append("category_name", p.category!);
      formData.append("subcategory_name", p.subCategory!);
      formData.append("title", p.title!);
      formData.append("price", (p.price ?? 0).toString());
      formData.append("actual_price", (p.actualPrice ?? 0).toString());
      formData.append("description", p.description ?? "");
      formData.append("features", "");

      if (p.imageFile) formData.append("image", p.imageFile, p.imageFile.name.replace(/\s/g, "-"));

      await axios.put(`${API_BASE}/storage/uploads/products`, formData);
      await fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // Delete product
  const deleteProduct = async (id: string, category: string, subCategory: string) => {
    try {
      await axios.delete(
        `${API_BASE}/storage/uploads/products?category_name=${category}&subcategory_name=${subCategory}&id=${id}`
      );
      setProducts((prev) => prev.filter((prod) => prod.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
