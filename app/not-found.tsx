'use client';

import { Link } from '@/i18n/routing';
import Image from "next/image";

export default function NotFound() {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background px-6 py-20 text-center">
  <div className="max-w-md w-full">
    <h1 className="text-8xl font-semibold text-default-900 dark:text-white mb-4">
      404
    </h1>
    <p className="text-base text-default-700 dark:text-gray-300 mb-8">
      The page you're looking for doesn’t exist, may have been moved, or is temporarily unavailable.
    </p>
    <Link
      href="/auth/login"
      className="inline-block w-full bg-white dark:bg-gray-900 text-default-900 dark:text-white border border-default-200 dark:border-gray-700 rounded-lg px-6 py-3 text-base font-medium shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
    >
      Go to Homepage
    </Link>
  </div>
</div>

    );
}