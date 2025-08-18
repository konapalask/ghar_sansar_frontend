import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { BlogProvider } from './context/BlogContext'; // Import BlogProvider
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import Blog from './pages/Blog';
import BlogAdmin from './pages/BlogAdmin'; // Import BlogAdmin
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import ChatBot from './components/ChatBot/ChatBot';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <BlogProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="pt-16">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogPost />} />
                    <Route path="/blog-admin" element={<BlogAdmin />} /> {/* Blog admin route */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
                <Footer />
                <ChatBot />
              </div>
            </Router>
          </BlogProvider>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
