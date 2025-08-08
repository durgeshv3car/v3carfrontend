import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import LeadPage from "./components/DeviceInfo"; 

export default async function MainPage() {
  const allowed = await checkRoute("DeviceInfo");
  if (!allowed) notFound();

  return <LeadPage />;
}
