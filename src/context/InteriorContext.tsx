// src/context/InteriorContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

export interface InteriorWork {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  description?: string;
  image?: string;
  videoUrl?: string; // YouTube / Instagram / direct video
}

interface InteriorContextType {
  works: InteriorWork[];
  loading: boolean;
  error: string | null;
  refreshWorks: () => Promise<void>;
}

const InteriorContext = createContext<InteriorContextType | undefined>(undefined);

export const useInterior = () => {
  const context = useContext(InteriorContext);
  if (!context) throw new Error("useInterior must be used inside InteriorProvider");
  return context;
};

const API_URL = "https://lx70r6zsef.execute-api.ap-south-1.amazonaws.com/prod/api/storage/uploads/interior";

// Sanitize URLs
const sanitizeUrl = (url?: string) => {
  if (!url) return "";
  url = url.trim();
  url = url.replace(/^https?:\/\/https?:\/\//, "https://");
  const httpsIndex = url.indexOf("://");
  if (httpsIndex !== -1) {
    let [prefix, path] = [url.slice(0, httpsIndex + 3), url.slice(httpsIndex + 3)];
    path = path.replace(/\/{2,}/g, "/");
    url = prefix + path;
  }
  return url;
};

interface InteriorProviderProps {
  children: ReactNode;
}

export const InteriorProvider: React.FC<InteriorProviderProps> = ({ children }) => {
  const [works, setWorks] = useState<InteriorWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL, { headers: { Accept: "application/json" } });
      const data = res.data;

      // Flatten categories → subcategories → images
      const flatWorks: InteriorWork[] = data.categories
        .flatMap((cat: any) =>
          cat.subcategories.flatMap((sub: any) =>
            sub.images.map((imgObj: any) => ({
              id: imgObj.id,
              title: imgObj.title,
              category: cat.name,
              subCategory: sub.name,
              description: imgObj.description,
              image: sanitizeUrl(imgObj.image),
              videoUrl: sanitizeUrl(imgObj.video),
            }))
          )
        );

      setWorks(flatWorks);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch interior works");
      setWorks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  return (
    <InteriorContext.Provider value={{ works, loading, error, refreshWorks: fetchWorks }}>
      {children}
    </InteriorContext.Provider>
  );
};
