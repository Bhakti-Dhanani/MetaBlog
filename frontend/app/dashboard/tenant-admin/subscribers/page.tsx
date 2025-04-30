"use client";

import { useState, useEffect } from 'react';
import { useTenant } from '@/lib/hooks/useTenant';
import { FiMail, FiDownload } from 'react-icons/fi';

interface Subscriber {
  id: number;
  attributes: {
    email: string;
    subscribed_at: string;
  };
}

export default function SubscribersPage() {
  const { tenant } = useTenant();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenant?.attributes?.slug) return;

    const fetchSubscribers = async () => {
      try {
        const response = await fetch(
          `/api/subscribers?filters[tenant][slug][$eq]=${tenant.attributes.slug}`
        );
        const { data } = await response.json();
        setSubscribers(data);
      } catch (error) {
        console.error('Failed to fetch subscribers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [tenant?.attributes?.slug]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + subscribers.map(sub => sub.attributes.email).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tenant?.attributes?.slug || 'subscribers'}_subscribers.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Email Subscribers</h2>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          disabled={loading || subscribers.length === 0}
        >
          <FiDownload className="mr-2" />
          Export CSV
        </button>
      </div>

      {loading ? (
        <div>Loading subscribers...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed On</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiMail className="mr-2 text-gray-400" />
                      {subscriber.attributes.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscriber.attributes.subscribed_at).toLocaleDateString()}
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