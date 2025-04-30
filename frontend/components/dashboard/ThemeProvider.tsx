"use client";

import { useTenant } from '@/lib/hooks/useTenant';
import { useEffect } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { tenant } = useTenant();

  useEffect(() => {
    if (tenant?.attributes?.theme_settings) {
      const { primaryColor, secondaryColor, fontFamily } = tenant.attributes.theme_settings;
      
      document.documentElement.style.setProperty(
        '--primary-color',
        primaryColor
      );
      document.documentElement.style.setProperty(
        '--secondary-color',
        secondaryColor
      );
      document.documentElement.style.setProperty(
        '--font-family',
        fontFamily
      );
    }
  }, [tenant?.attributes?.theme_settings]);

  return <>{children}</>;
}