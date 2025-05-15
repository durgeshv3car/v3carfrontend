import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/IncomePlan"; 

export default async function MainPage() {
  const allowed = await checkRoute("Income Plans");
  if (!allowed) notFound();

  return <Users />;
}
