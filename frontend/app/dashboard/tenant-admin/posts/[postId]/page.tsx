"use client";

import { useParams, useRouter } from 'next/navigation';
import {useTenant} from '@/lib/hooks/useTenant';
import { FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface PostAttributes {
  title: string;
  content: string;
  slug: string;
  publishedAt: string;
  // Add other attributes as needed
}

interface Post {
  id: string;
  attributes: PostAttributes;
}

export default function PostDetailPage() {
  const { postId } = useParams() as { postId: string };
  const { tenant } = useTenant();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenant) {
      setError('Tenant information not available');
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/${postId}?populate=*`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();
        
        if (!data) {
          throw new Error('Post data not found in response');
        }

        setPost(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, tenant]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, { 
        method: 'DELETE' 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push('/dashboard/tenant-admin/posts');
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-lg font-medium text-gray-900">Post not found</h2>
          <Link 
            href="/dashboard/tenant-admin/posts"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <FiArrowLeft className="mr-2" />
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/dashboard/tenant-admin/posts"
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Posts
        </Link>
        
        <div className="flex space-x-3">
          <Link
            href={`/dashboard/tenant-admin/posts/${postId}/edit`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiEdit className="mr-2" />
            Edit Post
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <FiTrash2 className="mr-2" />
            Delete Post
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{post.attributes.title}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {new Date(post.attributes.publishedAt).toLocaleDateString()}
          </p>
          <div 
            className="prose max-w-none" 
            dangerouslySetInnerHTML={{ __html: post.attributes.content }} 
          />
        </div>
      </div>
    </div>
  );
}