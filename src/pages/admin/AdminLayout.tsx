import { Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Package, Settings, PenBox, Hammer, Mail } from "lucide-react"; // <-- Import Mail icon

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-0">
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
            {/* NEW: Enquiry Details Sidebar Link */}
            <Link
              to="/admin/enquiries"
              className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              <Mail size={18} /> Enquiry Details
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area with Transparent Watermark Logo */}
      <main className="flex-1 p-8 bg-gray-50 relative overflow-hidden">
        {/* Watermark Logo */}
        <div className="pointer-events-none fixed left-64 top-0 bottom-0 flex justify-center items-center w-[calc(100vw-16rem)] h-screen z-0">
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
        {/* Regular content goes here, will be above the watermark */}
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
