// src/pages/ProductDetail.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Phone, MessageCircle, MapPinIcon, ChevronLeft, ArrowLeft } from "lucide-react";

const ProductDetail: React.FC = () => {
  const { state: product } = useLocation();
  const navigate = useNavigate();

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p>Product not found.</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg"
        >
          <ArrowLeft size={18} /> Go Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg"
      >
        <ChevronLeft size={18} /> Back
      </button>

      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full max-h-[70vh] object-contain rounded-xl shadow-lg transition-transform duration-500 hover:scale-[1.02]"
      />

      {/* Product Name */}
      <h1 className="text-4xl font-extrabold mt-6 tracking-tight text-gray-900">
        {product.name}
      </h1>

      {/* Product Description */}
      <div
        className="relative mt-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 
                   rounded-xl shadow-inner border-l-4 border-blue-500 
                   animate-fadeIn"
      >
        <p className="text-lg leading-relaxed font-serif text-gray-800 italic">
          {product.description}
        </p>
      </div>

      {/* Contact Options */}
      <div className="flex gap-4 mt-8 flex-wrap">
        {/* Call */}
        <a
          href="tel:+918121135980"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Phone size={18} /> Call
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/918121135980?text=I'm interested in ${product.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          <MessageCircle size={18} /> WhatsApp
        </a>

        {/* Address */}
        <a
          href="https://www.google.com/maps/dir//27-14-60,+Rajagopalachari+St,+Governor+Peta,+Vijayawada,+Andhra+Pradesh"
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
        >
          <MapPinIcon size={18} /> Address
        </a>
      </div>
    </div>
  );
};

export default ProductDetail;
  