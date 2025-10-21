"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMenu, FiLogOut } from "react-icons/fi";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('palmport-admin-token');
    document.cookie = 'palmport-admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiMenu size={20} />
          </button>
          
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-6 h-6 bg-[#ffbf00] rounded flex items-center justify-center">
              <span className="text-[#4A1A03] font-bold text-xs">P</span>
            </div>
            <span className="font-semibold text-gray-900">PalmPort</span>
          </div>
        </div>
        
        {/* User info and logout */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-gray-600">Welcome, Admin</span>
          
          {/* Mobile logout button */}
          <button
            onClick={handleLogout}
            className="sm:hidden flex items-center gap-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
          
          {/* Desktop logout button */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}