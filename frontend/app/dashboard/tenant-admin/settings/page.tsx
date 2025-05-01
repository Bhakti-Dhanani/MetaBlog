"use client";

import { useState, useEffect } from 'react';
import { useTenant } from '@/lib/hooks/useTenant';
import { FiSave, FiUpload } from 'react-icons/fi';
import Sidebar from '@/components/dashboard/Sidebar';
import TenantHeader from '@/components/dashboard/TenantHeader';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function SettingsPage() {
  const router = useRouter();
  const { tenant, loading: tenantLoading, error: tenantError } = useTenant();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null as File | null,
    theme_settings: {
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      fontFamily: 'sans-serif',
    },
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  useEffect(() => {
    if (tenant && !tenantLoading) {
      setFormData({
        name: tenant.attributes.name || '',
        description: tenant.attributes.description || '',
        logo: null,
        theme_settings: tenant.attributes.theme_settings || {
          primaryColor: '#3b82f6',
          secondaryColor: '#10b981',
          fontFamily: 'sans-serif',
        },
      });
      if (tenant.attributes.logo?.data?.attributes?.url) {
        setLogoPreview(tenant.attributes.logo.data.attributes.url);
      }
    }
  }, [tenant, tenantLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('theme_settings.')) {
      const themeField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        theme_settings: {
          ...prev.theme_settings,
          [themeField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    setFormLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify({
        name: formData.name,
        description: formData.description,
        theme_settings: formData.theme_settings,
      }));

      if (formData.logo) {
        formDataToSend.append('files.logo', formData.logo);
      }

      const response = await fetch(`/api/tenants/${tenant.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      // Refresh tenant data after successful update
      window.location.reload();
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    } finally {
      setFormLoading(false);
    }
  };

  if (tenantLoading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${inter.className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (tenantError) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${inter.className}`}>
        <div className="text-red-500">Error loading tenant data</div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen bg-gray-50 overflow-hidden ${inter.className}`}>
      {/* Mobile Sidebar with overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Component */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TenantHeader 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
          onLogout={handleLogout}
        />
        
        {/* Settings Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Tenant Settings</h2>
          
          {tenant && (
            <form onSubmit={handleSubmit} className="max-w-3xl bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Blog Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <div className="flex items-center">
                  {logoPreview && (
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-16 h-16 rounded-md mr-4 object-cover"
                    />
                  )}
                  <label className="cursor-pointer">
                    <div className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                      <FiUpload className="mr-2" />
                      {formData.logo ? 'Change Logo' : 'Upload Logo'}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      name="theme_settings.primaryColor"
                      value={formData.theme_settings.primaryColor}
                      onChange={handleChange}
                      className="w-10 h-10 mr-2"
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
                      className="w-10 h-10 mr-2"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                <select
                  name="theme_settings.fontFamily"
                  value={formData.theme_settings.fontFamily}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="sans-serif">Sans-serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <FiSave className="mr-2" />
                {formLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}