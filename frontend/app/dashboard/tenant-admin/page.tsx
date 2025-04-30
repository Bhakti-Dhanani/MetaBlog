"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FiHome, 
  FiFileText, 
  FiTag, 
  FiList, 
  FiMail, 
  FiSettings, 
  FiUsers, 
  FiUser,
  FiBell,
  FiSearch,
  FiLogOut
} from "react-icons/fi";
import TenantHeader from "@/components/dashboard/TenantHeader";
import RichTextEditor from "@/components/dashboard/RichTextEditor";
import ThemeProvider from "@/components/dashboard/ThemeProvider";
import { useTenant } from "@/lib/hooks/useTenant";

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
      localStorage.clear();
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  if (loading || tenantLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || tenantError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-md">
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
            className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30 w-64 bg-white shadow-md`}>
          <div className="p-4 border-b">
            <div className="flex items-center">
              {tenant?.attributes?.logo?.data?.attributes?.url && (
                <img 
                  src={tenant.attributes.logo.data.attributes.url}
                  alt={tenant.attributes.name}
                  className="w-10 h-10 rounded-md mr-3 object-cover"
                />
              )}
              <div>
                <h1 className="text-lg font-bold">{tenant?.attributes?.name}</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {[
                { name: 'Dashboard', href: '/dashboard/tenant-admin', icon: FiHome },
                { name: 'Posts', href: '/dashboard/tenant-admin/posts', icon: FiFileText },
                { name: 'Categories', href: '/dashboard/tenant-admin/categories', icon: FiList },
                { name: 'Tags', href: '/dashboard/tenant-admin/tags', icon: FiTag },
                { name: 'Authors', href: '/dashboard/tenant-admin/authors', icon: FiUsers },
                { name: 'Subscribers', href: '/dashboard/tenant-admin/subscribers', icon: FiMail },
                { name: 'Settings', href: '/dashboard/tenant-admin/settings', icon: FiSettings },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg ${
                      location.pathname === item.href 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="mr-3" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TenantHeader />
          
          <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
            <div className="max-w-7xl mx-auto">
              {/* Dashboard Header */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                    {tenant && (
                      <p className="text-gray-600 mt-2">
                        Managing: <span className="font-medium">{tenant.attributes.name}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {user?.role.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[
                  { title: 'Total Posts', value: stats.posts, icon: FiFileText },
                  { title: 'Categories', value: stats.categories, icon: FiList },
                  { title: 'Tags', value: stats.tags, icon: FiTag },
                  { title: 'Subscribers', value: stats.subscribers, icon: FiUsers },
                ].map((stat) => (
                  <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
                        <stat.icon className="text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-semibold">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Draft Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Draft</h3>
                  <RichTextEditor 
                    value="<p>Start writing your new post here...</p>" 
                    onChange={(content) => console.log(content)} 
                  />
                  <div className="mt-4 flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Save Draft
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <FiUser className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New post created</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
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