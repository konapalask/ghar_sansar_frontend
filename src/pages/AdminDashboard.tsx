import React from "react";
import { Package, PenBox, Hammer, Mail, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { name: "Products", icon: Package, link: "/admin/products-admin", color: "bg-blue-500" },
  { name: "Blogs", icon: PenBox, link: "/admin/blog-admin", color: "bg-green-500" },
  { name: "Services", icon: Settings, link: "/admin/services-admin", color: "bg-purple-500" },
  { name: "Interior Works", icon: Hammer, link: "/admin/interior-works", color: "bg-yellow-500" },
  { name: "Enquiries", icon: Mail, link: "/admin/enquiries", color: "bg-red-500" },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <p className="mb-8 text-gray-600">
        Welcome to the control panel. Use the quick links below to manage content.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.link}
              className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
            >
              <div
                className={`p-3 rounded-xl text-white ${item.color} flex items-center justify-center`}
              >
                <Icon size={28} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">Manage {item.name.toLowerCase()}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
