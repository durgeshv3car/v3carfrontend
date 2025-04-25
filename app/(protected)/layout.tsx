import dynamic from "next/dynamic";

import { auth } from "@/lib/auth";
import { redirect } from "@/components/navigation";
import ThemeCustomize from "@/components/partials/customizer";

// Dynamically imported components
const DashCodeSidebar = dynamic(() => import("@/components/partials/sidebar"), {
  ssr: false, // set to true if you want server-side rendering
  loading: () => <div>Loading Sidebar...</div>,
});
const LayoutProvider = dynamic(() => import("@/providers/layout.provider"), {
  ssr: false, // set to true if you want server-side rendering
  loading: () => <div>Loading Sidebar...</div>,
});
const LayoutContentProvider = dynamic(
  () => import("@/providers/content.provider"),
  {
    ssr: false, // set to true if you want server-side rendering
    loading: () => <div>Loading Sidebar...</div>,
  }
);
const DashCodeHeader = dynamic(() => import("@/components/partials/header"), {
  ssr: false,
  loading: () => <div>Loading Header...</div>,
});
const DashCodeFooter = dynamic(() => import("@/components/partials/footer"), {
  ssr: false,
  loading: () => <div>Loading Footer...</div>,
});

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <LayoutProvider>
      <ThemeCustomize />
      <DashCodeHeader />
      <DashCodeSidebar />
      <LayoutContentProvider>{children}</LayoutContentProvider>
      <DashCodeFooter />
    </LayoutProvider>
  );
};

export default layout;
