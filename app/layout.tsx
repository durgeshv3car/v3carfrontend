import type { Metadata } from "next";

import "./globals.css";
import "./theme.css"

import { RootClientWrapper } from "./ClientTheme";
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
    <html lang="en" suppressHydrationWarning>
      <body className="">
       <RootClientWrapper>{children}</RootClientWrapper>
      </body>
    </html>
  );
}
