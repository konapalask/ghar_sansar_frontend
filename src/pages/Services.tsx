import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useServices } from "../context/ServiceContext";

// ✅ Ensure images are always valid
const fixImageUrl = (url: string | undefined) => {
  if (!url) return "";
  return url
    .replace(/^https?:\/\/https?:\/\//, "https://")
    .replace(/\s/g, "%20")
    .replace(/([^:]\/)\/+/g, "$1");
};

const Services: React.FC = () => {
  const { services } = useServices();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // ✅ Stop loading whether services exist or not
    setLoading(false);
  }, [services]);

  if (loading) return <p className="text-center py-12">Loading services...</p>;
  if (!services.length) return <p className="text-center py-12">No services available.</p>;

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Interior Design Services
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((s) => (
            <motion.div
              key={s.id}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              {s.image ? (
                <img
                  src={fixImageUrl(s.image)}
                  alt={s.title}
                  className="w-full h-44 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-44 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-blue-600 font-semibold mb-2">
                {s.price ? `₹${s.price}` : "Custom Pricing"}
              </p>
              <p className="text-gray-600 mb-4">{s.description}</p>

              {s.features && (
                <ul className="space-y-2">
                  {s.features.map((f, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
