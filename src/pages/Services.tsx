// src/pages/Services.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Calendar, User, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { useServices } from "../context/ServiceContext";

interface ServiceFormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  roomType: string;
  budget: string;
  timeline: string;
  message: string;
}

const Services: React.FC = () => {
  const { services } = useServices(); // 👈 dynamic services
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormData>();

  const onSubmit = (data: ServiceFormData) => {
    console.log("Service request:", data);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      reset();
    }, 3000);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Interior Design Services
          </motion.h1>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((s) => (
            <motion.div
              key={s.id}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              {s.image && <img src={s.image} alt={s.title} className="w-full h-44 object-cover rounded-lg mb-4" />}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-blue-600 font-semibold mb-2">{s.price || "Custom Pricing"}</p>
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

        {/* Form */}
        {/* Keep your consultation form code here */}
      </div>
    </div>
  );
};

export default Services;
