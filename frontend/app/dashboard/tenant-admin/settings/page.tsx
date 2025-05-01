"use client";

import { useState, useEffect } from 'react';
import { useTenant } from '@/lib/hooks/useTenant';
import { FiSave, FiType } from 'react-icons/fi';
import { FaPalette } from 'react-icons/fa'; // Using Font Awesome palette icon instead
import Link from 'next/link';

export default function ThemeSettingsPage() {
  const { tenant } = useTenant();
  const [formData, setFormData] = useState({
    theme_settings: {
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      fontFamily: 'sans-serif',
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tenant?.attributes?.theme_settings) {
      setFormData({
        theme_settings: tenant.attributes.theme_settings,
      });
    }
  }, [tenant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const themeField = name.split('.')[1];
    setFormData(prev => ({
      ...prev,
      theme_settings: {
        ...prev.theme_settings,
        [themeField]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tenants/${tenant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify({
          theme_settings: formData.theme_settings,
        }),
      });

      if (!response.ok) throw new Error('Failed to update theme settings');
      alert('Theme settings updated successfully!');
    } catch (error) {
      console.error('Error updating theme settings:', error);
      alert('Failed to update theme settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Theme Settings</h2>
        <Link 
          href="/dashboard/tenant-admin/settings/profile" 
          className="text-blue-600 hover:text-blue-800"
        >
          Go to Profile Settings
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaPalette className="mr-2" /> {/* Changed to FaPalette */}
          Theme Customization
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
            <div className="flex items-center">
              <input
                type="color"
                name="theme_settings.primaryColor"
                value={formData.theme_settings.primaryColor}
                onChange={handleChange}
                className="w-10 h-10 mr-2 rounded cursor-pointer"
              />
              <input
                type="text"
                name="theme_settings.primaryColor"
                value={formData.theme_settings.primaryColor}
                onChange={handleChange}
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
            <div className="flex items-center">
              <input
                type="color"
                name="theme_settings.secondaryColor"
                value={formData.theme_settings.secondaryColor}
                onChange={handleChange}
                className="w-10 h-10 mr-2 rounded cursor-pointer"
              />
              <input
                type="text"
                name="theme_settings.secondaryColor"
                value={formData.theme_settings.secondaryColor}
                onChange={handleChange}
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiType className="mr-2" />
            Typography
          </h3>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
            <select
              name="theme_settings.fontFamily"
              value={formData.theme_settings.fontFamily}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
            >
              <option value="sans-serif">Sans-serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="cursive">Cursive</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg mb-6">
          <h4 className="font-medium mb-2">Theme Preview</h4>
          <div 
            className="p-4 rounded-lg"
            style={{
              backgroundColor: formData.theme_settings.primaryColor,
              color: getContrastColor(formData.theme_settings.primaryColor),
              fontFamily: formData.theme_settings.fontFamily,
            }}
          >
            <p>This is how your primary color and font will look</p>
          </div>
          <div 
            className="p-4 rounded-lg mt-2"
            style={{
              backgroundColor: formData.theme_settings.secondaryColor,
              color: getContrastColor(formData.theme_settings.secondaryColor),
              fontFamily: formData.theme_settings.fontFamily,
            }}
          >
            <p>This is how your secondary color will look</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave className="mr-2" />
          {loading ? 'Saving...' : 'Save Theme'}
        </button>
      </form>
    </div>
  );
}

// Helper function to determine text color based on background color
function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}