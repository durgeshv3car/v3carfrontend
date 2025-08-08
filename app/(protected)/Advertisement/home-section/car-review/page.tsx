import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/Slider"; 
import { auth } from "@/lib/auth";

export default async function MainPage() {
  const session = await auth();
  const token = session?.user?.token;
  const allowed = await checkRoute("Top Banner");
  if (!allowed) notFound();

  return <Users token={token}/>;
}
