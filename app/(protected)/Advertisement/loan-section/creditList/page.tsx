import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/CreditList"; 

export default async function MainPage() {
  const allowed = await checkRoute("Credit Card Offers");
  if (!allowed) notFound();

  return <Users />;
}
