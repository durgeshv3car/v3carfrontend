// Remove next-intl routing since it's no longer needed.
export const Link = require('next/link').default;
export const useRouter = require('next/navigation').useRouter;
export const usePathname = require('next/navigation').usePathname;
export const redirect = require('next/navigation').redirect;
