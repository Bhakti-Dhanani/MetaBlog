"use client";

import { useTenant } from '@/lib/hooks/useTenant';
import { useEffect } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

export default function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const { tenant } = useTenant();

  useEffect(() => {
    const settings = theme || tenant?.attributes?.theme_settings;
    if (settings) {
      const { primaryColor, secondaryColor, fontFamily } = settings;
      
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
  }, [tenant?.attributes?.theme_settings, theme]);

  return <>{children}</>;
}