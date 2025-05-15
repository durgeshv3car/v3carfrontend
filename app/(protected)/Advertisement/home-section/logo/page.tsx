import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/Logo"; 

export default async function MainPage() {
  const allowed = await checkRoute("Landing Partner Logo");
  if (!allowed) notFound();

  return <Users />;
}
