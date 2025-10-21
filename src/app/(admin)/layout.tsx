"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiMail,
  FiMenu,
  FiX,
  FiLogOut
} from "react-icons/fi";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminFooter from "@/components/admin/AdminFooter";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('palmport-admin-token');
    document.cookie = 'palmport-admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: FiHome },
    { name: "Batches", href: "/admin/batches", icon: FiPackage },
    { name: "Orders", href: "/admin/orders", icon: FiShoppingCart },
    { name: "Products", href: "/admin/products", icon: FiPackage },
    { name: "Subscribers", href: "/admin/subscribers", icon: FiMail },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="hidden lg:block bg-gradient-to-r from-[#4A1A03] to-[#7B2E10] shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#ffbf00] rounded-lg flex items-center justify-center">
                <span className="text-[#4A1A03] font-bold text-sm">P</span>
              </div>
              <span className="text-white font-bold text-lg">PalmPort Admin</span>
            </div>

            {/* Horizontal Navigation */}
            <nav className="flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-[#ffbf00] text-[#4A1A03] font-semibold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout - Desktop */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 bg-opacity-60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#4A1A03] to-[#7B2E10] shadow-xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#ffbf00] rounded-lg flex items-center justify-center">
                      <span className="text-[#4A1A03] font-bold text-sm">P</span>
                    </div>
                    <span className="text-white font-bold text-lg">PalmPort Admin</span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-white/70 hover:text-white"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          router.push(item.href);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive(item.href)
                            ? "bg-[#ffbf00] text-[#4A1A03] font-semibold"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <Icon size={20} />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                  >
                    <FiLogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-20 bg-white shadow-sm border-b border-gray-200">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-full">
            {children}
          </div>
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}