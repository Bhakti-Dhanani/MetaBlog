"use client";

import { useTenant } from '@/lib/hooks/useTenant';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Author {
  id: number;
  attributes: {
    name: string;
    bio?: string;
    avatar?: {
      data?: {
        attributes?: {
          url: string;
        };
      };
    };
  };
}

export default function AuthorsPage() {
  const { tenant } = useTenant();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenant) return;

    const fetchAuthors = async () => {
      try {
        const response = await fetch(
          `/api/authors?filters[tenant][slug][$eq]=${tenant.attributes.slug}&populate=*`
        );
        const { data } = await response.json();
        setAuthors(data);
      } catch (error) {
        console.error('Failed to fetch authors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [tenant]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Authors</h2>
        <Link
          href="/dashboard/tenant-admin/authors/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          New Author
        </Link>
      </div>

      {loading ? (
        <div>Loading authors...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avatar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {authors.map((author) => (
                <tr key={author.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {author.attributes.avatar?.data?.attributes?.url ? (
                      <img 
                        src={author.attributes.avatar.data.attributes.url}
                        alt={author.attributes.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">?</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {author.attributes.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {author.attributes.bio || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/dashboard/tenant-admin/authors/${author.id}/edit`}
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