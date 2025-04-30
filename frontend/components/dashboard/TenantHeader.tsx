"use client";

import { useTenant } from '@/lib/hooks/useTenant';
import { FiLogOut, FiUser, FiBell, FiSearch } from 'react-icons/fi';
import Link from 'next/link';

interface Tenant {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description?: string;
    logo?: {
      data?: {
        attributes?: {
          url: string;
        };
      };
    };
    theme_settings: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
    };
  };
}

export default function TenantHeader() {
  const { tenant } = useTenant();

  return (
    <header className="bg-white shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {tenant?.attributes?.logo?.data?.attributes?.url && (
            <img 
              src={tenant.attributes.logo.data.attributes.url}
              alt={`${tenant.attributes.name} logo`}
              className="h-8 w-auto mr-3"
            />
          )}
          <Link 
            href="/dashboard/tenant-admin" 
            className="text-xl font-semibold text-gray-800"
          >
            {tenant?.attributes?.name || 'Dashboard'}
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <FiBell className="text-xl" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <FiUser className="text-blue-600" />
            </div>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <span className="mr-1">Admin</span>
              <FiLogOut className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}