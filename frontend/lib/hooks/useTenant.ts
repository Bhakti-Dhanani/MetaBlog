"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

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

interface TenantUser {
  id: number;
  username: string;
  email: string;
  role: string;
  tenant?: Tenant;
}

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Failed to parse token:', error);
    return true;
  }
}

function clearAuthStorage() {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
}

export function useTenant() {
  const [user, setUser] = useState<TenantUser | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const redirectToLogin = useCallback(() => {
    if (!pathname?.startsWith('/auth/')) {
      router.push('/auth/login');
    }
  }, [router, pathname]);

  const verifySession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Skip verification on auth pages
      if (pathname?.startsWith('/auth/')) {
        setLoading(false);
        return;
      }

      const jwt = localStorage.getItem('jwt');
      
      // Check token existence and validity
      if (!jwt || isTokenExpired(jwt)) {
        console.warn('Token is missing or expired');
        clearAuthStorage();
        redirectToLogin();
        return;
      }

      const response = await fetch('http://localhost:1337/api/tenant/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.error('Session expired or invalid');
          clearAuthStorage();
          redirectToLogin();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      
      if (!userData?.id) {
        throw new Error('Invalid user data received');
      }

      setUser(userData);
      setTenant(userData.tenant || null);
    } catch (error) {
      console.error('Session verification failed:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      redirectToLogin();
    } finally {
      setLoading(false);
    }
  }, [redirectToLogin, pathname]);

  useEffect(() => {
    verifySession();

    // Optional: Set up periodic session verification
    const interval = setInterval(verifySession, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [verifySession]);

  // Optional: Add a refresh function that can be called manually
  const refreshSession = useCallback(async () => {
    await verifySession();
  }, [verifySession]);

  return { 
    user, 
    tenant, 
    loading, 
    error,
    refreshSession,
    isAuthenticated: !!user && !isTokenExpired(localStorage.getItem('jwt'))
  };
}