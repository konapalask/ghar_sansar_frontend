// src/components/ProductCard.tsx
import React, { useState } from "react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    image: string;
    description: string;
    height?: number;
    width?: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showDescription, setShowDescription] = useState(false);

  console.log("🛠 ProductCard received:", product); // 👀 Debug

  return (
    <div
      className="cursor-pointer w-full bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
      onClick={() => setShowDescription(!showDescription)}
    >
      <img
        src={product.image}
        alt={product.name.replace("_", " ")}
        className="w-full h-64 object-cover sm:h-80 md:h-96"
      />
      <div className="p-4 text-center">
        <h3 className="font-semibold text-lg">{product.name.replace("_", " ")}</h3>

        {/* Show description when clicked */}
        {showDescription && (
          <div className="mt-2">
            <p className="text-gray-600">{product.description}</p>
            <div className="text-sm text-gray-500 mt-1">
              Size: {product.height ?? "N/A"} x {product.width ?? "N/A"}
            </div>
            <a
              href={`https://wa.me/919866909081?text=I'm interested in ${product.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
              onClick={(e) => e.stopPropagation()} // prevent toggle on link click
            >
              Contact on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
