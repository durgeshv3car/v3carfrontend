import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import LeadPage from "./components/Leads"; 

export default async function MainPage() {
  const allowed = await checkRoute("leads");
  if (!allowed) notFound();

  return <LeadPage />;
}
