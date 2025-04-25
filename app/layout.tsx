import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import "./theme.css";

// Dynamically import components
const ThemeProvider = dynamic(() => import("@/providers/theme-provider").then(mod => mod.ThemeProvider), {
  ssr: true
});

const MountedProvider = dynamic(() => import("@/providers/mounted.provider"), {
  ssr: false
});

const Toaster = dynamic(() => import("@/components/ui/toaster").then(mod => mod.Toaster), {
  ssr: false
});

const SonnerToaster = dynamic(() => import("@/components/ui/sonner").then(mod => mod.Toaster), {
  ssr: false
});

const AuthProvider = dynamic(() => import("@/providers/auth.provider"), {
  ssr: true
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashcode admin Template",
  description: "created by codeshaper",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dashcode-app`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <MountedProvider>
              {children}
            </MountedProvider>
            <Toaster />
            <SonnerToaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}