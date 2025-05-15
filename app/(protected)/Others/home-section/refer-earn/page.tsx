import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/Refer-earn"; 

export default async function MainPage() {
  const allowed = await checkRoute("Refer&Earns");
  if (!allowed) notFound();

  return <Users />;
}
