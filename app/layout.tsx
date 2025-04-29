// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import dynamic from "next/dynamic";
// import { Suspense } from "react";
// import "./globals.css";
// import "./theme.css";
// import { ThemeProvider } from "@/providers/theme-provider";

// // Dynamically import components
// const MountedProvider = dynamic(() => import("@/providers/mounted.provider"), {
//   ssr: true,
// });

// const Toaster = dynamic(() => import("@/components/ui/toaster").then(mod => mod.Toaster), {
//   ssr: true,
// });

// const SonnerToaster = dynamic(() => import("@/components/ui/sonner").then(mod => mod.Toaster), {
//   ssr: true,
// });

// const AuthProvider = dynamic(() => import("@/providers/auth.provider"), {
//   ssr: true
// });

// // Create a client component to handle mounting state
// const ClientThemeWrapper = dynamic(() => import("./ClientTheme"), {
//   ssr: true,
// });

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Dashcode admin Template",
//   description: "created by codeshaper",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   // Remove async since we're handling client-side mounting separately
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <ClientThemeWrapper>
//           <Suspense fallback={<div>Loading theme...</div>}>
//             <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
//               <Suspense fallback={<div>Loading auth...</div>}>
//                 <AuthProvider>
//                   <Suspense fallback={<div>Loading app...</div>}>
//                     <MountedProvider>
//                       {children}
//                       <Toaster />
//                       <SonnerToaster />
//                     </MountedProvider>
//                   </Suspense>
//                 </AuthProvider>
//               </Suspense>
//             </ThemeProvider>
//           </Suspense>
//         </ClientThemeWrapper>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import "./theme.css";
import { RootClientWrapper } from "./ClientTheme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashcode admin Template",
  description: "created by codeshaper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootClientWrapper>{children}</RootClientWrapper>
      </body>
    </html>
  );
}
