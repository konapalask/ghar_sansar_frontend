// src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Headphones, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "../context/ProductContext"; // ✅ using context

const Home: React.FC = () => {
  const { products } = useProducts();

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free delivery on orders over ₹500",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure payment processing",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support",
    },
    {
      icon: XCircle,
      title: "No Return & Exchange",
      description: "Products cannot be returned or exchanged",
    },
  ];

  // ✅ Pick last 6 products as "recent"
  const recentProducts = [...products].slice(-6).reverse();

  return (
    <main className="w-full max-w-screen-xl mx-auto px-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Transform Your
                <span className="text-blue-600 block">Home Today</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover premium home decor items and professional interior
                design services to create the perfect living space.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/interior-design"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center justify-center group"
                >
                  Design Services
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/products"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-semibold inline-flex items-center justify-center"
                >
                  Shop Now
                </Link>
              </div>
            </motion.div>

           {/* Video */}
<motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  className="relative w-full"
>
  <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
    <video
      src="/videos/homepagevideo.mp4"
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
      poster="https://content3.jdmagicbox.com/comp/vijayawada/89/0866p866std2000089/catalogue/ghar-sansar-governerpet-vijayawada-gift-shops-r9zm63fkbh.jpg"
    >
      Your browser does not support the video tag.
    </video>
  </div>
</motion.div>
          </div>
        </div>
      </section>

      {/* Recent Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Recent Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check out our latest arrivals for your home.
            </p>
          </div>

          {recentProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 px-2 py-1 rounded-lg text-sm font-medium text-white bg-blue-600">
                      New
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {product.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              No recent products available.
            </p>
          )}

          {/* Show "View All" if more than 6 */}
          {products.length > 6 && (
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center group"
              >
                View All Products
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section (Above Footer) */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
