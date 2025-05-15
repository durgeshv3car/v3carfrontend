import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/Money-Smart"; 

export default async function MainPage() {
  const allowed = await checkRoute("MoneySmarts");
  if (!allowed) notFound();

  return <Users />;
}
