import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import LeadPage from "./components/LoanApplications"; 

export default async function MainPage() {
  const allowed = await checkRoute("loanapplications");
  if (!allowed) notFound();

  return <LeadPage />;
}
