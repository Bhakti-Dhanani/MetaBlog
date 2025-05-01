"use client";

import { FiMenu, FiBell, FiSearch, FiLogOut } from "react-icons/fi";

interface TenantHeaderProps {
  onMenuToggle: () => void;
  onLogout: () => void;
}

export default function TenantHeader({ onMenuToggle, onLogout }: TenantHeaderProps) {
  return (
    <header className="bg-white shadow-xs border-b border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 mr-2"
            aria-label="Toggle menu"
          >
            <FiMenu className="text-xl" />
          </button>
          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Search..."
              aria-label="Search dashboard"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 relative"
            aria-label="Notifications"
          >
            <FiBell className="text-xl" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={onLogout}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            aria-label="Logout"
          >
            <FiLogOut className="text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
}