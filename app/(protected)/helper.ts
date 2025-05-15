import { auth } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  permissions?: string[]; 
}

export async function checkRoute(page: string) {
  const session = await auth();
  let role = "";
  let permissions: string[] = []; 

  if (session?.user && "token" in session.user) {
    const decoded = jwtDecode<DecodedToken>(
      (session.user as { token: string }).token
    );
    role = decoded.role;
    permissions = (session.user as any).permissions || [];
  }
  if (role === "Super Admin" || permissions.includes(page)) {
    return true;
  }
  return false;
}
