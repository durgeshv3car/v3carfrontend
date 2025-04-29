// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useTheme } from 'next-themes';

// export default function ClientThemeWrapper({ children }) {
//   const [mounted, setMounted] = useState(false);
//   const { theme, setTheme } = useTheme();

//   // Update the html element's data-theme attribute when the theme changes
//   useEffect(() => {
//     if (mounted && theme) {
//       document.documentElement.setAttribute('data-theme', theme);
//       document.documentElement.style.colorScheme = theme;
//     }
//   }, [theme, mounted]);

//   // Set mounted state once the component is mounted
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   return <>{children}</>;
// }

"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import MountedProvider from "@/providers/mounted.provider";
import AuthProvider from "@/providers/auth.provider";
import dynamic from "next/dynamic";
import {Toaster} from "@/components/ui/toaster";

const SonnerToaster = dynamic(() => import("@/components/ui/sonner").then(mod => mod.Toaster), {
  ssr: false,
});

export function RootClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider >
      <AuthProvider>
        <MountedProvider>
          {children}
          <Toaster />
          <SonnerToaster />
        </MountedProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
