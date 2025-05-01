"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  FiFileText, 
  FiList, 
  FiTag, 
  FiUsers,
  FiUser,
  FiBell,
  FiSearch,
  FiLogOut
} from "react-icons/fi";
import TenantHeader from "@/components/dashboard/TenantHeader";
import RichTextEditor from "@/components/dashboard/RichTextEditor";
import ThemeProvider from "@/components/dashboard/ThemeProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import { useTenant } from "@/lib/hooks/useTenant";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface User {
  id: number;
  username: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
  tenant?: {
    id: number;
    name: string;
  };
}

const DashboardPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { tenant, loading: tenantLoading, error: tenantError } = useTenant();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    tags: 0,
    subscribers: 0,
    views: 0
  });

  const verifySession = async () => {
    try {
      setLoading(true);
      setError(null);

      const jwt = localStorage.getItem('jwt');
      if (!jwt) throw new Error('No authentication token found');

      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=role`, {
        headers: { 'Authorization': `Bearer ${jwt}` },
      });

      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const data = await response.json();
      if (!data?.id) throw new Error('Invalid user data');
      if (data.role?.name !== 'Tenant Admin') throw new Error('Access denied');

      setUser(data);
    } catch (err) {
      console.error('Session verification failed:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  useEffect(() => {
    verifySession();
  }, []);

  if (loading || tenantLoading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${inter.className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || tenantError) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${inter.className}`}>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-md rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || tenantError}</p>
            </div>
          </div>
          <button
            onClick={verifySession}
            className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
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
          
          {/* Main Content Container */}
          <main className="flex-1 overflow-y-auto">
            {/* Dashboard Header */}
            <div className="bg-white p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Dashboard Overview</h1>
                  {tenant && (
                    <p className="text-gray-600 text-sm">
                      Managing: <span className="font-medium">{tenant.attributes.name}</span>
                    </p>
                  )}
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user?.role.name}
                </span>
              </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2">
              {[
                { title: 'Posts', value: stats.posts, icon: FiFileText, color: 'bg-blue-100 text-blue-600' },
                { title: 'Categories', value: stats.categories, icon: FiList, color: 'bg-green-100 text-green-600' },
                { title: 'Tags', value: stats.tags, icon: FiTag, color: 'bg-purple-100 text-purple-600' },
                { title: 'Subscribers', value: stats.subscribers, icon: FiUsers, color: 'bg-orange-100 text-orange-600' },
              ].map((stat) => (
                <div key={stat.title} className="bg-white rounded-lg shadow p-3 border border-gray-200">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${stat.color} mr-3`}>
                      <stat.icon className="text-lg" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{stat.title}</p>
                      <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-2">
              {/* Quick Draft Section */}
              <div className="bg-white rounded-lg shadow p-3 border border-gray-200">
                <h3 className="text-md font-bold text-gray-800 mb-2">Quick Draft</h3>
                <RichTextEditor 
                  value="<p>Start writing your new post here...</p>" 
                  onChange={(content: string) => console.log(content)} 
                />
                <div className="mt-2 flex justify-end">
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium">
                    Save Draft
                  </button>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="bg-white rounded-lg shadow p-3 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-bold text-gray-800">Recent Activity</h3>
                  <button className="text-xs text-blue-600 hover:text-blue-800">View All</button>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start pb-2 border-b border-gray-100 last:border-0">
                      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                        <FiUser className="text-gray-500 text-xs" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">New post created</p>
                        <p className="text-2xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DashboardPage;