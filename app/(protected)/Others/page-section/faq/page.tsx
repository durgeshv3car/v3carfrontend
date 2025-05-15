import { notFound } from "next/navigation";
import { checkRoute } from "@/app/(protected)/helper";
import Users from "./components/Faq"; 

export default async function MainPage() {
  const allowed = await checkRoute("Faq");
  if (!allowed) notFound();

  return <Users />;
}
