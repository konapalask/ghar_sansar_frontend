import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { BlogProvider } from "./context/BlogContext";
import { ServiceProvider } from "./context/ServiceContext";
import { InteriorProvider } from "./context/InteriorContext"; // ✅ add this

import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import InteriorDesignPage from "./pages/InteriorDesignPage"; 
import InteriorWorks from "./pages/InteriorWorks";

// ✅ Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import BlogAdmin from "./pages/admin/BlogAdmin";
import ServicesAdmin from "./pages/admin/ServicesAdmin";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import ProductAdminBulk from "./pages/admin/ProductAdminBulk";
import InteriorWorksAdmin from "./pages/admin/InteriorWorksAdmin";

import ChatBot from "./components/ChatBot/ChatBot";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <BlogProvider>
            <ServiceProvider>
              <InteriorProvider> {/* ✅ wrap here */}
                <BrowserRouter>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="pt-16">
                      <Routes>
                        {/* ---------- Public routes ---------- */}
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:id" element={<BlogPost />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/cart" element={<Cart />} />

                        {/* Public Interior Design page */}
                        <Route path="/interior-design" element={<InteriorDesignPage />} />

                        {/* ---------- Protected routes ---------- */}
                        <Route
                          path="/checkout"
                          element={
                            <ProtectedRoute>
                              <Checkout />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/interior-works"
                          element={
                            <ProtectedRoute>
                              <InteriorWorks />
                            </ProtectedRoute>
                          }
                        />

                        {/* ---------- Admin protected routes ---------- */}
                        <Route
                          path="/admin/*"
                          element={
                            <ProtectedRoute role="admin">
                              <AdminLayout />
                            </ProtectedRoute>
                          }
                        >
                          <Route path="blog-admin" element={<BlogAdmin />} />
                          <Route path="services-admin" element={<ServicesAdmin />} />
                          <Route path="products-admin" element={<ProductsAdmin />} />
                          <Route path="products-bulk" element={<ProductAdminBulk />} />
                          {/* ✅ Interior Works Admin page */}
                          <Route path="interior-works" element={<InteriorWorksAdmin />} />
                        </Route>
                      </Routes>
                    </main>
                    <Footer />
                    <ChatBot />
                  </div>
                </BrowserRouter>
              </InteriorProvider>
            </ServiceProvider>
          </BlogProvider>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}
