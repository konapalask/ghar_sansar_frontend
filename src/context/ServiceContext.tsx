// src/context/ServiceContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string | number;
  actPrice?: number;
  image: string;
  category: string;
  subCategory: string;
  features?: string[];
}

interface ServiceContextType {
  services: Service[];
  addService: (service: Omit<Service, "id">) => Promise<void>;
  updateService: (id: string, updated: Partial<Service>) => Promise<void>;
  deleteService: (id: string, service: Service) => Promise<void>;
  refreshServices: (categoryType?: string) => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

const API_BASE = "https://backend.gharsansar.store/api/v1/storage/uploads";

// ✅ Helper to fix broken URLs
const fixImageUrl = (url: string | undefined) => {
  if (!url) return "";
  return url
    .replace(/^https?:\/\/https?:\/\//, "https://")
    .replace(/\s/g, "%20")
    .replace(/([^:]\/)\/+/g, "$1");
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) throw new Error("useServices must be used within ServiceProvider");
  return context;
};

interface Props {
  children: ReactNode;
}

export const ServiceProvider: React.FC<Props> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);

  // Fetch services
  const fetchServices = async (categoryType: string = "services") => {
    try {
      const url = `${API_BASE}/${categoryType}`;
      const res = await axios.get(url, { headers: { accept: "application/json" } });
      const json = res.data;
      const allServices: Service[] = [];

      if (json?.categories && Array.isArray(json.categories)) {
        json.categories.forEach((category: any) => {
          if (category.subcategories && Array.isArray(category.subcategories)) {
            category.subcategories.forEach((sub: any) => {
              if (sub.images && Array.isArray(sub.images)) {
                sub.images.forEach((img: any, index: number) => {
                  allServices.push({
                    id: `${category.name}-${sub.name}-${img.name || index}`,
                    title: img.title || "Untitled Service",
                    description: img.description || "No description",
                    price: img.price || "Custom Pricing",
                    actPrice: img.actual_price || 0,
                    image: fixImageUrl(img.image),
                    category: category.name,
                    subCategory: sub.name,
                    features: img.features,
                  });
                });
              }
            });
          }
        });
      }
      setServices(allServices);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Add service
  const addService = async (service: Omit<Service, "id">) => {
    try {
      const formData = new FormData();
      formData.append("category_type", "services");
      formData.append("category_name", service.category || "general");
      formData.append("subcategory_name", service.subCategory || "general");
      formData.append("title", service.title);
      formData.append("description", service.description);
      formData.append("price", service.price?.toString() || "Custom Pricing");

      if (service.features) {
        service.features.forEach((f) => formData.append("features", f));
      }

      if (service.image && typeof service.image !== "string") {
        const file = service.image as unknown as File;
        const safeFileName = file.name.replace(/\s/g, "-");
        formData.append("image", file, safeFileName);
      }

      const res = await axios.post(`${API_BASE}`, formData);
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      await fetchServices();
    } catch (err) {
      console.error("❌ Error adding service:", err);
      alert("Failed to add service. Check console.");
    }
  };

  // Update service metadata
  const updateService = async (id: string, updated: Partial<Service>) => {
    try {
      const service = services.find((s) => s.id === id);
      if (!service) throw new Error("Service not found");

      const payload = new URLSearchParams();
      payload.append("category_name", service.category);
      payload.append("subcategory_name", service.subCategory);
      payload.append("id", service._id); // backend requires existing image key

      if (updated.title) payload.append("title", updated.title);
      if (updated.description) payload.append("description", updated.description);
      if (updated.price) payload.append("price", updated.price.toString());
      if (updated.actPrice !== undefined) payload.append("actual_price", updated.actPrice.toString());
      if (updated.features) {
        updated.features.forEach((f) => payload.append("features", f));
      }

      await axios.put(`${API_BASE}/services`, payload, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      await fetchServices();
    } catch (err) {
      console.error("❌ Error updating service:", err);
      alert("Failed to update service. Check console.");
    }
  };

  // Delete service
  const deleteService = async (id: string, service: Service) => {
    try {
      if (!service.category || !service.subCategory || !service.image) {
        console.error("❌ Missing required fields for delete:", service);
        return;
      }

      // Extract last 3 segments: category/subcategory/filename.webp
      const parts = service.image.split("/");
      const relativePath = parts.slice(-3).join("/");

      const params = new URLSearchParams({
        category_name: service.category,
        subcategory_name: service.subCategory,
        image_url: relativePath,
      });

      console.log("Deleting service:", params.toString());

      const res = await axios.delete(`${API_BASE}/services?${params.toString()}`, {
        headers: { accept: "application/json" },
      });

      if (res.status !== 200) {
        throw new Error(`Failed to delete service: ${res.status}`);
      }

      setServices((prev) => prev.filter((s) => s.id !== id));
      console.log("✅ Service deleted:", service.title);
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete service. Check console.");
    }
  };

  const refreshServices = async (categoryType: string = "services") => {
    await fetchServices(categoryType);
  };

  return (
    <ServiceContext.Provider
      value={{ services, addService, updateService, deleteService, refreshServices }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
