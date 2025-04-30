"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/hooks/useTenant';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
    posts?: {
      data: {
        id: number;
      }[];
    };
  };
}

export default function CategoriesPage() {
  const { tenant } = useTenant();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenant?.attributes?.slug) return;

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `/api/categories?filters[tenant][slug][$eq]=${tenant.attributes.slug}&populate=posts`
        );
        const { data } = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [tenant?.attributes?.slug]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
        <Link
          href="/dashboard/tenant-admin/categories/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          New Category
        </Link>
      </div>

      {loading ? (
        <div>Loading categories...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {category.attributes.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    /{category.attributes.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.attributes.posts?.data?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/dashboard/tenant-admin/categories/${category.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FiEdit />
                    </Link>
                    <button className="text-red-600 hover:text-red-900">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}