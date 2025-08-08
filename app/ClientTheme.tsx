"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import MountedProvider from "@/providers/mounted.provider";
import AuthProvider from "@/providers/auth.provider";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster";

const SonnerToaster = dynamic(
  () => import("@/components/ui/sonner").then((mod) => mod.Toaster),
  {
    ssr: false,
  }
);

export function RootClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
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
