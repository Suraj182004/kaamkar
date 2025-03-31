'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Define the props directly based on what next-themes expects
type ThemeProviderProps = {
  children: React.ReactNode;
  // Use more specific types that match next-themes requirements
} & Parameters<typeof NextThemesProvider>[0]; // Get the exact prop types from NextThemesProvider

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
} 