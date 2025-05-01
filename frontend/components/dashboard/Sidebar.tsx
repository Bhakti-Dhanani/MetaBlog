"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenant } from '@/lib/hooks/useTenant';
import { 
  FiHome, FiFileText, FiTag, FiList, 
  FiMail, FiSettings, FiUsers, FiPlus 
} from 'react-icons/fi';

export default function Sidebar() {
  const pathname = usePathname();
  const { tenant, user } = useTenant(); // Assuming useTenant hook also provides user data

  const navItems = [
    { name: 'Dashboard', href: `/dashboard/tenant-admin`, icon: FiHome, exact: true },
    { name: 'Posts', href: `/dashboard/tenant-admin/posts`, icon: FiFileText },
    { name: 'Categories', href: `/dashboard/tenant-admin/categories`, icon: FiList },
    { name: 'Tags', href: `/dashboard/tenant-admin/tags`, icon: FiTag },
    { name: 'Authors', href: `/dashboard/tenant-admin/authors`, icon: FiUsers },
    { name: 'Subscribers', href: `/dashboard/tenant-admin/subscribers`, icon: FiMail },
    { name: 'Settings', href: `/dashboard/tenant-admin/settings`, icon: FiSettings },
  ];

  const isActive = (href: string, exact: boolean = false) => {
    return exact ? pathname === href : pathname.startsWith(href);
  };

  return (
    <div className="h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
      {/* Brand Section */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          {tenant?.attributes?.logo?.data?.attributes?.url ? (
            <img 
              src={tenant.attributes.logo.data.attributes.url}
              alt={tenant.attributes.name}
              className="w-10 h-10 rounded-md object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-white font-bold text-lg truncate">
              {user?.username || 'Admin'}
            </h1>
            <p className="text-blue-200 text-xs">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                  isActive(item.href, item.exact)
                    ? 'bg-blue-700 text-white shadow-md' 
                    : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
                }`}
              >
                <item.icon className="text-lg mr-3" />
                <span className="font-medium">{item.name}</span>
                {isActive(item.href, item.exact) && (
                  <span className="ml-auto w-2 h-2 bg-blue-300 rounded-full"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700">
        <button className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200">
          <FiPlus className="text-lg" />
          <span className="font-medium">New Post</span>
        </button>
      </div>
    </div>
  );
}