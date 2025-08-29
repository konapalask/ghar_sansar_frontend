// src/pages/admin/AdminLayout.tsx
import { Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Package, Settings, PenBox, Hammer } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-3">
          <Link
            to="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            to="/admin/products-admin"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700"
          >
            <Package size={18} /> Products Admin
          </Link>
          <Link
            to="/admin/services-admin"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700"
          >
            <Settings size={18} /> Services Admin
          </Link>
          <Link
            to="/admin/blog-admin"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700"
          >
            <PenBox size={18} /> Blog Admin
          </Link>
          <Link
            to="/admin/interior-works"
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700"
          >
            <Hammer size={18} /> Interior Works
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
