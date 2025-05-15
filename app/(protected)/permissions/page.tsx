import PermissionPage from "./components/PermissionPage";
import { auth } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  permissions?: string[]; // Make permissions optional in the interface
}

async function page() {
  const session = await auth();
  let role = "";
  let permissions: string[] = []; // ✅ correct TypeScript syntax
  
  if (session?.user && "token" in session.user) {
    const decoded = jwtDecode<DecodedToken>(
      (session.user as { token: string }).token
    );
    role = decoded.role;
    
    // Type assertion to access permissions safely
    permissions = (session.user as any).permissions || [];
  }
  
  return <PermissionPage role={role} permissions={permissions} />;
}

export default page;