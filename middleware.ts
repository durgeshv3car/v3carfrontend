// import createMiddleware from 'next-intl/middleware';
// import {NextRequest, NextResponse} from 'next/server';
// import {locales} from '@/config';

// export default async function middleware(request: NextRequest) {
  
 


//   // Step 1: Use the incoming request (example)
//   const defaultLocale = request.headers.get('dashcode-locale') || 'en';
 
//   // Step 2: Create and call the next-intl middleware (example)
//   const handleI18nRouting = createMiddleware({
//     locales,
//     defaultLocale
    
//   });
//   const response = handleI18nRouting(request);
 
//   // Step 3: Alter the response (example)
//   response.headers.set('dashcode-locale', defaultLocale);


 
//   return response;
// }
 
// export const config = {
//   // Match only internationalized pathnames
//   matcher: ['/', '/(ar|en)/:path*']
// };

// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   return NextResponse.next(); // Just passes the request forward
// }

// export const config = {
//   matcher: "/", 
// };


import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add caching headers for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static') || 
      request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};