import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  images?: string[];
  category?: string;
  subCategory?: string;
  rating?: number;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addMultipleProducts: (products: Product[]) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within ProductProvider");
  return context;
};

interface Props {
  children: ReactNode;
}

export const ProductProvider: React.FC<Props> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  // persist in localStorage
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // ✅ Keep product ID if already provided
  const addProduct = (product: Product) => {
    const id = product.id || Date.now().toString();
    setProducts([...products, { ...product, id }]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const addMultipleProducts = (newProducts: Product[]) => {
    const withIds = newProducts.map((p) => ({
      ...p,
      id: p.id || Date.now().toString() + Math.random(),
    }));
    setProducts([...products, ...withIds]);
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, addMultipleProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};
