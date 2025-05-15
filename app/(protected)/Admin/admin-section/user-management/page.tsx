import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/User-Management";
import { auth } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";

export default async function MainPage() {
  const allowed = await checkRoute("Api Management");
  if (!allowed) notFound();

  interface DecodedToken {
    role: string;
    id?: string[];
  }

  const session = await auth();
  let role = "";
  let id = "";

  if (session?.user && "token" in session.user) {
    const decoded = jwtDecode<DecodedToken>(
      (session.user as { token: string }).token
    );
    role = decoded.role;
    id = (session.user as any).id || [];
  }

  return <Users adminId={id} />;
}
