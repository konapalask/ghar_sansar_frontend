import React, { useEffect, useState } from "react";

interface InteriorWork {
  id: string;
  title: string;
  description: string;
  image: string;
}

const InteriorWorks: React.FC = () => {
  const [works, setWorks] = useState<InteriorWork[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("interiorWorks");
    if (stored) {
      setWorks(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Interior Works</h1>
      {works.length === 0 ? (
        <p>No interior works added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {works.map((work) => (
            <div
              key={work.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg"
            >
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h2 className="text-xl font-semibold">{work.title}</h2>
              <p className="text-gray-600">{work.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InteriorWorks;
