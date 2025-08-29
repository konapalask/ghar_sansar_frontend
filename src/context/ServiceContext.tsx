// src/context/ServiceContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Service {
  id: string;
  title: string;
  description: string;
  price?: string;
  image?: string;
  features?: string[];
}

interface ServiceContextType {
  services: Service[];
  addService: (service: Service) => void;
  updateService: (id: string, updated: Partial<Service>) => void;
  deleteService: (id: string) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) throw new Error("useServices must be used within ServiceProvider");
  return context;
};

interface Props {
  children: ReactNode;
}

export const ServiceProvider: React.FC<Props> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem("services");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            title: "Wallpaper Rolls",
            price: "Custom Pricing",
            image: "https://www.aarceewallpapers.com/wp-content/uploads/2021/04/buy-blue-wallpaper-online.jpg",
            description: "Beautiful wallpaper rolls to transform your walls.",
            features: ["Premium quality", "Easy to apply", "Variety of designs"],
          },
          {
            id: "2",
            title: "3D Wallpapers",
            price: "Custom Pricing",
            image: "https://5.imimg.com/data5/ANDROID/Default/2023/3/SN/HX/RY/127453337/product-jpeg-500x500.jpg",
            description: "Stunning 3D effect wallpapers for bold interiors.",
            features: ["Depth effect", "Long-lasting", "Modern styles"],
          },
          {
            id: "3",
            title: "Wall Art Effect",
            price: "Custom Pricing",
            image: "https://www.dekorcompany.com/cdn/shop/products/30_A.jpg?v=1627026001",
            description: "Unique wall art for statement-making interiors.",
            features: ["Handcrafted", "3D design", "Customizable"],
          },
          {
            id: "4",
            title: "Vinyl/Wooden Flooring",
            price: "Custom Pricing",
            image: "https://media.tarkett-image.com/medium/IN_HP_RR_ICONIK_Powell_Oak_Bronze_landscape.jpg",
            description: "Durable and stylish flooring for every room.",
            features: ["Easy to maintain", "Water resistant", "Wide range"],
          },
          {
            id: "5",
            title: "Natural Vertical Garden",
            price: "Custom Pricing",
            image: "https://5.imimg.com/data5/SELLER/Default/2024/6/424733064/YP/ZB/BK/135015145/natural-indoor-vertical-garden.jpg",
            description: "Live green vertical gardens for fresh ambiance.",
            features: ["Custom layouts", "Expert installation", "Low maintenance"],
          },
          {
            id: "6",
            title: "Blinds & Automation",
            price: "Custom Pricing",
            image: "https://newcastle-blinds.com/wp-content/uploads/2024/01/1-2.jpg",
            description: "Blinds and motorized solutions for privacy and style.",
            features: ["Manual & motorized", "Remote control", "Smart integration"],
          },
          {
            id: "7",
            title: "Canopy Installation",
            price: "Custom Pricing",
            image: "https://www.milwoodgroup.com/wp-content/uploads/2022/06/June-1_03.jpg",
            description: "High-quality canopies for outdoor and balcony shade.",
            features: ["UV protection", "Weatherproof", "Color options"],
          },
          {
            id: "8",
            title: "Ceramic & HDP Planter Pots",
            price: "Custom Pricing",
            image: "https://www.ugaoo.com/cdn/shop/files/1_d87323cc-bf70-4799-a66d-7ff965c8cb2b.jpg?v=1709701882&width=1100",
            description: "Artistic ceramic and HDP planters for all plants.",
            features: ["Indoor & outdoor", "Modern designs", "Durable"],
          },
          {
            id: "9",
            title: "Artificial Lawn & Wall Garden",
            price: "Custom Pricing",
            image: "https://www.chhajedgarden.com/cdn/shop/products/13_e3abbbeb-217c-4fa1-a2ec-b9ed6e21869b_934x700.jpg?v=1618551829",
            description: "Realistic artificial turf for gardens and walls.",
            features: ["Pet friendly", "Low maintenance", "Lush appearance"],
          },
          {
            id: "10",
            title: "Outdoor Deck Benches",
            price: "Custom Pricing",
            image: "https://i.pinimg.com/736x/6a/ce/90/6ace90bc4157be9b11f0199b59e0a56a.jpg",
            description: "Custom outdoor wooden benches for decks & patios.",
            features: ["Weatherproof finish", "Beautiful woods", "Custom sizing"],
          },
          {
            id: "11",
            title: "Customised Water Fountain/Bubble Fountain",
            price: "Custom Pricing",
            image: "https://fountains.com/wp-content/uploads/2020/12/unnamed_3.jpg",
            description: "Mesmerizing water and bubble fountains for serenity.",
            features: ["Indoor/outdoor", "Lighting options", "Unique designs"],
          },
          {
            id: "12",
            title: "Pigeon Net & Invisible Grill",
            price: "Custom Pricing",
            image: "https://5.imimg.com/data5/SELLER/Default/2025/1/483641672/HL/SM/BM/104295984/pigeon-net-invisible-grill.jpeg",
            description: "Safety nets and invisible grills for balconies.",
            features: ["Safe for kids/pets", "Discreet", "Rustproof"],
          },
          {
            id: "13",
            title: "Sliding & Metal Door",
            price: "Custom Pricing",
            image: "https://image.made-in-china.com/2f0j00IqQbuMUrJncp/Good-Price-Interior-Metal-Doors-Kitchen-Sliding-Door-Design-Aluminum-Sliding-Door.webp",
            description: "Modern sliding and secure metal doors.",
            features: ["Space saving", "Modern look", "Robust"],
          },
          {
            id: "14",
            title: "Terrace & Outdoor Gardening",
            price: "Custom Pricing",
            image: "https://jumanji.livspace-cdn.com/magazine/wp-content/uploads/sites/2/2022/07/01125821/cover_terrace-garden-idea.jpg",
            description: "Full terrace/landscape and outdoor gardening services.",
            features: ["Customized planting", "Automated irrigation", "Expert design"],
          },
          {
            id: "15",
            title: "EPDM & Gym/ICU Flooring",
            price: "Custom Pricing",
            image: "https://5.imimg.com/data5/SELLER/Default/2020/8/FI/VH/YZ/22787039/gym-flooring-rubber-flooring-epdm-flooring.jpg",
            description: "High quality EPDM, gym, and ICU flooring.",
            features: ["Soft underfoot", "Anti-slip", "Colorful patterns"],
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  const addService = (service: Service) => {
    setServices([...services, { ...service, id: Date.now().toString() }]);
  };

  const updateService = (id: string, updated: Partial<Service>) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const deleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <ServiceContext.Provider value={{ services, addService, updateService, deleteService }}>
      {children}
    </ServiceContext.Provider>
  );
};
