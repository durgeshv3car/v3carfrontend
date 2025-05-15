import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/HealthInsurance"; 

export default async function MainPage() {
  const allowed = await checkRoute("Health Insurance");
  if (!allowed) notFound();

  return <Users />;
}
