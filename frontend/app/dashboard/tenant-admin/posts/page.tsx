"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/hooks/useTenant';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

interface Post {
  id: number;
  attributes: {
    title: string;
    slug: string;
    status: 'draft' | 'published';
    publishedAt: string;
    author?: {
      data?: {
        attributes?: {
          name: string;
        };
      };
    };
  };
}

export default function PostsPage() {
  const { tenant } = useTenant();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenant?.attributes?.slug) return;

    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/posts?filters[tenant][slug][$eq]=${tenant.attributes.slug}&populate=author`
        );
        const { data } = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [tenant?.attributes?.slug]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Posts</h2>
        <Link
          href="/dashboard/tenant-admin/posts/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          New Post
        </Link>
      </div>

      {loading ? (
        <div>Loading posts...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{post.attributes.title}</div>
                    <div className="text-sm text-gray-500">/{post.attributes.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.attributes.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.attributes.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.attributes.author?.data?.attributes?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.attributes.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/dashboard/tenant-admin/posts/${post.id}/edit`}
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