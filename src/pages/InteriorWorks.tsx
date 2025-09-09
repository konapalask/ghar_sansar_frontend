// src/pages/InteriorWorks.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface InteriorWork {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  subCategory: string;
}

const API_URL = "https://backend.gharsansar.store/api/v1/storage/uploads/interior";

const InteriorWorks: React.FC = () => {
  const [works, setWorks] = useState<InteriorWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await axios.get(API_URL);
        const data = res.data;

        // Flatten JSON structure: categories → subcategories → images
        const flatWorks: InteriorWork[] = data.categories
          .flatMap((cat: any) =>
            cat.subcategories.flatMap((sub: any) =>
              sub.images.map((imgObj: any) => ({
                id: imgObj.id,
                title: imgObj.title,
                description: imgObj.description,
                image: imgObj.image,
                category: cat.name,
                subCategory: sub.name,
              }))
            )
          );

        setWorks(flatWorks);
      } catch (err) {
        console.error("Failed to fetch interior works:", err);
        setWorks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading interior works...</div>;
  if (!works.length) return <div className="p-6 text-gray-500">No interior works found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Interior Works</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {works.map((work) => (
          <div
            key={work.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg"
          >
            {work.image && (
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <h2 className="text-xl font-semibold">{work.title}</h2>
            <p className="text-gray-500 text-sm">
              {work.category} → {work.subCategory}
            </p>
            <p className="text-gray-600 mt-1">{work.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteriorWorks;
