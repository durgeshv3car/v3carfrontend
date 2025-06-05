import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/CompanyUrl"; 

export default async function MainPage() {
  const allowed = await checkRoute("CreditScoreUrl");
  if (!allowed) notFound();

  return <Users />;
}
