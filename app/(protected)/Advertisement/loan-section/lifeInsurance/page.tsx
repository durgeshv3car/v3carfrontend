import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/LifeInsurance"; 

export default async function MainPage() {
  const allowed = await checkRoute("Life Insurance");
  if (!allowed) notFound();

  return <Users />;
}
