import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/CarInsurance"; 

export default async function MainPage() {
  const allowed = await checkRoute("Car Insurance");
  if (!allowed) notFound();

  return <Users />;
}
