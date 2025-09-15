import { Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Package, Settings, PenBox, Hammer, Mail } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      {/* Sidebar */}
      <aside className="w-full sm:w-64 bg-gray-900 text-white flex flex-col p-0">
        <div className="p-6 flex-1">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-3">
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link
              to="/admin/products-admin"
              className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              <Package size={18} /> Products Admin
            </Link>
            <Link
              to="/admin/services-admin"
              className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              <Settings size={18} /> Services Admin
            </Link>
            <Link
              to="/admin/blog-admin"
              className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              <PenBox size={18} /> Blog Admin
            </Link>
            <Link
              to="/admin/interior-works"
              className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              <Hammer size={18} /> Interior Works
            </Link>
            {/* Uncomment to add Enquiries link */}
            {/* <Link
              to="/admin/enquiries"
              className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              <Mail size={18} /> Enquiries
            </Link> */}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 bg-gray-50 relative overflow-hidden">
        {/* Watermark Logo */}
        <div className="pointer-events-none fixed sm:left-64 left-0 top-0 bottom-0 flex justify-center items-center w-full sm:w-[calc(100vw-16rem)] h-screen z-0">
          <img
            src="/ghar sansar logo.svg"
            alt="Ghar Sansar Logo Watermark"
            className="w-1/2 max-w-xl opacity-20"
            style={{
              minWidth: '320px',
              objectFit: 'contain',
              filter: "none",
            }}
          />
        </div>
        {/* Content */}
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
