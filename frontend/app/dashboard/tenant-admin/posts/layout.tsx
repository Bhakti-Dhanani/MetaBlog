// app/dashboard/tenant-admin/posts/layout.tsx
"use client";

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TenantHeader from '@/components/dashboard/TenantHeader';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  return (
    <div className={`flex h-screen bg-gray-50 overflow-hidden ${inter.className}`}>
      {/* Mobile Sidebar with overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Component */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TenantHeader 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
          onLogout={handleLogout}
        />
        
        {/* Posts Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}