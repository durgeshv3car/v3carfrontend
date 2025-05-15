import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/Policy"; 

export default async function MainPage() {
  const allowed = await checkRoute("Policy");
  if (!allowed) notFound();

  return <Users />;
}
