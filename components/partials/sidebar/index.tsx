import React from "react";
import SidebarContent from "./sidebar-content";
import Logo from "@/components/logo";
import { Menu } from "./menu";
import { auth } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
interface DecodedToken {
  role: string;
  
}

const DashCodeSidebar = async () => {
   const session = await auth();
   let role = "";
   let permissions: string[] = []; 

 
   if (session?.user && 'token' in session.user) {
     const decoded = jwtDecode<DecodedToken>((session.user as { token: string }).token);
     role = decoded.role;
     permissions = (session.user as any).permissions || [];
   }
 
  return (
    <SidebarContent>
      <Menu role={role} permissions={permissions} />
    </SidebarContent>
  );
};

export default DashCodeSidebar;
