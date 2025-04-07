import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./theme.css"

import { ThemeProvider } from "@/providers/theme-provider";
import MountedProvider from "@/providers/mounted.provider";
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
const inter = Inter({ subsets: ["latin"] });
// language 

import AuthProvider from "@/providers/auth.provider";

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
            <ThemeProvider attribute="class"
              defaultTheme="light">
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
