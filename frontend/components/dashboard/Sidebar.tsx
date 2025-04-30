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
  const { tenant } = useTenant();

  const navItems = [
    { name: 'Dashboard', href: `/dashboard/tenant-admin`, icon: FiHome },
    { name: 'Posts', href: `/dashboard/tenant-admin/posts`, icon: FiFileText },
    { name: 'Categories', href: `/dashboard/tenant-admin/categories`, icon: FiList },
    { name: 'Tags', href: `/dashboard/tenant-admin/tags`, icon: FiTag },
    { name: 'Authors', href: `/dashboard/tenant-admin/authors`, icon: FiUsers },
    { name: 'Subscribers', href: `/dashboard/tenant-admin/subscribers`, icon: FiMail },
    { name: 'Settings', href: `/dashboard/tenant-admin/settings`, icon: FiSettings },
  ];

  return (
    <div className="w-64 bg-white shadow-md">
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
            <h1 className="text-lg font-bold">{tenant?.attributes?.name || 'Loading...'}</h1>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg ${
                  pathname.startsWith(item.href) 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <item.icon className="mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}