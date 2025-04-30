"use client";

import { useTenant } from '@/lib/hooks/useTenant';

export default function TenantAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useTenant();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar and other components */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        {children}
      </main>
    </div>
  );
}